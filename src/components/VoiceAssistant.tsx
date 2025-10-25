import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Volume2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Language } from "@/lib/translations";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface VoiceAssistantProps {
  language: Language;
  t: any;
  context?: string;
}

export const VoiceAssistant = ({ language, t, context = '' }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: language === 'en' ? "Hello! I'm Aarunya, your green companion 🌿. Let's make the Earth greener together! How can I help you today?" :
      language === 'te' ? "నమస్కారం! నేను ఆరుణ్య, మీ ఆకుపచ్చ స్నేహితురాలిని 🌿. భూమిని మరింత ఆకుపచ్చగా చేద్దాం! నేను మీకు ఎలా సహాయం చేయగలను?" :
      "नमस्ते! मैं आरुण्या हूँ, आपकी हरी साथी 🌿। आइए पृथ्वी को और हरा-भरा बनाएं! मैं आपकी कैसे मदद कर सकती हूँ?" }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'en' ? 'en-US' : language === 'te' ? 'te-IN' : 'hi-IN';

      recognitionInstance.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        await handleUserMessage(transcript);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast.error("Voice recognition error");
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language]);

  const handleUserMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputText('');
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('aarunya-chat', {
        body: { message: userMessage, language, context }
      });

      if (error) throw error;

      const reply = data.reply || "I'm here to help you! 🌱";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = language === 'en' ? "Sorry, I couldn't process that. Please try again." :
        language === 'te' ? "క్షమించండి, నేను దానిని ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్ళీ ప్రయత్నించండి." :
        "क्षमा करें, मैं इसे प्रोसेस नहीं कर सकी। कृपया पुनः प्रयास करें।";
      toast.error(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : language === 'te' ? 'te-IN' : 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1; // Slightly higher pitch for friendly tone
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        recognition.start();
        setIsListening(true);
        const listeningMsg = language === 'en' ? "🎤 Listening..." :
          language === 'te' ? "🎤 వింటున్నాను..." :
          "🎤 सुन रहा हूँ...";
        toast.success(listeningMsg);
      } else {
        toast.error("Voice recognition not supported");
      }
    }
  };

  const speakMotivation = () => {
    const motivations = t.slogans;
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    speak(randomMotivation);
    setMessages(prev => [...prev, { role: 'assistant', content: randomMotivation }]);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      handleUserMessage(inputText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="p-6 flex flex-col h-[600px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          {isSpeaking && (
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="h-8 w-8 text-primary/40" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">Aarunya 🌿</h2>
          <p className="text-sm text-muted-foreground">{t.voiceAssistant}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              language === 'en' ? "Ask me anything about trees..." :
              language === 'te' ? "చెట్ల గురించి ఏదైనా అడగండి..." :
              "पेड़ों के बारे में कुछ भी पूछें..."
            }
            disabled={isListening || isTyping}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            onClick={toggleListening}
            size="sm"
            variant={isListening ? "destructive" : "outline"}
            disabled={isTyping}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Stop' : language === 'te' ? 'ఆపు' : 'रोकें'}
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Voice' : language === 'te' ? 'వాయిస్' : 'आवाज़'}
              </>
            )}
          </Button>

          <Button
            onClick={speakMotivation}
            size="sm"
            variant="secondary"
            disabled={isSpeaking}
          >
            <Volume2 className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Motivation' : language === 'te' ? 'ప్రేరణ' : 'प्रेरणा'}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {language === 'en' ? 'Powered by AI • Speaks English, Telugu & Hindi' :
           language === 'te' ? 'AI శక్తితో • ఇంగ్లీష్, తెలుగు & హిందీ మాట్లాడుతుంది' :
           'AI द्वारा संचालित • अंग्रेज़ी, तेलुगु और हिंदी बोलती है'}
        </p>
      </div>
    </Card>
  );
};
