import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, PhoneOff, Volume2, Mic, MicOff, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useConversation } from '@11labs/react';

type ConversationStatus = 'idle' | 'connecting' | 'connected' | 'error';

const PhoneAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConversationStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setConnectionStatus('connected');
      setTranscript(prev => [...prev, '🟢 Ansluten! Börja prata med Emma.']);
      toast.success('Ansluten till röstassistenten Emma');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setConnectionStatus('idle');
      setTranscript(prev => [...prev, '🔴 Samtalet avslutat.']);
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      if (message.message) {
        const prefix = message.source === 'user' ? 'Du' : 'Emma';
        setTranscript(prev => [...prev, `${prefix}: ${message.message}`]);
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast.error('Ett fel uppstod i samtalet');
      setConnectionStatus('error');
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversation.status === 'connected') {
        conversation.endSession();
      }
    };
  }, [conversation]);

  const startConversation = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      setTranscript([]);

      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micError) {
        console.error('Microphone access denied:', micError);
        toast.error('Mikrofonåtkomst nekades. Tillåt mikrofon för att använda röstassistenten.');
        setConnectionStatus('idle');
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
        setConnectionStatus('idle');
        return;
      }

      console.log('Starting conversation with signed URL');

      // Start the conversation using the hook
      await conversation.startSession({ signedUrl: data.signedUrl });
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Kunde inte starta röstsamtal. Försök igen.');
      setConnectionStatus('idle');
    }
  }, [conversation]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setConnectionStatus('idle');
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }, [conversation]);

  const toggleMute = useCallback(async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    toast.info(newMutedState ? 'Mikrofon avstängd' : 'Mikrofon på');
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

  const isSpeaking = conversation.isSpeaking;
  const status = connectionStatus;

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
