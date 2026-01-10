import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Volume2, Send, Sparkles, Image, X, Camera, Leaf, TreeDeciduous, Loader2, Bug, Stethoscope, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDiseaseHistory } from "@/hooks/useDiseaseHistory";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  type?: 'normal' | 'disease';
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
    { icon: Bug, text: "Disease detection", query: "I want to check my plant for diseases. Let me upload an image." },
  ],
  te: [
    { icon: Leaf, text: "నా ప్రాంతానికి ఉత్తమ చెట్లు", query: "ఉష్ణమండల వాతావరణం మరియు ఇసుక నేలలో నాటడానికి ఉత్తమ చెట్లు ఏవి?" },
    { icon: TreeDeciduous, text: "వేప సంరక్షణ", query: "వేప చెట్టును ఎలా సంరక్షించాలి? నీరు మరియు సూర్యరశ్మి అవసరాలు ఏమిటి?" },
    { icon: Camera, text: "చెట్టును గుర్తించండి", query: "నేను చెట్టును గుర్తించాలనుకుంటున్నాను. నన్ను చిత్రాన్ని అప్‌లోడ్ చేయనివ్వండి." },
    { icon: Bug, text: "వ్యాధి గుర్తింపు", query: "నా మొక్కలో వ్యాధులు ఉన్నాయా అని తనిఖీ చేయాలనుకుంటున్నాను." },
  ],
  hi: [
    { icon: Leaf, text: "मेरे क्षेत्र के लिए सर्वोत्तम पेड़", query: "उष्णकटिबंधीय जलवायु और रेतीली मिट्टी में लगाने के लिए सबसे अच्छे पेड़ कौन से हैं?" },
    { icon: TreeDeciduous, text: "नीम की देखभाल", query: "नीम के पेड़ की देखभाल कैसे करें? पानी और धूप की क्या जरूरतें हैं?" },
    { icon: Camera, text: "पेड़ पहचानें", query: "मैं एक पेड़ की पहचान करना चाहता हूं। मुझे एक छवि अपलोड करने दें।" },
    { icon: Bug, text: "रोग का पता लगाएं", query: "मैं अपने पौधे में बीमारियों की जांच करना चाहता हूं।" },
  ],
};

