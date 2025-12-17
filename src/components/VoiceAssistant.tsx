import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Volume2, Send, Sparkles, Image, X, Camera, Leaf, TreeDeciduous, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

interface VoiceAssistantProps {
  language: string;
  t: any;
  context?: string;
}

const quickSuggestions = {
  en: [
    { icon: Leaf, text: "Best trees for my area", query: "What are the best trees to plant in tropical climate with sandy soil?" },
    { icon: TreeDeciduous, text: "How to care for Neem", query: "How do I take care of a Neem tree? What are the watering and sunlight requirements?" },
    { icon: Camera, text: "Identify a tree", query: "I want to identify a tree. Let me upload an image." },
    { icon: Sparkles, text: "Environmental benefits", query: "What are the environmental benefits of planting trees? How much oxygen does one tree produce?" },
  ],
  te: [
    { icon: Leaf, text: "నా ప్రాంతానికి ఉత్తమ చెట్లు", query: "ఉష్ణమండల వాతావరణం మరియు ఇసుక నేలలో నాటడానికి ఉత్తమ చెట్లు ఏవి?" },
    { icon: TreeDeciduous, text: "వేప సంరక్షణ", query: "వేప చెట్టును ఎలా సంరక్షించాలి? నీరు మరియు సూర్యరశ్మి అవసరాలు ఏమిటి?" },
    { icon: Camera, text: "చెట్టును గుర్తించండి", query: "నేను చెట్టును గుర్తించాలనుకుంటున్నాను. నన్ను చిత్రాన్ని అప్‌లోడ్ చేయనివ్వండి." },
    { icon: Sparkles, text: "పర్యావరణ ప్రయోజనాలు", query: "చెట్లు నాటడం వల్ల పర్యావరణ ప్రయోజనాలు ఏమిటి?" },
  ],
  hi: [
    { icon: Leaf, text: "मेरे क्षेत्र के लिए सर्वोत्तम पेड़", query: "उष्णकटिबंधीय जलवायु और रेतीली मिट्टी में लगाने के लिए सबसे अच्छे पेड़ कौन से हैं?" },
    { icon: TreeDeciduous, text: "नीम की देखभाल", query: "नीम के पेड़ की देखभाल कैसे करें? पानी और धूप की क्या जरूरतें हैं?" },
    { icon: Camera, text: "पेड़ पहचानें", query: "मैं एक पेड़ की पहचान करना चाहता हूं। मुझे एक छवि अपलोड करने दें।" },
    { icon: Sparkles, text: "पर्यावरणीय लाभ", query: "पेड़ लगाने के पर्यावरणीय लाभ क्या हैं?" },
  ],
};

