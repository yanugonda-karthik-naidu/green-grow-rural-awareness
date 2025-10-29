import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Trophy, Medal, Award, Lightbulb, Flame, BookOpen } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface QuizProps {
  language: string;
  t: any;
  onQuizComplete: (score: number) => void;
}

const leaderboardData = [
  { name: "Ravi Kumar", score: 28, trees: 15 },
  { name: "Priya Sharma", score: 25, trees: 12 },
  { name: "Amit Patel", score: 22, trees: 10 },
  { name: "Anjali Singh", score: 20, trees: 9 },
  { name: "Rahul Verma", score: 18, trees: 8 }
];

export const Quiz = ({ language, t, onQuizComplete }: QuizProps) => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [eliminatedOption, setEliminatedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  const allQuestions = {
    easy: [
      {
        question: { en: "Trees produce oxygen during the day", te: "చెట్లు పగటి పూట ఆక్సిజన్ ఉత్పత్తి చేస్తాయి", hi: "पेड़ दिन में ऑक्सीजन पैदा करते हैं" },
        options: [{ en: "True", te: "నిజం", hi: "सच" }, { en: "False", te: "అబద్ధం", hi: "झूठ" }],
        correct: 0,
        category: "categoryOxygen",
        explanation: { en: "Trees use photosynthesis to convert CO₂ into oxygen during daylight hours!", te: "చెట్లు సూర్యరశ్మి సమయంలో కిరణజన్య సంయోగ ద్వారా CO₂ను ఆక్సిజన్‌గా మారుస్తాయి!", hi: "पेड़ दिन के उजाले में प्रकाश संश्लेषण द्वारा CO₂ को ऑक्सीजन में बदलते हैं!" }
      },
      {
        question: { en: "Which tree is known as 'Tree of Life'?", te: "'జీవిత వృక్షం' గా ఏ చెట్టు పిలువబడుతుంది?", hi: "किस पेड़ को 'जीवन का वृक्ष' कहा जाता है?" },
        options: [{ en: "Neem", te: "వేప", hi: "नीम" }, { en: "Coconut", te: "కొబ్బరి", hi: "नारियल" }, { en: "Mango", te: "మామిడి", hi: "आम" }],
        correct: 1,
        category: "categoryHealth",
        explanation: { en: "Coconut trees provide food, water, shelter, and materials - truly supporting life!", te: "కొబ్బరి చెట్లు ఆహారం, నీరు, నివాసం మరియు పదార్థాలను అందిస్తాయి - నిజంగా జీవితాన్ని సపోర్ట్ చేస్తాయి!", hi: "नारियल के पेड़ भोजन, पानी, आश्रय और सामग्री प्रदान करते हैं - वास्तव में जीवन का समर्थन करते हैं!" }
      },
      {
        question: { en: "Trees help reduce air pollution", te: "చెట్లు వాయు కాలుష్యాన్ని తగ్గించడంలో సహాయపడతాయి", hi: "पेड़ वायु प्रदूषण कम करने में मदद करते हैं" },
        options: [{ en: "True", te: "నిజం", hi: "सच" }, { en: "False", te: "అబద్ధం", hi: "झूठ" }],
        correct: 0,
        category: "categoryClimate",
        explanation: { en: "Trees absorb harmful pollutants like CO₂, NO₂, and particulate matter, purifying our air!", te: "చెట్లు CO₂, NO₂ మరియు కణ పదార్థం వంటి హానికరమైన కాలుష్యాలను గ్రహిస్తాయి, మన గాలిని శుద్ధి చేస్తాయి!", hi: "पेड़ CO₂, NO₂ और कण पदार्थ जैसे हानिकारक प्रदूषकों को अवशोषित करते हैं, हमारी हवा को शुद्ध करते हैं!" }
      },
      {
        question: { en: "Do trees help prevent soil erosion?", te: "చెట్లు మట్టి కోతను నివారించడంలో సహాయపడతాయా?", hi: "क्या पेड़ मिट्टी के कटाव को रोकने में मदद करते हैं?" },
        options: [{ en: "Yes", te: "అవును", hi: "हाँ" }, { en: "No", te: "కాదు", hi: "नहीं" }],
        correct: 0,
        category: "categoryEcology",
        explanation: { en: "Tree roots hold soil in place, preventing erosion during heavy rains and floods!", te: "చెట్ల వేర్లు మట్టిని స్థానంలో ఉంచుతాయి, భారీ వర్షాలు మరియు వరదల సమయంలో కోతను నివారిస్తాయి!", hi: "पेड़ की जड़ें मिट्टी को जगह पर रखती हैं, भारी बारिश और बाढ़ के दौरान कटाव को रोकती हैं!" }
      },
      {
        question: { en: "Which part of the tree absorbs water?", te: "చెట్టు యొక్క ఏ భాగం నీటిని గ్రహిస్తుంది?", hi: "पेड़ का कौन सा हिस्सा पानी को अवशोषित करता है?" },
        options: [{ en: "Roots", te: "వేర్లు", hi: "जड़ें" }, { en: "Leaves", te: "ఆకులు", hi: "पत्ते" }, { en: "Trunk", te: "కాండం", hi: "तना" }],
        correct: 0,
        category: "categoryEcology",
        explanation: { en: "Roots absorb water and nutrients from the soil, transporting them throughout the tree!", te: "వేర్లు మట్టి నుండి నీరు మరియు పోషకాలను గ్రహిస్తాయి, వాటిని చెట్టు అంతటా రవాణా చేస్తాయి!", hi: "जड़ें मिट्टी से पानी और पोषक तत्वों को अवशोषित करती हैं, उन्हें पूरे पेड़ में पहुंचाती हैं!" }
      },
      {
        question: { en: "Trees provide shelter for animals", te: "చెట్లు జంతువులకు ఆశ్రయం అందిస్తాయి", hi: "पेड़ जानवरों के लिए आश्रय प्रदान करते हैं" },
        options: [{ en: "True", te: "నిజం", hi: "सच" }, { en: "False", te: "అబద్ధం", hi: "झूठ" }],
        correct: 0,
        category: "categoryWildlife",
        explanation: { en: "Trees are homes for countless birds, insects, and animals, creating biodiversity!", te: "చెట్లు లెక్కలేనన్ని పక్షులు, కీటకాలు మరియు జంతువులకు ఇళ్ళు, జీవవైవిధ్యాన్ని సృష్టిస్తాయి!", hi: "पेड़ अनगिनत पक्षियों, कीड़ों और जानवरों के घर हैं, जो जैव विविधता बनाते हैं!" }
      },
      {
        question: { en: "Which season do most trees shed leaves?", te: "చాలా చెట్లు ఏ సీజన్‌లో ఆకులు రాల్చుతాయి?", hi: "अधिकांश पेड़ किस मौसम में पत्ते गिराते हैं?" },
        options: [{ en: "Spring", te: "వసంతం", hi: "बसंत" }, { en: "Summer", te: "వేసవి", hi: "गर्मी" }, { en: "Autumn", te: "శరత్కాలం", hi: "शरद" }],
        correct: 2,
        category: "categoryEcology",
        explanation: { en: "Deciduous trees shed leaves in autumn to conserve energy during winter months!", te: "ఆకురాల్చే చెట్లు శీతాకాలంలో శక్తిని ఆదా చేయడానికి శరత్కాలంలో ఆకులు రాల్చుతాయి!", hi: "पतझड़ी पेड़ सर्दियों के महीनों में ऊर्जा बचाने के लिए शरद ऋतु में पत्ते गिराते हैं!" }
      },
      {
        question: { en: "Can trees grow in deserts?", te: "ఎడారులలో చెట్లు పెరగగలవా?", hi: "क्या रेगिस्तान में पेड़ उग सकते हैं?" },
        options: [{ en: "Yes", te: "అవును", hi: "हाँ" }, { en: "No", te: "కాదు", hi: "नहीं" }],
        correct: 0,
        category: "categoryEcology",
        explanation: { en: "Yes! Desert trees like Date Palms and Acacia adapt to harsh conditions with deep roots!", te: "అవును! ఖర్జూరం మరియు బబూల్ వంటి ఎడారి చెట్లు లోతైన వేర్లతో కఠినమైన పరిస్థితులకు అనుగుణంగా ఉంటాయి!", hi: "हाँ! खजूर और बबूल जैसे रेगिस्तानी पेड़ गहरी जड़ों से कठोर परिस्थितियों के अनुकूल हो जाते हैं!" }
      }
    ],
    medium: [
      {
        question: { en: "One tree can absorb how much CO₂ per year?", te: "ఒక చెట్టు సంవత్సరానికి ఎంత CO₂ గ్రహిస్తుంది?", hi: "एक पेड़ प्रति वर्ष कितना CO₂ अवशोषित कर सकता है?" },
        options: [{ en: "5 kg", te: "5 కిలోలు", hi: "5 किलो" }, { en: "25 kg", te: "25 కిలోలు", hi: "25 किलो" }, { en: "50 kg", te: "50 కిలోలు", hi: "50 किलो" }],
        correct: 1,
        category: "categoryClimate",
        explanation: { en: "A mature tree absorbs approximately 22-25 kg of CO₂ annually, fighting climate change!", te: "ఒక పరిపక్వ చెట్టు వార్షికంగా సుమారు 22-25 కిలోల CO₂ను గ్రహిస్తుంది, వాతావరణ మార్పుతో పోరాడుతుంది!", hi: "एक परिपक्व पेड़ सालाना लगभग 22-25 किलो CO₂ अवशोषित करता है, जलवायु परिवर्तन से लड़ता है!" }
      },
      {
        question: { en: "Which tree produces oxygen even at night?", te: "రాత్రి కూడా ఆక్సిజన్ ఉత్పత్తి చేసే చెట్టు ఏది?", hi: "कौन सा पेड़ रात में भी ऑक्सीजन पैदा करता है?" },
        options: [{ en: "Mango", te: "మామిడి", hi: "आम" }, { en: "Peepal", te: "రావి", hi: "पीपल" }, { en: "Neem", te: "వేప", hi: "नीम" }],
        correct: 1,
        category: "categoryOxygen",
        explanation: { en: "Peepal trees perform CAM photosynthesis, producing oxygen 24/7. Sacred and scientific!", te: "రావి చెట్లు CAM కిరణజన్య సంయోగం చేస్తాయి, 24/7 ఆక్సిజన్ ఉత్పత్తి చేస్తాయి. పవిత్ర మరియు శాస్త్రీయం!", hi: "पीपल के पेड़ CAM प्रकाश संश्लेषण करते हैं, 24/7 ऑक्सीजन पैदा करते हैं। पवित्र और वैज्ञानिक!" }
      },
      {
        question: { en: "Best time to plant trees in India?", te: "భారతదేశంలో చెట్లు నాటడానికి ఉత్తమ సమయం?", hi: "भारत में पेड़ लगाने का सर्वोत्तम समय?" },
        options: [{ en: "Summer", te: "వేసవి", hi: "गर्मी" }, { en: "Monsoon", te: "రుతుకాలం", hi: "मानसून" }, { en: "Winter", te: "చలి", hi: "सर्दी" }],
        correct: 1,
        category: "categoryEcology",
        explanation: { en: "Monsoon provides natural water supply, helping saplings establish strong roots!", te: "మానసూన్ సహజ నీటి సరఫరాను అందిస్తుంది, మొక్కలు బలమైన వేర్లను స్థాపించడంలో సహాయపడుతుంది!", hi: "मानसून प्राकृतिक जल आपूर्ति प्रदान करता है, पौधों को मजबूत जड़ें स्थापित करने में मदद करता है!" }
      },
      {
        question: { en: "How many years does it take for a tree to mature?", te: "చెట్టు పరిపక్వం కావడానికి ఎన్ని సంవత్సరాలు పడుతుంది?", hi: "एक पेड़ को परिपक्व होने में कितने साल लगते हैं?" },
        options: [{ en: "5-10 years", te: "5-10 సంవత్సరాలు", hi: "5-10 साल" }, { en: "10-20 years", te: "10-20 సంవత్సరాలు", hi: "10-20 साल" }, { en: "20-50 years", te: "20-50 సంవత్సరాలు", hi: "20-50 साल" }],
        correct: 2,
        category: "categoryEcology",
        explanation: { en: "Most trees take 20-50 years to fully mature, showing the importance of planting today!", te: "చాలా చెట్లు పూర్తిగా పరిపక్వం కావడానికి 20-50 సంవత్సరాలు పడుతుంది, ఈరోజు నాటడం యొక్క ప్రాముఖ్యతను చూపిస్తుంది!", hi: "अधिकांश पेड़ों को पूरी तरह से परिपक्व होने में 20-50 साल लगते हैं, जो आज रोपण के महत्व को दर्शाता है!" }
      },
      {
        question: { en: "Which Indian tree is widely used in Ayurveda?", te: "ఆయుర్వేదంలో విస్తృతంగా ఉపయోగించే భారతీయ చెట్టు ఏది?", hi: "आयुर्वेद में व्यापक रूप से उपयोग किया जाने वाला भारतीय पेड़ कौन सा है?" },
        options: [{ en: "Neem", te: "వేప", hi: "नीम" }, { en: "Tulsi", te: "తులసి", hi: "तुलसी" }, { en: "Both", te: "రెండూ", hi: "दोनों" }],
        correct: 2,
        category: "categoryHealth",
        explanation: { en: "Both Neem and Tulsi have powerful medicinal properties used for thousands of years!", te: "వేప మరియు తులసి రెండూ వేల సంవత్సరాలుగా ఉపయోగించే శక్తివంతమైన ఔషధ గుణాలను కలిగి ఉన్నాయి!", hi: "नीम और तुलसी दोनों में हजारों वर्षों से उपयोग होने वाले शक्तिशाली औषधीय गुण हैं!" }
      },
      {
        question: { en: "What percentage of Earth's oxygen comes from trees?", te: "భూమి ఆక్సిజన్ యొక్క ఎంత శాతం చెట్ల నుండి వస్తుంది?", hi: "पृथ्वी की ऑक्सीजन का कितना प्रतिशत पेड़ों से आता है?" },
        options: [{ en: "20%", te: "20%", hi: "20%" }, { en: "50%", te: "50%", hi: "50%" }, { en: "80%", te: "80%", hi: "80%" }],
        correct: 0,
        category: "categoryOxygen",
        explanation: { en: "Trees and land plants produce about 20-28% of Earth's oxygen. Ocean phytoplankton produces most!", te: "చెట్లు మరియు భూమి మొక్కలు భూమి ఆక్సిజన్‌లో సుమారు 20-28% ఉత్పత్తి చేస్తాయి. సముద్ర ఫైటోప్లాంక్టన్ ఎక్కువ ఉత్పత్తి చేస్తుంది!", hi: "पेड़ और भूमि पौधे पृथ्वी की ऑक्सीजन का लगभग 20-28% उत्पादन करते हैं। समुद्री फाइटोप्लांकटन सबसे अधिक उत्पादन करता है!" }
      },
      {
        question: { en: "Which tree bark is commonly used to make paper?", te: "కాగితం తయారు చేయడానికి సాధారణంగా ఏ చెట్టు బెరడు ఉపయోగించబడుతుంది?", hi: "कागज बनाने के लिए आमतौर पर किस पेड़ की छाल का उपयोग किया जाता है?" },
        options: [{ en: "Eucalyptus", te: "యూకలిప్టస్", hi: "नीलगिरी" }, { en: "Pine", te: "పైన్", hi: "पाइन" }, { en: "Both", te: "రెండూ", hi: "दोनों" }],
        correct: 2,
        category: "categoryEcology",
        explanation: { en: "Both Eucalyptus and Pine trees are major sources of wood pulp for paper production!", te: "యూకలిప్టస్ మరియు పైన్ చెట్లు రెండూ కాగితం ఉత్పత్తికి కలప పల్ప్ యొక్క ప్రధాన మూలాలు!", hi: "नीलगिरी और पाइन के पेड़ दोनों कागज उत्पादन के लिए लकड़ी के गूदे के प्रमुख स्रोत हैं!" }
      },
      {
        question: { en: "Trees can communicate with each other", te: "చెట్లు ఒకదానితో ఒకటి సంభాషించగలవు", hi: "पेड़ एक दूसरे के साथ संवाद कर सकते हैं" },
        options: [{ en: "True", te: "నిజం", hi: "सच" }, { en: "False", te: "అబద్ధం", hi: "झूठ" }],
        correct: 0,
        category: "categoryEcology",
        explanation: { en: "Yes! Trees communicate through underground fungal networks called 'Wood Wide Web'!", te: "అవును! చెట్లు 'వుడ్ వైడ్ వెబ్' అని పిలువబడే భూగర్భ శిలీంధ్ర నెట్‌వర్క్‌ల ద్వారా సంభాషిస్తాయి!", hi: "हाँ! पेड़ 'वुड वाइड वेब' नामक भूमिगत कवक नेटवर्क के माध्यम से संवाद करते हैं!" }
      }
    ],
    hard: [
      {
        question: { en: "How much oxygen does a mature tree produce daily?", te: "పరిపక్వ చెట్టు రోజూ ఎంత ఆక్సిజన్ ఉత్పత్తి చేస్తుంది?", hi: "एक परिपक्व पेड़ प्रतिदिन कितनी ऑक्सीजन पैदा करता है?" },
        options: [{ en: "50 liters", te: "50 లీటర్లు", hi: "50 लीटर" }, { en: "120 liters", te: "120 లీటర్లు", hi: "120 लीटर" }, { en: "260 liters", te: "260 లీటర్లు", hi: "260 लीटर" }],
        correct: 2,
        category: "categoryOxygen",
        explanation: { en: "A mature tree produces ~260 liters of oxygen daily, enough for 2 people!", te: "ఒక పరిపక్వ చెట్టు రోజూ ~260 లీటర్ల ఆక్సిజన్ ఉత్పత్తి చేస్తుంది, 2 మందికి సరిపోతుంది!", hi: "एक परिपक्व पेड़ प्रतिदिन ~260 लीटर ऑक्सीजन पैदा करता है, 2 लोगों के लिए पर्याप्त!" }
      },
      {
        question: { en: "Trees can increase rainfall in their region by:", te: "చెట్లు వారి ప్రాంతంలో వర్షపాతాన్ని ఎంత పెంచగలవు:", hi: "पेड़ अपने क्षेत्र में वर्षा को बढ़ा सकते हैं:" },
        options: [{ en: "5-10%", te: "5-10%", hi: "5-10%" }, { en: "20-30%", te: "20-30%", hi: "20-30%" }, { en: "50-60%", te: "50-60%", hi: "50-60%" }],
        correct: 1,
        category: "categoryClimate",
        explanation: { en: "Forests increase regional rainfall by 20-30% through transpiration and moisture recycling!", te: "అడవులు ట్రాన్స్‌పిరేషన్ మరియు తేమ రీసైక్లింగ్ ద్వారా ప్రాంతీయ వర్షపాతాన్ని 20-30% పెంచుతాయి!", hi: "वन वाष्पोत्सर्जन और नमी पुनर्चक्रण के माध्यम से क्षेत्रीय वर्षा को 20-30% बढ़ाते हैं!" }
      },
      {
        question: { en: "A single oak tree can support how many species?", te: "ఒక ఓక్ చెట్టు ఎన్ని జాతులకు మద్దతు ఇవ్వగలదు?", hi: "एक ओक का पेड़ कितनी प्रजातियों का समर्थन कर सकता है?" },
        options: [{ en: "100", te: "100", hi: "100" }, { en: "300", te: "300", hi: "300" }, { en: "500+", te: "500+", hi: "500+" }],
        correct: 2,
        category: "categoryWildlife",
        explanation: { en: "A mature oak supports 500+ species of insects, birds, mammals, and fungi!", te: "ఒక పరిపక్వ ఓక్ 500+ జాతుల కీటకాలు, పక్షులు, క్షీరదాలు మరియు శిలీంధ్రాలకు మద్దతు ఇస్తుంది!", hi: "एक परिपक्व ओक 500+ प्रजातियों के कीड़ों, पक्षियों, स्तनधारियों और कवक का समर्थन करता है!" }
      },
      {
        question: { en: "How much water can a large tree transpire daily?", te: "పెద్ద చెట్టు రోజూ ఎంత నీటిని ట్రాన్స్‌పైర్ చేయగలదు?", hi: "एक बड़ा पेड़ प्रतिदिन कितना पानी वाष्पित कर सकता है?" },
        options: [{ en: "100 liters", te: "100 లీటర్లు", hi: "100 लीटर" }, { en: "400 liters", te: "400 లీటర్లు", hi: "400 लीटर" }, { en: "1000 liters", te: "1000 లీటర్లు", hi: "1000 लीटर" }],
        correct: 1,
        category: "categoryClimate",
        explanation: { en: "Large trees transpire 400+ liters daily, cooling the air through evaporation!", te: "పెద్ద చెట్లు రోజూ 400+ లీటర్లు ట్రాన్స్‌పైర్ చేస్తాయి, బాష్పీభవనం ద్వారా గాలిని చల్లబరుస్తాయి!", hi: "बड़े पेड़ प्रतिदिन 400+ लीटर वाष्पित करते हैं, वाष्पीकरण के माध्यम से हवा को ठंडा करते हैं!" }
      },
      {
        question: { en: "Trees reduce urban heat by how many degrees?", te: "చెట్లు పట్టణ వేడిని ఎన్ని డిగ్రీలు తగ్గిస్తాయి?", hi: "पेड़ शहरी गर्मी को कितने डिग्री कम करते हैं?" },
        options: [{ en: "1-2°C", te: "1-2°C", hi: "1-2°C" }, { en: "3-5°C", te: "3-5°C", hi: "3-5°C" }, { en: "8-10°C", te: "8-10°C", hi: "8-10°C" }],
        correct: 1,
        category: "categoryClimate",
        explanation: { en: "Urban trees reduce temperatures by 3-5°C, combating the heat island effect!", te: "పట్టణ చెట్లు ఉష్ణోగ్రతలను 3-5°C తగ్గిస్తాయి, వేడి ద్వీప ప్రభావంతో పోరాడుతున్నాయి!", hi: "शहरी पेड़ तापमान को 3-5°C कम करते हैं, हीट आइलैंड प्रभाव से लड़ते हैं!" }
      },
      {
        question: { en: "What is the lifespan of a Banyan tree?", te: "బరగద చెట్టు యొక్క జీవితకాలం ఎంత?", hi: "बरगद के पेड़ की जीवन अवधि क्या है?" },
        options: [{ en: "100 years", te: "100 సంవత్సరాలు", hi: "100 साल" }, { en: "500 years", te: "500 సంవత్సరాలు", hi: "500 साल" }, { en: "1000+ years", te: "1000+ సంవత్సరాలు", hi: "1000+ साल" }],
        correct: 2,
        category: "categoryEcology",
        explanation: { en: "Banyan trees can live for over 1000 years, becoming living monuments of nature!", te: "బరగద చెట్లు 1000 సంవత్సరాలకు పైగా జీవించగలవు, ప్రకృతి యొక్క జీవన స్మారక చిహ్నాలుగా మారతాయి!", hi: "बरगद के पेड़ 1000 से अधिक वर्षों तक जीवित रह सकते हैं, प्रकृति के जीवित स्मारक बन जाते हैं!" }
      },
      {
        question: { en: "How much carbon is stored in a hectare of forest?", te: "ఒక హెక్టారు అడవిలో ఎంత కార్బన్ నిల్వ ఉంది?", hi: "एक हेक्टेयर वन में कितना कार्बन संग्रहीत है?" },
        options: [{ en: "50 tons", te: "50 టన్నులు", hi: "50 टन" }, { en: "150 tons", te: "150 టన్నులు", hi: "150 टन" }, { en: "300+ tons", te: "300+ టన్నులు", hi: "300+ टन" }],
        correct: 2,
        category: "categoryClimate",
        explanation: { en: "Mature forests store 300+ tons of carbon per hectare, crucial for climate regulation!", te: "పరిపక్వ అడవులు హెక్టారుకు 300+ టన్నుల కార్బన్‌ను నిల్వ చేస్తాయి, వాతావరణ నియంత్రణకు కీలకం!", hi: "परिपक्व वन प्रति हेक्टेयर 300+ टन कार्बन संग्रहीत करते हैं, जलवायु विनियमन के लिए महत्वपूर्ण!" }
      },
      {
        question: { en: "Trees can improve mental health and reduce stress by:", te: "చెట్లు మానసిక ఆరోగ్యాన్ని మెరుగుపరచగలవు మరియు ఒత్తిడిని తగ్గించగలవు:", hi: "पेड़ मानसिक स्वास्थ्य में सुधार कर सकते हैं और तनाव को कम कर सकते हैं:" },
        options: [{ en: "10%", te: "10%", hi: "10%" }, { en: "25%", te: "25%", hi: "25%" }, { en: "40%", te: "40%", hi: "40%" }],
        correct: 1,
        category: "categoryHealth",
        explanation: { en: "Studies show exposure to nature reduces stress hormones by 25%, improving mental wellbeing!", te: "అధ్యయనాలు ప్రకృతికి బహిర్గతం ఒత్తిడి హార్మోన్లను 25% తగ్గిస్తుందని చూపిస్తాయి, మానసిక శ్రేయస్సును మెరుగుపరుస్తుంది!", hi: "अध्ययन दिखाते हैं कि प्रकृति के संपर्क में आने से तनाव हार्मोन में 25% की कमी आती है, मानसिक कल्याण में सुधार होता है!" }
      }
    ]
  };

  // Shuffle questions on mount or difficulty change
  useEffect(() => {
    const shuffled = [...allQuestions[difficulty]].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setUserAnswers(new Array(shuffled.length).fill(null));
  }, [difficulty]);

  const currentQuestions = shuffledQuestions;

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
    
    const isCorrect = answerIndex === currentQuestions[currentQuestion].correct;
    
    if (isCorrect) {
      const basePoints = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
      const streakBonus = streak >= 4 ? 5 : 0;
      const totalPoints = basePoints + streakBonus;
      
      setScore(score + totalPoints);
      setStreak(streak + 1);
      
      // Confetti animation
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      
      toast.success(`✅ Correct! +${totalPoints} points${streakBonus > 0 ? ' (Streak Bonus!)' : ''}`);
      
      if (streak >= 4) {
        toast.success(`🔥 ${streak + 1} in a row! You're on fire!`);
      }
    } else {
      setStreak(0);
      toast.error("❌ Wrong answer");
    }

    setTimeout(() => setShowExplanation(true), 800);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < currentQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setEliminatedOption(null);
      setShowExplanation(false);
    } else {
      checkAchievements();
      setShowResult(true);
      onQuizComplete(score);
    }
  };

  const useHint = () => {
    if (hintsRemaining <= 0 || selectedAnswer !== null || eliminatedOption !== null) return;
    
    setHintsRemaining(hintsRemaining - 1);
    setScore(Math.max(0, score - 2));
    
    const currentQ = currentQuestions[currentQuestion];
    const wrongOptions = currentQ.options
      .map((_, idx) => idx)
      .filter(idx => idx !== currentQ.correct);
    
    const toEliminate = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    setEliminatedOption(toEliminate);
    
    toast.info("💡 Hint used! One wrong answer eliminated.");
  };

  const checkAchievements = () => {
    const newAchievements: string[] = [];
    const totalQuestions = currentQuestions.length;
    const correctAnswers = userAnswers.filter((ans, idx) => ans === currentQuestions[idx].correct).length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    const timeTaken = (Date.now() - startTime) / 1000;
    
    if (percentage === 100) newAchievements.push(t.perfectScore);
    if (timeTaken < 120 && totalQuestions >= 5) newAchievements.push(t.speedDemon);
    if (difficulty === "hard" && percentage >= 80) newAchievements.push(t.ecoExpert);
    if (hintsRemaining === 3) newAchievements.push(t.noHints);
    
    setAchievements(newAchievements);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setStreak(0);
    setHintsRemaining(3);
    setEliminatedOption(null);
    setShowExplanation(false);
    setReviewMode(false);
    setAchievements([]);
    const shuffled = [...allQuestions[difficulty]].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setUserAnswers(new Array(shuffled.length).fill(null));
  };

  if (showResult) {
    return (
      <Tabs defaultValue="result" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="result">Result</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="result">
          <Card className="p-8 text-center">
            <Trophy className="h-20 w-20 mx-auto mb-4 text-yellow-500 animate-bounce" />
            <h2 className="text-3xl font-bold mb-4 text-primary">{t.quiz} Complete!</h2>
            <p className="text-6xl font-bold my-8 text-accent animate-scale-in">{score}</p>
            <p className="text-xl mb-6 text-muted-foreground">
              {score >= 40 ? "🏆 Outstanding!" : score >= 25 ? "🌟 Great Job!" : "🌱 Keep Learning!"}
            </p>
            
            {achievements.length > 0 && (
              <div className="mb-6 space-y-2">
                <h3 className="text-lg font-semibold text-primary">Achievements Unlocked:</h3>
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="inline-block mx-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm animate-fade-in">
                    {achievement}
                  </div>
                ))}
              </div>
            )}
            
            <Button onClick={resetQuiz} size="lg">{t.tryAgain}</Button>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-6 text-primary text-center">Top Eco Warriors</h3>
            <div className="space-y-3">
              {leaderboardData.map((player, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  {idx === 0 ? <Trophy className="h-6 w-6 text-yellow-500" /> :
                   idx === 1 ? <Medal className="h-6 w-6 text-gray-400" /> :
                   idx === 2 ? <Award className="h-6 w-6 text-amber-600" /> :
                   <span className="w-6 text-center font-bold text-muted-foreground">{idx + 1}</span>}
                  <div className="flex-1">
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.trees} trees planted</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{player.score}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-6 text-primary text-center flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6" />
              {t.reviewMode}
            </h3>
            <div className="space-y-4">
              {currentQuestions.map((q, idx) => {
                const questionText = language === 'en' ? q.question.en : language === 'te' ? q.question.te : q.question.hi;
                const userAnswer = userAnswers[idx];
                const isCorrect = userAnswer === q.correct;
                
                return (
                  <div key={idx} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? 
                        <CheckCircle2 className="h-5 w-5 text-secondary mt-1 flex-shrink-0" /> : 
                        <XCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                      }
                      <div className="flex-1">
                        <p className="font-semibold mb-2">{idx + 1}. {questionText}</p>
                        <div className="text-sm space-y-1">
                          {q.options.map((option, optIdx) => {
                            const optionText = language === 'en' ? option.en : language === 'te' ? option.te : option.hi;
                            const isUserAnswer = optIdx === userAnswer;
                            const isCorrectAnswer = optIdx === q.correct;
                            
                            return (
                              <div 
                                key={optIdx}
                                className={`p-2 rounded ${
                                  isCorrectAnswer ? 'bg-secondary/20 text-secondary' : 
                                  isUserAnswer && !isCorrect ? 'bg-destructive/20 text-destructive' : 
                                  ''
                                }`}
                              >
                                {isCorrectAnswer && '✓ '}{optionText}
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                          <span className="font-semibold">{t.explanation}</span> {language === 'en' ? q.explanation.en : language === 'te' ? q.explanation.te : q.explanation.hi}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button onClick={resetQuiz} className="w-full mt-6" size="lg">{t.tryAgain}</Button>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  if (currentQuestions.length === 0) {
    return <div className="text-center p-8">Loading questions...</div>;
  }

  const q = currentQuestions[currentQuestion];
  const questionText = language === 'en' ? q.question.en : language === 'te' ? q.question.te : q.question.hi;
  const explanationText = language === 'en' ? q.explanation.en : language === 'te' ? q.explanation.te : q.explanation.hi;
  const categoryText = t[q.category];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <h2 className="text-3xl font-bold mb-4 text-primary text-center">{t.quiz}</h2>
        <p className="text-center text-muted-foreground mb-4">Test your knowledge about trees and nature!</p>
        
        <Tabs value={difficulty} onValueChange={(v) => { setDifficulty(v as any); resetQuiz(); }}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="easy">🌱 Easy</TabsTrigger>
            <TabsTrigger value="medium">🌿 Medium</TabsTrigger>
            <TabsTrigger value="hard">🌳 Hard</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      <Card className="p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-muted-foreground">
                Question {currentQuestion + 1} of {currentQuestions.length}
              </p>
              {streak > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm font-bold animate-pulse">
                  <Flame className="h-4 w-4" />
                  {streak}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">{t.hintsRemaining} {hintsRemaining}</p>
              <p className="text-lg font-bold text-primary">Score: {score}</p>
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {currentQuestions.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 flex-1 rounded transition-all duration-300 ${
                  idx < currentQuestion ? 'bg-primary' : 
                  idx === currentQuestion ? 'bg-primary animate-pulse' : 
                  'bg-muted'
                }`} 
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-semibold">
            {categoryText}
          </span>
          <Button 
            onClick={useHint}
            disabled={hintsRemaining <= 0 || selectedAnswer !== null || eliminatedOption !== null}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            {t.hintButton}
          </Button>
        </div>

        <h3 className="text-2xl font-bold mb-6 text-foreground">{questionText}</h3>

        <div className="space-y-3 mb-6">
          {q.options.map((option, idx) => {
            const optionText = language === 'en' ? option.en : language === 'te' ? option.te : option.hi;
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === q.correct;
            const isEliminated = eliminatedOption === idx;
            
            return (
              <Button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null || isEliminated}
                variant="outline"
                className={`w-full justify-start text-left h-auto py-4 text-lg transition-all duration-300 ${
                  isEliminated ? 'opacity-30 line-through' :
                  isSelected ? (isCorrect ? 'border-secondary bg-secondary/10 animate-scale-in' : 'border-destructive bg-destructive/10 animate-shake') : 
                  'hover-scale'
                }`}
              >
                {isSelected && (isCorrect ? <CheckCircle2 className="mr-2 h-5 w-5 text-secondary" /> : <XCircle className="mr-2 h-5 w-5 text-destructive" />)}
                {optionText}
              </Button>
            );
          })}
        </div>

        {showExplanation && selectedAnswer !== null && (
          <div className="p-4 bg-muted rounded-lg mb-4 animate-fade-in">
            <p className="text-sm font-semibold text-primary mb-2">{t.explanation}</p>
            <p className="text-sm text-muted-foreground">{explanationText}</p>
          </div>
        )}

        {selectedAnswer !== null && (
          <Button onClick={handleNext} className="w-full" size="lg">
            {currentQuestion + 1 < currentQuestions.length ? t.nextQuestion : "See Results"}
          </Button>
        )}
      </Card>
    </div>
  );
};