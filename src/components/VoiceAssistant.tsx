import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Language } from "@/lib/translations";

interface VoiceAssistantProps {
  language: Language;
  t: any;
}

export const VoiceAssistant = ({ language, t }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'en' ? 'en-US' : language === 'te' ? 'te-IN' : 'hi-IN';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
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

  const handleVoiceCommand = (command: string) => {
    if (command.includes('plant') || command.includes('నాటండి') || command.includes('लगाएं')) {
      speak(t.plantNow);
      toast.success("Command: " + t.plantTree);
    } else if (command.includes('progress') || command.includes('పురోగతి') || command.includes('प्रगति')) {
      speak(t.myProgress);
      toast.success("Command: " + t.myProgress);
    } else if (command.includes('quiz') || command.includes('క్విజ్') || command.includes('क्विज')) {
      speak(t.startQuiz);
      toast.success("Command: " + t.quiz);
    } else {
      speak("I didn't understand that command");
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : language === 'te' ? 'te-IN' : 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
      toast.success("🎤 Listening...");
    }
  };

  const speakMotivation = () => {
    const motivations = t.slogans;
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    speak(randomMotivation);
    toast.success("🔊 " + randomMotivation);
  };

  return (
    <Card className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-6 text-primary">{t.voiceAssistant}</h2>
      
      <div className="space-y-4">
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleListening}
            size="lg"
            variant={isListening ? "destructive" : "default"}
            className="w-32"
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-5 w-5" />
                Stop
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Listen
              </>
            )}
          </Button>

          <Button
            onClick={speakMotivation}
            size="lg"
            variant="secondary"
            className="w-40"
          >
            <Volume2 className="mr-2 h-5 w-5" />
            Motivation
          </Button>
        </div>

        {isListening && (
          <div className="animate-pulse-soft">
            <div className="h-12 w-12 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-destructive animate-pulse" />
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2 pt-4">
          <p className="font-semibold">Try saying:</p>
          <ul className="space-y-1">
            <li>"Plant a tree"</li>
            <li>"Show my progress"</li>
            <li>"Start quiz"</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
