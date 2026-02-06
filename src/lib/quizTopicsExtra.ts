// Extra quiz topics: Biodiversity, Sustainable Living, Renewable Energy
import { QuizTopic } from './advancedQuizData';

export const extraQuizTopics: QuizTopic[] = [
  {
    id: 'biodiversity',
    name: { en: 'Biodiversity', te: 'జీవవైవిధ్యం', hi: 'जैव विविधता' },
    description: { en: 'Explore the variety of life on Earth', te: 'భూమిపై జీవ వైవిధ్యాన్ని అన్వేషించండి', hi: 'पृथ्वी पर जीवन की विविधता का अन्वेषण करें' },
    icon: '🦋',
    color: 'bg-emerald-500',
    levels: [
      {
        id: 'bio-beginner',
        name: { en: 'Beginner', te: 'ప్రారంభికులు', hi: 'शुरुआती' },
        description: { en: 'What is biodiversity?', te: 'జీవవైవిధ్యం అంటే ఏమిటి?', hi: 'जैव विविधता क्या है?' },
        difficulty: 'beginner',
        requiredScore: 70,
        isLocked: false,
        questions: [
          {
            id: 'bio-b-1', type: 'mcq-single', difficulty: 'beginner',
            question: { en: 'What does "biodiversity" mean?', te: '"జీవవైవిధ్యం" అంటే ఏమిటి?', hi: '"जैव विविधता" का क्या अर्थ है?' },
            options: [
              { en: 'Only the number of animals', te: 'జంతువుల సంఖ్య మాత్రమే', hi: 'केवल जानवरों की संख्या' },
              { en: 'The variety of all living things', te: 'అన్ని జీవుల వైవిధ్యం', hi: 'सभी जीवित चीजों की विविधता' },
              { en: 'Types of rocks on Earth', te: 'భూమిపై రాళ్ల రకాలు', hi: 'पृथ्वी पर चट्टानों के प्रकार' },
              { en: 'The study of biology', te: 'జీవశాస్త్ర అధ్యయనం', hi: 'जीव विज्ञान का अध्ययन' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Biodiversity means the variety of all life forms on Earth – plants, animals, fungi, and microorganisms – as well as the ecosystems they create.', te: 'జీవవైవిధ్యం అంటే భూమిపై ఉన్న అన్ని జీవ రూపాల వైవిధ్యం.', hi: 'जैव विविधता का अर्थ है पृथ्वी पर सभी जीवन रूपों की विविधता।' }
          },
          {
            id: 'bio-b-2', type: 'true-false', difficulty: 'beginner',
            question: { en: 'Insects are the largest group of animals on Earth.', te: 'కీటకాలు భూమిపై అతి పెద్ద జంతు సమూహం.', hi: 'कीड़े पृथ्वी पर जानवरों का सबसे बड़ा समूह हैं।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'True! There are over 1 million known insect species, making up about 80% of all known animal species. Scientists believe millions more are undiscovered.', te: 'నిజం! 1 మిలియన్ కంటే ఎక్కువ తెలిసిన కీటక జాతులు ఉన్నాయి.', hi: 'सच! 1 मिलियन से अधिक ज्ञात कीट प्रजातियां हैं।' }
          },
          {
            id: 'bio-b-3', type: 'mcq-single', difficulty: 'beginner',
            question: { en: 'Which country is known as a "megadiverse" nation?', te: 'ఏ దేశాన్ని "మెగాడైవర్స్" దేశం అని పిలుస్తారు?', hi: 'किस देश को "मेगाडायवर्स" राष्ट्र कहा जाता है?' },
            options: [
              { en: 'Iceland', te: 'ఐస్‌ల్యాండ్', hi: 'आइसलैंड' },
              { en: 'India', te: 'భారతదేశం', hi: 'भारत' },
              { en: 'Canada', te: 'కెనడా', hi: 'कनाडा' },
              { en: 'Norway', te: 'నార్వే', hi: 'नॉर्वे' }
            ],
            correctAnswer: 1,
            explanation: { en: 'India is one of 17 megadiverse countries, home to 7-8% of all recorded species. It has diverse ecosystems from Himalayan peaks to tropical rainforests.', te: 'భారతదేశం 17 మెగాడైవర్స్ దేశాలలో ఒకటి.', hi: 'भारत 17 मेगाडायवर्स देशों में से एक है।' }
          },
          {
            id: 'bio-b-4', type: 'true-false', difficulty: 'beginner',
            question: { en: 'Bees are important for pollinating many food crops.', te: 'తేనెటీగలు అనేక ఆహార పంటలను పరాగసంపర్కం చేయడంలో ముఖ్యమైనవి.', hi: 'मधुमक्खियां कई खाद्य फसलों के परागण के लिए महत्वपूर्ण हैं।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झూठ' }],
            correctAnswer: 0,
            explanation: { en: 'Yes! Bees pollinate about 75% of the world\'s food crops. Without pollinators, we would lose many fruits, vegetables, and nuts from our diet.', te: 'అవును! తేనెటీగలు ప్రపంచ ఆహార పంటలలో సుమారు 75% పరాగసంపర్కం చేస్తాయి.', hi: 'हाँ! मधुमक्खियां दुनिया की लगभग 75% खाद्य फसलों का परागण करती हैं।' }
          },
          {
            id: 'bio-b-5', type: 'mcq-single', difficulty: 'beginner',
            question: { en: 'What is an "endangered species"?', te: '"అంతరించిపోతున్న జాతి" అంటే ఏమిటి?', hi: '"लुप्तप्राय प्रजाति" क्या है?' },
            options: [
              { en: 'A species that is very common', te: 'చాలా సాధారణమైన జాతి', hi: 'एक प्रजाति जो बहुत आम है' },
              { en: 'A species at risk of going extinct', te: 'అంతరించిపోయే ప్రమాదంలో ఉన్న జాతి', hi: 'एक प्रजाति जो विलुप्त होने के खतरे में है' },
              { en: 'A new species discovered', te: 'కొత్తగా కనుగొన్న జాతి', hi: 'एक नई खोजी गई प्रजाति' },
              { en: 'A species that lives in danger zones', te: 'ప్రమాద మండలాల్లో నివసించే జాతి', hi: 'एक प्रजाति जो खतरनाक क्षेत्रों में रहती है' }
            ],
            correctAnswer: 1,
            explanation: { en: 'An endangered species faces a high risk of extinction. Examples include Bengal tigers, snow leopards, and Indian rhinoceros. Conservation efforts help protect them.', te: 'అంతరించిపోతున్న జాతి అంతరించిపోయే ప్రమాదం ఎక్కువగా ఉంది.', hi: 'एक लुप्तप्राय प्रजाति को विलुप्त होने का उच्च जोखिम है।' }
          },
          {
            id: 'bio-b-6', type: 'mcq-single', difficulty: 'beginner',
            question: { en: 'What is a "habitat"?', te: '"ఆవాసం" అంటే ఏమిటి?', hi: '"आवास" क्या है?' },
            options: [
              { en: 'A type of animal', te: 'ఒక రకమైన జంతువు', hi: 'एक प्रकार का जानवर' },
              { en: 'The natural home of a living thing', te: 'ఒక జీవి యొక్క సహజ నివాసం', hi: 'किसी जीव का प्राकृतिक घर' },
              { en: 'A zoo enclosure', te: 'ఒక జూ ఎన్‌క్లోజర్', hi: 'एक चिड़ियाघर का बाड़ा' },
              { en: 'A type of plant', te: 'ఒక రకమైన మొక్క', hi: 'एक प्रकार का पौधा' }
            ],
            correctAnswer: 1,
            explanation: { en: 'A habitat is the natural environment where an organism lives. It provides food, water, shelter, and space. Forests, wetlands, deserts, and oceans are all habitats.', te: 'ఆవాసం అనేది ఒక జీవి నివసించే సహజ వాతావరణం.', hi: 'आवास वह प्राकृतिक वातावरण है जहां कोई जीव रहता है।' }
          }
        ]
      },
      {
        id: 'bio-intermediate',
        name: { en: 'Intermediate', te: 'మధ్యస్థం', hi: 'मध्यवर्ती' },
        description: { en: 'Ecosystems and threats', te: 'పర్యావరణ వ్యవస్థలు మరియు బెదిరింపులు', hi: 'पारिस्थितिकी तंत्र और खतरे' },
        difficulty: 'intermediate',
        requiredScore: 70,
        isLocked: true,
        questions: [
          {
            id: 'bio-i-1', type: 'mcq-multiple', difficulty: 'intermediate',
            question: { en: 'Select ALL major threats to biodiversity:', te: 'జీవవైవిధ్యానికి ప్రధాన బెదిరింపులన్నింటిని ఎంచుకోండి:', hi: 'जैव विविधता के सभी प्रमुख खतरों का चयन करें:' },
            options: [
              { en: 'Habitat destruction', te: 'ఆవాస విధ్వంసం', hi: 'आवास विनाश' },
              { en: 'Climate change', te: 'వాతావరణ మార్పు', hi: 'जलवायु परिवर्तन' },
              { en: 'Invasive species', te: 'ఆక్రమణ జాతులు', hi: 'आक्रामक प्रजातियां' },
              { en: 'Planting native trees', te: 'స్థానిక చెట్లను నాటడం', hi: 'देशी पेड़ लगाना' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Habitat loss, climate change, and invasive species are the biggest threats. Planting native trees actually helps biodiversity by restoring natural habitats.', te: 'ఆవాస నష్టం, వాతావరణ మార్పు మరియు ఆక్రమణ జాతులు అతిపెద్ద బెదిరింపులు.', hi: 'आवास हानि, जलवायु परिवर्तन और आक्रामक प्रजातियां सबसे बड़े खतरे हैं।' }
          },
          {
            id: 'bio-i-2', type: 'mcq-single', difficulty: 'intermediate',
            question: { en: 'What is a "keystone species"?', te: '"కీస్టోన్ స్పీషీస్" అంటే ఏమిటి?', hi: '"कीस्टोन स्पीशीज़" क्या है?' },
            options: [
              { en: 'The largest species in an ecosystem', te: 'పర్యావరణ వ్యవస్థలో అతిపెద్ద జాతి', hi: 'पारिस्थितिकी तंत्र में सबसे बड़ी प्रजाति' },
              { en: 'A species whose impact is disproportionately large', te: 'ప్రభావం అసమానంగా పెద్దది అయిన జాతి', hi: 'एक प्रजाति जिसका प्रभाव असमान रूप से बड़ा है' },
              { en: 'Any endangered species', te: 'ఏదైనా అంతరించిపోతున్న జాతి', hi: 'कोई भी लुप्तप्राय प्रजाति' },
              { en: 'The first species in an area', te: 'ఒక ప్రాంతంలో మొదటి జాతి', hi: 'किसी क्षेत्र में पहली प्रजाति' }
            ],
            correctAnswer: 1,
            explanation: { en: 'A keystone species has a disproportionately large effect on its ecosystem relative to its abundance. Removing it would drastically change the ecosystem. Examples: wolves, sea otters, bees.', te: 'కీస్టోన్ స్పీషీస్ దాని సమృద్ధికి సంబంధించి పర్యావరణ వ్యవస్థపై అసమానంగా పెద్ద ప్రభావాన్ని కలిగి ఉంటుంది.', hi: 'कीस्टोन स्पीशीज़ का अपनी बहुतायत के सापेक्ष पारिस्थितिकी तंत्र पर असमान रूप से बड़ा प्रभाव होता है।' }
          },
          {
            id: 'bio-i-3', type: 'mcq-single', difficulty: 'intermediate',
            question: { en: 'What is the current rate of species extinction compared to the natural rate?', te: 'ప్రస్తుత జాతుల అంతరించిపోయే రేటు సహజ రేటుతో పోలిస్తే ఎంత?', hi: 'प्राकृतिक दर की तुलना में प्रजातियों के विलुप्त होने की वर्तमान दर क्या है?' },
            options: [
              { en: 'Same as natural rate', te: 'సహజ రేటుతో సమానం', hi: 'प्राकृतिक दर के समान' },
              { en: '10 times faster', te: '10 రెట్లు వేగంగా', hi: '10 गुना तेज' },
              { en: '100-1000 times faster', te: '100-1000 రెట్లు వేగంగా', hi: '100-1000 गुना तेज' },
              { en: '2 times faster', te: '2 రెట్లు వేగంగా', hi: '2 गुना तेज' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Species are going extinct 100-1000 times faster than the natural background rate. This is sometimes called the "sixth mass extinction" driven primarily by human activities.', te: 'జాతులు సహజ రేటు కంటే 100-1000 రెట్లు వేగంగా అంతరించిపోతున్నాయి.', hi: 'प्रजातियां प्राकृतिक दर से 100-1000 गुना तेजी से विलुप्त हो रही हैं।' }
          },
          {
            id: 'bio-i-4', type: 'true-false', difficulty: 'intermediate',
            question: { en: 'Coral reefs support about 25% of all marine species despite covering less than 1% of the ocean floor.', te: 'పగడపు దిబ్బలు సముద్ర అడుగుభాగంలో 1% కంటే తక్కువ కప్పినప్పటికీ అన్ని సముద్ర జాతులలో సుమారు 25% మద్దతు ఇస్తాయి.', hi: 'प्रवाल भित्तियां समुद्र तल के 1% से कम को कवर करने के बावजूद सभी समुद्री प्रजातियों का लगभग 25% समर्थन करती हैं।' },
            options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }],
            correctAnswer: 0,
            explanation: { en: 'Coral reefs are the "rainforests of the sea." Despite their small area, they support an incredible diversity of marine life, from tiny shrimp to large sharks.', te: 'పగడపు దిబ్బలు "సముద్రపు వర్షారణ్యాలు."', hi: 'प्रवाल भित्तियां "समुद्र के वर्षावन" हैं।' }
          },
          {
            id: 'bio-i-5', type: 'mcq-single', difficulty: 'intermediate',
            question: { en: 'What is "endemic species"?', te: '"ఎండెమిక్ స్పీషీస్" అంటే ఏమిటి?', hi: '"स्थानिक प्रजाति" क्या है?' },
            options: [
              { en: 'A species found all over the world', te: 'ప్రపంచం అంతటా కనిపించే జాతి', hi: 'दुनिया भर में पाई जाने वाली प्रजाति' },
              { en: 'A species found only in one specific area', te: 'ఒక నిర్దిష్ట ప్రాంతంలో మాత్రమే కనిపించే జాతి', hi: 'केवल एक विशिष्ट क्षेत्र में पाई जाने वाली प्रजाति' },
              { en: 'A dangerous species', te: 'ప్రమాదకరమైన జాతి', hi: 'एक खतरनाक प्रजाति' },
              { en: 'A newly evolved species', te: 'కొత్తగా పరిణామం చెందిన జాతి', hi: 'एक नई विकसित प्रजाति' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Endemic species are found nowhere else on Earth. For example, the lion-tailed macaque is endemic to the Western Ghats of India. Their restricted range makes them especially vulnerable.', te: 'ఎండెమిక్ జాతులు భూమిపై మరెక్కడా కనిపించవు.', hi: 'स्थानिक प्रजातियां पृथ्वी पर कहीं और नहीं पाई जाती हैं।' }
          },
          {
            id: 'bio-i-6', type: 'mcq-single', difficulty: 'intermediate',
            question: { en: 'Which ecosystem has the highest biodiversity?', te: 'ఏ పర్యావరణ వ్యవస్థ అత్యధిక జీవవైవిధ్యాన్ని కలిగి ఉంది?', hi: 'किस पारिस्थितिकी तंत्र में सबसे अधिक जैव विविधता है?' },
            options: [
              { en: 'Desert', te: 'ఎడారి', hi: 'रेगिस्तान' },
              { en: 'Tropical rainforest', te: 'ఉష్ణమండల వర్షారణ్యం', hi: 'उष्णकटिबंधीय वर्षावन' },
              { en: 'Tundra', te: 'టుండ్రా', hi: 'टुंड्रा' },
              { en: 'Grassland', te: 'గడ్డి భూమి', hi: 'घास का मैदान' }
            ],
            correctAnswer: 1,
            explanation: { en: 'Tropical rainforests cover only 6% of Earth\'s surface but contain more than half of all plant and animal species. The Amazon alone has over 10% of all species on Earth.', te: 'ఉష్ణమండల వర్షారణ్యాలు భూమి ఉపరితలంలో కేవలం 6% కప్పుతాయి కానీ అన్ని మొక్కల మరియు జంతు జాతులలో సగానికి పైగా కలిగి ఉంటాయి.', hi: 'उष्णकटिबंधीय वर्षावन पृथ्वी की सतह का केवल 6% कवर करते हैं लेकिन सभी पौधों और जानवरों की प्रजातियों का आधे से अधिक हिस्सा रखते हैं।' }
          }
        ]
      },
      {
        id: 'bio-advanced',
        name: { en: 'Advanced', te: 'అధునాతన', hi: 'उन्नत' },
        description: { en: 'Conservation science', te: 'సంరక్షణ శాస్త్రం', hi: 'संरक्षण विज्ञान' },
        difficulty: 'advanced',
        requiredScore: 70,
        isLocked: true,
        questions: [
          {
            id: 'bio-a-1', type: 'mcq-single', difficulty: 'advanced',
            question: { en: 'What percentage of the world\'s species are estimated to be still undiscovered?', te: 'ప్రపంచ జాతులలో ఎంత శాతం ఇంకా కనుగొనబడలేదని అంచనా?', hi: 'दुनिया की कितनी प्रतिशत प्रजातियां अभी भी अनदेखी हैं?' },
            options: [
              { en: 'About 5%', te: 'సుమారు 5%', hi: 'लगभग 5%' },
              { en: 'About 25%', te: 'సుమారు 25%', hi: 'लगभग 25%' },
              { en: 'About 80%', te: 'సుమారు 80%', hi: 'लगभग 80%' },
              { en: 'About 50%', te: 'సుమారు 50%', hi: 'लगभग 50%' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Scientists estimate about 8.7 million species exist, but only about 1.5 million have been identified – meaning about 80% are still undiscovered! Many may go extinct before being found.', te: 'సుమారు 8.7 మిలియన్ జాతులు ఉన్నాయని శాస్త్రవేత్తలు అంచనా వేస్తారు, కానీ కేవలం 1.5 మిలియన్ మాత్రమే గుర్తించబడ్డాయి.', hi: 'वैज्ञानिकों का अनुमान है कि लगभग 8.7 मिलियन प्रजातियां मौजूद हैं, लेकिन केवल 1.5 मिलियन की पहचान हुई है।' }
          },
          {
            id: 'bio-a-2', type: 'mcq-multiple', difficulty: 'advanced',
            question: { en: 'Select ALL ecosystem services that biodiversity provides:', te: 'జీవవైవిధ్యం అందించే అన్ని పర్యావరణ సేవలను ఎంచుకోండి:', hi: 'जैव विविधता द्वारा प्रदान की जाने वाली सभी पारिस्थितिकी तंत्र सेवाओं का चयन करें:' },
            options: [
              { en: 'Clean air and water purification', te: 'శుభ్రమైన గాలి మరియు నీటి శుద్ధీకరణ', hi: 'स्वच्छ हवा और जल शुद्धिकरण' },
              { en: 'Pollination and food production', te: 'పరాగసంపర్కం మరియు ఆహార ఉత్పత్తి', hi: 'परागण और खाद्य उत्पादन' },
              { en: 'Medicine development from natural sources', te: 'సహజ వనరుల నుండి ఔషధ అభివృద్ధి', hi: 'प्राकृतिक स्रोतों से दवा विकास' },
              { en: 'Internet connectivity', te: 'ఇంటర్నెట్ కనెక్టివిటీ', hi: 'इंटरनेट कनेक्टिविटी' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Biodiversity provides essential services: wetlands purify water, forests clean air, insects pollinate crops, and over 50% of modern medicines are derived from natural sources. Internet connectivity is technology-based.', te: 'జీవవైవిధ్యం అవసరమైన సేవలను అందిస్తుంది.', hi: 'जैव विविधता आवश्यक सेवाएं प्रदान करती है।' }
          },
          {
            id: 'bio-a-3', type: 'mcq-single', difficulty: 'advanced',
            question: { en: 'What is the economic value of ecosystem services provided by biodiversity globally per year?', te: 'ప్రపంచవ్యాప్తంగా జీవవైవిధ్యం అందించే పర్యావరణ సేవల ఆర్థిక విలువ సంవత్సరానికి ఎంత?', hi: 'विश्व स्तर पर जैव विविधता द्वारा प्रदान की जाने वाली पारिस्थितिकी तंत्र सेवाओं का आर्थिक मूल्य प्रति वर्ष कितना है?' },
            options: [
              { en: '$1 billion', te: '$1 బిలియన్', hi: '$1 अरब' },
              { en: '$100 billion', te: '$100 బిలియన్', hi: '$100 अरब' },
              { en: '$33 trillion+', te: '$33 ట్రిలియన్+', hi: '$33 ट्रिलियन+' },
              { en: '$1 trillion', te: '$1 ట్రిలియన్', hi: '$1 ट्रिलियन' }
            ],
            correctAnswer: 2,
            explanation: { en: 'Global ecosystem services are valued at over $33 trillion per year – more than the GDP of the USA and China combined! This includes pollination, water filtration, carbon storage, and flood control.', te: 'ప్రపంచ పర్యావరణ సేవలు సంవత్సరానికి $33 ట్రిలియన్లకు పైగా విలువైనవి.', hi: 'वैश्विक पारिस्थितिकी तंत्र सेवाओं का मूल्य प्रति वर्ष $33 ट्रिलियन से अधिक है।' }
          },
          {
            id: 'bio-a-4', type: 'mcq-single', difficulty: 'advanced',
            question: { en: 'India is home to how many of the world\'s 36 biodiversity hotspots?', te: 'ప్రపంచంలోని 36 జీవవైవిధ్య హాట్‌స్పాట్‌లలో భారతదేశంలో ఎన్ని ఉన్నాయి?', hi: 'दुनिया के 36 जैव विविधता हॉटस्पॉट में से भारत में कितने हैं?' },
            options: [
              { en: '1', te: '1', hi: '1' },
              { en: '2', te: '2', hi: '2' },
              { en: '4', te: '4', hi: '4' },
              { en: '6', te: '6', hi: '6' }
            ],
            correctAnswer: 2,
            explanation: { en: 'India has 4 biodiversity hotspots: Western Ghats, Eastern Himalayas, Indo-Burma region, and Sundaland (Nicobar Islands). These areas have high species richness and high levels of threat.', te: 'భారతదేశంలో 4 జీవవైవిధ్య హాట్‌స్పాట్‌లు ఉన్నాయి: పశ్చిమ కనుమలు, తూర్పు హిమాలయాలు, ఇండో-బర్మా ప్రాంతం మరియు సుండాల్యాండ్.', hi: 'भारत में 4 जैव विविधता हॉटस्पॉट हैं: पश्चिमी घाट, पूर्वी हिमालय, इंडो-बर्मा क्षेत्र और सुंडालैंड।' }
          },
          {
            id: 'bio-a-5', type: 'mcq-single', difficulty: 'advanced',
            question: { en: 'What percentage of the world\'s mangrove forests has been lost in the last 50 years?', te: 'గత 50 సంవత్సరాలలో ప్రపంచ మడ అడవులలో ఎంత శాతం నష్టపోయింది?', hi: 'पिछले 50 वर्षों में दुनिया के कितने प्रतिशत मैंग्रोव वन नष्ट हो गए हैं?' },
            options: [
              { en: '5%', te: '5%', hi: '5%' },
              { en: '15%', te: '15%', hi: '15%' },
              { en: '35-50%', te: '35-50%', hi: '35-50%' },
              { en: '90%', te: '90%', hi: '90%' }
            ],
            correctAnswer: 2,
            explanation: { en: 'About 35-50% of mangroves have been lost to development, aquaculture, and pollution. Mangroves protect coastlines, store carbon, and serve as nurseries for marine life.', te: 'అభివృద్ధి, జలచరాల పెంపకం మరియు కాలుష్యం వల్ల సుమారు 35-50% మడ అడవులు నష్టమయ్యాయి.', hi: 'विकास, जलकृषि और प्रदूषण के कारण लगभग 35-50% मैंग्रोव नष्ट हो गए हैं।' }
          },
          {
            id: 'bio-a-6', type: 'mcq-multiple', difficulty: 'advanced',
            question: { en: 'Select ALL effective strategies for biodiversity conservation:', te: 'జీవవైవిధ్య సంరక్షణ కోసం సమర్థవంతమైన అన్ని వ్యూహాలను ఎంచుకోండి:', hi: 'जैव विविधता संरक्षण के सभी प्रभावी रणनीतियों का चयन करें:' },
            options: [
              { en: 'Creating wildlife corridors between protected areas', te: 'రక్షిత ప్రాంతాల మధ్య వన్యప్రాణి కారిడార్లను సృష్టించడం', hi: 'संरक्षित क्षेत्रों के बीच वन्यजीव गलियारे बनाना' },
              { en: 'Community-based conservation programs', te: 'సమాజ ఆధారిత సంరక్షణ కార్యక్రమాలు', hi: 'समुदाय-आधारित संरक्षण कार्यक्रम' },
              { en: 'Seed banks and genetic preservation', te: 'విత్తన బ్యాంకులు మరియు జన్యు సంరక్షణ', hi: 'बीज बैंक और आनुवंशिक संरक्षण' },
              { en: 'Introducing non-native species everywhere', te: 'ప్రతిచోటా స్థానికేతర జాతులను ప్రవేశపెట్టడం', hi: 'हर जगह गैर-मूल प्रजातियां लाना' }
            ],
            correctAnswer: [0, 1, 2],
            explanation: { en: 'Wildlife corridors, community programs, and seed banks all effectively protect biodiversity. Introducing non-native species is one of the biggest THREATS to biodiversity – it\'s the opposite of conservation!', te: 'వన్యప్రాణి కారిడార్లు, సమాజ కార్యక్రమాలు మరియు విత్తన బ్యాంకులు అన్నీ జీవవైవిధ్యాన్ని సమర్థవంతంగా రక్షిస్తాయి.', hi: 'वन्यजीव गलियारे, सामुदायिक कार्यक्रम और बीज बैंक सभी प्रभावी रूप से जैव विविधता की रक्षा करते हैं।' }
          }
        ]
      }
    ]
  },
  {
    id: 'sustainable-living',
    name: { en: 'Sustainable Living', te: 'స్థిరమైన జీవనం', hi: 'सतत जीवन' },
    description: { en: 'Learn eco-friendly daily habits', te: 'పర్యావరణ అనుకూల దైనందిన అలవాట్లు నేర్చుకోండి', hi: 'पर्यावरण-अनुकूल दैनिक आदतें सीखें' },
    icon: '♻️',
    color: 'bg-teal-500',
    levels: [
      {
        id: 'sustain-beginner',
        name: { en: 'Beginner', te: 'ప్రారంభికులు', hi: 'शुरुआती' },
        description: { en: 'Green habits basics', te: 'పచ్చని అలవాట్ల ప్రాథమికాలు', hi: 'हरी आदतों की मूल बातें' },
        difficulty: 'beginner', requiredScore: 70, isLocked: false,
        questions: [
          { id: 'sl-b-1', type: 'mcq-single', difficulty: 'beginner', question: { en: 'Which of these is the best way to reduce plastic waste?', te: 'ప్లాస్టిక్ వ్యర్థాలను తగ్గించడానికి ఉత్తమ మార్గం ఏది?', hi: 'प्लास्टिक कचरा कम करने का सबसे अच्छा तरीका कौन सा है?' }, options: [{ en: 'Use cloth bags instead of plastic', te: 'ప్లాస్టిక్ బదులు గుడ్డ సంచులు వాడండి', hi: 'प्लास्टिक के बजाय कपड़े के बैग उपयोग करें' }, { en: 'Burn plastic waste', te: 'ప్లాస్టిక్ వ్యర్థాలను కాల్చడం', hi: 'प्लास्टिक कचरा जलाना' }, { en: 'Throw it in rivers', te: 'నదులలో పడేయడం', hi: 'नदियों में फेंकना' }, { en: 'Bury it underground', te: 'భూమిలో పూడ్చడం', hi: 'जमीन में दबाना' }], correctAnswer: 0, explanation: { en: 'Reusable cloth bags are the best alternative. Burning plastic releases toxic fumes, and dumping pollutes waterways and soil. Reduce, Reuse, Recycle!', te: 'పునర్వినియోగ గుడ్డ సంచులు ఉత్తమ ప్రత్యామ్నాయం.', hi: 'पुन: प्रयोज्य कपड़े के बैग सबसे अच्छा विकल्प हैं।' } },
          { id: 'sl-b-2', type: 'true-false', difficulty: 'beginner', question: { en: 'Composting food waste at home reduces greenhouse gas emissions.', te: 'ఇంట్లో ఆహార వ్యర్థాలను కంపోస్ట్ చేయడం గ్రీన్‌హౌస్ వాయు ఉద్గారాలను తగ్గిస్తుంది.', hi: 'घर पर खाद्य अपशिष्ट की खाद बनाने से ग्रीनहाउस गैस उत्सर्जन कम होता है।' }, options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }], correctAnswer: 0, explanation: { en: 'When food waste goes to landfills, it produces methane – a powerful greenhouse gas. Composting at home turns waste into nutrient-rich soil and avoids methane production.', te: 'ఆహార వ్యర్థాలు భూపూరక ప్రదేశాలకు వెళ్ళినప్పుడు, అవి మీథేన్‌ను ఉత్పత్తి చేస్తాయి.', hi: 'जब खाद्य अपशिष्ट लैंडफिल में जाता है, तो यह मीथेन पैदा करता है।' } },
          { id: 'sl-b-3', type: 'mcq-single', difficulty: 'beginner', question: { en: 'Which uses less energy: LED bulbs or incandescent bulbs?', te: 'తక్కువ శక్తిని వాడేది ఏది: LED బల్బులు లేదా ఇన్‌కాండెసెంట్ బల్బులు?', hi: 'कम ऊर्जा किसमें लगती है: LED बल्ब या तापदीप्त बल्ब?' }, options: [{ en: 'LED bulbs', te: 'LED బల్బులు', hi: 'LED बल्ब' }, { en: 'Incandescent bulbs', te: 'ఇన్‌కాండెసెంట్ బల్బులు', hi: 'तापदीप्त बल्ब' }, { en: 'Both use the same', te: 'రెండూ సమానం', hi: 'दोनों समान' }, { en: 'Neither uses energy', te: 'ఏదీ శక్తిని వాడదు', hi: 'दोनों ऊर्जा नहीं उपयोग करते' }], correctAnswer: 0, explanation: { en: 'LED bulbs use up to 75% less energy than incandescent bulbs and last 25 times longer! Switching is one of the easiest energy-saving changes.', te: 'LED బల్బులు ఇన్‌కాండెసెంట్ బల్బుల కంటే 75% తక్కువ శక్తిని వాడతాయి.', hi: 'LED बल्ब तापदीप्त बल्बों से 75% कम ऊर्जा उपयोग करते हैं।' } },
          { id: 'sl-b-4', type: 'mcq-single', difficulty: 'beginner', question: { en: 'What does the "3 Rs" stand for in waste management?', te: 'వ్యర్థ నిర్వహణలో "3 Rs" అంటే ఏమిటి?', hi: 'अपशिष्ट प्रबंधन में "3 Rs" का क्या मतलब है?' }, options: [{ en: 'Reduce, Reuse, Recycle', te: 'తగ్గించు, పునర్వినియోగించు, రీసైకిల్ చేయి', hi: 'कम करो, पुन: उपयोग करो, रीसाइकल करो' }, { en: 'Read, Run, Relax', te: 'చదువు, పరుగెత్తు, విశ్రాంతి', hi: 'पढ़ो, दौड़ो, आराम करो' }, { en: 'Remove, Replace, Repair', te: 'తీసివేయి, భర్తీ చేయి, బాగుచేయి', hi: 'हटाओ, बदलो, मरम्मत करो' }, { en: 'Rest, Restore, Renew', te: 'విశ్రాంతి, పునరుద్ధరించు, నవీకరించు', hi: 'आराम करो, पुनर्स्थापित करो, नवीकरण करो' }], correctAnswer: 0, explanation: { en: 'Reduce (use less), Reuse (use again), Recycle (make into something new). This hierarchy prioritizes prevention of waste first, which has the biggest environmental impact.', te: 'తగ్గించు (తక్కువ వాడు), పునర్వినియోగించు (మళ్ళీ వాడు), రీసైకిల్ చేయి (కొత్తది తయారు చేయి).', hi: 'कम करो (कम उपयोग करो), पुन: उपयोग करो (फिर से उपयोग करो), रीसाइकल करो (नई चीज बनाओ)।' } },
          { id: 'sl-b-5', type: 'true-false', difficulty: 'beginner', question: { en: 'Walking or cycling to school/work is better for the environment than driving.', te: 'బడికి/ఆఫీసుకు నడవడం లేదా సైక్లింగ్ చేయడం డ్రైవింగ్ కంటే పర్యావరణానికి మేలు.', hi: 'स्कूल/कार्यालय पैदल या साइकिल से जाना गाड़ी चलाने से बेहतर है।' }, options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }], correctAnswer: 0, explanation: { en: 'Walking and cycling produce zero emissions! Transportation is responsible for about 16% of global emissions. Short car trips are especially inefficient.', te: 'నడక మరియు సైక్లింగ్ సున్నా ఉద్గారాలను ఉత్పత్తి చేస్తాయి!', hi: 'पैदल चलना और साइकिल चलाना शून्य उत्सर्जन पैदा करते हैं!' } },
          { id: 'sl-b-6', type: 'mcq-single', difficulty: 'beginner', question: { en: 'How long does a plastic bottle take to decompose?', te: 'ఒక ప్లాస్టిక్ బాటిల్ కుళ్ళిపోవడానికి ఎంత సమయం పడుతుంది?', hi: 'एक प्लास्टिक की बोतल को विघटित होने में कितना समय लगता है?' }, options: [{ en: '1 year', te: '1 సంవత్సరం', hi: '1 साल' }, { en: '10 years', te: '10 సంవత్సరాలు', hi: '10 साल' }, { en: '100 years', te: '100 సంవత్సరాలు', hi: '100 साल' }, { en: '450+ years', te: '450+ సంవత్సరాలు', hi: '450+ साल' }], correctAnswer: 3, explanation: { en: 'Plastic bottles take 450+ years to decompose! They break into smaller microplastics that pollute soil, water, and even enter our food chain. Always recycle or use reusable bottles.', te: 'ప్లాస్టిక్ బాటిల్‌లు కుళ్ళిపోవడానికి 450+ సంవత్సరాలు పడుతుంది!', hi: 'प्लास्टिक की बोतलों को विघटित होने में 450+ साल लगते हैं!' } }
        ]
      },
      {
        id: 'sustain-intermediate',
        name: { en: 'Intermediate', te: 'మధ్యస్థం', hi: 'मध्यवर्ती' },
        description: { en: 'Conscious consumption', te: 'చైతన్యవంతమైన వినియోగం', hi: 'सचेत उपभोग' },
        difficulty: 'intermediate', requiredScore: 70, isLocked: true,
        questions: [
          { id: 'sl-i-1', type: 'mcq-single', difficulty: 'intermediate', question: { en: 'What is "fast fashion" and why is it harmful?', te: '"ఫాస్ట్ ఫ్యాషన్" అంటే ఏమిటి మరియు ఇది ఎందుకు హానికరం?', hi: '"फास्ट फैशन" क्या है और यह हानिकारक क्यों है?' }, options: [{ en: 'Quick delivery of clothes – no harm', te: 'బట్టల శీఘ్ర డెలివరీ – హాని లేదు', hi: 'कपड़ों की तेज डिलीवरी – कोई नुकसान नहीं' }, { en: 'Cheap, trendy clothes causing pollution and waste', te: 'చవకైన, ట్రెండీ బట్టలు కాలుష్యం మరియు వ్యర్థాలకు కారణం', hi: 'सस्ते, ट्रेंडी कपड़े जो प्रदूषण और कचरा पैदा करते हैं' }, { en: 'Running in fashionable clothes', te: 'ఫ్యాషనబుల్ బట్టల్లో పరుగెత్తడం', hi: 'फैशनेबल कपड़ों में दौड़ना' }, { en: 'Wearing clothes quickly', te: 'బట్టలు త్వరగా వేసుకోవడం', hi: 'कपड़े जल्दी पहनना' }], correctAnswer: 1, explanation: { en: 'Fast fashion produces cheap, trendy clothes rapidly, leading to massive waste (92 million tons/year), water pollution from dyes, and poor labor conditions. Buying fewer, quality items is more sustainable.', te: 'ఫాస్ట్ ఫ్యాషన్ చవకైన, ట్రెండీ బట్టలను వేగంగా ఉత్పత్తి చేస్తుంది, భారీ వ్యర్థాలకు దారితీస్తుంది.', hi: 'फास्ट फैशन सस्ते, ट्रेंडी कपड़े तेजी से बनाता है, जिससे भारी कचरा होता है।' } },
          { id: 'sl-i-2', type: 'mcq-single', difficulty: 'intermediate', question: { en: 'What is a "carbon-neutral" lifestyle?', te: '"కార్బన్-న్యూట్రల్" జీవనశైలి అంటే ఏమిటి?', hi: '"कार्बन-न्यूट्रल" जीवनशैली क्या है?' }, options: [{ en: 'Never using any energy', te: 'ఎప్పుడూ ఏ శక్తినీ వాడకపోవడం', hi: 'कभी भी कोई ऊर्जा उपयोग नहीं करना' }, { en: 'Balancing emissions with offsets and reduction', te: 'ఆఫ్‌సెట్‌లు మరియు తగ్గింపుతో ఉద్గారాలను సమతుల్యం చేయడం', hi: 'ऑफसेट और कमी के साथ उत्सर्जन को संतुलित करना' }, { en: 'Only eating carbon-free food', te: 'కార్బన్-ఫ్రీ ఆహారాన్ని మాత్రమే తినడం', hi: 'केवल कार्बन-मुक्त भोजन खाना' }, { en: 'Living without electricity', te: 'విద్యుత్ లేకుండా జీవించడం', hi: 'बिजली के बिना जीना' }], correctAnswer: 1, explanation: { en: 'A carbon-neutral lifestyle means reducing your emissions as much as possible and offsetting the rest through tree planting, renewable energy, or carbon credits.', te: 'కార్బన్-న్యూట్రల్ జీవనశైలి అంటే మీ ఉద్గారాలను సాధ్యమైనంత తగ్గించడం.', hi: 'कार्बन-न्यूट्रल जीवनशैली का अर्थ है अपने उत्सर्जन को यथासंभव कम करना।' } },
          { id: 'sl-i-3', type: 'mcq-multiple', difficulty: 'intermediate', question: { en: 'Select ALL ways to reduce your household energy consumption:', te: 'మీ గృహ శక్తి వినియోగాన్ని తగ్గించడానికి అన్ని మార్గాలను ఎంచుకోండి:', hi: 'अपनी घरेलू ऊर्जा खपत कम करने के सभी तरीकों का चयन करें:' }, options: [{ en: 'Use solar panels', te: 'సోలార్ ప్యానెల్‌లు వాడండి', hi: 'सोलर पैनल उपयोग करें' }, { en: 'Turn off lights when leaving rooms', te: 'గదుల నుండి బయటకు వెళ్ళేటప్పుడు లైట్లు ఆపేయండి', hi: 'कमरे से जाते समय लाइट बंद करें' }, { en: 'Use energy-efficient appliances', te: 'శక్తి-సమర్థ ఉపకరణాలను వాడండి', hi: 'ऊर्जा-कुशल उपकरणों का उपयोग करें' }, { en: 'Keep all appliances on standby 24/7', te: 'అన్ని ఉపకరణాలను 24/7 స్టాండ్‌బైలో ఉంచండి', hi: 'सभी उपकरणों को 24/7 स्टैंडबाय पर रखें' }], correctAnswer: [0, 1, 2], explanation: { en: 'Solar panels, turning off unused lights, and efficient appliances all reduce energy. Standby mode still uses electricity – called "vampire power" – wasting up to 10% of household energy.', te: 'సోలార్ ప్యానెల్‌లు, వాడని లైట్లను ఆపేయడం మరియు సమర్థ ఉపకరణాలు అన్నీ శక్తిని తగ్గిస్తాయి.', hi: 'सोलर पैनल, अप्रयुक्त लाइटें बंद करना और कुशल उपकरण सभी ऊर्जा कम करते हैं।' } },
          { id: 'sl-i-4', type: 'true-false', difficulty: 'intermediate', question: { en: 'Buying local produce reduces your carbon footprint because it requires less transportation.', te: 'స్థానిక ఉత్పత్తులను కొనడం మీ కార్బన్ ఫుట్‌ప్రింట్‌ను తగ్గిస్తుంది ఎందుకంటే తక్కువ రవాణా అవసరం.', hi: 'स्थानीय उत्पाद खरीदने से आपका कार्बन फुटप्रिंट कम होता है क्योंकि इसमें कम परिवहन की आवश्यकता होती है।' }, options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }], correctAnswer: 0, explanation: { en: 'Food transportation (called "food miles") contributes to emissions. Locally grown food travels shorter distances, is often fresher, and supports local farmers.', te: 'ఆహార రవాణా ఉద్గారాలకు దోహదం చేస్తుంది. స్థానికంగా పండించిన ఆహారం తక్కువ దూరం ప్రయాణిస్తుంది.', hi: 'खाद्य परिवहन उत्सर्जन में योगदान करता है। स्थानीय रूप से उगाया गया भोजन कम दूरी तय करता है।' } },
          { id: 'sl-i-5', type: 'mcq-single', difficulty: 'intermediate', question: { en: 'What is "upcycling"?', te: '"అప్‌సైక్లింగ్" అంటే ఏమిటి?', hi: '"अपसाइक्लिंग" क्या है?' }, options: [{ en: 'Throwing things upward', te: 'వస్తువులను పైకి విసరడం', hi: 'चीजों को ऊपर फेंकना' }, { en: 'Transforming waste into higher-value products', te: 'వ్యర్థాలను అధిక-విలువ ఉత్పత్తులుగా మార్చడం', hi: 'कचरे को उच्च-मूल्य उत्पादों में बदलना' }, { en: 'Cycling uphill', te: 'కొండపైకి సైక్లింగ్', hi: 'ऊपर की ओर साइकिल चलाना' }, { en: 'Uploading content online', te: 'ఆన్‌లైన్‌లో కంటెంట్ అప్‌లోడ్ చేయడం', hi: 'ऑनलाइन कंटेंट अपलोड करना' }], correctAnswer: 1, explanation: { en: 'Upcycling creatively transforms waste materials into new, useful products. Examples: old jeans into bags, pallets into furniture, glass bottles into lamps. It\'s even better than recycling!', te: 'అప్‌సైక్లింగ్ వ్యర్థ పదార్థాలను సృజనాత్మకంగా కొత్త, ఉపయోగకరమైన ఉత్పత్తులుగా మారుస్తుంది.', hi: 'अपसाइक्लिंग रचनात्मक रूप से कचरे को नए, उपयोगी उत्पादों में बदलता है।' } },
          { id: 'sl-i-6', type: 'mcq-single', difficulty: 'intermediate', question: { en: 'Which daily habit has the biggest impact on reducing personal carbon footprint?', te: 'వ్యక్తిగత కార్బన్ ఫుట్‌ప్రింట్‌ను తగ్గించడంలో ఏ దైనందిన అలవాటు అతిపెద్ద ప్రభావాన్ని చూపుతుంది?', hi: 'व्यक्तिगत कार्बन फुटप्रिंट कम करने में किस दैनिक आदत का सबसे बड़ा प्रभाव है?' }, options: [{ en: 'Shorter showers', te: 'తక్కువ సమయం స్నానం', hi: 'छोटे शावर' }, { en: 'Eating more plant-based meals', te: 'ఎక్కువ మొక్కల ఆధారిత భోజనాలు తినడం', hi: 'अधिक पौधे-आधारित भोजन खाना' }, { en: 'Turning off WiFi', te: 'WiFi ఆపేయడం', hi: 'WiFi बंद करना' }, { en: 'Wearing lighter clothes', te: 'తేలికైన బట్టలు వేసుకోవడం', hi: 'हल्के कपड़े पहनना' }], correctAnswer: 1, explanation: { en: 'Shifting to plant-based meals can reduce food-related emissions by up to 50%. Animal agriculture is responsible for 14.5% of global greenhouse gas emissions, more than all transportation combined.', te: 'మొక్కల ఆధారిత భోజనాలకు మారడం ఆహార-సంబంధిత ఉద్గారాలను 50% వరకు తగ్గిస్తుంది.', hi: 'पौधे-आधारित भोजन पर स्विच करने से खाद्य-संबंधित उत्सर्जन 50% तक कम हो सकता है।' } }
        ]
      },
      {
        id: 'sustain-advanced',
        name: { en: 'Advanced', te: 'అధునాతన', hi: 'उन्नत' },
        description: { en: 'Systemic sustainability', te: 'వ్యవస్థాగత స్థిరత్వం', hi: 'व्यवस्थागत स्थिरता' },
        difficulty: 'advanced', requiredScore: 70, isLocked: true,
        questions: [
          { id: 'sl-a-1', type: 'mcq-single', difficulty: 'advanced', question: { en: 'What is the "circular economy"?', te: '"సర్క్యులర్ ఎకానమీ" అంటే ఏమిటి?', hi: '"सर्कुलर इकोनॉमी" क्या है?' }, options: [{ en: 'An economy based on circles', te: 'వృత్తాలపై ఆధారిత ఆర్థిక వ్యవస్థ', hi: 'वृत्तों पर आधारित अर्थव्यवस्था' }, { en: 'Designing out waste by keeping materials in use', te: 'పదార్థాలను వినియోగంలో ఉంచడం ద్వారా వ్యర్థాలను తొలగించడం', hi: 'सामग्री को उपयोग में रखकर कचरे को खत्म करना' }, { en: 'Trading in circles', te: 'వృత్తాలలో వ్యాపారం', hi: 'गोलों में व्यापार' }, { en: 'A type of cryptocurrency', te: 'ఒక రకమైన క్రిప్టోకరెన్సీ', hi: 'एक प्रकार की क्रिप्टोकरेंसी' }], correctAnswer: 1, explanation: { en: 'The circular economy redesigns production to eliminate waste. Products are designed to be reused, repaired, and recycled. Unlike the linear "take-make-dispose" model, nothing becomes waste.', te: 'సర్క్యులర్ ఎకానమీ వ్యర్థాలను తొలగించడానికి ఉత్పత్తిని పునర్రూపకల్పన చేస్తుంది.', hi: 'सर्कुलर इकोनॉमी कचरे को खत्म करने के लिए उत्पादन को फिर से डिजाइन करती है।' } },
          { id: 'sl-a-2', type: 'mcq-multiple', difficulty: 'advanced', question: { en: 'Select ALL principles of sustainable development:', te: 'సుస్థిర అభివృద్ధి సూత్రాలన్నింటిని ఎంచుకోండి:', hi: 'सतत विकास के सभी सिद्धांतों का चयन करें:' }, options: [{ en: 'Meeting present needs without compromising future generations', te: 'భవిష్యత్ తరాలను రాజీ చేయకుండా ప్రస్తుత అవసరాలను తీర్చడం', hi: 'भावी पीढ़ियों से समझौता किए बिना वर्तमान जरूरतों को पूरा करना' }, { en: 'Balancing economic, social, and environmental goals', te: 'ఆర్థిక, సామాజిక మరియు పర్యావరణ లక్ష్యాలను సమతుల్యం చేయడం', hi: 'आर्थिक, सामाजिक और पर्यावरणीय लक्ष्यों को संतुलित करना' }, { en: 'Equity and inclusion for all people', te: 'అందరికీ సమానత్వం మరియు చేర్పు', hi: 'सभी लोगों के लिए समानता और समावेश' }, { en: 'Maximizing profit at any cost', te: 'ఏ ఖర్చుతోనైనా లాభాన్ని గరిష్ఠం చేయడం', hi: 'किसी भी कीमत पर लाभ अधिकतम करना' }], correctAnswer: [0, 1, 2], explanation: { en: 'Sustainable development balances people, planet, and prosperity. It\'s about meeting today\'s needs while ensuring future generations can meet theirs. The 17 UN Sustainable Development Goals guide global efforts.', te: 'సుస్థిర అభివృద్ధి ప్రజలు, గ్రహం మరియు శ్రేయస్సును సమతుల్యం చేస్తుంది.', hi: 'सतत विकास लोगों, ग्रह और समृद्धि को संतुलित करता है।' } },
          { id: 'sl-a-3', type: 'mcq-single', difficulty: 'advanced', question: { en: 'What is "greenwashing"?', te: '"గ్రీన్‌వాషింగ్" అంటే ఏమిటి?', hi: '"ग्रीनवॉशिंग" क्या है?' }, options: [{ en: 'Washing clothes in an eco-friendly way', te: 'పర్యావరణ అనుకూల పద్ధతిలో బట్టలు ఉతకడం', hi: 'पर्यावरण-अनुकूल तरीके से कपड़े धोना' }, { en: 'Companies falsely claiming to be environmentally friendly', te: 'కంపెనీలు పర్యావరణ అనుకూలమని తప్పుగా చెప్పుకోవడం', hi: 'कंपनियों का पर्यावरण-अनुकूल होने का झूठा दावा' }, { en: 'Cleaning with green products', te: 'గ్రీన్ ఉత్పత్తులతో శుభ్రపరచడం', hi: 'हरे उत्पादों से सफाई' }, { en: 'Painting buildings green', te: 'భవనాలను ఆకుపచ్చ రంగు వేయడం', hi: 'इमारतों को हरा रंगना' }], correctAnswer: 1, explanation: { en: 'Greenwashing is when companies make misleading claims about their environmental practices to appear eco-friendly. Always look for verified certifications and transparent data.', te: 'గ్రీన్‌వాషింగ్ అంటే కంపెనీలు తమ పర్యావరణ పద్ధతుల గురించి తప్పుదారి పట్టించే వాదనలు చేయడం.', hi: 'ग्रीनवॉशिंग तब होती है जब कंपनियां अपने पर्यावरणीय प्रथाओं के बारे में भ्रामक दावे करती हैं।' } },
          { id: 'sl-a-4', type: 'mcq-single', difficulty: 'advanced', question: { en: 'How many UN Sustainable Development Goals (SDGs) are there?', te: 'UN సస్టైనబుల్ డెవలప్‌మెంట్ గోల్స్ (SDGs) ఎన్ని ఉన్నాయి?', hi: 'UN सतत विकास लक्ष्य (SDGs) कितने हैं?' }, options: [{ en: '5', te: '5', hi: '5' }, { en: '10', te: '10', hi: '10' }, { en: '17', te: '17', hi: '17' }, { en: '25', te: '25', hi: '25' }], correctAnswer: 2, explanation: { en: 'There are 17 UN SDGs adopted in 2015, covering poverty, hunger, health, education, gender equality, clean water, energy, work, innovation, inequality, cities, consumption, climate, oceans, land, peace, and partnerships.', te: '2015లో ఆమోదించబడిన 17 UN SDGలు ఉన్నాయి.', hi: '2015 में अपनाए गए 17 UN SDGs हैं।' } },
          { id: 'sl-a-5', type: 'true-false', difficulty: 'advanced', question: { en: 'The fashion industry is the second-largest polluter in the world after oil.', te: 'చమురు తర్వాత ప్రపంచంలో రెండవ అతిపెద్ద కాలుష్య కారకం ఫ్యాషన్ పరిశ్రమ.', hi: 'फैशन उद्योग तेल के बाद दुनिया का दूसरा सबसे बड़ा प्रदूषक है।' }, options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }], correctAnswer: 0, explanation: { en: 'The fashion industry produces 10% of global carbon emissions, pollutes waterways with dye chemicals, and creates massive textile waste. Choosing sustainable fashion makes a real difference.', te: 'ఫ్యాషన్ పరిశ్రమ ప్రపంచ కార్బన్ ఉద్గారాలలో 10% ఉత్పత్తి చేస్తుంది.', hi: 'फैशन उद्योग वैश्विक कार्बन उत्सर्जन का 10% पैदा करता है।' } },
          { id: 'sl-a-6', type: 'mcq-single', difficulty: 'advanced', question: { en: 'What is "zero waste" lifestyle?', te: '"జీరో వేస్ట్" జీవనశైలి అంటే ఏమిటి?', hi: '"जीरो वेस्ट" जीवनशैली क्या है?' }, options: [{ en: 'Never producing any garbage ever', te: 'ఎప్పుడూ ఏ చెత్తా ఉత్పత్తి చేయకపోవడం', hi: 'कभी कोई कचरा न पैदा करना' }, { en: 'Redesigning life to send nothing to landfills', te: 'ల్యాండ్‌ఫిల్‌లకు ఏమీ పంపకుండా జీవితాన్ని పునర్రూపకల్పన చేయడం', hi: 'लैंडफिल में कुछ भी न भेजने के लिए जीवन को फिर से डिजाइन करना' }, { en: 'Wasting zero money', te: 'సున్నా డబ్బు వృథా', hi: 'शून्य पैसा बर्बाद करना' }, { en: 'Having zero belongings', te: 'సున్నా సామానులు', hi: 'शून्य सामान रखना' }], correctAnswer: 1, explanation: { en: 'Zero waste aims to redesign consumption to minimize what goes to landfills or incinerators. It\'s a goal, not perfection – even reducing waste by 80% makes a huge difference. Key: refuse, reduce, reuse, recycle, rot (compost).', te: 'జీరో వేస్ట్ ల్యాండ్‌ఫిల్‌లకు వెళ్ళేదాన్ని తగ్గించడానికి వినియోగాన్ని పునర్రూపకల్పన చేయడం లక్ష్యంగా పెట్టుకుంది.', hi: 'जीरो वेस्ट का लक्ष्य लैंडफिल में जाने वाली चीजों को कम करने के लिए उपभोग को फिर से डिजाइन करना है।' } }
        ]
      }
    ]
  },
  {
    id: 'renewable-energy',
    name: { en: 'Renewable Energy', te: 'పునరుత్పాదక ఇంధనం', hi: 'नवीकरणीय ऊर्जा' },
    description: { en: 'Discover clean energy sources and their impact', te: 'శుభ్రమైన ఇంధన వనరులను కనుగొనండి', hi: 'स्वच्छ ऊर्जा स्रोतों और उनके प्रभाव की खोज करें' },
    icon: '⚡',
    color: 'bg-yellow-500',
    levels: [
      {
        id: 'renew-beginner',
        name: { en: 'Beginner', te: 'ప్రారంభికులు', hi: 'शुरुआती' },
        description: { en: 'Clean energy basics', te: 'శుభ్రమైన ఇంధన ప్రాథమికాలు', hi: 'स्वच्छ ऊर्जा की मूल बातें' },
        difficulty: 'beginner', requiredScore: 70, isLocked: false,
        questions: [
          { id: 're-b-1', type: 'mcq-single', difficulty: 'beginner', question: { en: 'Which of these is NOT a renewable energy source?', te: 'వీటిలో పునరుత్పాదక ఇంధన వనరు కానిది ఏది?', hi: 'इनमें से कौन सा नवीकरणीय ऊर्जा स्रोत नहीं है?' }, options: [{ en: 'Solar', te: 'సౌర', hi: 'सौर' }, { en: 'Wind', te: 'గాలి', hi: 'पवन' }, { en: 'Coal', te: 'బొగ్గు', hi: 'कोयला' }, { en: 'Hydropower', te: 'జలశక్తి', hi: 'जलविद्युत' }], correctAnswer: 2, explanation: { en: 'Coal is a fossil fuel formed over millions of years and releases CO₂ when burned. Solar, wind, and hydropower are renewable because they come from naturally replenishing sources.', te: 'బొగ్గు మిలియన్ల సంవత్సరాలలో ఏర్పడిన శిలాజ ఇంధనం.', hi: 'कोयला लाखों वर्षों में बना एक जीवाश्म ईंधन है।' } },
          { id: 're-b-2', type: 'true-false', difficulty: 'beginner', question: { en: 'Solar panels can generate electricity even on cloudy days.', te: 'సోలార్ ప్యానెల్‌లు మేఘావృత రోజుల్లో కూడా విద్యుత్ ఉత్పత్తి చేయగలవు.', hi: 'सोलर पैनल बादल वाले दिनों में भी बिजली पैदा कर सकते हैं।' }, options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }], correctAnswer: 0, explanation: { en: 'Solar panels work with light, not heat. While they produce less on cloudy days (about 25-30% of full capacity), they still generate usable electricity. Germany, which has many cloudy days, is a solar energy leader!', te: 'సోలార్ ప్యానెల్‌లు వెలుగుతో పనిచేస్తాయి, వేడితో కాదు.', hi: 'सोलर पैनल प्रकाश से काम करते हैं, गर्मी से नहीं।' } },
          { id: 're-b-3', type: 'mcq-single', difficulty: 'beginner', question: { en: 'What energy source does a wind turbine use?', te: 'విండ్ టర్బైన్ ఏ ఇంధన వనరును వాడుతుంది?', hi: 'पवन टर्बाइन किस ऊर्जा स्रोत का उपयोग करता है?' }, options: [{ en: 'Sunlight', te: 'సూర్యకాంతి', hi: 'सूर्य का प्रकाश' }, { en: 'Moving air (wind)', te: 'కదిలే గాలి (వాయువు)', hi: 'चलती हवा (पवन)' }, { en: 'Water', te: 'నీరు', hi: 'पानी' }, { en: 'Natural gas', te: 'సహజ వాయువు', hi: 'प्राकृतिक गैस' }], correctAnswer: 1, explanation: { en: 'Wind turbines convert the kinetic energy of moving air into electricity. A single large turbine can power about 1,500 homes! Wind energy produces zero emissions during operation.', te: 'విండ్ టర్బైన్‌లు కదిలే గాలి యొక్క గతి శక్తిని విద్యుత్‌గా మారుస్తాయి.', hi: 'पवन टर्बाइन चलती हवा की गतिज ऊर्जा को बिजली में बदलते हैं।' } },
          { id: 're-b-4', type: 'mcq-single', difficulty: 'beginner', question: { en: 'India has set a target for renewable energy capacity by 2030 of:', te: '2030 నాటికి భారతదేశం నిర్ణయించిన పునరుత్పాదక ఇంధన సామర్థ్య లక్ష్యం:', hi: '2030 तक भारत का नवीकरणीय ऊर्जा क्षमता लक्ष्य:' }, options: [{ en: '100 GW', te: '100 GW', hi: '100 GW' }, { en: '250 GW', te: '250 GW', hi: '250 GW' }, { en: '500 GW', te: '500 GW', hi: '500 GW' }, { en: '50 GW', te: '50 GW', hi: '50 GW' }], correctAnswer: 2, explanation: { en: 'India has set an ambitious target of 500 GW of renewable energy capacity by 2030. This would make it one of the world\'s largest clean energy producers. Solar parks in Rajasthan are leading the way!', te: 'భారతదేశం 2030 నాటికి 500 GW పునరుత్పాదక ఇంధన సామర్థ్య లక్ష్యాన్ని నిర్ణయించింది.', hi: 'भारत ने 2030 तक 500 GW नवीकरणीय ऊर्जा क्षमता का लक्ष्य रखा है।' } },
          { id: 're-b-5', type: 'true-false', difficulty: 'beginner', question: { en: 'Renewable energy creates more jobs than fossil fuel industries.', te: 'పునరుత్పాదక ఇంధనం శిలాజ ఇంధన పరిశ్రమల కంటే ఎక్కువ ఉద్యోగాలను సృష్టిస్తుంది.', hi: 'नवीकरणीय ऊर्जा जीवाश्म ईंधन उद्योगों से अधिक नौकरियां पैदा करती है।' }, options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }], correctAnswer: 0, explanation: { en: 'The renewable energy sector employs over 13 million people worldwide and is growing rapidly. Solar and wind manufacturing, installation, and maintenance create 3x more jobs per dollar invested than fossil fuels.', te: 'పునరుత్పాదక ఇంధన రంగం ప్రపంచవ్యాప్తంగా 13 మిలియన్లకు పైగా ప్రజలకు ఉద్యోగం కల్పిస్తుంది.', hi: 'नवीकरणीय ऊर्जा क्षेत्र दुनिया भर में 13 मिलियन से अधिक लोगों को रोजगार देता है।' } },
          { id: 're-b-6', type: 'mcq-single', difficulty: 'beginner', question: { en: 'What is "biomass energy"?', te: '"బయోమాస్ ఎనర్జీ" అంటే ఏమిటి?', hi: '"बायोमास ऊर्जा" क्या है?' }, options: [{ en: 'Energy from the sun', te: 'సూర్యుడి నుండి శక్తి', hi: 'सूर्य से ऊर्जा' }, { en: 'Energy from organic materials like plants and waste', te: 'మొక్కలు మరియు వ్యర్థాలు వంటి సేంద్రీయ పదార్థాల నుండి శక్తి', hi: 'पौधों और कचरे जैसी जैविक सामग्री से ऊर्जा' }, { en: 'Energy from rocks', te: 'రాళ్ల నుండి శక్తి', hi: 'चट्टानों से ऊर्जा' }, { en: 'Energy from electricity', te: 'విద్యుత్ నుండి శక్తి', hi: 'बिजली से ऊर्जा' }], correctAnswer: 1, explanation: { en: 'Biomass energy comes from organic materials – crop waste, wood, animal dung, and other biological matter. In India, biogas plants that convert cow dung into cooking fuel are widely used in rural areas.', te: 'బయోమాస్ ఎనర్జీ సేంద్రీయ పదార్థాల నుండి వస్తుంది.', hi: 'बायोमास ऊर्जा जैविक सामग्री से आती है।' } }
        ]
      },
      {
        id: 'renew-intermediate',
        name: { en: 'Intermediate', te: 'మధ్యస్థం', hi: 'मध्यवर्ती' },
        description: { en: 'Energy technology deep dive', te: 'ఇంధన సాంకేతికత లోతైన అధ్యయనం', hi: 'ऊर्जा प्रौद्योगिकी गहन अध्ययन' },
        difficulty: 'intermediate', requiredScore: 70, isLocked: true,
        questions: [
          { id: 're-i-1', type: 'mcq-single', difficulty: 'intermediate', question: { en: 'What is the efficiency of typical commercial solar panels?', te: 'సాధారణ వాణిజ్య సోలార్ ప్యానెల్‌ల సామర్థ్యం ఎంత?', hi: 'सामान्य वाणिज्यिक सोलर पैनलों की दक्षता कितनी है?' }, options: [{ en: '5-10%', te: '5-10%', hi: '5-10%' }, { en: '15-22%', te: '15-22%', hi: '15-22%' }, { en: '50-60%', te: '50-60%', hi: '50-60%' }, { en: '90-95%', te: '90-95%', hi: '90-95%' }], correctAnswer: 1, explanation: { en: 'Most commercial solar panels have 15-22% efficiency. While this seems low, it\'s constantly improving, and the free, unlimited nature of sunlight makes it very cost-effective.', te: 'చాలా వాణిజ్య సోలార్ ప్యానెల్‌లు 15-22% సామర్థ్యం కలిగి ఉంటాయి.', hi: 'अधिकांश वाणिज्यिक सोलर पैनलों की दक्षता 15-22% है।' } },
          { id: 're-i-2', type: 'mcq-single', difficulty: 'intermediate', question: { en: 'What is "grid parity" in renewable energy?', te: 'పునరుత్పాదక ఇంధనంలో "గ్రిడ్ ప్యారిటీ" అంటే ఏమిటి?', hi: 'नवीकरणीय ऊर्जा में "ग्रिड पैरिटी" क्या है?' }, options: [{ en: 'When solar panels are placed in a grid', te: 'సోలార్ ప్యానెల్‌లను గ్రిడ్‌లో ఉంచినప్పుడు', hi: 'जब सोलर पैनल ग्रिड में लगाए जाते हैं' }, { en: 'When renewable energy costs equal fossil fuel costs', te: 'పునరుత్పాదక ఇంధన ఖర్చులు శిలాజ ఇంధన ఖర్చులతో సమానమైనప్పుడు', hi: 'जब नवीकरणीय ऊर्जा की लागत जीवाश्म ईंधन लागत के बराबर हो' }, { en: 'Equal distribution of electricity', te: 'విద్యుత్ సమాన పంపిణీ', hi: 'बिजली का समान वितरण' }, { en: 'When the power grid is balanced', te: 'విద్యుత్ గ్రిడ్ సమతుల్యంగా ఉన్నప్పుడు', hi: 'जब बिजली ग्रिड संतुलित हो' }], correctAnswer: 1, explanation: { en: 'Grid parity is when renewable energy becomes as cheap as fossil fuels. Solar and wind have already achieved grid parity in many countries, making them the cheapest new energy sources in history!', te: 'పునరుత్పాదక ఇంధనం శిలాజ ఇంధనాల అంత చవకైనప్పుడు గ్రిడ్ ప్యారిటీ.', hi: 'ग्रिड पैरिटी तब होती है जब नवीकरणीय ऊर्जा जीवाश्म ईंधन जितनी सस्ती हो जाती है।' } },
          { id: 're-i-3', type: 'mcq-multiple', difficulty: 'intermediate', question: { en: 'Select ALL challenges of renewable energy:', te: 'పునరుత్పాదక ఇంధన సవాళ్ళన్నింటిని ఎంచుకోండి:', hi: 'नवीकरणीय ऊर्जा की सभी चुनौतियों का चयन करें:' }, options: [{ en: 'Intermittency (sun doesn\'t always shine)', te: 'ఇంటర్మిటెన్సీ (సూర్యుడు ఎప్పుడూ ప్రకాశించడు)', hi: 'रुक-रुक कर (सूरज हमेशा नहीं चमकता)' }, { en: 'Energy storage needs', te: 'శక్తి నిల్వ అవసరాలు', hi: 'ऊर्जा भंडारण की जरूरत' }, { en: 'Initial infrastructure costs', te: 'ప్రారంభ మౌలిక సదుపాయాల ఖర్చులు', hi: 'प्रारंभिक बुनियादी ढांचा लागत' }, { en: 'They produce too much CO₂', te: 'అవి చాలా ఎక్కువ CO₂ ఉత్పత్తి చేస్తాయి', hi: 'वे बहुत अधिक CO₂ पैदा करते हैं' }], correctAnswer: [0, 1, 2], explanation: { en: 'Renewable energy challenges include variability (weather-dependent), storage (batteries needed), and upfront costs. However, they produce virtually ZERO CO₂ during operation! These challenges are rapidly being solved with improving technology.', te: 'పునరుత్పాదక ఇంధన సవాళ్ళలో వేరియబిలిటీ, నిల్వ మరియు ముందస్తు ఖర్చులు ఉన్నాయి.', hi: 'नवीकरणीय ऊर्जा चुनौतियों में परिवर्तनशीलता, भंडारण और प्रारंभिक लागत शामिल हैं।' } },
          { id: 're-i-4', type: 'mcq-single', difficulty: 'intermediate', question: { en: 'What is a "smart grid"?', te: '"స్మార్ట్ గ్రిడ్" అంటే ఏమిటి?', hi: '"स्मार्ट ग्रिड" क्या है?' }, options: [{ en: 'A grid made of smart materials', te: 'స్మార్ట్ మెటీరియల్స్‌తో చేసిన గ్రిడ్', hi: 'स्मार्ट सामग्री से बना ग्रिड' }, { en: 'Digital technology-enhanced electricity network', te: 'డిజిటల్ టెక్నాలజీతో మెరుగైన విద్యుత్ నెట్‌వర్క్', hi: 'डिजिटल तकनीक-संवर्धित बिजली नेटवर्क' }, { en: 'A very large solar panel', te: 'చాలా పెద్ద సోలార్ ప్యానెల్', hi: 'एक बहुत बड़ा सोलर पैनल' }, { en: 'A grid pattern for planting trees', te: 'చెట్లు నాటడానికి గ్రిడ్ నమూనా', hi: 'पेड़ लगाने के लिए ग्रिड पैटर्न' }], correctAnswer: 1, explanation: { en: 'A smart grid uses digital technology to manage electricity from multiple sources (solar, wind, traditional) efficiently. It can balance supply and demand in real-time, reduce waste, and integrate renewable sources.', te: 'స్మార్ట్ గ్రిడ్ బహుళ వనరుల నుండి విద్యుత్‌ను సమర్థవంతంగా నిర్వహించడానికి డిజిటల్ టెక్నాలజీని ఉపయోగిస్తుంది.', hi: 'स्मार्ट ग्रिड कई स्रोतों से बिजली को कुशलता से प्रबंधित करने के लिए डिजिटल तकनीक का उपयोग करता है।' } },
          { id: 're-i-5', type: 'true-false', difficulty: 'intermediate', question: { en: 'The cost of solar energy has dropped by more than 80% in the last decade.', te: 'గత దశాబ్దంలో సౌర ఇంధన ధర 80% కంటే ఎక్కువ తగ్గింది.', hi: 'पिछले दशक में सौर ऊर्जा की लागत 80% से अधिक गिर गई है।' }, options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }], correctAnswer: 0, explanation: { en: 'Solar energy costs have dropped about 89% since 2010! This dramatic cost reduction has made solar the cheapest source of electricity in many parts of the world.', te: '2010 నుండి సౌర ఇంధన ఖర్చులు సుమారు 89% తగ్గాయి!', hi: '2010 से सौर ऊर्जा लागत में लगभग 89% की गिरावट आई है!' } },
          { id: 're-i-6', type: 'mcq-single', difficulty: 'intermediate', question: { en: 'Which country leads the world in total installed solar capacity?', te: 'మొత్తం ఇన్‌స్టాల్ చేసిన సోలార్ సామర్థ్యంలో ప్రపంచంలో ముందంజలో ఉన్న దేశం ఏది?', hi: 'कुल स्थापित सौर क्षमता में दुनिया में कौन सा देश अग्रणी है?' }, options: [{ en: 'USA', te: 'అమెరికా', hi: 'अमेरिका' }, { en: 'Germany', te: 'జర్మనీ', hi: 'जर्मनी' }, { en: 'China', te: 'చైనా', hi: 'चीन' }, { en: 'Japan', te: 'జపాన్', hi: 'जापान' }], correctAnswer: 2, explanation: { en: 'China leads with over 400 GW of solar capacity, producing more solar energy than any other country. India is among the top 5 and rapidly growing its solar infrastructure.', te: 'చైనా 400 GW కంటే ఎక్కువ సోలార్ సామర్థ్యంతో ముందంజలో ఉంది.', hi: 'चीन 400 GW से अधिक सौर क्षमता के साथ अग्रणी है।' } }
        ]
      },
      {
        id: 'renew-advanced',
        name: { en: 'Advanced', te: 'అధునాతన', hi: 'उन्नत' },
        description: { en: 'Future of energy', te: 'ఇంధనం యొక్క భవిష్యత్తు', hi: 'ऊर्जा का भविष्य' },
        difficulty: 'advanced', requiredScore: 70, isLocked: true,
        questions: [
          { id: 're-a-1', type: 'mcq-single', difficulty: 'advanced', question: { en: 'What is "green hydrogen" and why is it important?', te: '"గ్రీన్ హైడ్రోజన్" అంటే ఏమిటి మరియు ఇది ఎందుకు ముఖ్యమైనది?', hi: '"ग्रीन हाइड्रोजन" क्या है और यह महत्वपूर्ण क्यों है?' }, options: [{ en: 'Hydrogen gas that is colored green', te: 'ఆకుపచ్చ రంగులో ఉన్న హైడ్రోజన్ వాయువు', hi: 'हाइड्रोजन गैस जो हरे रंग की है' }, { en: 'Hydrogen produced using renewable energy', te: 'పునరుత్పాదక ఇంధనాన్ని ఉపయోగించి ఉత్పత్తి చేసిన హైడ్రోజన్', hi: 'नवीकरणीय ऊर्जा का उपयोग करके उत्पादित हाइड्रोजन' }, { en: 'Hydrogen found in plants', te: 'మొక్కలలో కనిపించే హైడ్రోజన్', hi: 'पौधों में पाया जाने वाला हाइड्रोजन' }, { en: 'Toxic hydrogen gas', te: 'విషపూరిత హైడ్రోజన్ వాయువు', hi: 'विषैली हाइड्रोजन गैस' }], correctAnswer: 1, explanation: { en: 'Green hydrogen is produced by splitting water using renewable electricity. It can store renewable energy and fuel heavy vehicles, planes, and industrial processes that are hard to electrify directly.', te: 'గ్రీన్ హైడ్రోజన్ పునరుత్పాదక విద్యుత్‌ను ఉపయోగించి నీటిని విభజించడం ద్వారా ఉత్పత్తి చేయబడుతుంది.', hi: 'ग्रीन हाइड्रोजन नवीकरणीय बिजली का उपयोग करके पानी को विभाजित करके उत्पादित किया जाता है।' } },
          { id: 're-a-2', type: 'mcq-multiple', difficulty: 'advanced', question: { en: 'Select ALL emerging renewable energy technologies:', te: 'అభివృద్ధి చెందుతున్న పునరుత్పాదక ఇంధన సాంకేతికతలన్నింటిని ఎంచుకోండి:', hi: 'उभरती नवीकरणीय ऊर्जा प्रौद्योगिकियों का चयन करें:' }, options: [{ en: 'Floating solar farms on water', te: 'నీటిపై ఫ్లోటింగ్ సోలార్ ఫార్మ్‌లు', hi: 'पानी पर तैरते सोलर फार्म' }, { en: 'Perovskite solar cells', te: 'పెరోవ్‌స్కైట్ సోలార్ సెల్స్', hi: 'पेरोव्स्काइट सोलर सेल' }, { en: 'Wave and tidal energy', te: 'తరంగ మరియు జ్వార శక్తి', hi: 'तरंग और ज्वारीय ऊर्जा' }, { en: 'Burning more coal', te: 'మరింత బొగ్గు కాల్చడం', hi: 'अधिक कोयला जलाना' }], correctAnswer: [0, 1, 2], explanation: { en: 'Floating solar, perovskite cells (flexible, cheap solar), and wave/tidal energy are all exciting emerging technologies. Burning coal is the opposite – it\'s a technology we\'re trying to phase out!', te: 'ఫ్లోటింగ్ సోలార్, పెరోవ్‌స్కైట్ సెల్స్ మరియు తరంగ/జ్వార శక్తి అన్నీ ఆసక్తికరమైన అభివృద్ధి చెందుతున్న సాంకేతికతలు.', hi: 'फ्लोटिंग सोलर, पेरोव्स्काइट सेल और तरंग/ज्वारीय ऊर्जा सभी रोमांचक उभरती प्रौद्योगिकियां हैं।' } },
          { id: 're-a-3', type: 'mcq-single', difficulty: 'advanced', question: { en: 'What is "energy storage" and why is it critical for renewables?', te: '"ఎనర్జీ స్టోరేజ్" అంటే ఏమిటి మరియు పునరుత్పాదక ఇంధనాలకు ఇది ఎందుకు కీలకం?', hi: '"ऊर्जा भंडारण" क्या है और नवीकरणीय ऊर्जा के लिए यह महत्वपूर्ण क्यों है?' }, options: [{ en: 'Keeping fuel in tanks', te: 'ట్యాంకులలో ఇంధనాన్ని ఉంచడం', hi: 'टैंकों में ईंधन रखना' }, { en: 'Storing excess renewable energy for when it\'s needed', te: 'అవసరమైనప్పుడు కోసం అదనపు పునరుత్పాదక ఇంధనాన్ని నిల్వ చేయడం', hi: 'जरूरत के लिए अतिरिक्त नवीकरणीय ऊर्जा का भंडारण' }, { en: 'Eating more food for energy', te: 'శక్తి కోసం ఎక్కువ ఆహారం తినడం', hi: 'ऊर्जा के लिए अधिक भोजन खाना' }, { en: 'Saving electricity bills', te: 'విద్యుత్ బిల్లులను ఆదా చేయడం', hi: 'बिजली बिल बचाना' }], correctAnswer: 1, explanation: { en: 'Energy storage (batteries, pumped hydro, hydrogen) is critical because sun and wind are intermittent. Storage allows us to use renewable energy 24/7, making a 100% renewable grid possible.', te: 'ఎనర్జీ స్టోరేజ్ (బ్యాటరీలు, పంప్డ్ హైడ్రో, హైడ్రోజన్) కీలకం ఎందుకంటే సూర్యుడు మరియు గాలి ఇంటర్మిటెంట్.', hi: 'ऊर्जा भंडारण (बैटरी, पंप्ड हाइड्रो, हाइड्रोजन) महत्वपूर्ण है क्योंकि सूरज और हवा रुक-रुक कर आते हैं।' } },
          { id: 're-a-4', type: 'mcq-single', difficulty: 'advanced', question: { en: 'By what year could renewable energy potentially provide 90% of global electricity?', te: 'ఏ సంవత్సరం నాటికి పునరుత్పాదక ఇంధనం ప్రపంచ విద్యుత్‌లో 90% అందించగలదు?', hi: 'किस वर्ष तक नवीकरणीय ऊर्जा वैश्विक बिजली का 90% प्रदान कर सकती है?' }, options: [{ en: '2025', te: '2025', hi: '2025' }, { en: '2035', te: '2035', hi: '2035' }, { en: '2050', te: '2050', hi: '2050' }, { en: '2100', te: '2100', hi: '2100' }], correctAnswer: 2, explanation: { en: 'Many energy experts and the IRENA project that renewables could provide 90% of global electricity by 2050 with aggressive investment and policy. Some regions may achieve this even sooner.', te: 'అనేక ఇంధన నిపుణులు 2050 నాటికి పునరుత్పాదక ఇంధనాలు ప్రపంచ విద్యుత్‌లో 90% అందించగలవని అంచనా వేస్తారు.', hi: 'कई ऊर्जा विशेषज्ञ 2050 तक नवीकरणीय ऊर्जा वैश्विक बिजली का 90% प्रदान कर सकती है।' } },
          { id: 're-a-5', type: 'true-false', difficulty: 'advanced', question: { en: 'A single offshore wind turbine can power over 10,000 homes.', te: 'ఒక ఆఫ్‌షోర్ విండ్ టర్బైన్ 10,000 కంటే ఎక్కువ ఇళ్లకు విద్యుత్ అందించగలదు.', hi: 'एक अपतटीय पवन टर्बाइन 10,000 से अधिक घरों को बिजली दे सकता है।' }, options: [{ en: 'True', te: 'నిజం', hi: 'सच' }, { en: 'False', te: 'అబద్ధం', hi: 'झूठ' }], correctAnswer: 0, explanation: { en: 'Modern offshore wind turbines are massive! A single 15 MW turbine can power 13,000-15,000 homes. Offshore winds are stronger and more consistent than onshore, making these turbines highly efficient.', te: 'ఆధునిక ఆఫ్‌షోర్ విండ్ టర్బైన్‌లు భారీవి! ఒక 15 MW టర్బైన్ 13,000-15,000 ఇళ్లకు విద్యుత్ అందించగలదు.', hi: 'आधुनिक अपतटीय पवन टर्बाइन विशाल हैं! एक 15 MW टर्बाइन 13,000-15,000 घरों को बिजली दे सकता है।' } },
          { id: 're-a-6', type: 'mcq-single', difficulty: 'advanced', question: { en: 'What is India\'s largest solar park and its capacity?', te: 'భారతదేశపు అతిపెద్ద సోలార్ పార్క్ మరియు దాని సామర్థ్యం ఏమిటి?', hi: 'भारत का सबसे बड़ा सोलर पार्क और इसकी क्षमता क्या है?' }, options: [{ en: 'Bhadla Solar Park, 2,245 MW', te: 'భద్ల సోలార్ పార్క్, 2,245 MW', hi: 'भडला सोलर पार्क, 2,245 MW' }, { en: 'Kamuthi Solar Park, 500 MW', te: 'కాముతి సోలార్ పార్క్, 500 MW', hi: 'कामुथी सोलर पार्क, 500 MW' }, { en: 'Rewa Solar Park, 750 MW', te: 'రేవా సోలార్ పార్క్, 750 MW', hi: 'रीवा सोलर पार्क, 750 MW' }, { en: 'Pavagada Solar Park, 2,050 MW', te: 'పావగడ సోలార్ పార్క్, 2,050 MW', hi: 'पावागड़ा सोलर पार्क, 2,050 MW' }], correctAnswer: 0, explanation: { en: 'Bhadla Solar Park in Rajasthan is the world\'s largest solar park with 2,245 MW capacity, covering 14,000 acres. It can power millions of homes and is a symbol of India\'s renewable energy ambitions.', te: 'రాజస్థాన్‌లోని భద్ల సోలార్ పార్క్ ప్రపంచంలోనే అతిపెద్ద సోలార్ పార్క్, 2,245 MW సామర్థ్యంతో.', hi: 'राजस्थान में भडला सोलर पार्क दुनिया का सबसे बड़ा सोलर पार्क है, 2,245 MW क्षमता के साथ।' } }
        ]
      }
    ]
  }
];
