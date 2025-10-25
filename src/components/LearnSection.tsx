import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplets, Sun, Leaf, Shield } from "lucide-react";

interface LearnSectionProps {
  language: string;
  t: any;
}

export const LearnSection = ({ language, t }: LearnSectionProps) => {
  const topics = [
    {
      icon: Leaf,
      title: {
        en: "Importance of Trees",
        te: "చెట్ల ప్రాముఖ్యత",
        hi: "पेड़ों का महत्व"
      },
      content: {
        en: "Trees produce oxygen, absorb CO₂, prevent soil erosion, provide shade, support wildlife, and maintain ecological balance. A single mature tree can produce enough oxygen for 2-10 people per year.",
        te: "చెట్లు ఆక్సిజన్ ఉత్పత్తి చేస్తాయి, CO₂ గ్రహిస్తాయి, నేల కోతను నివారిస్తాయి, నీడ అందిస్తాయి, వన్యజీవులకు మద్దతు ఇస్తాయి మరియు పర్యావరణ సమతుల్యతను నిర్వహిస్తాయి.",
        hi: "पेड़ ऑक्सीजन पैदा करते हैं, CO₂ अवशोषित करते हैं, मिट्टी के कटाव को रोकते हैं, छाया प्रदान करते हैं, वन्यजीवों का समर्थन करते हैं, और पारिस्थितिक संतुलन बनाए रखते हैं।"
      }
    },
    {
      icon: Droplets,
      title: {
        en: "Climate & Rainfall Effects",
        te: "వాతావరణం & వర్షపాతం ప్రభావాలు",
        hi: "जलवायु और वर्षा प्रभाव"
      },
      content: {
        en: "Trees play a crucial role in the water cycle. They increase rainfall through transpiration, prevent floods, maintain groundwater levels, and reduce temperature. Forests can increase rainfall by 20-30% in their region.",
        te: "చెట్లు నీటి చక్రంలో కీలక పాత్ర పోషిస్తాయి. అవి ట్రాన్స్పిరేషన్ ద్వారా వర్షపాతాన్ని పెంచుతాయి, వరదలను నివారిస్తాయి, భూగర్భ జల స్థాయిలను కాపాడుతాయి.",
        hi: "पेड़ जल चक्र में महत्वपूर्ण भूमिका निभाते हैं। वे वाष्पोत्सर्जन के माध्यम से वर्षा बढ़ाते हैं, बाढ़ रोकते हैं, भूजल स्तर बनाए रखते हैं।"
      }
    },
    {
      icon: Shield,
      title: {
        en: "Plantation Safety & Tips",
        te: "నాటడం భద్రత & చిట్కాలు",
        hi: "रोपण सुरक्षा और सुझाव"
      },
      content: {
        en: "Use gloves when handling plants. Maintain 10-15 feet spacing between trees. Plant during monsoon for best results. Water regularly for first 2 years. Protect from grazing animals. Use organic manure.",
        te: "మొక్కలను నిర్వహించేటప్పుడు చేతి తొడుగులు వాడండి. చెట్ల మధ్య 10-15 అడుగుల దూరం ఉంచండి. ఉత్తమ ఫలితాల కోసం రుతుకాలంలో నాటండి.",
        hi: "पौधों को संभालते समय दस्ताने का प्रयोग करें। पेड़ों के बीच 10-15 फीट की दूरी रखें। सर्वोत्तम परिणाम के लिए मानसून के दौरान रोपण करें।"
      }
    },
    {
      icon: Sun,
      title: {
        en: "Maintenance Guide",
        te: "నిర్వహణ మార్గదర్శి",
        hi: "रखरखाव गाइड"
      },
      content: {
        en: "Water saplings twice daily in summer, once in winter. Ensure 6-8 hours of sunlight. Remove weeds monthly. Apply organic fertilizer quarterly. Prune dead branches. Watch for pests and diseases.",
        te: "వేసవిలో మొక్కలకు రోజుకు రెండుసార్లు, చలికాలంలో ఒకసారి నీరు పోయండి. 6-8 గంటల సూర్యకాంతి నిర్ధారించండి. నెలకు ఒకసారి కలుపు తీయండి.",
        hi: "गर्मियों में दिन में दो बार, सर्दियों में एक बार पानी दें। 6-8 घंटे धूप सुनिश्चित करें। मासिक रूप से खरपतवार हटाएं।"
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">{t.learnGrow}</h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        {topics.map((topic, idx) => {
          const title = language === 'en' ? topic.title.en : language === 'te' ? topic.title.te : topic.title.hi;
          const content = language === 'en' ? topic.content.en : language === 'te' ? topic.content.te : topic.content.hi;
          
          return (
            <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <topic.icon className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">{title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted-foreground">
                {content}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
