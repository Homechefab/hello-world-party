import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, User, Bot, Clock, Minimize2, Phone, PhoneOff, Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

// Function to parse message text and convert links to clickable elements
const parseMessageWithLinks = (text: string) => {
  const linkRegex = /(\/[a-zA-Z0-9\-\/]+|https?:\/\/[^\s]+)/g;
  const parts = text.split(linkRegex);
  
  return parts.map((part, index) => {
    if (part.match(/^\/[a-zA-Z0-9\-\/]+$/)) {
      return (
        <Link 
          key={index} 
          to={part} 
          className="underline font-medium hover:opacity-80"
        >
          {part}
        </Link>
      );
    } else if (part.match(/^https?:\/\//)) {
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline font-medium hover:opacity-80"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  senderName: string;
}

type ConversationStatus = 'idle' | 'connecting' | 'connected' | 'error';
type ChatMode = 'text' | 'voice';

const LiveChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hej! Jag heter Emma och jobbar på Homechef. Hur kan jag hjälpa dig idag?',
      sender: 'support',
      timestamp: new Date(),
      senderName: 'Emma'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, _setIsOnline] = useState(true);
  const [userRole, setUserRole] = useState<string>('customer');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice assistant state
  const [chatMode, setChatMode] = useState<ChatMode>('text');
  const [voiceStatus, setVoiceStatus] = useState<ConversationStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) {
        setUserRole('customer');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          setUserRole('customer');
        } else {
          setUserRole(data.role || 'customer');
        }
      } catch {
        setUserRole('customer');
      }
    };

    fetchUserRole();
  }, [user]);

  // Cleanup voice on unmount
  useEffect(() => {
    return () => {
      endVoiceConversation();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, voiceTranscript]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const conversationMessages = messages
        .filter(m => m.sender === 'user' || m.sender === 'support')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      conversationMessages.push({
        role: 'user',
        content: userMessage
      });

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { 
          messages: conversationMessages,
          userRole: userRole,
          userId: user?.id
        }
      });

      if (error) throw error;

      return data.message || 'Ledsen, jag kunde inte generera ett svar. Ring oss på 0734234686!';
    } catch (error) {
      return 'Hej! Just nu har vi tekniska problem med chatten. Ring oss gärna på 0734234686 (vardagar 08:00-17:00) så hjälper vi dig direkt! 😊';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      senderName: 'Du'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(currentMessage);
      
      setIsTyping(false);
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'support',
        timestamp: new Date(),
        senderName: 'Emma'
      };
      setMessages(prev => [...prev, supportMessage]);
    } catch {
      setIsTyping(false);
      toast.error('Kunde inte skicka meddelande. Försök igen.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Voice assistant functions
  const startVoiceConversation = useCallback(async () => {
    try {
      setVoiceStatus('connecting');
      setVoiceTranscript([]);
      audioQueueRef.current = [];
      isPlayingRef.current = false;

      try {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
      } catch (micError) {
        toast.error('Mikrofonåtkomst nekades. Tillåt mikrofon för att använda röstassistenten.');
        setVoiceStatus('idle');
        return;
      }

      const { data, error } = await supabase.functions.invoke('phone-ai-token', {
        body: {}
      });

      if (error) throw new Error('Kunde inte starta samtal');

      if (!data?.signedUrl) {
        toast.error(data?.message || 'Röstassistenten är inte konfigurerad ännu.');
        setVoiceStatus('idle');
        return;
      }

      audioContextRef.current = new AudioContext({ sampleRate: 16000 });

      const ws = new WebSocket(data.signedUrl);
      wsRef.current = ws;

      // Set up keep-alive ping every 15 seconds
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          lastActivityRef.current = Date.now();
          // Send a keep-alive ping to prevent timeout
          try {
            ws.send(JSON.stringify({ type: 'ping' }));
          } catch (e) {
            console.log('Ping failed, connection may be closing');
          }
        }
      }, 15000);

      ws.onopen = () => {
        setVoiceStatus('connected');
        setVoiceTranscript(['🟢 Ansluten! Börja prata med Emma.']);
        toast.success('Ansluten till röstassistenten Emma');
        lastActivityRef.current = Date.now();
        startAudioCapture();
      };

      ws.onmessage = async (event) => {
        lastActivityRef.current = Date.now();
        
        try {
          if (event.data instanceof Blob) {
            setIsSpeaking(true);
            const arrayBuffer = await event.data.arrayBuffer();
            queueAudioPlayback(arrayBuffer);
            return;
          }

          const message = JSON.parse(event.data);
          console.log('WebSocket message:', message.type);

          switch (message.type) {
            case 'conversation_initiation_metadata':
              console.log('Conversation initiated');
              break;
              
            case 'audio':
              if (message.audio_event?.audio_base_64) {
                setIsSpeaking(true);
                const base64 = message.audio_event.audio_base_64;
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                queueAudioPlayback(bytes.buffer);
              }
              break;
              
            case 'agent_response':
              if (message.agent_response_event?.agent_response) {
                setVoiceTranscript(prev => [...prev, `Emma: ${message.agent_response_event.agent_response}`]);
              } else if (message.text) {
                setVoiceTranscript(prev => [...prev, `Emma: ${message.text}`]);
              }
              break;
              
            case 'user_transcript':
              if (message.user_transcription_event?.user_transcript) {
                setVoiceTranscript(prev => [...prev, `Du: ${message.user_transcription_event.user_transcript}`]);
              } else if (message.text) {
                setVoiceTranscript(prev => [...prev, `Du: ${message.text}`]);
              }
              break;

            case 'interruption':
              audioQueueRef.current = [];
              setIsSpeaking(false);
              break;

            case 'ping':
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'pong', event_id: message.ping_event?.event_id }));
              }
              break;
              
            case 'pong':
              // Keep-alive response received
              break;

            case 'agent_response_correction':
              if (message.agent_response_correction_event?.corrected_response) {
                setVoiceTranscript(prev => {
                  const newTranscript = [...prev];
                  for (let i = newTranscript.length - 1; i >= 0; i--) {
                    if (newTranscript[i].startsWith('Emma:')) {
                      newTranscript[i] = `Emma: ${message.agent_response_correction_event.corrected_response}`;
                      break;
                    }
                  }
                  return newTranscript;
                });
              }
              break;
              
            case 'error':
              console.error('ElevenLabs error:', message);
              toast.error('Ett fel uppstod i samtalet');
              break;
          }
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Anslutningsfel');
        setVoiceStatus('error');
        clearPingInterval();
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        clearPingInterval();
        setVoiceStatus('idle');
        setIsSpeaking(false);

        const reason = (event.reason || '').toLowerCase();
        const isQuotaError =
          event.code === 1002 ||
          reason.includes('quota') ||
          reason.includes('exceeds your quota');

        if (isQuotaError) {
          setVoiceTranscript(prev => [
            ...prev,
            '🔴 Röstsamtalet stoppades: ElevenLabs-kvoten (credits) är slut. Fyll på/uppgradera ElevenLabs för att fortsätta.'
          ]);
          toast.error('Röstassistenten stoppades: ElevenLabs-kvoten är slut');
          return;
        }

        // Provide more specific feedback based on close code
        if (event.code === 1000) {
          setVoiceTranscript(prev => [...prev, '🔴 Samtalet avslutat.']);
        } else if (event.code === 1006) {
          setVoiceTranscript(prev => [...prev, '🔴 Anslutningen bröts. Prova att starta ett nytt samtal.']);
          toast.error('Anslutningen bröts oväntat');
        } else {
          setVoiceTranscript(prev => [...prev, '🔴 Samtalet avslutat.']);
        }
      };

    } catch (error) {
      console.error('Error starting voice conversation:', error);
      toast.error('Kunde inte starta röstsamtal. Försök igen.');
      setVoiceStatus('idle');
      clearPingInterval();
    }
  }, []);
  
  const clearPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  const queueAudioPlayback = useCallback((audioData: ArrayBuffer) => {
    audioQueueRef.current.push(audioData);
    if (!isPlayingRef.current) {
      playNextAudio();
    }
  }, []);

  const playNextAudio = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || !audioContextRef.current) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift()!;

    try {
      const int16Data = new Int16Array(audioData);
      const float32Data = new Float32Array(int16Data.length);
      
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }

      const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 16000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        playNextAudio();
      };
      
      source.start();
    } catch (error) {
      playNextAudio();
    }
  }, []);

  const startAudioCapture = useCallback(() => {
    if (!mediaStreamRef.current || !wsRef.current || !audioContextRef.current) return;

    const captureContext = new AudioContext({ sampleRate: 16000 });
    
    sourceRef.current = captureContext.createMediaStreamSource(mediaStreamRef.current);
    processorRef.current = captureContext.createScriptProcessor(4096, 1, 1);

    processorRef.current.onaudioprocess = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && !isMuted) {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Array = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        
        const bytes = new Uint8Array(int16Array.buffer);
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }
        const base64Audio = btoa(binary);
        
        wsRef.current.send(JSON.stringify({
          user_audio_chunk: base64Audio
        }));
      }
    };

    sourceRef.current.connect(processorRef.current);
    processorRef.current.connect(captureContext.destination);
  }, [isMuted]);

  const endVoiceConversation = useCallback(() => {
    clearPingInterval();
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'User ended conversation');
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
    
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setVoiceStatus('idle');
    setIsSpeaking(false);
  }, [clearPingInterval]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    toast.info(isMuted ? 'Mikrofon på' : 'Mikrofon avstängd');
  }, [isMuted]);

  const switchToVoice = () => {
    setChatMode('voice');
  };

  const switchToText = () => {
    if (voiceStatus === 'connected') {
      endVoiceConversation();
    }
    setChatMode('text');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 md:w-16 md:h-16 bg-gradient-primary hover:bg-gradient-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
        </Button>
        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full md:w-auto">
      <Card className={`w-full md:w-96 shadow-2xl transition-all duration-300 rounded-none md:rounded-lg ${isMinimized ? 'h-16' : 'h-[100dvh] md:h-[500px]'}`}>
        <CardHeader className="pb-3 bg-gradient-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {chatMode === 'voice' ? <Phone className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {chatMode === 'voice' ? 'Ring Emma' : 'Live Chat'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    chatMode === 'voice' 
                      ? (voiceStatus === 'connected' ? 'bg-white animate-pulse' : 'bg-white/50')
                      : (isOnline ? 'bg-green-400' : 'bg-gray-400')
                  }`}></div>
                  <span className="text-sm opacity-90">
                    {chatMode === 'voice' ? (
                      <>
                        {voiceStatus === 'idle' && 'Redo att ringa'}
                        {voiceStatus === 'connecting' && 'Ansluter...'}
                        {voiceStatus === 'connected' && 'I samtal'}
                        {voiceStatus === 'error' && 'Fel uppstod'}
                      </>
                    ) : (
                      isOnline ? 'Online' : 'Offline'
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (voiceStatus === 'connected') {
                    endVoiceConversation();
                  }
                  setIsOpen(false);
                }}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Mode Toggle */}
            <div className="flex border-b">
              <button
                onClick={switchToText}
                className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  chatMode === 'text' 
                    ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chatt
              </button>
              <button
                onClick={switchToVoice}
                className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  chatMode === 'voice' 
                    ? 'bg-green-500/10 text-green-600 border-b-2 border-green-500' 
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Phone className="w-4 h-4" />
                Ring
              </button>
            </div>

            <CardContent className="p-0 flex flex-col h-[380px]">
              {chatMode === 'text' ? (
                <>
                  {/* Text Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {message.sender === 'support' ? (
                              <User className="w-3 h-3" />
                            ) : (
                              <Bot className="w-3 h-3" />
                            )}
                            <span className="text-xs opacity-75">{message.senderName}</span>
                            <span className="text-xs opacity-75">{formatTime(message.timestamp)}</span>
                          </div>
                          <p className="text-sm">{parseMessageWithLinks(message.text)}</p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span className="text-xs text-muted-foreground">Emma skriver...</span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Text Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Skriv ditt meddelande..."
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Vardagar 08:00-17:00 | Ring 0734234686 för akut hjälp
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Voice Chat UI */}
                  <div className="flex-1 flex flex-col p-4">
                    {/* Status indicator */}
                    {voiceStatus === 'connected' && (
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
                    {voiceTranscript.length > 0 && (
                      <div className="flex-1 bg-muted/50 rounded-lg p-3 overflow-y-auto text-sm space-y-1 mb-4">
                        {voiceTranscript.map((line, index) => (
                          <p key={index} className="text-muted-foreground">{line}</p>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}

                    {/* Voice Controls */}
                    <div className="flex flex-col justify-center gap-4 mt-auto">
                      {voiceStatus === 'idle' && (
                        <Button
                          onClick={startVoiceConversation}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Starta samtal
                        </Button>
                      )}

                      {voiceStatus === 'connecting' && (
                        <Button disabled className="w-full">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Ansluter...
                        </Button>
                      )}

                      {voiceStatus === 'connected' && (
                        <div className="flex justify-center gap-4">
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
                            onClick={endVoiceConversation}
                            className="rounded-full w-14 h-14"
                          >
                            <PhoneOff className="w-6 h-6" />
                          </Button>
                        </div>
                      )}

                      {voiceStatus === 'error' && (
                        <Button
                          onClick={startVoiceConversation}
                          className="w-full"
                        >
                          Försök igen
                        </Button>
                      )}
                    </div>

                    {/* Info text */}
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Prata med Emma, vår AI-assistent. Hon kan svara på frågor om Homechef.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default LiveChat;