export const VoiceAssistant = ({ language, t, context = '' }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: language === 'en' 
        ? "Hello! I'm Aarunya, your intelligent green companion 🌿. I can help you identify trees from photos, give care tips, suggest the best trees for your area, and answer all your gardening questions. Try uploading an image or ask me anything!" 
        : language === 'te' 
        ? "నమస్కారం! నేను ఆరుణ్య, మీ తెలివైన ఆకుపచ్చ స్నేహితురాలిని 🌿. ఫోటోల నుండి చెట్లను గుర్తించడంలో, సంరక్షణ చిట్కాలు ఇవ్వడంలో, మీ ప్రాంతానికి ఉత్తమ చెట్లను సూచించడంలో మీకు సహాయపడగలను. చిత్రాన్ని అప్‌లోడ్ చేయండి లేదా నన్ను ఏదైనా అడగండి!" 
        : "नमस्ते! मैं आरुण्या हूँ, आपकी बुद्धिमान हरी साथी 🌿। मैं तस्वीरों से पेड़ों की पहचान करने, देखभाल के सुझाव देने, आपके क्षेत्र के लिए सबसे अच्छे पेड़ सुझाने में मदद कर सकती हूँ। एक छवि अपलोड करें या मुझसे कुछ भी पूछें!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(language === 'en' ? "Image too large. Max 5MB." : language === 'te' ? "చిత్రం చాలా పెద్దది. గరిష్టంగా 5MB." : "छवि बहुत बड़ी है। अधिकतम 5MB।");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        toast.success(language === 'en' ? "Image ready! Ask me about it or click analyze." : language === 'te' ? "చిత్రం సిద్ధం! దాని గురించి అడగండి." : "छवि तैयार! इसके बारे में पूछें।");
      };
      reader.readAsDataURL(file);
    }
  }, [language]);

  const handleUserMessage = async (userMessage: string, imageData?: string) => {
    if (!userMessage.trim() && !imageData) return;

    const newUserMessage: Message = { 
      role: 'user', 
      content: userMessage || (language === 'en' ? "Please analyze this image" : language === 'te' ? "దయచేసి ఈ చిత్రాన్ని విశ్లేషించండి" : "कृपया इस छवि का विश्लेषण करें"),
      imageUrl: imageData 
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);
    
    if (imageData) {
      setIsAnalyzingImage(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke('aarunya-chat', {
        body: { 
          message: userMessage, 
          language, 
          context,
          imageData: imageData || null
        }
      });

      if (error) throw error;

      const reply = data.reply || "I'm here to help you! 🌱";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply);
      
      if (imageData) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = language === 'en' ? "Sorry, I couldn't process that. Please try again." :
        language === 'te' ? "క్షమించండి, నేను దానిని ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్ళీ ప్రయత్నించండి." :
        "क्षमा करें, मैं इसे प्रोसेस नहीं कर सकी। कृपया पुनः प्रयास करें।";
      toast.error(errorMsg);
    } finally {
      setIsTyping(false);
      setIsAnalyzingImage(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : language === 'te' ? 'te-IN' : 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
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

  const handleAnalyzeImage = () => {
    if (selectedImage) {
      const analyzeMsg = language === 'en' 
        ? "Please analyze this image of a tree/plant. Identify the species, assess its health, and provide care recommendations."
        : language === 'te'
        ? "దయచేసి ఈ చెట్టు/మొక్క చిత్రాన్ని విశ్లేషించండి. జాతులను గుర్తించండి, ఆరోగ్యాన్ని అంచనా వేయండి."
        : "कृपया इस पेड़/पौधे की छवि का विश्लेषण करें। प्रजाति की पहचान करें, स्वास्थ्य का आकलन करें।";
      handleUserMessage(analyzeMsg, selectedImage);
    }
  };

  const handleQuickSuggestion = (query: string) => {
    if (query.includes("upload") || query.includes("అప్‌లోడ్") || query.includes("अपलोड")) {
      fileInputRef.current?.click();
    } else {
      handleUserMessage(query);
    }
  };

  const handleSendMessage = () => {
    if (selectedImage) {
      handleUserMessage(inputText || "", selectedImage);
    } else if (inputText.trim()) {
      handleUserMessage(inputText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = quickSuggestions[language] || quickSuggestions.en;

  return (
    <Card className="p-4 md:p-6 flex flex-col h-[650px] bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-primary/10">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          {isSpeaking && (
            <div className="absolute inset-0 animate-ping">
              <div className="w-12 h-12 rounded-full bg-primary/30" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Aarunya 🌿
          </h2>
          <p className="text-xs text-muted-foreground">
            {language === 'en' ? "AI Tree Expert • Image Recognition" : language === 'te' ? "AI చెట్టు నిపుణుడు • చిత్ర గుర్తింపు" : "AI वृक्ष विशेषज्ञ • छवि पहचान"}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {language === 'en' ? "Online" : language === 'te' ? "ఆన్‌లైన్" : "ऑनलाइन"}
        </Badge>
      </div>

      {/* Quick Suggestions */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
        {suggestions.map((suggestion, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            className="shrink-0 text-xs border-primary/20 hover:bg-primary/10 hover:border-primary/40"
            onClick={() => handleQuickSuggestion(suggestion.query)}
          >
            <suggestion.icon className="h-3 w-3 mr-1" />
            {suggestion.text}
          </Button>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                }`}
              >
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="Uploaded" 
                    className="max-w-full h-auto rounded-lg mb-2 max-h-48 object-cover"
                  />
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  {isAnalyzingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">
                        {language === 'en' ? "Analyzing image..." : language === 'te' ? "చిత్రాన్ని విశ్లేషిస్తోంది..." : "छवि का विश्लेषण कर रहा है..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Image Preview */}
      {selectedImage && (
        <div className="relative mb-3 inline-block">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="h-20 w-20 object-cover rounded-lg border-2 border-primary/50"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90"
          >
            <X className="h-3 w-3" />
          </button>
          <Button
            size="sm"
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs h-6 px-2"
            onClick={handleAnalyzeImage}
            disabled={isTyping}
          >
            {language === 'en' ? "Analyze" : language === 'te' ? "విశ్లేషించు" : "विश्लेषण"}
          </Button>
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              selectedImage 
                ? (language === 'en' ? "Ask about this image..." : language === 'te' ? "ఈ చిత్రం గురించి అడగండి..." : "इस छवि के बारे में पूछें...")
                : (language === 'en' ? "Ask me anything about trees..." : language === 'te' ? "చెట్ల గురించి ఏదైనా అడగండి..." : "पेड़ों के बारे में कुछ भी पूछें...")
            }
            disabled={isListening || isTyping}
            className="flex-1 border-primary/20 focus:border-primary/50"
          />
          <Button
            onClick={handleSendMessage}
            disabled={(!inputText.trim() && !selectedImage) || isTyping}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            variant="outline"
            disabled={isTyping}
            className="border-primary/20 hover:bg-primary/10"
          >
            <Image className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Upload Image' : language === 'te' ? 'చిత్రం అప్‌లోడ్' : 'छवि अपलोड'}
          </Button>

          <Button
            onClick={toggleListening}
            size="sm"
            variant={isListening ? "destructive" : "outline"}
            disabled={isTyping}
            className={!isListening ? "border-primary/20 hover:bg-primary/10" : ""}
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
            onClick={() => {
              const motivations = t.slogans;
              const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
              speak(randomMotivation);
              setMessages(prev => [...prev, { role: 'assistant', content: randomMotivation }]);
            }}
            size="sm"
            variant="secondary"
            disabled={isSpeaking}
          >
            <Volume2 className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Motivate' : language === 'te' ? 'ప్రేరణ' : 'प्रेरणा'}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {language === 'en' ? '🌱 Powered by AI • Upload tree photos for instant identification & care tips' :
           language === 'te' ? '🌱 AI శక్తితో • తక్షణ గుర్తింపు కోసం చెట్టు ఫోటోలను అప్‌లోడ్ చేయండి' :
           '🌱 AI द्वारा संचालित • तत्काल पहचान के लिए पेड़ की तस्वीरें अपलोड करें'}
        </p>
      </div>
    </Card>
  );
};
