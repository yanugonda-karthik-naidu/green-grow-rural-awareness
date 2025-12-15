import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Sun, Leaf, Shield, TreeDeciduous, Sprout, Heart, Cloud, Volume2, VolumeX, CheckCircle, XCircle } from "lucide-react";

interface LearnSectionProps {
  language: string;
  t: any;
}

export const LearnSection = ({ language, t }: LearnSectionProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);

  const speakContent = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && currentSpeakingId === id) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setCurrentSpeakingId(id);
    }
  };

  // Myths vs Facts data
  const mythsFacts = {
    en: [
      { myth: "Planting trees is only for farmers", fact: "Anyone can plant trees - in pots, balconies, rooftops, or community spaces" },
      { myth: "Trees take too long to grow", fact: "Fast-growing species like Moringa can grow 3-4 meters in the first year" },
      { myth: "One tree doesn't make a difference", fact: "One tree absorbs 48 lbs of CO₂/year and provides oxygen for 2-10 people" },
      { myth: "Trees need a lot of maintenance", fact: "Once established (1-2 years), most native trees need minimal care" },
      { myth: "Urban areas can't support trees", fact: "Cities benefit most from trees - reducing heat by 2-8°F and improving air quality" },
    ],
    te: [
      { myth: "చెట్లు నాటడం రైతులకు మాత్రమే", fact: "ఎవరైనా చెట్లు నాటవచ్చు - కుండలలో, బాల్కనీలలో, పైకప్పులలో" },
      { myth: "చెట్లు పెరగడానికి చాలా సమయం పడుతుంది", fact: "మునగ వంటి వేగంగా పెరిగే జాతులు మొదటి సంవత్సరంలో 3-4 మీటర్లు పెరుగుతాయి" },
      { myth: "ఒక చెట్టు తేడా చేయదు", fact: "ఒక చెట్టు సంవత్సరానికి 48 పౌండ్ల CO₂ను గ్రహిస్తుంది" },
      { myth: "చెట్లకు చాలా నిర్వహణ అవసరం", fact: "స్థాపించిన తర్వాత చాలా స్థానిక చెట్లకు తక్కువ సంరక్షణ అవసరం" },
      { myth: "పట్టణ ప్రాంతాలు చెట్లకు మద్దతు ఇవ్వవు", fact: "నగరాలు చెట్ల నుండి అత్యధిక ప్రయోజనం పొందుతాయి" },
    ],
    hi: [
      { myth: "पेड़ लगाना केवल किसानों के लिए है", fact: "कोई भी पेड़ लगा सकता है - गमलों, बालकनियों, छतों पर" },
      { myth: "पेड़ों को बढ़ने में बहुत समय लगता है", fact: "मोरिंगा जैसी तेजी से बढ़ने वाली प्रजातियां पहले साल में 3-4 मीटर बढ़ सकती हैं" },
      { myth: "एक पेड़ से कोई फर्क नहीं पड़ता", fact: "एक पेड़ प्रति वर्ष 48 पाउंड CO₂ अवशोषित करता है" },
      { myth: "पेड़ों को बहुत रखरखाव की जरूरत है", fact: "स्थापित होने के बाद अधिकांश देशी पेड़ों को न्यूनतम देखभाल की आवश्यकता होती है" },
      { myth: "शहरी क्षेत्र पेड़ों का समर्थन नहीं कर सकते", fact: "शहरों को पेड़ों से सबसे अधिक लाभ होता है" },
    ]
  };
  const topics = [
    {
      icon: Leaf,
      title: {
        en: "Importance of Trees",
        te: "చెట్ల ప్రాముఖ్యత",
        hi: "पेड़ों का महत्व"
      },
      sections: {
        en: [
          {
            subtitle: "Environmental Benefits",
            content: "Trees are the lungs of our planet. A single mature tree produces enough oxygen for 2-10 people annually and absorbs 48 pounds of CO₂ per year. They filter air pollutants, reducing respiratory diseases in urban areas by up to 50%. Trees also regulate temperature, providing natural air conditioning that can reduce energy costs by 30%."
          },
          {
            subtitle: "Economic Value",
            content: "Trees increase property values by 10-20% and create jobs in forestry, landscaping, and wood industries. Fruit-bearing trees provide sustainable income for rural families. Urban trees save cities millions in storm water management and air quality improvements."
          },
          {
            subtitle: "Social Impact",
            content: "Green spaces with trees reduce stress, improve mental health, and promote community bonding. Studies show that hospital patients with views of trees recover 20% faster. Trees create safer neighborhoods by reducing urban heat and providing gathering spaces."
          },
          {
            subtitle: "Wildlife Support",
            content: "A single oak tree can support over 500 species of wildlife. Trees provide food, shelter, and breeding grounds for birds, insects, and mammals. They create vital corridors for wildlife migration and biodiversity conservation."
          }
        ],
        te: [
          {
            subtitle: "పర్యావరణ లాభాలు",
            content: "చెట్లు మన గ్రహం యొక్క ఊపిరితిత్తులు. ఒక పెద్ద చెట్టు సంవత్సరానికి 2-10 మందికి సరిపడా ఆక్సిజన్ ఉత్పత్తి చేస్తుంది మరియు సంవత్సరానికి 48 పౌండ్ల CO₂ను గ్రహిస్తుంది. అవి గాలి కాలుష్యాన్ని ఫిల్టర్ చేస్తాయి, పట్టణ ప్రాంతాలలో శ్వాసకోశ వ్యాధులను 50% వరకు తగ్గిస్తాయి."
          },
          {
            subtitle: "ఆర్థిక విలువ",
            content: "చెట్లు ఆస్తి విలువలను 10-20% పెంచుతాయి మరియు అటవీ, తోటల పెంపకం మరియు కలప పరిశ్రమలలో ఉద్యోగాలను సృష్టిస్తాయి. పండ్ల చెట్లు గ్రామీణ కుటుంబాలకు స్థిరమైన ఆదాయాన్ని అందిస్తాయి."
          },
          {
            subtitle: "సామాజిక ప్రభావం",
            content: "చెట్లతో కూడిన పచ్చని ప్రదేశాలు ఒత్తిడిని తగ్గిస్తాయి, మానసిక ఆరోగ్యాన్ని మెరుగుపరుస్తాయి మరియు సమాజ బంధాన్ని ప్రోత్సహిస్తాయి. చెట్ల దృశ్యాలతో ఉన్న ఆసుపత్రి రోగులు 20% వేగంగా కోలుకుంటారు."
          },
          {
            subtitle: "వన్యజీవుల మద్దతు",
            content: "ఒక ఓక్ చెట్టు 500 కంటే ఎక్కువ వన్యజీవుల జాతులకు మద్దతు ఇవ్వగలదు. చెట్లు పక్షులు, కీటకాలు మరియు క్షీరదాలకు ఆహారం, ఆశ్రయం మరియు సంతానోత్పత్తి ప్రదేశాలను అందిస్తాయి."
          }
        ],
        hi: [
          {
            subtitle: "पर्यावरणीय लाभ",
            content: "पेड़ हमारे ग्रह के फेफड़े हैं। एक परिपक्व पेड़ सालाना 2-10 लोगों के लिए पर्याप्त ऑक्सीजन पैदा करता है और प्रति वर्ष 48 पाउंड CO₂ अवशोषित करता है। वे वायु प्रदूषकों को फ़िल्टर करते हैं, शहरी क्षेत्रों में श्वसन रोगों को 50% तक कम करते हैं।"
          },
          {
            subtitle: "आर्थिक मूल्य",
            content: "पेड़ संपत्ति मूल्यों को 10-20% बढ़ाते हैं और वानिकी, बागवानी और लकड़ी उद्योगों में नौकरियां पैदा करते हैं। फल देने वाले पेड़ ग्रामीण परिवारों के लिए स्थायी आय प्रदान करते हैं।"
          },
          {
            subtitle: "सामाजिक प्रभाव",
            content: "पेड़ों वाले हरे स्थान तनाव कम करते हैं, मानसिक स्वास्थ्य में सुधार करते हैं और सामुदायिक बंधन को बढ़ावा देते हैं। अध्ययन बताते हैं कि पेड़ों के दृश्य वाले अस्पताल के रोगी 20% तेजी से ठीक होते हैं।"
          },
          {
            subtitle: "वन्यजीव समर्थन",
            content: "एक ओक का पेड़ 500 से अधिक वन्यजीव प्रजातियों का समर्थन कर सकता है। पेड़ पक्षियों, कीड़ों और स्तनधारियों के लिए भोजन, आश्रय और प्रजनन स्थल प्रदान करते हैं।"
          }
        ]
      }
    },
    {
      icon: Cloud,
      title: {
        en: "Climate & Rainfall",
        te: "వాతావరణం & వర్షపాతం",
        hi: "जलवायु और वर्षा"
      },
      sections: {
        en: [
          {
            subtitle: "Water Cycle Impact",
            content: "Trees are crucial to the water cycle. Through transpiration, a single large tree releases 100 gallons of water into the atmosphere daily. Forests can increase regional rainfall by 20-30% and help distribute precipitation more evenly throughout the year."
          },
          {
            subtitle: "Climate Regulation",
            content: "Trees act as natural thermostats. Urban areas with 30% tree cover can be 2-8°F cooler than concrete jungles. Trees store carbon, with mature forests acting as carbon sinks that offset industrial emissions and combat climate change."
          },
          {
            subtitle: "Monsoon Influence",
            content: "In India, trees play a vital role in monsoon patterns. Deforestation has been linked to irregular monsoons and drought. Reforestation efforts can help restore normal rainfall patterns and prevent extreme weather events."
          },
          {
            subtitle: "Microclimate Creation",
            content: "Trees create favorable microclimates that benefit agriculture. They provide windbreaks, reduce soil temperature, and maintain humidity levels that support crop growth and prevent desertification."
          }
        ],
        te: [
          {
            subtitle: "నీటి చక్ర ప్రభావం",
            content: "చెట్లు నీటి చక్రానికి కీలకం. ట్రాన్స్పిరేషన్ ద్వారా, ఒక పెద్ద చెట్టు ప్రతిరోజు 100 గ్యాలన్ల నీటిని వాతావరణంలోకి విడుదల చేస్తుంది. అడవులు ప్రాంతీయ వర్షపాతాన్ని 20-30% పెంచగలవు."
          },
          {
            subtitle: "వాతావరణ నియంత్రణ",
            content: "చెట్లు సహజ థర్మోస్టాట్‌లుగా పనిచేస్తాయి. 30% చెట్ల కవర్ ఉన్న పట్టణ ప్రాంతాలు కాంక్రీట్ అరణ్యాల కంటే 2-8°F చల్లగా ఉంటాయి."
          },
          {
            subtitle: "రుతుపవన ప్రభావం",
            content: "భారతదేశంలో, చెట్లు రుతుపవన నమూనాలలో కీలక పాత్ర పోషిస్తాయి. అటవీ నిర్మూలన అనియమిత రుతుపవనాలు మరియు కరువుతో ముడిపడి ఉంది."
          },
          {
            subtitle: "సూక్ష్మ వాతావరణ సృష్టి",
            content: "చెట్లు వ్యవసాయానికి అనుకూలమైన సూక్ష్మ వాతావరణాలను సృష్టిస్తాయి. అవి గాలి అడ్డంకులను అందిస్తాయి, నేల ఉష్ణోగ్రతను తగ్గిస్తాయి మరియు తేమ స్థాయిలను నిర్వహిస్తాయి."
          }
        ],
        hi: [
          {
            subtitle: "जल चक्र प्रभाव",
            content: "पेड़ जल चक्र के लिए महत्वपूर्ण हैं। वाष्पोत्सर्जन के माध्यम से, एक बड़ा पेड़ प्रतिदिन 100 गैलन पानी वायुमंडल में छोड़ता है। वन क्षेत्रीय वर्षा को 20-30% बढ़ा सकते हैं।"
          },
          {
            subtitle: "जलवायु नियंत्रण",
            content: "पेड़ प्राकृतिक थर्मोस्टैट के रूप में कार्य करते हैं। 30% वृक्ष आवरण वाले शहरी क्षेत्र कंक्रीट के जंगलों की तुलना में 2-8°F ठंडे हो सकते हैं।"
          },
          {
            subtitle: "मानसून प्रभाव",
            content: "भारत में, पेड़ मानसून पैटर्न में महत्वपूर्ण भूमिका निभाते हैं। वनों की कटाई अनियमित मानसून और सूखे से जुड़ी हुई है।"
          },
          {
            subtitle: "सूक्ष्म जलवायु निर्माण",
            content: "पेड़ अनुकूल सूक्ष्म जलवायु बनाते हैं जो कृषि के लिए फायदेमंद हैं। वे वायु रोधक प्रदान करते हैं, मिट्टी का तापमान कम करते हैं।"
          }
        ]
      }
    },
    {
      icon: Sprout,
      title: {
        en: "Plantation Methods",
        te: "నాటడం పద్ధతులు",
        hi: "रोपण विधियां"
      },
      sections: {
        en: [
          {
            subtitle: "Site Preparation",
            content: "Choose a location with appropriate sunlight (6-8 hours daily). Test soil pH and drainage. Clear the area of weeds and rocks. Dig a hole twice the width of the root ball and same depth. Mix organic compost with native soil for better growth."
          },
          {
            subtitle: "Planting Process",
            content: "Best time: Monsoon season (June-August). Handle saplings gently to avoid root damage. Place the tree at ground level, never bury the trunk. Fill hole with soil mixture, pressing firmly to eliminate air pockets. Create a watering basin around the base."
          },
          {
            subtitle: "Initial Care",
            content: "Water immediately after planting (10-15 liters). Water daily for first 2 weeks, then twice weekly. Add 2-3 inch mulch layer around base (not touching trunk). Stake young trees if in windy areas. Protect from grazing animals with guard fencing."
          },
          {
            subtitle: "Spacing Guidelines",
            content: "Maintain proper spacing: Small trees (10-15 feet), Medium trees (20-30 feet), Large trees (40-50 feet). Consider mature canopy size. Avoid planting near buildings, power lines, or underground utilities. Group similar species together for better ecosystem development."
          }
        ],
        te: [
          {
            subtitle: "స్థల తయారీ",
            content: "తగిన సూర్యరశ్మి ఉన్న ప్రదేశాన్ని ఎంచుకోండి (రోజుకు 6-8 గంటలు). నేల pH మరియు నీటి పారుదల పరీక్షించండి. కలుపు మరియు రాళ్ళను తొలగించండి. మూల బంతి వెడల్పు కంటే రెండింతలు రంధ్రం త్రవ్వండి."
          },
          {
            subtitle: "నాటడం ప్రక్రియ",
            content: "ఉత్తమ సమయం: రుతుకాలం (జూన్-ఆగస్టు). మూల నష్టాన్ని నివారించడానికి మొక్కలను సున్నితంగా నిర్వహించండి. చెట్టును నేల స్థాయిలో ఉంచండి, ట్రంక్‌ను పాతిపెట్టవద్దు."
          },
          {
            subtitle: "ప్రాథమిక సంరక్షణ",
            content: "నాటిన వెంటనే నీరు పోయండి (10-15 లీటర్లు). మొదటి 2 వారాల వరకు ప్రతిరోజు, తర్వాత వారానికి రెండుసార్లు నీరు పోయండి. బేస్ చుట్టూ 2-3 అంగుళాల మల్చ్ పొర జోడించండి."
          },
          {
            subtitle: "అంతర మార్గదర్శకాలు",
            content: "సరైన అంతరం ఉంచండి: చిన్న చెట్లు (10-15 అడుగులు), మధ్యస్థ చెట్లు (20-30 అడుగులు), పెద్ద చెట్లు (40-50 అడుగులు). పరిపక్వ పందిరి పరిమాణాన్ని పరిగణించండి."
          }
        ],
        hi: [
          {
            subtitle: "स्थल तैयारी",
            content: "उपयुक्त धूप वाला स्थान चुनें (प्रतिदिन 6-8 घंटे)। मिट्टी pH और जल निकासी का परीक्षण करें। क्षेत्र को खरपतवार और चट्टानों से साफ करें। जड़ गेंद की चौड़ाई से दोगुना गड्ढा खोदें।"
          },
          {
            subtitle: "रोपण प्रक्रिया",
            content: "सर्वोत्तम समय: मानसून का मौसम (जून-अगस्त)। जड़ क्षति से बचने के लिए पौधों को धीरे से संभालें। पेड़ को जमीनी स्तर पर रखें, ट्रंक को कभी न दबाएं।"
          },
          {
            subtitle: "प्रारंभिक देखभाल",
            content: "रोपण के तुरंत बाद पानी दें (10-15 लीटर)। पहले 2 सप्ताह के लिए दैनिक, फिर साप्ताहिक दो बार पानी दें। आधार के चारों ओर 2-3 इंच मल्च परत जोड़ें।"
          },
          {
            subtitle: "दूरी दिशानिर्देश",
            content: "उचित दूरी बनाए रखें: छोटे पेड़ (10-15 फीट), मध्यम पेड़ (20-30 फीट), बड़े पेड़ (40-50 फीट)। परिपक्व शामियाना आकार पर विचार करें।"
          }
        ]
      }
    },
    {
      icon: Heart,
      title: {
        en: "Maintenance Guide",
        te: "నిర్వహణ మార్గదర్శి",
        hi: "रखरखाव गाइड"
      },
      sections: {
        en: [
          {
            subtitle: "Watering Schedule",
            content: "First year: Water twice daily in summer (morning & evening), once daily in winter. Second year: Reduce to once daily in summer, 3 times weekly in winter. Mature trees: Deep watering weekly. Adjust based on rainfall. Signs of overwatering: yellowing leaves, wilting."
          },
          {
            subtitle: "Fertilization",
            content: "Apply organic compost quarterly. Use NPK fertilizer (10:10:10) in growing season. Add bone meal for phosphorus, neem cake for nitrogen. Avoid chemical fertilizers near young trees. Apply fertilizer 2 feet away from trunk to prevent root burn."
          },
          {
            subtitle: "Pruning & Training",
            content: "Best time: Late winter or early spring before new growth. Remove dead, diseased, or crossing branches. Make clean cuts at branch collar. Never remove more than 25% of canopy in one season. Shape young trees to desired form. Sterilize pruning tools between cuts."
          },
          {
            subtitle: "Pest & Disease Management",
            content: "Regular inspection for leaf discoloration, holes, or unusual growth. Natural solutions: Neem oil spray for aphids, copper fungicide for diseases. Encourage beneficial insects like ladybugs. Remove infected leaves promptly. Maintain tree health through proper watering and nutrition to prevent issues."
          }
        ],
        te: [
          {
            subtitle: "నీరు పోసే షెడ్యూల్",
            content: "మొదటి సంవత్సరం: వేసవిలో రోజుకు రెండుసార్లు (ఉదయం & సాయంత్రం), చలికాలంలో రోజుకు ఒకసారి నీరు పోయండి. రెండవ సంవత్సరం: వేసవిలో రోజుకు ఒకసారి, చలికాలంలో వారానికి 3 సార్లు తగ్గించండి."
          },
          {
            subtitle: "ఎరువులు",
            content: "త్రైమాసికంగా సేంద్రీయ కంపోస్ట్ వర్తింపజేయండి. పెరుగుదల కాలంలో NPK ఎరువు (10:10:10) ఉపయోగించండి. ఫాస్ఫరస్ కోసం ఎముక పిండి, నైట్రోజన్ కోసం వేప పిండి జోడించండి."
          },
          {
            subtitle: "కత్తిరించడం & శిక్షణ",
            content: "ఉత్తమ సమయం: కొత్త పెరుగుదలకు ముందు చివరి శీతాకాలం లేదా ప్రారంభ వసంతం. చనిపోయిన, వ్యాధిగ్రస్తమైన లేదా కూడి ఉన్న కొమ్మలను తొలగించండి."
          },
          {
            subtitle: "పురుగులు & వ్యాధి నిర్వహణ",
            content: "ఆకుల రంగు మార్పు, రంధ్రాలు లేదా అసాధారణ పెరుగుదల కోసం క్రమం తప్పకుండా తనిఖీ చేయండి. సహజ పరిష్కారాలు: ఎఫిడ్స్ కోసం వేప నూనె స్ప్రే."
          }
        ],
        hi: [
          {
            subtitle: "पानी देने का कार्यक्रम",
            content: "पहला वर्ष: गर्मियों में दिन में दो बार (सुबह और शाम), सर्दियों में दिन में एक बार पानी दें। दूसरा वर्ष: गर्मियों में दिन में एक बार, सर्दियों में सप्ताह में 3 बार कम करें।"
          },
          {
            subtitle: "उर्वरक",
            content: "त्रैमासिक जैविक खाद लागू करें। बढ़ती अवधि में NPK उर्वरक (10:10:10) का उपयोग करें। फास्फोरस के लिए अस्थि भोजन, नाइट्रोजन के लिए नीम की खली जोड़ें।"
          },
          {
            subtitle: "छंटाई और प्रशिक्षण",
            content: "सर्वोत्तम समय: नई वृद्धि से पहले देर से सर्दी या शुरुआती वसंत। मृत, रोगग्रस्त, या पार करने वाली शाखाओं को हटा दें।"
          },
          {
            subtitle: "कीट और रोग प्रबंधन",
            content: "पत्ती विरंजन, छेद, या असामान्य वृद्धि के लिए नियमित निरीक्षण। प्राकृतिक समाधान: एफिड्स के लिए नीम तेल स्प्रे।"
          }
        ]
      }
    }
  ];

  const currentMythsFacts = mythsFacts[language as keyof typeof mythsFacts] || mythsFacts.en;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center p-8 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl border-2 border-green-500/20">
        <div className="inline-block p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full mb-4">
          <TreeDeciduous className="h-12 w-12 text-green-600 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          📚 {t.learnGrow}
        </h2>
        <p className="text-muted-foreground text-lg">Comprehensive guide to understanding and growing trees</p>
        <p className="text-sm text-primary mt-2">🔊 Click the speaker icon to hear content read aloud</p>
      </div>

      {/* Myths vs Facts Section */}
      <Card className="p-6 border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <h3 className="text-2xl font-bold text-amber-600 mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          🎯 Myths vs Facts
        </h3>
        <div className="grid gap-4">
          {currentMythsFacts.map((item, idx) => (
            <div key={idx} className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 border-2 border-red-300/50 bg-red-50 dark:bg-red-950/20">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-600 mb-1">MYTH</p>
                    <p className="text-sm text-foreground">{item.myth}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-2 border-green-300/50 bg-green-50 dark:bg-green-950/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-1">FACT</p>
                    <p className="text-sm text-foreground">{item.fact}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Learning Topics */}
      <div className="space-y-6">
        {topics.map((topic, idx) => {
          const title = language === 'en' ? topic.title.en : language === 'te' ? topic.title.te : topic.title.hi;
          const sections = language === 'en' ? topic.sections.en : language === 'te' ? topic.sections.te : topic.sections.hi;
          
          return (
            <Card key={idx} className="p-6 hover:shadow-lg transition-all border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <topic.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">{title}</h3>
              </div>
              
              <Tabs defaultValue="0" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
                  {sections.map((section, sIdx) => (
                    <TabsTrigger key={sIdx} value={String(sIdx)} className="text-xs lg:text-sm">
                      {section.subtitle}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {sections.map((section, sIdx) => {
                  const contentId = `${idx}-${sIdx}`;
                  return (
                    <TabsContent key={sIdx} value={String(sIdx)} className="space-y-3">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg text-foreground">{section.subtitle}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakContent(section.content, contentId)}
                            className="shrink-0"
                          >
                            {isSpeaking && currentSpeakingId === contentId ? (
                              <VolumeX className="h-4 w-4 text-destructive" />
                            ) : (
                              <Volume2 className="h-4 w-4 text-primary" />
                            )}
                          </Button>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
