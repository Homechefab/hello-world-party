import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, PhoneOff, Volume2, Mic, MicOff, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ConversationStatus = 'idle' | 'connecting' | 'connected' | 'error';

const PhoneAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ConversationStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endConversation();
    };
  }, []);

  const startConversation = useCallback(async () => {
    try {
      setStatus('connecting');
      setTranscript([]);

      // Request microphone permission first
      try {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micError) {
        console.error('Microphone access denied:', micError);
        toast.error('Mikrofonåtkomst nekades. Tillåt mikrofon för att använda röstassistenten.');
        setStatus('idle');
        return;
      }

      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('phone-ai-token', {
        body: {}
      });

      if (error) {
        console.error('Error getting signed URL:', error);
        throw new Error('Kunde inte starta samtal');
      }

      if (!data?.signedUrl) {
        console.error('No signed URL returned:', data);
        toast.error(data?.message || 'Röstassistenten är inte konfigurerad ännu. Lägg till ELEVENLABS_AGENT_ID.');
        setStatus('idle');
        return;
      }

      console.log('Starting conversation with signed URL');

      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });

      // Connect via WebSocket
      const ws = new WebSocket(data.signedUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to ElevenLabs');
        setStatus('connected');
        setTranscript(prev => [...prev, '🟢 Ansluten! Börja prata med Emma.']);
        toast.success('Ansluten till röstassistenten Emma');
        
        // Start sending audio
        startAudioCapture();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Message received:', message.type);

          if (message.type === 'audio') {
            setIsSpeaking(true);
            playAudio(message.audio);
          } else if (message.type === 'agent_response') {
            setTranscript(prev => [...prev, `Emma: ${message.text}`]);
          } else if (message.type === 'user_transcript') {
            setTranscript(prev => [...prev, `Du: ${message.text}`]);
          } else if (message.type === 'audio_done') {
            setIsSpeaking(false);
          }
        } catch (e) {
          // Binary audio data
          if (event.data instanceof Blob) {
            setIsSpeaking(true);
            playAudioBlob(event.data);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Anslutningsfel');
        setStatus('error');
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setStatus('idle');
        setTranscript(prev => [...prev, '🔴 Samtalet avslutat.']);
      };

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Kunde inte starta röstsamtal. Försök igen.');
      setStatus('idle');
    }
  }, []);

  const startAudioCapture = useCallback(() => {
    if (!mediaStreamRef.current || !wsRef.current || !audioContextRef.current) return;

    const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
    const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && !isMuted) {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = convertFloat32ToInt16(inputData);
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        
        wsRef.current.send(JSON.stringify({
          user_audio_chunk: base64Audio
        }));
      }
    };

    source.connect(processor);
    processor.connect(audioContextRef.current.destination);
  }, [isMuted]);

  const convertFloat32ToInt16 = (float32Array: Float32Array): Int16Array => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
  };

  const playAudio = useCallback((base64Audio: string) => {
    if (!audioContextRef.current) return;
    
    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Convert to audio buffer and play
      const int16Data = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 0x8000;
      }

      const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 16000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, []);

  const playAudioBlob = useCallback(async (blob: Blob) => {
    if (!audioContextRef.current) return;
    
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (error) {
      console.error('Error playing audio blob:', error);
    }
  }, []);

  const endConversation = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setStatus('idle');
    setIsSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    toast.info(isMuted ? 'Mikrofon på' : 'Mikrofon avstängd');
  }, [isMuted]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Phone className="w-8 h-8" />
        </Button>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className="w-80 shadow-2xl">
        <CardHeader className="pb-3 bg-green-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Ring Emma</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-white animate-pulse' : 'bg-white/50'}`}></div>
                  <span className="text-sm opacity-90">
                    {status === 'idle' && 'Redo att ringa'}
                    {status === 'connecting' && 'Ansluter...'}
                    {status === 'connected' && 'I samtal'}
                    {status === 'error' && 'Fel uppstod'}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (status === 'connected') {
                  endConversation();
                }
                setIsOpen(false);
              }}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Status indicator */}
          {status === 'connected' && (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className={`relative ${isSpeaking ? 'animate-pulse' : ''}`}>
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Volume2 className={`w-10 h-10 text-green-600 ${isSpeaking ? 'animate-bounce' : ''}`} />
                </div>
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-50"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-pulse"></div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Transcript */}
          {transcript.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-3 max-h-40 overflow-y-auto text-sm space-y-1">
              {transcript.slice(-5).map((line, index) => (
                <p key={index} className="text-muted-foreground">{line}</p>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {status === 'idle' && (
              <Button
                onClick={startConversation}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Starta samtal
              </Button>
            )}

            {status === 'connecting' && (
              <Button disabled className="w-full">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ansluter...
              </Button>
            )}

            {status === 'connected' && (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleMute}
                  className={`rounded-full w-14 h-14 ${isMuted ? 'bg-red-100 border-red-300' : ''}`}
                >
                  {isMuted ? <MicOff className="w-6 h-6 text-red-600" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endConversation}
                  className="rounded-full w-14 h-14"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </>
            )}

            {status === 'error' && (
              <Button
                onClick={startConversation}
                className="w-full"
              >
                Försök igen
              </Button>
            )}
          </div>

          {/* Info text */}
          <p className="text-xs text-center text-muted-foreground">
            Prata med Emma, vår AI-assistent. Hon kan svara på frågor om Homechef, beställningar och mer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneAssistant;