export const VoiceAssistant = ({ language, t, context = '' }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'disease'>('chat');
  const [userId, setUserId] = useState<string | null>(null);
  const { saveDiagnosis, extractDiseaseInfo } = useDiseaseHistory();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: language === 'en' 
        ? "Hello! I'm Aarunya, your intelligent green companion 🌿. I can help you identify trees from photos, detect plant diseases, give care tips, and suggest the best trees for your area. Try uploading an image or ask me anything!" 
        : language === 'te' 
        ? "నమస్కారం! నేను ఆరుణ్య, మీ తెలివైన ఆకుపచ్చ స్నేహితురాలిని 🌿. ఫోటోల నుండి చెట్లను గుర్తించడంలో, మొక్క వ్యాధులను గుర్తించడంలో, సంరక్షణ చిట్కాలు ఇవ్వడంలో మీకు సహాయపడగలను!" 
        : "नमस्ते! मैं आरुण्या हूँ, आपकी बुद्धिमान हरी साथी 🌿। मैं तस्वीरों से पेड़ों की पहचान, पौधों की बीमारियों का पता लगाने, देखभाल के सुझाव देने में मदद कर सकती हूँ!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [diseaseMode, setDiseaseMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = () => {
      const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        console.log("Speech recognition not supported");
        return null;
      }

      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;
      
      // Set language based on current language setting
      switch (language) {
        case 'te':
          recognitionInstance.lang = 'te-IN';
          break;
        case 'hi':
          recognitionInstance.lang = 'hi-IN';
          break;
        default:
          recognitionInstance.lang = 'en-US';
      }

      recognitionInstance.onresult = (event: any) => {
        if (event.results && event.results[0]) {
          const transcript = event.results[0][0].transcript;
          console.log("Speech recognized:", transcript);
          if (transcript.trim()) {
            handleUserMessage(transcript);
          }
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          toast.info(language === 'en' ? "No speech detected. Try again." : 
                    language === 'te' ? "మాట గుర్తించబడలేదు. మళ్ళీ ప్రయత్నించండి." : 
                    "कोई भाषण नहीं मिला। पुनः प्रयास करें।");
        } else if (event.error === 'not-allowed') {
          toast.error(language === 'en' ? "Microphone access denied. Please allow microphone access." : 
                     language === 'te' ? "మైక్రోఫోన్ యాక్సెస్ తిరస్కరించబడింది." : 
                     "माइक्रोफ़ोन एक्सेस अस्वीकृत।");
        } else {
          toast.error(language === 'en' ? "Voice recognition error. Please try again." : 
                     language === 'te' ? "వాయిస్ గుర్తింపు లోపం." : 
                     "आवाज पहचान त्रुटि।");
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      return recognitionInstance;
    };

    const rec = initSpeechRecognition();
    setRecognition(rec);

    return () => {
      if (rec) {
        try {
          rec.abort();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
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
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  }, [language]);

  const handleUserMessage = async (userMessage: string, imageData?: string) => {
    if (!userMessage.trim() && !imageData) return;

    const messageType: 'normal' | 'disease' = diseaseMode ? 'disease' : 'normal';
    const newUserMessage: Message = { 
      role: 'user', 
      content: userMessage || (language === 'en' ? "Please analyze this image" : language === 'te' ? "దయచేసి ఈ చిత్రాన్ని విశ్లేషించండి" : "कृपया इस छवि का विश्लेषण करें"),
      imageUrl: imageData,
      type: messageType
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
          context: diseaseMode ? 'disease_detection' : context,
          imageData: imageData || null,
          diseaseMode: diseaseMode
        }
      });

      if (error) throw error;

      const reply = data.reply || (language === 'en' ? "I'm here to help you! 🌱" : language === 'te' ? "నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను! 🌱" : "मैं आपकी मदद के लिए यहाँ हूँ! 🌱");
      setMessages(prev => [...prev, { role: 'assistant', content: reply, type: messageType }]);
      speak(reply);
      
      // Save disease diagnosis if in disease mode with image
      if (diseaseMode && imageData && userId) {
        const diseaseInfo = extractDiseaseInfo(reply);
        await saveDiagnosis({
          userId,
          plantName: userMessage?.split(' ').slice(0, 3).join(' ') || "Unknown Plant",
          diseaseName: diseaseInfo.diseaseName,
          symptoms: diseaseInfo.symptoms,
          diagnosis: reply,
          severity: diseaseInfo.severity,
          treatment: diseaseInfo.treatment,
          imageUrl: imageData,
        });
        toast.success(language === 'en' ? "Diagnosis saved to history!" : "నిర్ధారణ చరిత్రకు సేవ్ చేయబడింది!");
      }
      
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

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.log("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthRef.current = utterance;
    
    // Set language
    switch (language) {
      case 'te':
        utterance.lang = 'te-IN';
        break;
      case 'hi':
        utterance.lang = 'hi-IN';
        break;
      default:
        utterance.lang = 'en-US';
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      speechSynthRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      speechSynthRef.current = null;
    };

    // Small delay to ensure voices are loaded
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      if (recognition) {
        recognition.stop();
      }
      setIsListening(false);
    } else {
      if (!recognition) {
        toast.error(language === 'en' ? "Voice recognition not supported in your browser" : 
                   language === 'te' ? "మీ బ్రౌజర్‌లో వాయిస్ గుర్తింపు మద్దతు లేదు" : 
                   "आपके ब्राउज़र में आवाज पहचान समर्थित नहीं है");
        return;
      }

      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        recognition.start();
        setIsListening(true);
        toast.success(language === 'en' ? "🎤 Listening... Speak now!" : 
                     language === 'te' ? "🎤 వింటున్నాను... ఇప్పుడు మాట్లాడండి!" : 
                     "🎤 सुन रहा हूँ... अब बोलें!");
      } catch (error) {
        console.error("Microphone error:", error);
        toast.error(language === 'en' ? "Please allow microphone access to use voice input" : 
                   language === 'te' ? "వాయిస్ ఇన్‌పుట్ ఉపయోగించడానికి మైక్రోఫోన్ యాక్సెస్ అనుమతించండి" : 
                   "वॉइस इनपुट का उपयोग करने के लिए माइक्रोफ़ोन एक्सेस की अनुमति दें");
      }
    }
  }, [isListening, recognition, language]);

  const handleAnalyzeImage = () => {
    if (selectedImage) {
      const analyzeMsg = diseaseMode
        ? (language === 'en' 
            ? "Please analyze this plant image for any diseases, pests, or health issues. Identify the problem, explain the cause, and provide treatment recommendations."
            : language === 'te'
            ? "దయచేసి ఈ మొక్క చిత్రాన్ని వ్యాధులు, తెగుళ్ళు లేదా ఆరోగ్య సమస్యల కోసం విశ్లేషించండి. సమస్యను గుర్తించండి, కారణాన్ని వివరించండి మరియు చికిత్స సిఫారసులను అందించండి."
            : "कृपया इस पौधे की छवि का विश्लेषण करें किसी भी बीमारी, कीट या स्वास्थ्य समस्याओं के लिए। समस्या की पहचान करें, कारण बताएं और उपचार की सिफारिशें दें।")
        : (language === 'en' 
            ? "Please analyze this image of a tree/plant. Identify the species, assess its health, and provide care recommendations."
            : language === 'te'
            ? "దయచేసి ఈ చెట్టు/మొక్క చిత్రాన్ని విశ్లేషించండి. జాతులను గుర్తించండి, ఆరోగ్యాన్ని అంచనా వేయండి."
            : "कृपया इस पेड़/पौधे की छवि का विश्लेषण करें। प्रजाति की पहचान करें, स्वास्थ्य का आकलन करें।");
      handleUserMessage(analyzeMsg, selectedImage);
    }
  };

  const handleQuickSuggestion = (query: string) => {
    if (query.includes("upload") || query.includes("అప్‌లోడ్") || query.includes("अपलोड") || query.includes("image")) {
      fileInputRef.current?.click();
    } else if (query.includes("disease") || query.includes("వ్యాధి") || query.includes("रोग") || query.includes("check")) {
      setDiseaseMode(true);
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

  const suggestions = quickSuggestions[language as keyof typeof quickSuggestions] || quickSuggestions.en;

  return (
    <Card className="p-4 md:p-6 flex flex-col h-[700px] bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
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
          {isListening && (
            <div className="absolute inset-0 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-red-500/30" />
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
            isListening ? 'bg-red-500' : isSpeaking ? 'bg-blue-500' : 'bg-green-500'
          }`} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Aarunya 🌿
          </h2>
          <p className="text-xs text-muted-foreground">
            {language === 'en' ? "AI Tree Expert • Disease Detection • Image Recognition" : 
             language === 'te' ? "AI చెట్టు నిపుణుడు • వ్యాధి గుర్తింపు • చిత్ర గుర్తింపు" : 
             "AI वृक्ष विशेषज्ञ • रोग पहचान • छवि पहचान"}
          </p>
        </div>
        <div className="flex gap-2">
          {diseaseMode && (
            <Badge variant="destructive" className="text-xs flex items-center gap-1">
              <Stethoscope className="h-3 w-3" />
              {language === 'en' ? "Disease Mode" : language === 'te' ? "వ్యాధి మోడ్" : "रोग मोड"}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {isListening ? (language === 'en' ? "Listening..." : language === 'te' ? "వింటోంది..." : "सुन रहा है...") :
             isSpeaking ? (language === 'en' ? "Speaking..." : language === 'te' ? "మాట్లాడుతోంది..." : "बोल रहा है...") :
             (language === 'en' ? "Online" : language === 'te' ? "ఆన్‌లైన్" : "ऑनलाइन")}
          </Badge>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <Button
          size="sm"
          variant={!diseaseMode ? "default" : "outline"}
          onClick={() => setDiseaseMode(false)}
          className="flex-1"
        >
          <TreeDeciduous className="h-4 w-4 mr-2" />
          {language === 'en' ? "General" : language === 'te' ? "సాధారణ" : "सामान्य"}
        </Button>
        <Button
          size="sm"
          variant={diseaseMode ? "default" : "outline"}
          onClick={() => setDiseaseMode(true)}
          className="flex-1"
        >
          <Stethoscope className="h-4 w-4 mr-2" />
          {language === 'en' ? "Disease Detection" : language === 'te' ? "వ్యాధి గుర్తింపు" : "रोग पहचान"}
        </Button>
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
                    ? msg.type === 'disease' 
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-primary text-primary-foreground rounded-br-md'
                    : msg.type === 'disease'
                      ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-bl-md'
                      : 'bg-muted rounded-bl-md'
                }`}
              >
                {msg.type === 'disease' && msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs mb-2">
                    <AlertTriangle className="h-3 w-3" />
                    {language === 'en' ? "Disease Analysis" : language === 'te' ? "వ్యాధి విశ్లేషణ" : "रोग विश्लेषण"}
                  </div>
                )}
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
              <div className={`rounded-2xl rounded-bl-md p-3 shadow-sm ${
                diseaseMode ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800' : 'bg-muted'
              }`}>
                <div className="flex items-center gap-2">
                  {isAnalyzingImage ? (
                    <>
                      <Loader2 className={`w-4 h-4 animate-spin ${diseaseMode ? 'text-orange-500' : 'text-primary'}`} />
                      <span className="text-xs text-muted-foreground">
                        {diseaseMode 
                          ? (language === 'en' ? "Detecting diseases..." : language === 'te' ? "వ్యాధులను గుర్తిస్తోంది..." : "रोगों का पता लगा रहा है...")
                          : (language === 'en' ? "Analyzing image..." : language === 'te' ? "చిత్రాన్ని విశ్లేషిస్తోంది..." : "छवि का विश्लेषण कर रहा है...")}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${diseaseMode ? 'bg-orange-500' : 'bg-primary'}`} />
                      <div className={`w-2 h-2 rounded-full animate-bounce delay-100 ${diseaseMode ? 'bg-orange-500' : 'bg-primary'}`} />
                      <div className={`w-2 h-2 rounded-full animate-bounce delay-200 ${diseaseMode ? 'bg-orange-500' : 'bg-primary'}`} />
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
            className={`h-20 w-20 object-cover rounded-lg border-2 ${diseaseMode ? 'border-orange-500/50' : 'border-primary/50'}`}
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90"
          >
            <X className="h-3 w-3" />
          </button>
          <Button
            size="sm"
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs h-6 px-2 ${diseaseMode ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
            onClick={handleAnalyzeImage}
            disabled={isTyping}
          >
            {diseaseMode 
              ? (language === 'en' ? "Detect" : language === 'te' ? "గుర్తించు" : "पता लगाएं")
              : (language === 'en' ? "Analyze" : language === 'te' ? "విశ్లేషించు" : "विश्लेषण")}
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
              diseaseMode
                ? (language === 'en' ? "Describe the plant issue..." : language === 'te' ? "మొక్క సమస్యను వివరించండి..." : "पौधे की समस्या का वर्णन करें...")
                : selectedImage 
                  ? (language === 'en' ? "Ask about this image..." : language === 'te' ? "ఈ చిత్రం గురించి అడగండి..." : "इस छवि के बारे में पूछें...")
                  : (language === 'en' ? "Ask me anything about trees..." : language === 'te' ? "చెట్ల గురించి ఏదైనా అడగండి..." : "पेड़ों के बारे में कुछ भी पूछें...")
            }
            disabled={isListening || isTyping}
            className={`flex-1 ${diseaseMode ? 'border-orange-300 focus:border-orange-500' : 'border-primary/20 focus:border-primary/50'}`}
          />
          <Button
            onClick={handleSendMessage}
            disabled={(!inputText.trim() && !selectedImage) || isTyping}
            size="icon"
            className={`shrink-0 ${diseaseMode ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
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
            className={diseaseMode ? "border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20" : "border-primary/20 hover:bg-primary/10"}
          >
            <Image className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Upload Image' : language === 'te' ? 'చిత్రం అప్‌లోడ్' : 'छवि अपलोड'}
          </Button>

          <Button
            onClick={toggleListening}
            size="sm"
            variant={isListening ? "destructive" : "outline"}
            disabled={isTyping}
            className={!isListening ? (diseaseMode ? "border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20" : "border-primary/20 hover:bg-primary/10") : ""}
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

          {isSpeaking ? (
            <Button
              onClick={stopSpeaking}
              size="sm"
              variant="destructive"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Stop' : language === 'te' ? 'ఆపు' : 'रोकें'}
            </Button>
          ) : (
            <Button
              onClick={() => {
                const motivations = t.slogans;
                const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
                speak(randomMotivation);
                setMessages(prev => [...prev, { role: 'assistant', content: randomMotivation }]);
              }}
              size="sm"
              variant="secondary"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Motivate' : language === 'te' ? 'ప్రేరణ' : 'प्रेरणा'}
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {diseaseMode 
            ? (language === 'en' ? '🔬 Disease Detection Mode • Upload photos to identify plant diseases & get treatment advice' :
               language === 'te' ? '🔬 వ్యాధి గుర్తింపు మోడ్ • మొక్క వ్యాధులను గుర్తించడానికి ఫోటోలను అప్‌లోడ్ చేయండి' :
               '🔬 रोग पहचान मोड • पौधों की बीमारियों की पहचान के लिए तस्वीरें अपलोड करें')
            : (language === 'en' ? '🌱 Powered by AI • Upload tree photos for instant identification & care tips' :
               language === 'te' ? '🌱 AI శక్తితో • తక్షణ గుర్తింపు కోసం చెట్టు ఫోటోలను అప్‌లోడ్ చేయండి' :
               '🌱 AI द्वारा संचालित • तत्काल पहचान के लिए पेड़ की तस्वीरें अपलोड करें')}
        </p>
      </div>
    </Card>
  );
};
