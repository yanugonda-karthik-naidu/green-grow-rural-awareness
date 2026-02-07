// Advanced Quiz Data Structure for Multi-level Learning System

export type QuestionType = 
  | 'mcq-single' 
  | 'mcq-multiple' 
  | 'true-false' 
  | 'image-based' 
  | 'match-following' 
  | 'arrange-order';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: { en: string; te: string; hi: string };
  options?: { en: string; te: string; hi: string }[];
  image?: string;
  correctAnswer: number | number[] | { left: string; right: string }[] | number[];
  explanation: { en: string; te: string; hi: string };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  // For match-following type
  matchPairs?: { left: { en: string; te: string; hi: string }; right: { en: string; te: string; hi: string } }[];
  // For arrange-order type
  correctOrder?: number[];
}

export interface QuizLevel {
  id: string;
  name: { en: string; te: string; hi: string };
  description: { en: string; te: string; hi: string };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredScore: number; // Percentage to unlock next level
  questions: QuizQuestion[];
  isLocked: boolean;
}

export interface QuizTopic {
  id: string;
  name: { en: string; te: string; hi: string };
  description: { en: string; te: string; hi: string };
  icon: string;
  color: string;
  levels: QuizLevel[];
}

import { extraQuizTopics } from './quizTopicsExtra';

