// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, User, Bot, Clock, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  senderName: string;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hej! Välkommen till Homechef. Hur kan jag hjälpa dig idag?',
      sender: 'support',
      timestamp: new Date(),
      senderName: 'Emma från support'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hej') || message.includes('hello') || message.includes('hallå')) {
      return 'Hej och välkommen till Homechef! 🍽️ Jag hjälper dig gärna med frågor om våra tjänster - beställa mat, bli kock, hyra kök eller boka privatkock. Vad kan jag hjälpa dig med idag?';
    }
    
    if (message.includes('beställ') || message.includes('order') || message.includes('mat') || message.includes('köpa')) {
      return 'För att beställa mat går du till vår hemsida och klickar på "Beställ mat". Där kan du söka bland lokala kockar och deras rätter. Har du problem med din beställning kan du ringa oss på 0734234686!';
    }
    
    if (message.includes('kock') || message.includes('chef') || message.includes('sälja') || message.includes('sälja mat')) {
      return 'Som kock på Homechef kan du sälja din hemlagade mat! Gå till "Sälja mat" för att registrera dig som kock. Vi har strikta hygienregler för att säkerställa kvalitet. Har du frågor om att bli kock? Ring 0734234686!';
    }
    
    if (message.includes('kök') || message.includes('hyra') || message.includes('kitchen') || message.includes('hyra kök')) {
      return 'Du kan hyra professionella kök genom vår plattform! Perfekt för catering, events eller större matlagning. Gå till "Hyra kök" för att se tillgängliga alternativ. För mer info, ring 0734234686!';
    }
    
    if (message.includes('privatkock') || message.includes('private chef') || message.includes('event')) {
      return 'Vi erbjuder privatkockar för events, middagar och speciella tillfällen! Gå till "Privatkock" för att se våra duktiga kockar och boka. Ring 0734234686 för personlig rådgivning!';
    }
    
    if (message.includes('upplevelse') || message.includes('experience') || message.includes('matlagning')) {
      return 'Våra matlagningsupplevelser är perfekta för teambuilding, dejter eller bara för kul! Du får laga mat tillsammans med professionella kockar. Boka under "Upplevelser". Frågor? Ring 0734234686!';
    }
    
    if (message.includes('betala') || message.includes('betalning') || message.includes('payment') || message.includes('klarna')) {
      return 'Vi använder säkra betalningar via Klarna. Du kan betala med kort, banköverföring eller delbetalning. All betalning sker säkert och krypterat. Problem med betalning? Ring 0734234686!';
    }
    
    if (message.includes('problem') || message.includes('hjälp') || message.includes('support')) {
      return 'Vi hjälper gärna till! För snabb hjälp ring oss på 0734234686 (vardagar 08:00-17:00). Du kan också maila oss eller använda denna chat. Vad behöver du hjälp med specifikt?';
    }
    
    if (message.includes('tack') || message.includes('thanks')) {
      return 'Så kul att jag kunde hjälpa! Om du har fler frågor är jag här. Du kan också alltid ringa oss på 0734234686 för direkt hjälp. Ha en fantastisk dag! 😊';
    }
    
    return 'Tack för din fråga! Jag hjälper dig gärna med information om Homechef - beställa mat, bli kock, hyra kök, boka privatkock eller matlagningsupplevelser. För specifik hjälp kan du ringa oss på 0734234686 (vardagar 08:00-17:00). Vad behöver du veta mer om?';
  };

  const handleSendMessage = () => {
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

    // Get AI response
    const aiResponse = generateAIResponse(currentMessage);
      
    setTimeout(() => {
      setIsTyping(false);
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'support',
        timestamp: new Date(),
        senderName: 'Emma från support'
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);

    toast.success('Meddelande skickat!');
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

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-primary hover:bg-gradient-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
        {/* Notification badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
        <CardHeader className="pb-3 bg-gradient-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Live Chat</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-sm opacity-90">
                    {isOnline ? 'Online' : 'Offline'}
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
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0 flex flex-col h-[400px]">
              {/* Messages */}
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
                      <p className="text-sm">{message.text}</p>
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

              {/* Input */}
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
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default LiveChat;