// Quiz Topics Data
const baseQuizTopics: QuizTopic[] = [
  {
    id: 'plantation',
    name: { en: 'Plantation & Trees', te: 'మొక్కల సాగు & చెట్లు', hi: 'वृक्षारोपण और पेड़' },
    description: { en: 'Learn about tree planting, species, and their benefits', te: 'చెట్ల నాటడం, జాతులు మరియు వాటి ప్రయోజనాల గురించి తెలుసుకోండి', hi: 'पेड़ लगाने, प्रजातियों और उनके लाभों के बारे में जानें' },
    icon: '🌳',
    color: 'bg-green-500',
    levels: [
      {
        id: 'plantation-beginner',
        name: { en: 'Beginner', te: 'ప్రారంభికులు', hi: 'शुरुआती' },
        description: { en: 'Basic tree knowledge', te: 'ప్రాథమిక చెట్ల జ్ఞానం', hi: 'बुनियादी पेड़ का ज्ञान' },
        difficulty: 'beginner',
        requiredScore: 70,
        isLocked: false,
        questions: [
          {
            id: 'p-b-1',
            type: 'true-false',
            question: { en: 'Trees produce oxygen during the day through photosynthesis.', te: 'చెట్లు పగటి పూట కిరణజన్య సంయోగక్రియ ద్వారా ఆక్సిజన్ ఉత్పత్తి చేస్తాయి.', hi: 'पेड़ दिन में प्रकाश संश्लेषण के माध्यम से ऑक्सीजन पैदा करते हैं।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Yes! Trees use sunlight to convert carbon dioxide and water into glucose and oxygen. This process called photosynthesis happens during daylight hours.', te: 'అవును! చెట్లు సూర్యకాంతిని ఉపయోగించి కార్బన్ డయాక్సైడ్ మరియు నీటిని గ్లూకోజ్ మరియు ఆక్సిజన్‌గా మారుస్తాయి.', hi: 'हाँ! पेड़ सूर्य के प्रकाश का उपयोग करके कार्बन डाइऑक्साइड और पानी को ग्लूकोज और ऑक्सीजन में बदलते हैं।' },
            difficulty: 'beginner'
          },
          {
            id: 'p-b-2',
            type: 'mcq-single',
            question: { en: 'Which part of the tree absorbs water from the soil?', te: 'చెట్టు యొక్క ఏ భాగం మట్టి నుండి నీటిని గ్రహిస్తుంది?', hi: 'पेड़ का कौन सा हिस्सा मिट्टी से पानी को अवशोषित करता है?' },
            options: [
              { en: 'Leaves', te: 'ఆకులు', hi: 'पत्ते' },
              { en: 'Roots', te: 'వేర్లు', hi: 'जड़ें' },
              { en: 'Trunk', te: 'కాండం', hi: 'तना' },
              { en: 'Branches', te: 'శాఖలు', hi: 'शाखाएं' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Roots are the underground part of the tree that absorb water and nutrients from the soil. They also anchor the tree firmly in the ground.', te: 'వేర్లు చెట్టు యొక్క భూగర్భ భాగం, ఇది మట్టి నుండి నీరు మరియు పోషకాలను గ్రహిస్తుంది.', hi: 'जड़ें पेड़ का भूमिगत हिस्सा हैं जो मिट्टी से पानी और पोषक तत्वों को अवशोषित करती हैं।' },
            difficulty: 'beginner'
          },
          {
            id: 'p-b-3',
            type: 'mcq-single',
            question: { en: 'Which is the best season to plant trees in India?', te: 'భారతదేశంలో చెట్లు నాటడానికి ఉత్తమ సీజన్ ఏది?', hi: 'भारत में पेड़ लगाने का सबसे अच्छा मौसम कौन सा है?' },
            options: [
              { en: 'Summer', te: 'వేసవి', hi: 'गर्मी' },
              { en: 'Winter', te: 'చలికాలం', hi: 'सर्दी' },
              { en: 'Monsoon', te: 'వర్షాకాలం', hi: 'मानसून' },
              { en: 'Spring', te: 'వసంతకాలం', hi: 'बसंत' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Monsoon is the best time because natural rainfall provides adequate water for young saplings to establish their roots without additional irrigation.', te: 'వర్షాకాలం ఉత్తమం ఎందుకంటే సహజ వర్షపాతం యువ మొక్కలకు తగినంత నీటిని అందిస్తుంది.', hi: 'मानसून सबसे अच्छा समय है क्योंकि प्राकृतिक वर्षा युवा पौधों के लिए पर्याप्त पानी प्रदान करती है।' },
            difficulty: 'beginner'
          },
          {
            id: 'p-b-4',
            type: 'true-false',
            question: { en: 'Trees help prevent soil erosion.', te: 'చెట్లు మట్టి కోతను నివారించడంలో సహాయపడతాయి.', hi: 'पेड़ मिट्टी के कटाव को रोकने में मदद करते हैं।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Tree roots bind the soil together, preventing it from being washed away by rain or blown away by wind. This is especially important on hillsides and near water bodies.', te: 'చెట్ల వేర్లు మట్టిని కలిపి ఉంచుతాయి, వర్షం లేదా గాలి ద్వారా కొట్టుకుపోకుండా నిరోధిస్తాయి.', hi: 'पेड़ की जड़ें मिट्टी को एक साथ बांधे रखती हैं, जिससे वह बारिश या हवा से बह नहीं जाती।' },
            difficulty: 'beginner'
          },
          {
            id: 'p-b-5',
            type: 'mcq-single',
            question: { en: 'Which tree is called the "Tree of Life" because it provides many useful products?', te: 'ఏ చెట్టును "జీవిత వృక్షం" అని పిలుస్తారు?', hi: 'किस पेड़ को "जीवन का वृक्ष" कहा जाता है?' },
            options: [
              { en: 'Mango', te: 'మామిడి', hi: 'आम' },
              { en: 'Coconut', te: 'కొబ్బరి', hi: 'नारियल' },
              { en: 'Neem', te: 'వేప', hi: 'नीम' },
              { en: 'Banyan', te: 'మర్రి', hi: 'बरगद' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Coconut is called the "Tree of Life" because every part is useful - fruit for food and oil, leaves for roofing, trunk for wood, and coir for ropes.', te: 'కొబ్బరిని "జీవిత వృక్షం" అని పిలుస్తారు ఎందుకంటే ప్రతి భాగం ఉపయోగకరం.', hi: 'नारियल को "जीवन का वृक्ष" कहा जाता है क्योंकि इसका हर हिस्सा उपयोगी है।' },
            difficulty: 'beginner'
          },
          {
            id: 'p-b-6',
            type: 'true-false',
            question: { en: 'All trees lose their leaves in winter.', te: 'అన్ని చెట్లు శీతాకాలంలో ఆకులు రాల్చుతాయి.', hi: 'सभी पेड़ सर्दियों में पत्ते गिराते हैं।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 1,
            explanation: { en: 'Not all trees! Evergreen trees like Pine, Deodar, and Eucalyptus keep their leaves year-round. Only deciduous trees shed leaves seasonally.', te: 'అన్ని చెట్లు కాదు! పైన్, దేవదారు, నీలగిరి వంటి నిత్యహరిత చెట్లు ఏడాది పొడవునా ఆకులను ఉంచుతాయి.', hi: 'सभी पेड़ नहीं! पाइन, देवदार और नीलगिरी जैसे सदाबहार पेड़ साल भर पत्ते रखते हैं।' },
            difficulty: 'beginner'
          },
          {
            id: 'p-b-7',
            type: 'mcq-single',
            question: { en: 'How many years does a typical tree take to mature fully?', te: 'ఒక సాధారణ చెట్టు పూర్తిగా పరిపక్వం కావడానికి ఎన్ని సంవత్సరాలు పడుతుంది?', hi: 'एक सामान्य पेड़ को पूरी तरह परिपक्व होने में कितने साल लगते हैं?' },
            options: [
              { en: '1-5 years', te: '1-5 సంవత్సరాలు', hi: '1-5 साल' },
              { en: '5-10 years', te: '5-10 సంవత్సరాలు', hi: '5-10 साल' },
              { en: '20-50 years', te: '20-50 సంవత్సరాలు', hi: '20-50 साल' },
              { en: '100+ years', te: '100+ సంవత్సరాలు', hi: '100+ साल' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Most trees take 20-50 years to fully mature. This is why planting trees today is an investment in the future - for generations to come!', te: 'చాలా చెట్లు పూర్తిగా పరిపక్వం కావడానికి 20-50 సంవత్సరాలు పడుతుంది.', hi: 'अधिकांश पेड़ों को पूरी तरह से परिपक्व होने में 20-50 साल लगते हैं।' },
            difficulty: 'beginner'
          },
          {
            id: 'p-b-8',
            type: 'mcq-single',
            question: { en: 'Trees provide shelter for:', te: 'చెట్లు ఎవరికి ఆశ్రయం కల్పిస్తాయి:', hi: 'पेड़ किसे आश्रय प्रदान करते हैं:' },
            options: [
              { en: 'Only birds', te: 'పక్షులకు మాత్రమే', hi: 'केवल पक्षियों को' },
              { en: 'Only insects', te: 'కీటకాలకు మాత్రమే', hi: 'केवल कीड़ों को' },
              { en: 'Birds, insects, and many animals', te: 'పక్షులు, కీటకాలు మరియు చాలా జంతువులు', hi: 'पक्षियों, कीड़ों और कई जानवरों को' },
              { en: 'No animals', te: 'ఏ జంతువులు లేవు', hi: 'कोई जानवर नहीं' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Trees are home to countless creatures - birds nest in branches, insects live in bark, squirrels store food, and many mammals find shelter in tree hollows.', te: 'చెట్లు లెక్కలేనన్ని జీవులకు నివాసం - పక్షులు శాఖలలో గూడు కట్టుకుంటాయి, కీటకాలు బెరడులో నివసిస్తాయి.', hi: 'पेड़ अनगिनत जीवों का घर हैं - पक्षी शाखाओं में घोंसला बनाते हैं, कीड़े छाल में रहते हैं।' },
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'plantation-intermediate',
        name: { en: 'Intermediate', te: 'మధ్యస్థం', hi: 'मध्यवर्ती' },
        description: { en: 'Deeper understanding of trees', te: 'చెట్ల గురించి లోతైన అవగాహన', hi: 'पेड़ों की गहरी समझ' },
        difficulty: 'intermediate',
        requiredScore: 70,
        isLocked: true,
        questions: [
          {
            id: 'p-i-1',
            type: 'mcq-single',
            question: { en: 'A mature tree can absorb approximately how much CO₂ per year?', te: 'ఒక పరిపక్వ చెట్టు సంవత్సరానికి సుమారు ఎంత CO₂ను గ్రహిస్తుంది?', hi: 'एक परिपक्व पेड़ प्रति वर्ष लगभग कितना CO₂ अवशोषित कर सकता है?' },
            options: [
              { en: '5 kg', te: '5 కిలోలు', hi: '5 किलो' },
              { en: '22-25 kg', te: '22-25 కిలోలు', hi: '22-25 किलो' },
              { en: '100 kg', te: '100 కిలోలు', hi: '100 किलो' },
              { en: '500 kg', te: '500 కిలోలు', hi: '500 किलो' }
            ],
            correctAnswer: 1,
            explanation: { en: 'A mature tree absorbs approximately 22-25 kg of CO₂ per year. This is equivalent to the emissions from driving a car about 100 km. Trees are essential in fighting climate change!', te: 'ఒక పరిపక్వ చెట్టు సంవత్సరానికి సుమారు 22-25 కిలోల CO₂ను గ్రహిస్తుంది.', hi: 'एक परिपक्व पेड़ प्रति वर्ष लगभग 22-25 किलो CO₂ अवशोषित करता है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'p-i-2',
            type: 'mcq-single',
            question: { en: 'Which tree is known for producing oxygen even at night?', te: 'రాత్రి కూడా ఆక్సిజన్ ఉత్పత్తి చేసే చెట్టు ఏది?', hi: 'कौन सा पेड़ रात में भी ऑक्सीजन उत्पादन के लिए जाना जाता है?' },
            options: [
              { en: 'Mango', te: 'మామిడి', hi: 'आम' },
              { en: 'Peepal (Sacred Fig)', te: 'రావి', hi: 'पीपल' },
              { en: 'Oak', te: 'ఓక్', hi: 'ओक' },
              { en: 'Eucalyptus', te: 'నీలగిరి', hi: 'नीलगिरी' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Peepal (Sacred Fig) trees perform a unique type of photosynthesis called CAM (Crassulacean Acid Metabolism), allowing them to produce oxygen even at night. This is why they are often planted near temples!', te: 'రావి చెట్లు CAM అనే ప్రత్యేక రకం కిరణజన్య సంయోగక్రియను నిర్వహిస్తాయి.', hi: 'पीपल के पेड़ CAM नामक एक विशेष प्रकार की प्रकाश संश्लेषण करते हैं।' },
            difficulty: 'intermediate'
          },
          {
            id: 'p-i-3',
            type: 'mcq-multiple',
            question: { en: 'Select ALL trees commonly used in Ayurveda medicine:', te: 'ఆయుర్వేద వైద్యంలో సాధారణంగా ఉపయోగించే అన్ని చెట్లను ఎంచుకోండి:', hi: 'आयुर्वेद चिकित्सा में आमतौर पर उपयोग किए जाने वाले सभी पेड़ों का चयन करें:' },
            options: [
              { en: 'Neem', te: 'వేప', hi: 'नीम' },
              { en: 'Tulsi (Holy Basil)', te: 'తులసి', hi: 'तुलसी' },
              { en: 'Amla (Indian Gooseberry)', te: 'ఉసిరి', hi: 'आंवला' },
              { en: 'Rubber Tree', te: 'రబ్బర్ చెట్టు', hi: 'रबड़ का पेड़' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Neem, Tulsi, and Amla are all important medicinal plants in Ayurveda. Neem has antibacterial properties, Tulsi boosts immunity, and Amla is rich in Vitamin C. Rubber trees are not used medicinally.', te: 'వేప, తులసి మరియు ఉసిరి అన్నీ ఆయుర్వేదంలో ముఖ్యమైన ఔషధ మొక్కలు.', hi: 'नीम, तुलसी और आंवला सभी आयुर्वेद में महत्वपूर्ण औषधीय पौधे हैं।' },
            difficulty: 'intermediate'
          },
          {
            id: 'p-i-4',
            type: 'image-based',
            question: { en: 'Trees can communicate through underground fungal networks. What is this network called?', te: 'చెట్లు భూగర్భ శిలీంధ్ర నెట్‌వర్క్‌ల ద్వారా సంభాషించగలవు. ఈ నెట్‌వర్క్‌ను ఏమి పిలుస్తారు?', hi: 'पेड़ भूमिगत कवक नेटवर्क के माध्यम से संवाद कर सकते हैं। इस नेटवर्क को क्या कहा जाता है?' },
            options: [
              { en: 'Tree Internet', te: 'ట్రీ ఇంటర్నెట్', hi: 'ट्री इंटरनेट' },
              { en: 'Wood Wide Web', te: 'వుడ్ వైడ్ వెబ్', hi: 'वुड वाइड वेब' },
              { en: 'Forest Network', te: 'ఫారెస్ట్ నెట్‌వర్క్', hi: 'फॉरेस्ट नेटवर्क' },
              { en: 'Root Connection', te: 'రూట్ కనెక్షన్', hi: 'रूट कनेक्शन' }
            ],
            correctAnswer: 1,
            explanation: { en: 'The "Wood Wide Web" is a network of mycorrhizal fungi that connect trees underground. Through this network, trees share nutrients, water, and even warning signals about pests or drought!', te: '"వుడ్ వైడ్ వెబ్" అనేది చెట్లను భూగర్భంలో అనుసంధానించే మైకోరైజల్ శిలీంధ్రాల నెట్‌వర్క్.', hi: '"वुड वाइड वेब" माइकोराइजल कवक का एक नेटवर्क है जो पेड़ों को भूमिगत रूप से जोड़ता है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'p-i-5',
            type: 'mcq-single',
            question: { en: 'What is the primary purpose of bark on a tree?', te: 'చెట్టు మీద బెరడు యొక్క ప్రాథమిక ప్రయోజనం ఏమిటి?', hi: 'पेड़ की छाल का प्राथमिक उद्देश्य क्या है?' },
            options: [
              { en: 'To make the tree look beautiful', te: 'చెట్టును అందంగా కనిపించేలా చేయడానికి', hi: 'पेड़ को सुंदर दिखाने के लिए' },
              { en: 'Protection from insects, disease, and weather', te: 'కీటకాలు, వ్యాధులు మరియు వాతావరణం నుండి రక్షణ', hi: 'कीड़ों, बीमारियों और मौसम से सुरक्षा' },
              { en: 'To absorb sunlight', te: 'సూర్యకాంతిని గ్రహించడానికి', hi: 'सूर्य की रोशनी को अवशोषित करने के लिए' },
              { en: 'To produce fruits', te: 'పండ్లు ఉత్పత్తి చేయడానికి', hi: 'फल पैदा करने के लिए' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Bark acts like skin for the tree, protecting the living tissue inside from physical damage, pests, diseases, extreme temperatures, and water loss.', te: 'బెరడు చెట్టుకు చర్మం వలె పనిచేస్తుంది, లోపల ఉన్న సజీవ కణజాలాన్ని రక్షిస్తుంది.', hi: 'छाल पेड़ के लिए त्वचा की तरह काम करती है, अंदर के जीवित ऊतक की रक्षा करती है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'p-i-6',
            type: 'mcq-single',
            question: { en: 'How do trees help reduce urban temperatures?', te: 'చెట్లు పట్టణ ఉష్ణోగ్రతలను తగ్గించడంలో ఎలా సహాయపడతాయి?', hi: 'पेड़ शहरी तापमान को कम करने में कैसे मदद करते हैं?' },
            options: [
              { en: 'By blocking the sun completely', te: 'సూర్యుడిని పూర్తిగా అడ్డుకోవడం ద్వారా', hi: 'सूरज को पूरी तरह से रोककर' },
              { en: 'Through shade and evaporative cooling (transpiration)', te: 'నీడ మరియు బాష్పీభవన శీతలీకరణ (ట్రాన్స్‌పిరేషన్) ద్వారా', hi: 'छाया और वाष्पीकरण शीतलन (वाष्पोत्सर्जन) के माध्यम से' },
              { en: 'By absorbing all the heat', te: 'మొత్తం వేడిని గ్రహించడం ద్వారా', hi: 'सारी गर्मी को अवशोषित करके' },
              { en: 'Trees don\'t affect temperature', te: 'చెట్లు ఉష్ణోగ్రతను ప్రభావితం చేయవు', hi: 'पेड़ तापमान को प्रभावित नहीं करते' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Trees cool cities through shade (blocking direct sunlight) and transpiration (releasing water vapor that cools the air). Urban trees can reduce temperatures by 3-5°C compared to areas without trees.', te: 'చెట్లు నీడ మరియు ట్రాన్స్‌పిరేషన్ ద్వారా నగరాలను చల్లబరుస్తాయి.', hi: 'पेड़ छाया और वाष्पोत्सर्जन के माध्यम से शहरों को ठंडा करते हैं।' },
            difficulty: 'intermediate'
          },
          {
            id: 'p-i-7',
            type: 'mcq-single',
            question: { en: 'What percentage of Earth\'s oxygen comes from land trees and plants?', te: 'భూమి ఆక్సిజన్‌లో ఎంత శాతం భూమి చెట్లు మరియు మొక్కల నుండి వస్తుంది?', hi: 'पृथ्वी की ऑक्सीजन का कितना प्रतिशत भूमि के पेड़ों और पौधों से आता है?' },
            options: [
              { en: 'About 80%', te: 'సుమారు 80%', hi: 'लगभग 80%' },
              { en: 'About 50%', te: 'సుమారు 50%', hi: 'लगभग 50%' },
              { en: 'About 20-28%', te: 'సుమారు 20-28%', hi: 'लगभग 20-28%' },
              { en: 'About 5%', te: 'సుమారు 5%', hi: 'लगभग 5%' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Land plants produce about 20-28% of Earth\'s oxygen. The majority (about 50-80%) comes from ocean phytoplankton and algae. However, land forests are crucial for carbon storage and biodiversity!', te: 'భూమి మొక్కలు భూమి ఆక్సిజన్‌లో సుమారు 20-28% ఉత్పత్తి చేస్తాయి.', hi: 'भूमि के पौधे पृथ्वी की ऑक्सीजन का लगभग 20-28% उत्पादन करते हैं।' },
            difficulty: 'intermediate'
          },
          {
            id: 'p-i-8',
            type: 'true-false',
            question: { en: 'Older, larger trees absorb more CO₂ and produce more oxygen than young trees.', te: 'పాత, పెద్ద చెట్లు యువ చెట్ల కంటే ఎక్కువ CO₂ గ్రహిస్తాయి మరియు ఎక్కువ ఆక్సిజన్ ఉత్పత్తి చేస్తాయి.', hi: 'पुराने, बड़े पेड़ युवा पेड़ों की तुलना में अधिक CO₂ अवशोषित करते हैं और अधिक ऑक्सीजन उत्पन्न करते हैं।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Yes! Larger trees have more leaves for photosynthesis. A single mature tree can produce enough oxygen for 2-4 people daily, while a sapling produces much less. This is why protecting old-growth forests is so important.', te: 'అవును! పెద్ద చెట్లకు కిరణజన్య సంయోగక్రియ కోసం ఎక్కువ ఆకులు ఉంటాయి.', hi: 'हाँ! बड़े पेड़ों में प्रकाश संश्लेषण के लिए अधिक पत्तियां होती हैं।' },
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'plantation-advanced',
        name: { en: 'Advanced', te: 'అధునాతన', hi: 'उन्नत' },
        description: { en: 'Expert level tree knowledge', te: 'నిపుణుల స్థాయి చెట్ల జ్ఞానం', hi: 'विशेषज्ञ स्तर का पेड़ ज्ञान' },
        difficulty: 'advanced',
        requiredScore: 70,
        isLocked: true,
        questions: [
          {
            id: 'p-a-1',
            type: 'mcq-single',
            question: { en: 'A mature tree can produce approximately how many liters of oxygen per day?', te: 'ఒక పరిపక్వ చెట్టు రోజుకు సుమారు ఎన్ని లీటర్ల ఆక్సిజన్ ఉత్పత్తి చేస్తుంది?', hi: 'एक परिपक्व पेड़ प्रति दिन लगभग कितने लीटर ऑक्सीजन पैदा कर सकता है?' },
            options: [
              { en: '50 liters', te: '50 లీటర్లు', hi: '50 लीटर' },
              { en: '100 liters', te: '100 లీటర్లు', hi: '100 लीटर' },
              { en: '260 liters', te: '260 లీటర్లు', hi: '260 लीटर' },
              { en: '500 liters', te: '500 లీటర్లు', hi: '500 लीटर' }
            ],
            correctAnswer: 2,
            explanation: { en: 'A mature tree produces approximately 260 liters (about 118 kg) of oxygen per day. This is enough oxygen for 2 people for a full day! The exact amount varies by species, size, and environmental conditions.', te: 'ఒక పరిపక్వ చెట్టు రోజుకు సుమారు 260 లీటర్ల ఆక్సిజన్ ఉత్పత్తి చేస్తుంది.', hi: 'एक परिपक्व पेड़ प्रति दिन लगभग 260 लीटर ऑक्सीजन पैदा करता है।' },
            difficulty: 'advanced'
          },
          {
            id: 'p-a-2',
            type: 'mcq-multiple',
            question: { en: 'A city wants to reduce urban heat island effect. Select ALL effective tree-based solutions:', te: 'ఒక నగరం పట్టణ వేడి ద్వీప ప్రభావాన్ని తగ్గించాలనుకుంటోంది. అన్ని ప్రభావవంతమైన చెట్టు-ఆధారిత పరిష్కారాలను ఎంచుకోండి:', hi: 'एक शहर शहरी ताप द्वीप प्रभाव को कम करना चाहता है। सभी प्रभावी पेड़-आधारित समाधानों का चयन करें:' },
            options: [
              { en: 'Planting trees along streets and in parking lots', te: 'వీధులు మరియు పార్కింగ్ స్థలాల్లో చెట్లను నాటడం', hi: 'सड़कों और पार्किंग स्थलों में पेड़ लगाना' },
              { en: 'Creating urban forests and green corridors', te: 'పట్టణ అడవులు మరియు హరిత కారిడార్లను సృష్టించడం', hi: 'शहरी वन और हरित गलियारे बनाना' },
              { en: 'Green roofs with trees and plants', te: 'చెట్లు మరియు మొక్కలతో హరిత పైకప్పులు', hi: 'पेड़ों और पौधों के साथ हरी छतें' },
              { en: 'Removing all trees to improve air circulation', te: 'గాలి ప్రసరణను మెరుగుపరచడానికి అన్ని చెట్లను తొలగించడం', hi: 'वायु संचार में सुधार के लिए सभी पेड़ हटाना' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Street trees, urban forests, green corridors, and green roofs all help reduce urban heat through shade and evaporative cooling. Removing trees would make the problem WORSE! Trees can reduce urban temperatures by 3-5°C.', te: 'వీధి చెట్లు, పట్టణ అడవులు, హరిత కారిడార్లు మరియు హరిత పైకప్పులు అన్నీ నీడ మరియు బాష్పీభవన శీతలీకరణ ద్వారా పట్టణ వేడిని తగ్గించడంలో సహాయపడతాయి.', hi: 'सड़क के पेड़, शहरी वन, हरित गलियारे और हरी छतें सभी छाया और वाष्पीकरण शीतलन के माध्यम से शहरी गर्मी को कम करने में मदद करते हैं।' },
            difficulty: 'advanced'
          },
          {
            id: 'p-a-3',
            type: 'mcq-single',
            question: { en: 'Forests can increase regional rainfall by what percentage through transpiration and moisture recycling?', te: 'ట్రాన్స్‌పిరేషన్ మరియు తేమ పునర్వినియోగం ద్వారా అడవులు ప్రాంతీయ వర్షపాతాన్ని ఎంత శాతం పెంచగలవు?', hi: 'वाष्पोत्सर्जन और नमी पुनर्चक्रण के माध्यम से वन क्षेत्रीय वर्षा को कितने प्रतिशत तक बढ़ा सकते हैं?' },
            options: [
              { en: '5-10%', te: '5-10%', hi: '5-10%' },
              { en: '20-30%', te: '20-30%', hi: '20-30%' },
              { en: '50-60%', te: '50-60%', hi: '50-60%' },
              { en: '80-90%', te: '80-90%', hi: '80-90%' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Research shows forests can increase regional rainfall by 20-30% through "biotic pump" mechanism. Trees release water vapor through transpiration, which forms clouds and falls as rain. Deforestation can significantly reduce local rainfall.', te: 'అడవులు "బయోటిక్ పంప్" మెకానిజం ద్వారా ప్రాంతీయ వర్షపాతాన్ని 20-30% పెంచగలవని పరిశోధన చూపిస్తుంది.', hi: 'शोध से पता चलता है कि वन "बायोटिक पंप" तंत्र के माध्यम से क्षेत्रीय वर्षा को 20-30% तक बढ़ा सकते हैं।' },
            difficulty: 'advanced'
          },
          {
            id: 'p-a-4',
            type: 'mcq-single',
            question: { en: 'A single mature oak tree can support how many species of insects, birds, and other organisms?', te: 'ఒక పరిపక్వ ఓక్ చెట్టు ఎన్ని జాతుల కీటకాలు, పక్షులు మరియు ఇతర జీవులకు మద్దతు ఇవ్వగలదు?', hi: 'एक परिपक्व ओक का पेड़ कितनी प्रजातियों के कीड़ों, पक्षियों और अन्य जीवों का समर्थन कर सकता है?' },
            options: [
              { en: '50 species', te: '50 జాతులు', hi: '50 प्रजातियां' },
              { en: '150 species', te: '150 జాతులు', hi: '150 प्रजातियां' },
              { en: '300 species', te: '300 జాతులు', hi: '300 प्रजातियां' },
              { en: '500+ species', te: '500+ జాతులు', hi: '500+ प्रजातियां' }
            ],
            correctAnswer: 3,
            explanation: { en: 'A single mature oak tree can support over 500 species including caterpillars, beetles, birds, mammals, fungi, and lichens. This makes large, old trees incredibly valuable for biodiversity. Each tree is essentially a complete ecosystem!', te: 'ఒక పరిపక్వ ఓక్ చెట్టు 500 కంటే ఎక్కువ జాతులకు మద్దతు ఇవ్వగలదు.', hi: 'एक परिपक्व ओक का पेड़ 500 से अधिक प्रजातियों का समर्थन कर सकता है।' },
            difficulty: 'advanced'
          },
          {
            id: 'p-a-5',
            type: 'mcq-single',
            question: { en: 'How much water can a large tree transpire (release) on a hot summer day?', te: 'వేడి వేసవి రోజున ఒక పెద్ద చెట్టు ఎంత నీటిని ట్రాన్స్‌పైర్ చేయగలదు?', hi: 'गर्मी के दिन एक बड़ा पेड़ कितना पानी वाष्पित कर सकता है?' },
            options: [
              { en: '50 liters', te: '50 లీటర్లు', hi: '50 लीटर' },
              { en: '100 liters', te: '100 లీటర్లు', hi: '100 लीटर' },
              { en: '200 liters', te: '200 లీటర్లు', hi: '200 लीटर' },
              { en: '400+ liters', te: '400+ లీటర్లు', hi: '400+ लीटर' }
            ],
            correctAnswer: 3,
            explanation: { en: 'Large trees can transpire over 400 liters of water per day during hot weather! This water evaporates and cools the surrounding air, acting like natural air conditioning. This is why shaded areas under trees feel much cooler.', te: 'వేడి వాతావరణంలో పెద్ద చెట్లు రోజుకు 400 లీటర్ల కంటే ఎక్కువ నీటిని ట్రాన్స్‌పైర్ చేయగలవు!', hi: 'गर्म मौसम में बड़े पेड़ प्रति दिन 400 लीटर से अधिक पानी वाष्पित कर सकते हैं!' },
            difficulty: 'advanced'
          },
          {
            id: 'p-a-6',
            type: 'mcq-single',
            question: { en: 'What is the approximate lifespan of a Banyan tree under ideal conditions?', te: 'ఆదర్శ పరిస్థితులలో బరగద చెట్టు యొక్క సుమారు ఆయువు ఎంత?', hi: 'आदर्श परिस्थितियों में बरगद के पेड़ की अनुमानित आयु क्या है?' },
            options: [
              { en: '100-200 years', te: '100-200 సంవత్సరాలు', hi: '100-200 साल' },
              { en: '200-500 years', te: '200-500 సంవత్సరాలు', hi: '200-500 साल' },
              { en: '500-1000 years', te: '500-1000 సంవత్సరాలు', hi: '500-1000 साल' },
              { en: '1000+ years', te: '1000+ సంవత్సరాలు', hi: '1000+ साल' }
            ],
            correctAnswer: 3,
            explanation: { en: 'Banyan trees can live for over 1000 years! The Great Banyan in Kolkata is over 250 years old and covers an area of about 4.67 acres. Banyan trees grow by sending down aerial roots that become supporting trunks, allowing them to expand indefinitely.', te: 'బరగద చెట్లు 1000 సంవత్సరాలకు పైగా జీవించగలవు!', hi: 'बरगद के पेड़ 1000 से अधिक वर्षों तक जीवित रह सकते हैं!' },
            difficulty: 'advanced'
          },
          {
            id: 'p-a-7',
            type: 'mcq-single',
            question: { en: 'How much carbon is typically stored in one hectare of mature tropical forest?', te: 'ఒక హెక్టారు పరిపక్వ ఉష్ణమండల అడవిలో సాధారణంగా ఎంత కార్బన్ నిల్వ చేయబడుతుంది?', hi: 'एक हेक्टेयर परिपक्व उष्णकटिबंधीय वन में आमतौर पर कितना कार्बन संग्रहीत होता है?' },
            options: [
              { en: '50-100 tons', te: '50-100 టన్నులు', hi: '50-100 टन' },
              { en: '100-150 tons', te: '100-150 టన్నులు', hi: '100-150 टन' },
              { en: '200-300 tons', te: '200-300 టన్నులు', hi: '200-300 टन' },
              { en: '300-500 tons', te: '300-500 టన్నులు', hi: '300-500 टन' }
            ],
            correctAnswer: 3,
            explanation: { en: 'Mature tropical forests store 300-500 tons of carbon per hectare! This includes carbon in trees, soil, dead wood, and litter. When forests are destroyed, this carbon is released, contributing significantly to climate change.', te: 'పరిపక్వ ఉష్ణమండల అడవులు హెక్టారుకు 300-500 టన్నుల కార్బన్‌ను నిల్వ చేస్తాయి!', hi: 'परिपक्व उष्णकटिबंधीय वन प्रति हेक्टेयर 300-500 टन कार्बन संग्रहीत करते हैं!' },
            difficulty: 'advanced'
          },
          {
            id: 'p-a-8',
            type: 'mcq-multiple',
            question: { en: 'A village is experiencing water shortages. Select ALL ways trees can help address this problem:', te: 'ఒక గ్రామంలో నీటి కొరత ఉంది. చెట్లు ఈ సమస్యను పరిష్కరించడంలో సహాయపడే అన్ని మార్గాలను ఎంచుకోండి:', hi: 'एक गांव में पानी की कमी है। पेड़ इस समस्या को हल करने में कैसे मदद कर सकते हैं, सभी तरीकों का चयन करें:' },
            options: [
              { en: 'Trees help recharge groundwater by allowing rain to seep into soil', te: 'వర్షం మట్టిలోకి ఇంకేలా చెట్లు భూగర్భజలాలను పునరుద్ధరించడంలో సహాయపడతాయి', hi: 'पेड़ बारिश को मिट्टी में रिसने देकर भूजल को रिचार्ज करने में मदद करते हैं' },
              { en: 'Tree roots prevent erosion and maintain watershed health', te: 'చెట్ల వేర్లు కోతను నిరోధిస్తాయి మరియు జలాశయ ఆరోగ్యాన్ని కాపాడతాయి', hi: 'पेड़ की जड़ें कटाव को रोकती हैं और जलसंभर स्वास्थ्य को बनाए रखती हैं' },
              { en: 'Forests help increase regional rainfall', te: 'అడవులు ప్రాంతీయ వర్షపాతాన్ని పెంచడంలో సహాయపడతాయి', hi: 'वन क्षेत्रीय वर्षा बढ़ाने में मदद करते हैं' },
              { en: 'Trees consume all available water and make shortages worse', te: 'చెట్లు అందుబాటులో ఉన్న మొత్తం నీటిని వినియోగిస్తాయి మరియు కొరతను మరింత తీవ్రం చేస్తాయి', hi: 'पेड़ सारा उपलब्ध पानी खपत करते हैं और कमी को बदतर बनाते हैं' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Trees help water availability in multiple ways: their roots allow rainwater to infiltrate soil and recharge aquifers, prevent erosion that damages watersheds, and increase regional rainfall through transpiration. While trees do use water, the net effect is improved water availability!', te: 'చెట్లు అనేక మార్గాల్లో నీటి లభ్యతకు సహాయపడతాయి.', hi: 'पेड़ कई तरीकों से पानी की उपलब्धता में मदद करते हैं।' },
            difficulty: 'advanced'
          }
        ]
      }
    ]
  },
  {
    id: 'water-conservation',
    name: { en: 'Water Conservation', te: 'నీటి సంరక్షణ', hi: 'जल संरक्षण' },
    description: { en: 'Master water-saving techniques and understand water cycles', te: 'నీటి పొదుపు పద్ధతులను నేర్చుకోండి', hi: 'जल बचाने की तकनीकें सीखें' },
    icon: '💧',
    color: 'bg-blue-500',
    levels: [
      {
        id: 'water-beginner',
        name: { en: 'Beginner', te: 'ప్రారంభికులు', hi: 'शुरुआती' },
        description: { en: 'Basic water conservation', te: 'ప్రాథమిక నీటి సంరక్షణ', hi: 'बुनियादी जल संरक्षण' },
        difficulty: 'beginner',
        requiredScore: 70,
        isLocked: false,
        questions: [
          {
            id: 'w-b-1',
            type: 'true-false',
            question: { en: 'Turning off the tap while brushing teeth can save water.', te: 'పళ్ళు తోముతున్నప్పుడు కుళాయిని మూసివేయడం నీటిని ఆదా చేయగలదు.', hi: 'दांत ब्रश करते समय नल बंद करने से पानी बचाया जा सकता है।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Leaving the tap running while brushing wastes about 6 liters of water per minute! By turning it off, a family can save thousands of liters per year.', te: 'పళ్ళు తోముతున్నప్పుడు కుళాయిని వదిలేయడం నిమిషానికి సుమారు 6 లీటర్ల నీటిని వృథా చేస్తుంది!', hi: 'ब्रश करते समय नल चालू छोड़ने से प्रति मिनट लगभग 6 लीटर पानी बर्बाद होता है!' },
            difficulty: 'beginner'
          },
          {
            id: 'w-b-2',
            type: 'mcq-single',
            question: { en: 'What is the best time to water plants to reduce evaporation?', te: 'బాష్పీభవనాన్ని తగ్గించడానికి మొక్కలకు నీరు పోయడానికి ఉత్తమ సమయం ఏది?', hi: 'वाष्पीकरण कम करने के लिए पौधों को पानी देने का सबसे अच्छा समय क्या है?' },
            options: [
              { en: 'Afternoon', te: 'మధ్యాహ్నం', hi: 'दोपहर' },
              { en: 'Early morning or evening', te: 'ఉదయం లేదా సాయంత్రం', hi: 'सुबह या शाम' },
              { en: 'Midnight', te: 'అర్ధరాత్రి', hi: 'आधी रात' },
              { en: 'Any time', te: 'ఏ సమయంలోనైనా', hi: 'कभी भी' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Early morning or evening is best because the sun is not strong, so less water evaporates. This means more water reaches the plant roots where it\'s needed.', te: 'ఉదయం లేదా సాయంత్రం ఉత్తమం ఎందుకంటే సూర్యుడు బలంగా ఉండదు, కాబట్టి తక్కువ నీరు ఆవిరవుతుంది.', hi: 'सुबह या शाम सबसे अच्छा है क्योंकि सूरज तेज नहीं होता, इसलिए कम पानी वाष्पित होता है।' },
            difficulty: 'beginner'
          },
          {
            id: 'w-b-3',
            type: 'mcq-single',
            question: { en: 'What percentage of Earth\'s water is fresh water available for human use?', te: 'భూమి నీటిలో ఎంత శాతం మానవ వినియోగానికి అందుబాటులో ఉన్న మంచినీరు?', hi: 'पृथ्वी के पानी का कितना प्रतिशत मनुष्यों के उपयोग के लिए उपलब्ध मीठा पानी है?' },
            options: [
              { en: 'About 50%', te: 'సుమారు 50%', hi: 'लगभग 50%' },
              { en: 'About 25%', te: 'సుమారు 25%', hi: 'लगभग 25%' },
              { en: 'Less than 1%', te: '1% కంటే తక్కువ', hi: '1% से कम' },
              { en: 'About 10%', te: 'సుమారు 10%', hi: 'लगभग 10%' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Only about 0.5-1% of Earth\'s water is fresh water available for human use! Most water is salty ocean water (97%) or frozen in ice caps. This is why conservation is so important.', te: 'భూమి నీటిలో సుమారు 0.5-1% మాత్రమే మానవ వినియోగానికి అందుబాటులో ఉన్న మంచినీరు!', hi: 'पृथ्वी के पानी का केवल लगभग 0.5-1% ही मनुष्यों के उपयोग के लिए उपलब्ध मीठा पानी है!' },
            difficulty: 'beginner'
          },
          {
            id: 'w-b-4',
            type: 'mcq-single',
            question: { en: 'Which uses MORE water - a shower or a bucket bath?', te: 'ఏది ఎక్కువ నీటిని వాడుతుంది - షవర్ లేదా బకెట్ స్నానం?', hi: 'कौन ज्यादा पानी उपयोग करता है - शावर या बाल्टी स्नान?' },
            options: [
              { en: 'Bucket bath uses more', te: 'బకెట్ స్నానం ఎక్కువ వాడుతుంది', hi: 'बाल्टी स्नान ज्यादा उपयोग करता है' },
              { en: 'Shower uses more', te: 'షవర్ ఎక్కువ వాడుతుంది', hi: 'शावर ज्यादा उपयोग करता है' },
              { en: 'Both use the same', te: 'రెండూ సమానంగా వాడతాయి', hi: 'दोनों समान उपयोग करते हैं' },
              { en: 'Neither uses water', te: 'ఏదీ నీటిని వాడదు', hi: 'दोनों पानी नहीं उपयोग करते' }
            ],
            correctAnswer: 1,
            explanation: { en: 'A 5-minute shower typically uses 35-40 liters of water, while a bucket bath uses only 15-20 liters. Bucket baths are more water-efficient!', te: '5-నిమిషాల షవర్ సాధారణంగా 35-40 లీటర్ల నీటిని వాడుతుంది, అయితే బకెట్ స్నానం కేవలం 15-20 లీటర్లు వాడుతుంది.', hi: '5 मिनट का शावर आमतौर पर 35-40 लीटर पानी उपयोग करता है, जबकि बाल्टी स्नान केवल 15-20 लीटर उपयोग करता है।' },
            difficulty: 'beginner'
          },
          {
            id: 'w-b-5',
            type: 'true-false',
            question: { en: 'Rainwater harvesting means collecting and storing rainwater for later use.', te: 'వర్షపు నీటి సేకరణ అంటే తరువాత ఉపయోగం కోసం వర్షపు నీటిని సేకరించడం మరియు నిల్వ చేయడం.', hi: 'वर्षा जल संचयन का अर्थ है बाद में उपयोग के लिए वर्षा जल एकत्र करना और संग्रहीत करना।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Rainwater harvesting captures rain from rooftops or other surfaces and stores it in tanks or allows it to seep into the ground. This water can be used for gardening, cleaning, or even drinking after treatment.', te: 'వర్షపు నీటి సేకరణ పైకప్పుల లేదా ఇతర ఉపరితలాల నుండి వర్షాన్ని సంగ్రహిస్తుంది.', hi: 'वर्षा जल संचयन छतों या अन्य सतहों से बारिश एकत्र करता है।' },
            difficulty: 'beginner'
          },
          {
            id: 'w-b-6',
            type: 'mcq-single',
            question: { en: 'A dripping tap can waste how much water per day?', te: 'కారే కుళాయి రోజుకు ఎంత నీటిని వృథా చేయగలదు?', hi: 'टपकता नल प्रति दिन कितना पानी बर्बाद कर सकता है?' },
            options: [
              { en: 'About 1 liter', te: 'సుమారు 1 లీటర్', hi: 'लगभग 1 लीटर' },
              { en: 'About 20-30 liters', te: 'సుమారు 20-30 లీటర్లు', hi: 'लगभग 20-30 लीटर' },
              { en: 'About 100 liters', te: 'సుమారు 100 లీటర్లు', hi: 'लगभग 100 लीटर' },
              { en: 'Only a few drops', te: 'కొన్ని చుక్కలు మాత్రమే', hi: 'केवल कुछ बूंदें' }
            ],
            correctAnswer: 1,
            explanation: { en: 'A dripping tap can waste 20-30 liters per day, which adds up to over 10,000 liters per year! Fixing leaky taps is one of the easiest ways to save water.', te: 'కారే కుళాయి రోజుకు 20-30 లీటర్లను వృథా చేయగలదు, ఇది సంవత్సరానికి 10,000 లీటర్లకు పైగా చేరుకుంటుంది!', hi: 'टपकता नल प्रति दिन 20-30 लीटर बर्बाद कर सकता है, जो प्रति वर्ष 10,000 लीटर से अधिक हो जाता है!' },
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'water-intermediate',
        name: { en: 'Intermediate', te: 'మధ్యస్థం', hi: 'मध्यवर्ती' },
        description: { en: 'Advanced water management', te: 'అధునాతన నీటి నిర్వహణ', hi: 'उन्नत जल प्रबंधन' },
        difficulty: 'intermediate',
        requiredScore: 70,
        isLocked: true,
        questions: [
          {
            id: 'w-i-1',
            type: 'mcq-single',
            question: { en: 'What is "virtual water" or "water footprint"?', te: '"వర్చువల్ వాటర్" లేదా "వాటర్ ఫుట్‌ప్రింట్" అంటే ఏమిటి?', hi: '"वर्चुअल वाटर" या "वाटर फुटप्रिंट" क्या है?' },
            options: [
              { en: 'Water that doesn\'t exist', te: 'ఉనికిలో లేని నీరు', hi: 'पानी जो मौजूद नहीं है' },
              { en: 'Total water used to produce a product', te: 'ఉత్పత్తిని తయారు చేయడానికి ఉపయోగించిన మొత్తం నీరు', hi: 'किसी उत्पाद के उत्पादन में उपयोग किया गया कुल पानी' },
              { en: 'Water in digital form', te: 'డిజిటల్ రూపంలో నీరు', hi: 'डिजिटल रूप में पानी' },
              { en: 'Bottled water', te: 'బాటిల్ నీరు', hi: 'बोतलबंद पानी' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Virtual water is the total amount of water used throughout the production of goods. For example, producing 1 kg of rice requires about 3,000 liters of water for growing, processing, and transport!', te: 'వర్చువల్ వాటర్ అనేది వస్తువుల ఉత్పత్తిలో ఉపయోగించిన మొత్తం నీటి మొత్తం.', hi: 'वर्चुअल वाटर वस्तुओं के उत्पादन में उपयोग किए गए कुल पानी की मात्रा है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'w-i-2',
            type: 'mcq-single',
            question: { en: 'Which farming technique uses the LEAST amount of water?', te: 'ఏ వ్యవసాయ పద్ధతి అతి తక్కువ నీటిని వాడుతుంది?', hi: 'कौन सी खेती तकनीक सबसे कम पानी उपयोग करती है?' },
            options: [
              { en: 'Flood irrigation', te: 'వరద నీటిపారుదల', hi: 'बाढ़ सिंचाई' },
              { en: 'Drip irrigation', te: 'బిందు సేద్యం', hi: 'टपक सिंचाई' },
              { en: 'Sprinkler irrigation', te: 'స్ప్రింక్లర్ నీటిపారుదల', hi: 'स्प्रिंकलर सिंचाई' },
              { en: 'Canal irrigation', te: 'కాలువ నీటిపారుదల', hi: 'नहर सिंचाई' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Drip irrigation delivers water directly to plant roots through tubes, using 30-50% less water than traditional methods. It also reduces weed growth and disease since water doesn\'t touch leaves.', te: 'బిందు సేద్యం గొట్టాల ద్వారా నేరుగా మొక్కల వేర్లకు నీటిని అందిస్తుంది, సాంప్రదాయ పద్ధతుల కంటే 30-50% తక్కువ నీటిని వాడుతుంది.', hi: 'टपक सिंचाई ट्यूबों के माध्यम से सीधे पौधों की जड़ों में पानी पहुंचाती है, पारंपरिक तरीकों से 30-50% कम पानी उपयोग करती है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'w-i-3',
            type: 'mcq-multiple',
            question: { en: 'Select ALL methods of groundwater recharge:', te: 'భూగర్భజలాలను పునరుద్ధరించే అన్ని పద్ధతులను ఎంచుకోండి:', hi: 'भूजल रिचार्ज की सभी विधियों का चयन करें:' },
            options: [
              { en: 'Rainwater harvesting pits', te: 'వర్షపు నీటి సేకరణ గొయ్యలు', hi: 'वर्षा जल संचयन गड्ढे' },
              { en: 'Percolation tanks', te: 'పెర్కొలేషన్ ట్యాంకులు', hi: 'परकोलेशन टैंक' },
              { en: 'Planting trees', te: 'చెట్లను నాటడం', hi: 'पेड़ लगाना' },
              { en: 'Paving all surfaces with concrete', te: 'అన్ని ఉపరితలాలను కాంక్రీట్‌తో పేవ్ చేయడం', hi: 'सभी सतहों को कंक्रीट से पक्का करना' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Rainwater pits, percolation tanks, and trees all help recharge groundwater by allowing water to seep into the soil. Concrete paving prevents water absorption and increases runoff, actually harming groundwater levels!', te: 'వర్షపు నీటి గొయ్యలు, పెర్కొలేషన్ ట్యాంకులు మరియు చెట్లు అన్నీ నీరు మట్టిలోకి ఇంకేలా భూగర్భజలాలను పునరుద్ధరించడంలో సహాయపడతాయి.', hi: 'वर्षा जल गड्ढे, परकोलेशन टैंक और पेड़ सभी पानी को मिट्टी में रिसने देकर भूजल रिचार्ज में मदद करते हैं।' },
            difficulty: 'intermediate'
          },
          {
            id: 'w-i-4',
            type: 'mcq-single',
            question: { en: 'How much water is needed to produce 1 kg of beef?', te: '1 కిలో గొడ్డు మాంసం ఉత్పత్తికి ఎంత నీరు అవసరం?', hi: '1 किलो गोमांस का उत्पादन करने के लिए कितना पानी चाहिए?' },
            options: [
              { en: 'About 500 liters', te: 'సుమారు 500 లీటర్లు', hi: 'लगभग 500 लीटर' },
              { en: 'About 5,000 liters', te: 'సుమారు 5,000 లీటర్లు', hi: 'लगभग 5,000 लीटर' },
              { en: 'About 15,000 liters', te: 'సుమారు 15,000 లీటర్లు', hi: 'लगभग 15,000 लीटर' },
              { en: 'About 100 liters', te: 'సుమారు 100 లీటర్లు', hi: 'लगभग 100 लीटर' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Producing 1 kg of beef requires about 15,000 liters of water when you count water for growing cattle feed, drinking water for animals, and processing. Plant-based foods generally have much lower water footprints.', te: '1 కిలో గొడ్డు మాంసం ఉత్పత్తికి సుమారు 15,000 లీటర్ల నీరు అవసరం.', hi: '1 किलो गोमांस के उत्पादन में लगभग 15,000 लीटर पानी लगता है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'w-i-5',
            type: 'true-false',
            question: { en: 'Greywater (from sinks and washing machines) can be safely reused for watering gardens.', te: 'గ్రే వాటర్ (సింక్‌లు మరియు వాషింగ్ మెషీన్ల నుండి) తోటలకు నీరు పోయడానికి సురక్షితంగా పునర్వినియోగించవచ్చు.', hi: 'ग्रे वाटर (सिंक और वाशिंग मशीन से) बगीचों में पानी देने के लिए सुरक्षित रूप से पुन: उपयोग किया जा सकता है।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Greywater (lightly used water from sinks, showers, and laundry) can be safely reused for garden irrigation. This can reduce household water consumption by 30-50%! Avoid using water with harsh chemicals.', te: 'గ్రే వాటర్ (సింక్‌లు, షవర్లు మరియు లాండ్రీ నుండి తేలికగా వాడిన నీరు) తోట నీటిపారుదల కోసం సురక్షితంగా పునర్వినియోగించవచ్చు.', hi: 'ग्रे वाटर (सिंक, शावर और लॉन्ड्री से हल्के इस्तेमाल का पानी) बगीचे की सिंचाई के लिए सुरक्षित रूप से पुन: उपयोग किया जा सकता है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'w-i-6',
            type: 'mcq-single',
            question: { en: 'What is the main cause of water scarcity in many regions?', te: 'అనేక ప్రాంతాలలో నీటి కొరతకు ప్రధాన కారణం ఏమిటి?', hi: 'कई क्षेत्रों में पानी की कमी का मुख्य कारण क्या है?' },
            options: [
              { en: 'Too little rainfall globally', te: 'ప్రపంచవ్యాప్తంగా చాలా తక్కువ వర్షపాతం', hi: 'विश्व स्तर पर बहुत कम वर्षा' },
              { en: 'Poor water management and wastage', te: 'అసమర్థ నీటి నిర్వహణ మరియు వృథా', hi: 'खराब जल प्रबंधन और बर्बादी' },
              { en: 'Too many trees using water', te: 'చాలా చెట్లు నీటిని వాడుతున్నాయి', hi: 'बहुत सारे पेड़ पानी उपयोग कर रहे हैं' },
              { en: 'The sun evaporating all water', te: 'సూర్యుడు మొత్తం నీటిని ఆవిరి చేస్తున్నాడు', hi: 'सूरज सारा पानी वाष्पित कर रहा है' }
            ],
            correctAnswer: 1,
            explanation: { en: 'While climate affects water availability, poor management, pollution, over-extraction of groundwater, and wastage are the main human causes of water scarcity. Better management can solve most water problems.', te: 'వాతావరణం నీటి లభ్యతను ప్రభావితం చేస్తున్నప్పటికీ, అసమర్థ నిర్వహణ, కాలుష్యం, భూగర్భజలాల అతి వెలికితీత మరియు వృథా నీటి కొరతకు ప్రధాన మానవ కారణాలు.', hi: 'हालांकि जलवायु पानी की उपलब्धता को प्रभावित करती है, खराब प्रबंधन, प्रदूषण, भूजल का अधिक निकालना और बर्बादी पानी की कमी के मुख्य मानवीय कारण हैं।' },
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'water-advanced',
        name: { en: 'Advanced', te: 'అధునాతన', hi: 'उन्नत' },
        description: { en: 'Expert water science', te: 'నిపుణుల స్థాయి నీటి శాస్త్రం', hi: 'विशेषज्ञ जल विज्ञान' },
        difficulty: 'advanced',
        requiredScore: 70,
        isLocked: true,
        questions: [
          {
            id: 'w-a-1',
            type: 'mcq-single',
            question: { en: 'What is "water stress" and when does a region experience it?', te: '"వాటర్ స్ట్రెస్" అంటే ఏమిటి మరియు ఒక ప్రాంతం దానిని ఎప్పుడు అనుభవిస్తుంది?', hi: '"वाटर स्ट्रेस" क्या है और कोई क्षेत्र इसे कब अनुभव करता है?' },
            options: [
              { en: 'When water is too cold', te: 'నీరు చాలా చల్లగా ఉన్నప్పుడు', hi: 'जब पानी बहुत ठंडा हो' },
              { en: 'When demand exceeds available supply or quality limits access', te: 'డిమాండ్ అందుబాటులో ఉన్న సరఫరాను మించినప్పుడు లేదా నాణ్యత ప్రాప్యతను పరిమితం చేసినప్పుడు', hi: 'जब मांग उपलब्ध आपूर्ति से अधिक हो या गुणवत्ता पहुंच को सीमित करे' },
              { en: 'When there is too much rain', te: 'చాలా ఎక్కువ వర్షం పడినప్పుడు', hi: 'जब बहुत ज्यादा बारिश हो' },
              { en: 'When rivers flow too fast', te: 'నదులు చాలా వేగంగా ప్రవహించినప్పుడు', hi: 'जब नदियां बहुत तेज बहती हों' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Water stress occurs when freshwater demand exceeds available supply or when poor quality restricts its use. A region is "water stressed" when withdrawals exceed 25% of renewable freshwater resources. Over 2 billion people live in water-stressed regions.', te: 'మంచినీటి డిమాండ్ అందుబాటులో ఉన్న సరఫరాను మించినప్పుడు లేదా నాసిరకం నాణ్యత దాని వినియోగాన్ని పరిమితం చేసినప్పుడు వాటర్ స్ట్రెస్ సంభవిస్తుంది.', hi: 'वाटर स्ट्रेस तब होता है जब मीठे पानी की मांग उपलब्ध आपूर्ति से अधिक हो जाती है।' },
            difficulty: 'advanced'
          },
          {
            id: 'w-a-2',
            type: 'mcq-multiple',
            question: { en: 'A city facing severe water crisis should implement which solutions? (Select ALL that apply)', te: 'తీవ్రమైన నీటి సంక్షోభాన్ని ఎదుర్కొంటున్న నగరం ఏ పరిష్కారాలను అమలు చేయాలి? (వర్తించే అన్నింటిని ఎంచుకోండి)', hi: 'गंभीर जल संकट का सामना कर रहे शहर को कौन से समाधान लागू करने चाहिए? (सभी लागू चुनें)' },
            options: [
              { en: 'Mandatory rainwater harvesting for all buildings', te: 'అన్ని భవనాలకు తప్పనిసరి వర్షపు నీటి సేకరణ', hi: 'सभी भवनों के लिए अनिवार्य वर्षा जल संचयन' },
              { en: 'Wastewater treatment and recycling', te: 'మురుగునీటి శుద్ధి మరియు పునర్వినియోగం', hi: 'अपशिष्ट जल उपचार और पुनर्चक्रण' },
              { en: 'Tiered water pricing (higher use = higher cost)', te: 'అంచెల నీటి ధర (ఎక్కువ వాడకం = ఎక్కువ ఖర్చు)', hi: 'टियर्ड जल मूल्य निर्धारण (अधिक उपयोग = अधिक लागत)' },
              { en: 'Removing all vegetation to save water', te: 'నీటిని ఆదా చేయడానికి అన్ని వృక్షసంపదను తొలగించడం', hi: 'पानी बचाने के लिए सभी वनस्पति हटाना' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Effective water crisis solutions include rainwater harvesting, wastewater recycling, and smart pricing to discourage waste. Removing vegetation is counterproductive - plants help recharge groundwater and regulate water cycles!', te: 'సమర్థవంతమైన నీటి సంక్షోభ పరిష్కారాలలో వర్షపు నీటి సేకరణ, మురుగునీటి పునర్వినియోగం మరియు వృథాను నిరుత్సాహపరచడానికి తెలివైన ధర ఉన్నాయి.', hi: 'प्रभावी जल संकट समाधानों में वर्षा जल संचयन, अपशिष्ट जल पुनर्चक्रण और बर्बादी को हतोत्साहित करने के लिए स्मार्ट मूल्य निर्धारण शामिल हैं।' },
            difficulty: 'advanced'
          },
          {
            id: 'w-a-3',
            type: 'mcq-single',
            question: { en: 'What is "aquifer depletion" and why is it dangerous?', te: '"అక్విఫర్ డిప్లీషన్" అంటే ఏమిటి మరియు ఇది ఎందుకు ప్రమాదకరం?', hi: '"एक्वीफर डिप्लीशन" क्या है और यह खतरनाक क्यों है?' },
            options: [
              { en: 'Rain clouds disappearing - causes drought', te: 'వర్షపు మేఘాలు అదృశ్యమవడం - కరువుకు కారణమవుతుంది', hi: 'बारिश के बादलों का गायब होना - सूखा का कारण' },
              { en: 'Underground water being pumped faster than it recharges', te: 'భూగర్భజలాలు పునరుద్ధరణ కంటే వేగంగా పంప్ చేయబడుతున్నాయి', hi: 'भूजल को रिचार्ज से तेज गति से निकालना' },
              { en: 'Fish populations declining', te: 'చేపల జనాభా తగ్గుతోంది', hi: 'मछली की आबादी में गिरावट' },
              { en: 'Rivers changing direction', te: 'నదులు దిశ మారుస్తున్నాయి', hi: 'नदियों की दिशा बदलना' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Aquifer depletion occurs when groundwater is pumped out faster than natural recharge. This can cause land subsidence (sinking), saltwater intrusion in coastal areas, and long-term water shortages. Many aquifers take thousands of years to recharge!', te: 'సహజ పునరుద్ధరణ కంటే భూగర్భజలాలు వేగంగా పంప్ చేయబడినప్పుడు అక్విఫర్ డిప్లీషన్ సంభవిస్తుంది.', hi: 'एक्वीफर डिप्लीशन तब होता है जब भूजल को प्राकृतिक रिचार्ज से तेज गति से निकाला जाता है।' },
            difficulty: 'advanced'
          },
          {
            id: 'w-a-4',
            type: 'mcq-single',
            question: { en: 'What is "desalination" and what is its main challenge?', te: '"డీసాలినేషన్" అంటే ఏమిటి మరియు దాని ప్రధాన సవాలు ఏమిటి?', hi: '"डिसेलिनेशन" क्या है और इसकी मुख्य चुनौती क्या है?' },
            options: [
              { en: 'Adding salt to water - it\'s too cheap', te: 'నీటికి ఉప్పు కలపడం - ఇది చాలా చవకైనది', hi: 'पानी में नमक मिलाना - यह बहुत सस्ता है' },
              { en: 'Removing salt from seawater - requires high energy', te: 'సముద్రపు నీటి నుండి ఉప్పు తొలగించడం - అధిక శక్తి అవసరం', hi: 'समुद्री जल से नमक निकालना - उच्च ऊर्जा की आवश्यकता है' },
              { en: 'Freezing water - too slow', te: 'నీటిని గడ్డ కట్టించడం - చాలా నెమ్మదిగా', hi: 'पानी जमाना - बहुत धीमा' },
              { en: 'Boiling water - uses too much water', te: 'నీటిని మరగించడం - చాలా ఎక్కువ నీటిని వాడుతుంది', hi: 'पानी उबालना - बहुत ज्यादा पानी उपयोग करता है' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Desalination removes salt from seawater to produce freshwater. The main challenge is high energy consumption - it takes about 3-4 kWh to produce 1 cubic meter of water. This makes it expensive and has environmental impacts from energy use.', te: 'డీసాలినేషన్ మంచినీటిని ఉత్పత్తి చేయడానికి సముద్రపు నీటి నుండి ఉప్పును తొలగిస్తుంది. ప్రధాన సవాలు అధిక శక్తి వినియోగం.', hi: 'डिसेलिनेशन मीठा पानी पैदा करने के लिए समुद्री जल से नमक निकालता है। मुख्य चुनौती उच्च ऊर्जा खपत है।' },
            difficulty: 'advanced'
          },
          {
            id: 'w-a-5',
            type: 'mcq-single',
            question: { en: 'By 2050, how many people are projected to live in areas facing water scarcity?', te: '2050 నాటికి, నీటి కొరత ఎదుర్కొంటున్న ప్రాంతాలలో ఎంత మంది నివసిస్తారని అంచనా?', hi: '2050 तक, पानी की कमी वाले क्षेत्रों में कितने लोगों के रहने का अनुमान है?' },
            options: [
              { en: '500 million', te: '50 కోట్లు', hi: '50 करोड़' },
              { en: '2 billion', te: '200 కోట్లు', hi: '200 करोड़' },
              { en: '5 billion', te: '500 కోట్లు', hi: '500 करोड़' },
              { en: '1 billion', te: '100 కోట్లు', hi: '100 करोड़' }
            ],
            correctAnswer: 2,
            explanation: { en: 'UN projections estimate that 5 billion people (about half of the world\'s projected population) could face water scarcity by 2050 due to climate change, population growth, and pollution. This makes water conservation critical for our future.', te: 'UN అంచనాల ప్రకారం 2050 నాటికి 500 కోట్ల మంది (ప్రపంచ జనాభాలో సగం) నీటి కొరతను ఎదుర్కోవచ్చు.', hi: 'UN अनुमानों के अनुसार 2050 तक 500 करोड़ लोग (दुनिया की आबादी का लगभग आधा) पानी की कमी का सामना कर सकते हैं।' },
            difficulty: 'advanced'
          },
          {
            id: 'w-a-6',
            type: 'mcq-multiple',
            question: { en: 'Climate change affects water resources through: (Select ALL)', te: 'వాతావరణ మార్పు నీటి వనరులను ప్రభావితం చేస్తుంది: (అన్నీ ఎంచుకోండి)', hi: 'जलवायु परिवर्तन जल संसाधनों को प्रभावित करता है: (सभी चुनें)' },
            options: [
              { en: 'Changing rainfall patterns and intensity', te: 'వర్షపాతం నమూనాలు మరియు తీవ్రత మారడం', hi: 'वर्षा पैटर्न और तीव्रता में बदलाव' },
              { en: 'Melting glaciers affecting river flows', te: 'హిమానీనదాలు కరిగిపోవడం నది ప్రవాహాలను ప్రభావితం చేస్తుంది', hi: 'ग्लेशियर पिघलने से नदी प्रवाह प्रभावित' },
              { en: 'Increased evaporation from warming', te: 'వేడెక్కడం వల్ల పెరిగిన బాష్పీభవనం', hi: 'गर्माहट से बढ़ा वाष्पीकरण' },
              { en: 'Sea level rise contaminating coastal freshwater', te: 'సముద్ర మట్టం పెరుగుదల తీరప్రాంత మంచినీటిని కలుషితం చేస్తుంది', hi: 'समुद्र स्तर वृद्धि से तटीय मीठे पानी का प्रदूषण' }
            ],
            correctAnswer: [0, 1, 2, 3],
            explanation: { en: 'Climate change impacts water through ALL these mechanisms: altered rain patterns cause floods or droughts, glacier melt affects rivers that billions depend on, warming increases evaporation, and rising seas push saltwater into freshwater sources. Comprehensive water management must address all these factors.', te: 'వాతావరణ మార్పు ఈ అన్ని యంత్రాంగాల ద్వారా నీటిని ప్రభావితం చేస్తుంది.', hi: 'जलवायु परिवर्तन इन सभी तंत्रों के माध्यम से पानी को प्रभावित करता है।' },
            difficulty: 'advanced'
          }
        ]
      }
    ]
  },
  {
    id: 'climate-awareness',
    name: { en: 'Climate Awareness', te: 'వాతావరణ అవగాహన', hi: 'जलवायु जागरूकता' },
    description: { en: 'Understand climate change and environmental impact', te: 'వాతావరణ మార్పు మరియు పర్యావరణ ప్రభావాన్ని అర్థం చేసుకోండి', hi: 'जलवायु परिवर्तन और पर्यावरणीय प्रभाव को समझें' },
    icon: '🌍',
    color: 'bg-orange-500',
    levels: [
      {
        id: 'climate-beginner',
        name: { en: 'Beginner', te: 'ప్రారంభికులు', hi: 'शुरुआती' },
        description: { en: 'Basic climate concepts', te: 'ప్రాథమిక వాతావరణ భావనలు', hi: 'बुनियादी जलवायु अवधारणाएं' },
        difficulty: 'beginner',
        requiredScore: 70,
        isLocked: false,
        questions: [
          {
            id: 'c-b-1',
            type: 'true-false',
            question: { en: 'Climate change and global warming mean the same thing.', te: 'వాతావరణ మార్పు మరియు గ్లోబల్ వార్మింగ్ ఒకే అర్థం.', hi: 'जलवायु परिवर्तन और ग्लोबल वार्मिंग का मतलब एक ही है।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 1,
            explanation: { en: 'They\'re related but different! Global warming refers to rising temperatures, while climate change includes all changes like shifting seasons, extreme weather, and rising sea levels. Global warming is ONE part of climate change.', te: 'అవి సంబంధితాలు కానీ భిన్నమైనవి! గ్లోబల్ వార్మింగ్ పెరుగుతున్న ఉష్ణోగ్రతలను సూచిస్తుంది, అయితే వాతావరణ మార్పు మారుతున్న సీజన్లు, తీవ్రమైన వాతావరణం వంటి అన్ని మార్పులను కలిగి ఉంటుంది.', hi: 'वे संबंधित हैं लेकिन अलग हैं! ग्लोबल वार्मिंग का मतलब बढ़ते तापमान से है, जबकि जलवायु परिवर्तन में मौसम बदलना, चरम मौसम जैसे सभी परिवर्तन शामिल हैं।' },
            difficulty: 'beginner'
          },
          {
            id: 'c-b-2',
            type: 'mcq-single',
            question: { en: 'What is the main gas causing global warming?', te: 'గ్లోబల్ వార్మింగ్‌కు కారణమయ్యే ప్రధాన వాయువు ఏది?', hi: 'ग्लोबल वार्मिंग का कारण बनने वाली मुख्य गैस कौन सी है?' },
            options: [
              { en: 'Oxygen', te: 'ఆక్సిజన్', hi: 'ऑक्सीजन' },
              { en: 'Nitrogen', te: 'నత్రజని', hi: 'नाइट्रोजन' },
              { en: 'Carbon Dioxide (CO₂)', te: 'కార్బన్ డయాక్సైడ్ (CO₂)', hi: 'कार्बन डाइऑक्साइड (CO₂)' },
              { en: 'Hydrogen', te: 'హైడ్రోజన్', hi: 'हाइड्रोजन' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Carbon dioxide (CO₂) is the main greenhouse gas causing warming. It\'s released when we burn fossil fuels (coal, oil, gas) for energy. CO₂ traps heat in the atmosphere, acting like a blanket around Earth.', te: 'కార్బన్ డయాక్సైడ్ (CO₂) వేడెక్కడానికి కారణమయ్యే ప్రధాన గ్రీన్‌హౌస్ వాయువు. మనం శక్తి కోసం శిలాజ ఇంధనాలను కాల్చినప్పుడు ఇది విడుదలవుతుంది.', hi: 'कार्बन डाइऑक्साइड (CO₂) गर्माहट का कारण बनने वाली मुख्य ग्रीनहाउस गैस है। जब हम ऊर्जा के लिए जीवाश्म ईंधन जलाते हैं तब यह निकलती है।' },
            difficulty: 'beginner'
          },
          {
            id: 'c-b-3',
            type: 'mcq-single',
            question: { en: 'How can planting trees help fight climate change?', te: 'చెట్లు నాటడం వాతావరణ మార్పుతో పోరాడటానికి ఎలా సహాయపడుతుంది?', hi: 'पेड़ लगाना जलवायु परिवर्तन से लड़ने में कैसे मदद कर सकता है?' },
            options: [
              { en: 'Trees produce more heat', te: 'చెట్లు ఎక్కువ వేడిని ఉత్పత్తి చేస్తాయి', hi: 'पेड़ अधिक गर्मी पैदा करते हैं' },
              { en: 'Trees absorb CO₂ and store carbon', te: 'చెట్లు CO₂ గ్రహిస్తాయి మరియు కార్బన్‌ను నిల్వ చేస్తాయి', hi: 'पेड़ CO₂ अवशोषित करते हैं और कार्बन संग्रहीत करते हैं' },
              { en: 'Trees release harmful gases', te: 'చెట్లు హానికరమైన వాయువులను విడుదల చేస్తాయి', hi: 'पेड़ हानिकारक गैसें छोड़ते हैं' },
              { en: 'Trees have no effect', te: 'చెట్లకు ఎటువంటి ప్రభావం లేదు', hi: 'पेड़ों का कोई प्रभाव नहीं है' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Trees are nature\'s carbon capture machines! They absorb CO₂ through photosynthesis and store carbon in their wood, roots, and leaves. A single tree can absorb 20-25 kg of CO₂ per year.', te: 'చెట్లు ప్రకృతి యొక్క కార్బన్ క్యాప్చర్ యంత్రాలు! అవి కిరణజన్య సంయోగక్రియ ద్వారా CO₂ను గ్రహిస్తాయి మరియు వాటి కలప, వేర్లు మరియు ఆకులలో కార్బన్‌ను నిల్వ చేస్తాయి.', hi: 'पेड़ प्रकृति की कार्बन कैप्चर मशीनें हैं! वे प्रकाश संश्लेषण के माध्यम से CO₂ अवशोषित करते हैं और अपनी लकड़ी, जड़ों और पत्तियों में कार्बन संग्रहीत करते हैं।' },
            difficulty: 'beginner'
          },
          {
            id: 'c-b-4',
            type: 'true-false',
            question: { en: 'The Earth\'s temperature has increased in the last 100 years.', te: 'గత 100 సంవత్సరాలలో భూమి ఉష్ణోగ్రత పెరిగింది.', hi: 'पिछले 100 वर्षों में पृथ्वी का तापमान बढ़ा है।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Yes! Earth\'s average temperature has risen about 1.1°C (2°F) since the late 1800s. This may seem small, but it\'s causing major changes - melting ice, rising seas, and more extreme weather.', te: 'అవును! 1800ల చివరి నుండి భూమి సగటు ఉష్ణోగ్రత సుమారు 1.1°C పెరిగింది. ఇది చిన్నదిగా అనిపించవచ్చు, కానీ ఇది పెద్ద మార్పులకు కారణమవుతోంది.', hi: 'हाँ! 1800 के दशक के अंत से पृथ्वी का औसत तापमान लगभग 1.1°C बढ़ा है। यह छोटा लग सकता है, लेकिन यह बड़े बदलाव ला रहा है।' },
            difficulty: 'beginner'
          },
          {
            id: 'c-b-5',
            type: 'mcq-single',
            question: { en: 'Which of these is a renewable energy source?', te: 'వీటిలో ఏది పునరుత్పాదక ఇంధన వనరు?', hi: 'इनमें से कौन सा नवीकरणीय ऊर्जा स्रोत है?' },
            options: [
              { en: 'Coal', te: 'బొగ్గు', hi: 'कोयला' },
              { en: 'Solar power', te: 'సౌర శక్తి', hi: 'सौर ऊर्जा' },
              { en: 'Natural gas', te: 'సహజ వాయువు', hi: 'प्राकृतिक गैस' },
              { en: 'Petroleum', te: 'పెట్రోలియం', hi: 'पेट्रोलियम' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Solar power is renewable because the sun will keep shining for billions of years! Unlike coal, gas, or petroleum (fossil fuels), solar energy is clean and doesn\'t produce greenhouse gases when generating electricity.', te: 'సౌర శక్తి పునరుత్పాదకం ఎందుకంటే సూర్యుడు బిలియన్ల సంవత్సరాలు ప్రకాశిస్తూనే ఉంటాడు!', hi: 'सौर ऊर्जा नवीकरणीय है क्योंकि सूरज अरबों वर्षों तक चमकता रहेगा!' },
            difficulty: 'beginner'
          },
          {
            id: 'c-b-6',
            type: 'mcq-single',
            question: { en: 'What is the "greenhouse effect"?', te: '"గ్రీన్‌హౌస్ ఎఫెక్ట్" అంటే ఏమిటి?', hi: '"ग्रीनहाउस प्रभाव" क्या है?' },
            options: [
              { en: 'Growing plants in glass buildings', te: 'గాజు భవనాలలో మొక్కలు పెంచడం', hi: 'कांच के भवनों में पौधे उगाना' },
              { en: 'Gases trapping heat in atmosphere', te: 'వాయువులు వాతావరణంలో వేడిని బంధిస్తాయి', hi: 'गैसें वायुमंडल में गर्मी को फंसाती हैं' },
              { en: 'Painting houses green', te: 'ఇళ్లను ఆకుపచ్చ రంగు వేయడం', hi: 'घरों को हरा रंगना' },
              { en: 'Growing vegetables', te: 'కూరగాయలు పండించడం', hi: 'सब्जियां उगाना' }
            ],
            correctAnswer: 1,
            explanation: { en: 'The greenhouse effect is when gases like CO₂ and methane trap the sun\'s heat in Earth\'s atmosphere, like a blanket. A little greenhouse effect is natural and necessary for life, but too much causes dangerous warming.', te: 'గ్రీన్‌హౌస్ ఎఫెక్ట్ అంటే CO₂ మరియు మీథేన్ వంటి వాయువులు భూమి వాతావరణంలో సూర్యుడి వేడిని బంధిస్తాయి.', hi: 'ग्रीनहाउस प्रभाव तब होता है जब CO₂ और मीथेन जैसी गैसें पृथ्वी के वायुमंडल में सूर्य की गर्मी को फंसा लेती हैं।' },
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'climate-intermediate',
        name: { en: 'Intermediate', te: 'మధ్యస్థం', hi: 'मध्यवर्ती' },
        description: { en: 'Deeper climate understanding', te: 'వాతావరణం గురించి లోతైన అవగాహన', hi: 'जलवायु की गहरी समझ' },
        difficulty: 'intermediate',
        requiredScore: 70,
        isLocked: true,
        questions: [
          {
            id: 'c-i-1',
            type: 'mcq-single',
            question: { en: 'What is the Paris Agreement goal for limiting global warming?', te: 'గ్లోబల్ వార్మింగ్‌ను పరిమితం చేయడానికి పారిస్ ఒప్పందం లక్ష్యం ఏమిటి?', hi: 'ग्लोबल वार्मिंग को सीमित करने के लिए पेरिस समझौते का लक्ष्य क्या है?' },
            options: [
              { en: 'Below 5°C rise', te: '5°C పెరుగుదల కంటే తక్కువ', hi: '5°C वृद्धि से नीचे' },
              { en: 'Below 2°C, preferably 1.5°C', te: '2°C కంటే తక్కువ, ప్రాధాన్యంగా 1.5°C', hi: '2°C से नीचे, अधिमानतः 1.5°C' },
              { en: 'No limit set', te: 'ఎటువంటి పరిమితి లేదు', hi: 'कोई सीमा निर्धारित नहीं' },
              { en: 'Below 10°C rise', te: '10°C పెరుగుదల కంటే తక్కువ', hi: '10°C वृद्धि से नीचे' }
            ],
            correctAnswer: 1,
            explanation: { en: 'The Paris Agreement aims to limit warming to well below 2°C, and pursue efforts to limit it to 1.5°C above pre-industrial levels. Every fraction of a degree matters for preventing catastrophic impacts.', te: 'పారిస్ ఒప్పందం వేడెక్కడాన్ని 2°C కంటే తక్కువగా పరిమితం చేయాలని లక్ష్యంగా పెట్టుకుంది.', hi: 'पेरिस समझौते का लक्ष्य गर्माहट को 2°C से नीचे सीमित करना है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'c-i-2',
            type: 'mcq-multiple',
            question: { en: 'Select ALL major sources of greenhouse gas emissions:', te: 'గ్రీన్‌హౌస్ వాయు ఉద్గారాల యొక్క అన్ని ప్రధాన వనరులను ఎంచుకోండి:', hi: 'ग्रीनहाउस गैस उत्सर्जन के सभी प्रमुख स्रोतों का चयन करें:' },
            options: [
              { en: 'Electricity and heat production', te: 'విద్యుత్ మరియు ఉష్ణ ఉత్పత్తి', hi: 'बिजली और ताप उत्पादन' },
              { en: 'Transportation', te: 'రవాణా', hi: 'परिवहन' },
              { en: 'Agriculture and deforestation', te: 'వ్యవసాయం మరియు అడవుల నరికివేత', hi: 'कृषि और वनों की कटाई' },
              { en: 'Planting trees', te: 'చెట్లను నాటడం', hi: 'पेड़ लगाना' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Power generation, transportation, and agriculture/deforestation are major emission sources. Planting trees actually REDUCES emissions by absorbing CO₂. Industry and buildings also contribute significantly.', te: 'విద్యుత్ ఉత్పత్తి, రవాణా మరియు వ్యవసాయం/అడవుల నరికివేత ప్రధాన ఉద్గార వనరులు. చెట్లను నాటడం వాస్తవానికి CO₂ను గ్రహించడం ద్వారా ఉద్గారాలను తగ్గిస్తుంది.', hi: 'बिजली उत्पादन, परिवहन और कृषि/वनों की कटाई प्रमुख उत्सर्जन स्रोत हैं। पेड़ लगाना वास्तव में CO₂ अवशोषित करके उत्सर्जन कम करता है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'c-i-3',
            type: 'mcq-single',
            question: { en: 'What is a "carbon footprint"?', te: '"కార్బన్ ఫుట్‌ప్రింట్" అంటే ఏమిటి?', hi: '"कार्बन फुटप्रिंट" क्या है?' },
            options: [
              { en: 'Footprints made of charcoal', te: 'బొగ్గుతో చేసిన పాదముద్రలు', hi: 'चारकोल से बने पदचिह्न' },
              { en: 'Total greenhouse gases from a person or activity', te: 'ఒక వ్యక్తి లేదా కార్యకలాపం నుండి మొత్తం గ్రీన్‌హౌస్ వాయువులు', hi: 'किसी व्यक्ति या गतिविधि से कुल ग्रीनहाउस गैसें' },
              { en: 'The size of your feet', te: 'మీ పాదాల పరిమాణం', hi: 'आपके पैरों का आकार' },
              { en: 'How far you can walk', te: 'మీరు ఎంత దూరం నడవగలరు', hi: 'आप कितनी दूर चल सकते हैं' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Your carbon footprint is the total amount of greenhouse gases produced by your activities - from driving, electricity use, food choices, shopping, and more. The average person produces 4-8 tons of CO₂ annually.', te: 'మీ కార్బన్ ఫుట్‌ప్రింట్ అనేది మీ కార్యకలాపాల ద్వారా ఉత్పత్తి అయ్యే గ్రీన్‌హౌస్ వాయువుల మొత్తం మొత్తం.', hi: 'आपका कार्बन फुटप्रिंट आपकी गतिविधियों से उत्पन्न ग्रीनहाउस गैसों की कुल मात्रा है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'c-i-4',
            type: 'true-false',
            question: { en: 'Reducing meat consumption can help reduce your carbon footprint.', te: 'మాంసం వినియోగాన్ని తగ్గించడం మీ కార్బన్ ఫుట్‌ప్రింట్‌ను తగ్గించడంలో సహాయపడుతుంది.', hi: 'मांस की खपत कम करने से आपके कार्बन फुटप्रिंट को कम करने में मदद मिल सकती है।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Yes! Livestock farming produces about 14.5% of global greenhouse gas emissions through methane from digestion, land use, and feed production. Eating more plant-based foods can significantly reduce your environmental impact.', te: 'అవును! పశువుల పెంపకం జీర్ణక్రియ నుండి మీథేన్, భూమి వినియోగం మరియు దాణా ఉత్పత్తి ద్వారా ప్రపంచ గ్రీన్‌హౌస్ వాయు ఉద్గారాలలో సుమారు 14.5% ఉత్పత్తి చేస్తుంది.', hi: 'हाँ! पशुपालन पाचन से मीथेन, भूमि उपयोग और चारा उत्पादन के माध्यम से वैश्विक ग्रीनहाउस गैस उत्सर्जन का लगभग 14.5% उत्पन्न करता है।' },
            difficulty: 'intermediate'
          },
          {
            id: 'c-i-5',
            type: 'mcq-single',
            question: { en: 'What is "carbon neutrality" or "net zero"?', te: '"కార్బన్ న్యూట్రాలిటీ" లేదా "నెట్ జీరో" అంటే ఏమిటి?', hi: '"कार्बन न्यूट्रैलिटी" या "नेट जीरो" क्या है?' },
            options: [
              { en: 'Producing no carbon at all', te: 'కార్బన్ అస్సలు ఉత్పత్తి చేయకపోవడం', hi: 'बिल्कुल भी कार्बन नहीं पैदा करना' },
              { en: 'Balancing emissions with removal/offsets', te: 'తొలగింపు/ఆఫ్‌సెట్‌లతో ఉద్గారాలను సమతుల్యం చేయడం', hi: 'हटाने/ऑफसेट के साथ उत्सर्जन को संतुलित करना' },
              { en: 'Using only coal', te: 'కేవలం బొగ్గు మాత్రమే వాడటం', hi: 'केवल कोयले का उपयोग करना' },
              { en: 'Having zero weight', te: 'సున్నా బరువు కలిగి ఉండటం', hi: 'शून्य वजन होना' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Carbon neutrality means balancing the CO₂ you emit with an equal amount removed - through tree planting, carbon capture, or offsets. Many countries and companies have net zero targets for 2050.', te: 'కార్బన్ న్యూట్రాలిటీ అంటే మీరు విడుదల చేసే CO₂ను సమాన మొత్తంలో తొలగించడంతో సమతుల్యం చేయడం.', hi: 'कार्बन न्यूट्रैलिटी का मतलब है आप जो CO₂ उत्सर्जित करते हैं उसे समान मात्रा में हटाने के साथ संतुलित करना।' },
            difficulty: 'intermediate'
          },
          {
            id: 'c-i-6',
            type: 'mcq-single',
            question: { en: 'How does deforestation contribute to climate change?', te: 'అడవుల నరికివేత వాతావరణ మార్పుకు ఎలా దోహదం చేస్తుంది?', hi: 'वनों की कटाई जलवायु परिवर्तन में कैसे योगदान करती है?' },
            options: [
              { en: 'It doesn\'t affect climate', te: 'ఇది వాతావరణాన్ని ప్రభావితం చేయదు', hi: 'यह जलवायु को प्रभावित नहीं करता' },
              { en: 'Releases stored carbon and reduces CO₂ absorption', te: 'నిల్వ చేసిన కార్బన్‌ను విడుదల చేస్తుంది మరియు CO₂ గ్రహణాన్ని తగ్గిస్తుంది', hi: 'संग्रहीत कार्बन छोड़ता है और CO₂ अवशोषण कम करता है' },
              { en: 'Makes the climate cooler', te: 'వాతావరణాన్ని చల్లబరుస్తుంది', hi: 'जलवायु को ठंडा करता है' },
              { en: 'Creates more forests', te: 'మరిన్ని అడవులను సృష్టిస్తుంది', hi: 'अधिक वन बनाता है' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Deforestation is a double problem: cutting trees releases stored carbon (sometimes through burning), AND removes future capacity to absorb CO₂. Tropical deforestation alone accounts for about 10% of global emissions.', te: 'అడవుల నరికివేత ఒక డబుల్ సమస్య: చెట్లను నరకడం నిల్వ చేసిన కార్బన్‌ను విడుదల చేస్తుంది మరియు CO₂ను గ్రహించే భవిష్యత్ సామర్థ్యాన్ని తొలగిస్తుంది.', hi: 'वनों की कटाई एक दोहरी समस्या है: पेड़ काटने से संग्रहीत कार्बन निकलता है और CO₂ अवशोषित करने की भविष्य की क्षमता समाप्त हो जाती है।' },
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'climate-advanced',
        name: { en: 'Advanced', te: 'అధునాతన', hi: 'उन्नत' },
        description: { en: 'Expert climate science', te: 'నిపుణుల స్థాయి వాతావరణ శాస్త్రం', hi: 'विशेषज्ञ जलवायु विज्ञान' },
        difficulty: 'advanced',
        requiredScore: 70,
        isLocked: true,
        questions: [
          {
            id: 'c-a-1',
            type: 'mcq-single',
            question: { en: 'What are "tipping points" in climate science?', te: 'వాతావరణ శాస్త్రంలో "టిప్పింగ్ పాయింట్స్" అంటే ఏమిటి?', hi: 'जलवायु विज्ञान में "टिपिंग पॉइंट्स" क्या हैं?' },
            options: [
              { en: 'Highest points of mountains', te: 'పర్వతాల అత్యున్నత స్థానాలు', hi: 'पहाड़ों के सबसे ऊंचे बिंदु' },
              { en: 'Thresholds beyond which changes become irreversible', te: 'మార్పులు తిరిగి మార్చలేనివిగా మారే పరిమితులు', hi: 'सीमाएं जिनके बाद परिवर्तन अपरिवर्तनीय हो जाते हैं' },
              { en: 'Tips for recycling', te: 'రీసైక్లింగ్ కోసం చిట్కాలు', hi: 'रीसाइक्लिंग के टिप्स' },
              { en: 'Financial donation points', te: 'ఆర్థిక విరాళం పాయింట్లు', hi: 'वित्तीय दान बिंदु' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Climate tipping points are critical thresholds where small changes trigger large, often irreversible changes in Earth systems. Examples include ice sheet collapse, Amazon dieback, and permafrost thawing releasing methane. Once crossed, these changes are very difficult to reverse.', te: 'వాతావరణ టిప్పింగ్ పాయింట్స్ అనేవి చిన్న మార్పులు భూమి వ్యవస్థలలో పెద్ద, తరచుగా తిరిగి మార్చలేని మార్పులను ప్రేరేపించే క్లిష్టమైన పరిమితులు.', hi: 'जलवायु टिपिंग पॉइंट्स महत्वपूर्ण सीमाएं हैं जहां छोटे बदलाव पृथ्वी प्रणालियों में बड़े, अक्सर अपरिवर्तनीय परिवर्तन शुरू करते हैं।' },
            difficulty: 'advanced'
          },
          {
            id: 'c-a-2',
            type: 'mcq-multiple',
            question: { en: 'Which climate tipping points are scientists most concerned about? (Select ALL)', te: 'వాతావరణ టిప్పింగ్ పాయింట్స్ గురించి శాస్త్రవేత్తలు అత్యంత ఆందోళన చెందుతున్నారు? (అన్నీ ఎంచుకోండి)', hi: 'वैज्ञानिक किन जलवायु टिपिंग पॉइंट्स के बारे में सबसे चिंतित हैं? (सभी चुनें)' },
            options: [
              { en: 'Greenland ice sheet collapse', te: 'గ్రీన్‌ల్యాండ్ మంచు షీట్ కూలిపోవడం', hi: 'ग्रीनलैंड बर्फ की चादर का ढहना' },
              { en: 'Amazon rainforest dieback', te: 'అమెజాన్ వర్షారణ్యం వెనక్కి తగ్గడం', hi: 'अमेज़न वर्षावन का मरना' },
              { en: 'Permafrost thawing', te: 'పెర్మాఫ్రాస్ట్ కరగడం', hi: 'पर्माफ्रॉस्ट का पिघलना' },
              { en: 'More people buying electric cars', te: 'ఎక్కువ మంది ఎలక్ట్రిక్ కార్లు కొనడం', hi: 'अधिक लोगों द्वारा इलेक्ट्रिक कार खरीदना' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Scientists warn about ice sheet collapse (causing massive sea level rise), Amazon dieback (releasing carbon and reducing rainfall), and permafrost thawing (releasing trapped methane, a powerful greenhouse gas). Each could trigger cascading effects. Electric car adoption is a solution, not a tipping point.', te: 'శాస్త్రవేత్తలు మంచు షీట్ కూలిపోవడం, అమెజాన్ డైబ్యాక్ మరియు పెర్మాఫ్రాస్ట్ కరగడం గురించి హెచ్చరిస్తారు.', hi: 'वैज्ञानिक बर्फ की चादर के ढहने, अमेज़न के मरने और पर्माफ्रॉस्ट के पिघलने के बारे में चेतावनी देते हैं।' },
            difficulty: 'advanced'
          },
          {
            id: 'c-a-3',
            type: 'mcq-single',
            question: { en: 'What is "carbon sequestration"?', te: '"కార్బన్ సీక్వెస్ట్రేషన్" అంటే ఏమిటి?', hi: '"कार्बन सीक्वेस्ट्रेशन" क्या है?' },
            options: [
              { en: 'Burning carbon for energy', te: 'శక్తి కోసం కార్బన్‌ను కాల్చడం', hi: 'ऊर्जा के लिए कार्बन जलाना' },
              { en: 'Capturing and storing CO₂ long-term', te: 'CO₂ను దీర్ఘకాలంగా సంగ్రహించడం మరియు నిల్వ చేయడం', hi: 'CO₂ को दीर्घकालिक रूप से पकड़ना और संग्रहीत करना' },
              { en: 'Measuring carbon dioxide', te: 'కార్బన్ డయాక్సైడ్‌ను కొలవడం', hi: 'कार्बन डाइऑक्साइड मापना' },
              { en: 'Transporting coal', te: 'బొగ్గును రవాణా చేయడం', hi: 'कोयला परिवहन' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Carbon sequestration is capturing CO₂ from the atmosphere and storing it long-term. This happens naturally (forests, oceans, soil) and can be done technologically (carbon capture and storage). Both natural and technological solutions are needed to reach climate goals.', te: 'కార్బన్ సీక్వెస్ట్రేషన్ అనేది వాతావరణం నుండి CO₂ను సంగ్రహించి దీర్ఘకాలంగా నిల్వ చేయడం.', hi: 'कार्बन सीक्वेस्ट्रेशन वायुमंडल से CO₂ को पकड़कर दीर्घकालिक रूप से संग्रहीत करना है।' },
            difficulty: 'advanced'
          },
          {
            id: 'c-a-4',
            type: 'mcq-single',
            question: { en: 'How much has sea level risen since 1900, and what is projected by 2100?', te: '1900 నుండి సముద్ర మట్టం ఎంత పెరిగింది, మరియు 2100 నాటికి ఏమి అంచనా వేయబడింది?', hi: '1900 से समुद्र का स्तर कितना बढ़ा है, और 2100 तक क्या अनुमान है?' },
            options: [
              { en: '2 cm risen; 5 cm by 2100', te: '2 సెం.మీ పెరిగింది; 2100 నాటికి 5 సెం.మీ', hi: '2 सेमी बढ़ा; 2100 तक 5 सेमी' },
              { en: '20 cm risen; 30-100 cm by 2100', te: '20 సెం.మీ పెరిగింది; 2100 నాటికి 30-100 సెం.మీ', hi: '20 सेमी बढ़ा; 2100 तक 30-100 सेमी' },
              { en: '1 meter risen; 5 meters by 2100', te: '1 మీటర్ పెరిగింది; 2100 నాటికి 5 మీటర్లు', hi: '1 मीटर बढ़ा; 2100 तक 5 मीटर' },
              { en: 'Sea level has not changed', te: 'సముద్ర మట్టం మారలేదు', hi: 'समुद्र स्तर नहीं बदला है' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Sea level has risen about 20 cm since 1900, and is projected to rise 30-100 cm more by 2100 (depending on emissions). This threatens coastal cities, islands, and low-lying areas where billions of people live. Some projections are even higher with ice sheet instability.', te: '1900 నుండి సముద్ర మట్టం సుమారు 20 సెం.మీ పెరిగింది, మరియు 2100 నాటికి 30-100 సెం.మీ మరింత పెరుగుతుందని అంచనా.', hi: '1900 से समुद्र का स्तर लगभग 20 सेमी बढ़ा है, और 2100 तक 30-100 सेमी और बढ़ने का अनुमान है।' },
            difficulty: 'advanced'
          },
          {
            id: 'c-a-5',
            type: 'mcq-single',
            question: { en: 'What is "climate justice" and why is it important?', te: '"వాతావరణ న్యాయం" అంటే ఏమిటి మరియు ఇది ఎందుకు ముఖ్యమైనది?', hi: '"जलवायु न्याय" क्या है और यह महत्वपूर्ण क्यों है?' },
            options: [
              { en: 'Laws about weather prediction', te: 'వాతావరణ అంచనా గురించి చట్టాలు', hi: 'मौसम भविष्यवाणी के बारे में कानून' },
              { en: 'Addressing that climate impacts fall hardest on vulnerable populations', te: 'వాతావరణ ప్రభావాలు హాని కలిగించే జనాభాపై అత్యంత కఠినంగా పడతాయని పరిష్కరించడం', hi: 'जलवायु प्रभाव कमजोर आबादी पर सबसे अधिक पड़ता है इसे संबोधित करना' },
              { en: 'Courtrooms about pollution', te: 'కాలుష్యం గురించి కోర్టు గదులు', hi: 'प्रदूषण के बारे में अदालतें' },
              { en: 'Fair weather for everyone', te: 'అందరికీ అనుకూలమైన వాతావరణం', hi: 'सभी के लिए अच्छा मौसम' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Climate justice recognizes that those who have contributed least to climate change (low-income countries, marginalized communities) often suffer its worst impacts. It calls for fair solutions that protect vulnerable people and hold major emitters accountable.', te: 'వాతావరణ న్యాయం వాతావరణ మార్పుకు అతి తక్కువగా కృషి చేసినవారు తరచుగా దాని చెడ్డ ప్రభావాలను అనుభవిస్తారని గుర్తిస్తుంది.', hi: 'जलवायु न्याय मानता है कि जिन्होंने जलवायु परिवर्तन में सबसे कम योगदान दिया है वे अक्सर इसके सबसे बुरे प्रभाव झेलते हैं।' },
            difficulty: 'advanced'
          },
          {
            id: 'c-a-6',
            type: 'mcq-multiple',
            question: { en: 'A company claims to be "climate positive." What should this mean? (Select ALL)', te: 'ఒక కంపెనీ "క్లైమేట్ పాజిటివ్" అని చెప్పుకుంటుంది. దీని అర్థం ఏమిటి? (అన్నీ ఎంచుకోండి)', hi: 'एक कंपनी "क्लाइमेट पॉजिटिव" होने का दावा करती है। इसका क्या मतलब होना चाहिए? (सभी चुनें)' },
            options: [
              { en: 'Removes more carbon than it emits', te: 'విడుదల చేసే దాని కంటే ఎక్కువ కార్బన్‌ను తొలగిస్తుంది', hi: 'उत्सर्जित करने से अधिक कार्बन निकालता है' },
              { en: 'Helps the environment beyond just neutralizing impact', te: 'ప్రభావాన్ని తటస్థం చేయడం మాత్రమే కాకుండా పర్యావరణానికి సహాయపడుతుంది', hi: 'केवल प्रभाव को निष्क्रिय करने से परे पर्यावरण की मदद करता है' },
              { en: 'Invests in environmental restoration projects', te: 'పర్యావరణ పునరుద్ధరణ ప్రాజెక్టులలో పెట్టుబడి పెడుతుంది', hi: 'पर्यावरण पुनर्स्थापना परियोजनाओं में निवेश करता है' },
              { en: 'Simply uses green marketing', te: 'కేవలం హరిత మార్కెటింగ్ వాడుతుంది', hi: 'केवल ग्रीन मार्केटिंग का उपयोग करता है' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'True "climate positive" means removing more emissions than produced (going beyond carbon neutral), creating net environmental benefit, and investing in genuine restoration. Simply using green marketing without real action is "greenwashing" - a deceptive practice.', te: 'నిజమైన "క్లైమేట్ పాజిటివ్" అంటే ఉత్పత్తి చేసిన దాని కంటే ఎక్కువ ఉద్గారాలను తొలగించడం, నికర పర్యావరణ ప్రయోజనాన్ని సృష్టించడం మరియు నిజమైన పునరుద్ధరణలో పెట్టుబడి పెట్టడం.', hi: 'वास्तविक "क्लाइमेट पॉजिटिव" का अर्थ है उत्पादित से अधिक उत्सर्जन हटाना, शुद्ध पर्यावरणीय लाभ बनाना और वास्तविक पुनर्स्थापना में निवेश करना।' },
            difficulty: 'advanced'
          }
        ]
      }
    ]
  }
];

// Merged quiz topics (base + extra)
export const quizTopics: QuizTopic[] = [...baseQuizTopics, ...extraQuizTopics];

// Quiz progress interface for localStorage
export interface QuizProgress {
  topicId: string;
  levelId: string;
  completed: boolean;
  bestScore: number;
  attempts: number;
  unlockedLevels: string[];
  lastAttemptDate: string;
}

export interface DailyQuizChallenge {
  id: string;
  title: string;
  description: string;
  type: 'complete_quiz' | 'perfect_score' | 'complete_topic' | 'streak' | 'speed_run';
  target: number;
  reward: number;
  icon: string;
}

export interface DailyQuizProgress {
  date: string; // YYYY-MM-DD
  quizzesCompleted: number;
  perfectScores: number;
  topicsAttempted: string[];
  challengesCompleted: string[];
  totalPointsToday: number;
}

export interface UserQuizProgress {
  topics: { [topicId: string]: { [levelId: string]: QuizProgress } };
  totalScore: number;
  completedQuizzes: number;
  perfectScores: number;
  quizStreak: number;
  lastQuizDate: string;
  longestStreak: number;
  earnedBadges: string[];
  dailyProgress: DailyQuizProgress;
}

// Quiz Badge Definitions
export interface QuizBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: UserQuizProgress) => boolean;
}

export const quizBadges: QuizBadge[] = [
  {
    id: 'first_quiz',
    name: 'Quiz Beginner',
    description: 'Complete your first quiz',
    icon: '🎓',
    condition: (p) => p.completedQuizzes >= 1,
  },
  {
    id: 'quiz_explorer',
    name: 'Quiz Explorer',
    description: 'Complete 5 quizzes',
    icon: '🔍',
    condition: (p) => p.completedQuizzes >= 5,
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 15 quizzes',
    icon: '🏅',
    condition: (p) => p.completedQuizzes >= 15,
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '💯',
    condition: (p) => p.perfectScores >= 1,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get 5 perfect scores',
    icon: '⭐',
    condition: (p) => p.perfectScores >= 5,
  },
  {
    id: 'topic_master_plantation',
    name: 'Plantation Expert',
    description: 'Complete all Plantation levels',
    icon: '🌳',
    condition: (p) => {
      const topic = p.topics['plantation'];
      if (!topic) return false;
      return Object.values(topic).filter(l => l.completed).length >= 3;
    },
  },
  {
    id: 'topic_master_water',
    name: 'Water Guru',
    description: 'Complete all Water Conservation levels',
    icon: '💧',
    condition: (p) => {
      const topic = p.topics['water-conservation'];
      if (!topic) return false;
      return Object.values(topic).filter(l => l.completed).length >= 3;
    },
  },
  {
    id: 'topic_master_climate',
    name: 'Climate Champion',
    description: 'Complete all Climate Awareness levels',
    icon: '🌍',
    condition: (p) => {
      const topic = p.topics['climate-awareness'];
      if (!topic) return false;
      return Object.values(topic).filter(l => l.completed).length >= 3;
    },
  },
  {
    id: 'all_topics',
    name: 'Knowledge King',
    description: 'Complete all levels in all topics',
    icon: '👑',
    condition: (p) => {
      return quizTopics.every(topic => {
        const topicProgress = p.topics[topic.id];
        if (!topicProgress) return false;
        return topic.levels.every(level => topicProgress[level.id]?.completed);
      });
    },
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    description: '3-day quiz streak',
    icon: '🔥',
    condition: (p) => p.quizStreak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7-day quiz streak',
    icon: '⚡',
    condition: (p) => p.quizStreak >= 7,
  },
  {
    id: 'streak_30',
    name: 'Monthly Legend',
    description: '30-day quiz streak',
    icon: '🏆',
    condition: (p) => p.longestStreak >= 30,
  },
  {
    id: 'points_500',
    name: 'Point Collector',
    description: 'Earn 500 total quiz points',
    icon: '💎',
    condition: (p) => p.totalScore >= 500,
  },
  {
    id: 'points_2000',
    name: 'Point Legend',
    description: 'Earn 2000 total quiz points',
    icon: '🌟',
    condition: (p) => p.totalScore >= 2000,
  },
];

// Daily quiz challenges (rotate based on day)
export const dailyQuizChallenges: DailyQuizChallenge[] = [
  { id: 'dq1', title: 'Quick Learner', description: 'Complete 1 quiz today', type: 'complete_quiz', target: 1, reward: 10, icon: '📝' },
  { id: 'dq2', title: 'Quiz Champion', description: 'Complete 3 quizzes today', type: 'complete_quiz', target: 3, reward: 25, icon: '🏆' },
  { id: 'dq3', title: 'Perfect Run', description: 'Get a perfect score on any quiz', type: 'perfect_score', target: 1, reward: 30, icon: '💯' },
  { id: 'dq4', title: 'Topic Explorer', description: 'Attempt 2 different topics today', type: 'complete_topic', target: 2, reward: 20, icon: '🔍' },
  { id: 'dq5', title: 'Streak Builder', description: 'Maintain your daily streak', type: 'streak', target: 1, reward: 15, icon: '🔥' },
];

export const getTodaysChallenges = (): DailyQuizChallenge[] => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  // Pick 3 challenges that rotate daily
  const indices = [
    dayOfYear % dailyQuizChallenges.length,
    (dayOfYear + 1) % dailyQuizChallenges.length,
    (dayOfYear + 2) % dailyQuizChallenges.length,
  ];
  // Deduplicate
  const unique = [...new Set(indices)];
  return unique.map(i => dailyQuizChallenges[i]);
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Default progress structure
export const getDefaultProgress = (): UserQuizProgress => ({
  topics: {},
  totalScore: 0,
  completedQuizzes: 0,
  perfectScores: 0,
  quizStreak: 0,
  lastQuizDate: '',
  longestStreak: 0,
  earnedBadges: [],
  dailyProgress: {
    date: getTodayString(),
    quizzesCompleted: 0,
    perfectScores: 0,
    topicsAttempted: [],
    challengesCompleted: [],
    totalPointsToday: 0,
  },
});
