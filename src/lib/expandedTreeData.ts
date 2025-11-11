import { TreeInfo } from "./treeData";
import neemImg from "@/assets/trees/neem.jpg";
import banyanImg from "@/assets/trees/banyan.jpg";
import mangoImg from "@/assets/trees/mango.jpg";
import coconutImg from "@/assets/trees/coconut.jpg";
import peepalImg from "@/assets/trees/peepal.jpg";
import tulsiImg from "@/assets/trees/tulsi.jpg";
import oakImg from "@/assets/trees/oak.jpg";
import pineImg from "@/assets/trees/pine.jpg";
import mahoganyImg from "@/assets/trees/mahogany.jpg";
import teakImg from "@/assets/trees/teak.jpg";
import bambooImg from "@/assets/trees/bamboo.jpg";
import cedarImg from "@/assets/trees/cedar.jpg";
import eucalyptusImg from "@/assets/trees/eucalyptus.jpg";
import jackfruitImg from "@/assets/trees/jackfruit.jpg";
import guavaImg from "@/assets/trees/guava.jpg";
import papayaImg from "@/assets/trees/papaya.jpg";
import lemonImg from "@/assets/trees/lemon.jpg";
import orangeImg from "@/assets/trees/orange.jpg";
import pomegranateImg from "@/assets/trees/pomegranate.jpg";
import figImg from "@/assets/trees/fig.jpg";
import tamarindImg from "@/assets/trees/tamarind.jpg";
import jamunImg from "@/assets/trees/jamun.jpg";
import amlaImg from "@/assets/trees/amla.jpg";
import curryLeafImg from "@/assets/trees/curry-leaf.jpg";
import drumstickImg from "@/assets/trees/drumstick.jpg";
import arecaImg from "@/assets/trees/areca.jpg";
import betelNutImg from "@/assets/trees/betel-nut.jpg";
import palmImg from "@/assets/trees/palm.jpg";
import sandalwoodImg from "@/assets/trees/sandalwood.jpg";
import deodarImg from "@/assets/trees/deodar.jpg";
import chirImg from "@/assets/trees/chir.jpg";
import firImg from "@/assets/trees/fir.jpg";
import spruceImg from "@/assets/trees/spruce.jpg";
import mapleImg from "@/assets/trees/maple.jpg";
import birchImg from "@/assets/trees/birch.jpg";
import willowImg from "@/assets/trees/willow.jpg";
import poplarImg from "@/assets/trees/poplar.jpg";
import elmImg from "@/assets/trees/elm.jpg";
import ashImg from "@/assets/trees/ash.jpg";
import walnutImg from "@/assets/trees/walnut.jpg";
import chestnutImg from "@/assets/trees/chestnut.jpg";
import cherryImg from "@/assets/trees/cherry.jpg";
import plumImg from "@/assets/trees/plum.jpg";
import peachImg from "@/assets/trees/peach.jpg";
import apricotImg from "@/assets/trees/apricot.jpg";
import almondImg from "@/assets/trees/almond.jpg";
import cashewImg from "@/assets/trees/cashew.jpg";
import pistachioImg from "@/assets/trees/pistachio.jpg";
import oliveImg from "@/assets/trees/olive.jpg";
import dateImg from "@/assets/trees/date.jpg";
import avocadoImg from "@/assets/trees/avocado.jpg";
import custardAppleImg from "@/assets/trees/custard-apple.jpg";
import sapotaImg from "@/assets/trees/sapota.jpg";
import litchiImg from "@/assets/trees/litchi.jpg";
import longanImg from "@/assets/trees/longan.jpg";
import rambutanImg from "@/assets/trees/rambutan.jpg";

// Extended tree library with 100 trees
export const expandedTreeData: TreeInfo[] = [
  // Original 6 trees
  { id: "neem", nameEn: "Neem Tree", nameTe: "వేప చెట్టు", nameHi: "नीम का पेड़", benefits: ["Air purification", "Medicinal properties", "Natural pesticide", "Shade provider"], benefitsTe: ["గాలి శుద్ధి", "ఔషధ గుణాలు", "సహజ పురుగుమందు", "నీడ అందించడం"], benefitsHi: ["वायु शुद्धिकरण", "औषधीय गुण", "प्राकृतिक कीटनाशक", "छाया प्रदाता"], growthTime: "3-5 years", soilType: "Dry soil", maintenance: "Low water", co2Absorption: 25, oxygenProduction: 260, image: neemImg },
  { id: "banyan", nameEn: "Banyan Tree", nameTe: "మర్రి చెట్టు", nameHi: "बरगद का पेड़", benefits: ["Large canopy", "Oxygen production", "Wildlife habitat", "Cultural significance"], benefitsTe: ["పెద్ద చాప", "ఆక్సిజన్ ఉత్పత్తి", "వన్యజీవుల ఆవాసం", "సాంస్కృతిక ప్రాముఖ్యత"], benefitsHi: ["बड़ी छतरी", "ऑक्सीजन उत्पादन", "वन्यजीव आवास", "सांस्कृतिक महत्व"], growthTime: "5-10 years", soilType: "Rich soil", maintenance: "Regular water", co2Absorption: 50, oxygenProduction: 500, image: banyanImg },
  { id: "mango", nameEn: "Mango Tree", nameTe: "మామిడి చెట్టు", nameHi: "आम का पेड़", benefits: ["Delicious fruits", "Dense foliage", "Shade", "Economic value"], benefitsTe: ["రుచికరమైన పండ్లు", "దట్టమైన ఆకులు", "నీడ", "ఆర్థిక విలువ"], benefitsHi: ["स्वादिष्ट फल", "घना पत्ते", "छाया", "आर्थिक मूल्य"], growthTime: "4-6 years", soilType: "Sandy loam", maintenance: "Moderate water", co2Absorption: 28, oxygenProduction: 300, image: mangoImg },
  { id: "coconut", nameEn: "Coconut Tree", nameTe: "కొబ్బరి చెట్టు", nameHi: "नारियल का पेड़", benefits: ["Coconut production", "Versatile uses", "Coastal protection", "Income source"], benefitsTe: ["కొబ్బరి ఉత్పత్తి", "బహుముఖ వినియోగాలు", "తీర రక్షణ", "ఆదాయ వనరు"], benefitsHi: ["नारियल उत्पादन", "बहुमुखी उपयोग", "तटीय सुरक्षा", "आय स्रोत"], growthTime: "5-7 years", soilType: "Sandy soil", maintenance: "Regular water", co2Absorption: 22, oxygenProduction: 250, image: coconutImg },
  { id: "peepal", nameEn: "Peepal Tree", nameTe: "రావి చెట్టు", nameHi: "पीपल का पेड़", benefits: ["24/7 oxygen", "Sacred tree", "Large shade", "Long lifespan"], benefitsTe: ["24/7 ఆక్సిజన్", "పవిత్ర చెట్టు", "పెద్ద నీడ", "దీర్ఘ జీవితకాలం"], benefitsHi: ["24/7 ऑक्सीजन", "पवित्र पेड़", "बड़ी छाया", "लंबा जीवनकाल"], growthTime: "4-6 years", soilType: "Various", maintenance: "Low", co2Absorption: 45, oxygenProduction: 450, image: peepalImg },
  { id: "tulsi", nameEn: "Tulsi", nameTe: "తులసి", nameHi: "तुलसी", benefits: ["Medicinal", "Air purification", "Aromatic", "Easy to grow"], benefitsTe: ["ఔషధ", "గాలి శుద్ధి", "సుగంధం", "సులభం"], benefitsHi: ["औषधीय", "वायु शुद्धिकरण", "सुगंधित", "आसान"], growthTime: "3-6 months", soilType: "Fertile soil", maintenance: "Regular water", co2Absorption: 2, oxygenProduction: 20, image: tulsiImg },

  // New trees with unique images
  { id: "oak", nameEn: "Oak Tree", nameTe: "Oak చెట్టు", nameHi: "Oak का पेड़", benefits: ["Strong wood", "Wildlife habitat", "Longevity", "Shade provider"], benefitsTe: ["బలమైన కలప", "వన్యజీవుల నివాసం", "దీర్ఘాయువు", "నీడ"], benefitsHi: ["मजबूत लकड़ी", "वन्यजीव आवास", "दीर्घायु", "छाया"], growthTime: "5-8 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 30, oxygenProduction: 320, image: oakImg },
  { id: "pine", nameEn: "Pine Tree", nameTe: "Pine చెట్టు", nameHi: "Pine का पेड़", benefits: ["Evergreen", "Timber production", "Resin source", "Erosion control"], benefitsTe: ["శాశ్వత ఆకులు", "కలప ఉత్పత్తి", "రాళ్ళ మూలం", "కోత నియంత్రణ"], benefitsHi: ["सदाबहार", "लकड़ी उत्पादन", "रेजिन स्रोत", "कटाव नियंत्रण"], growthTime: "4-6 years", soilType: "Sandy soil", maintenance: "Low", co2Absorption: 26, oxygenProduction: 280, image: pineImg },
  { id: "mahogany", nameEn: "Mahogany Tree", nameTe: "Mahogany చెట్టు", nameHi: "Mahogany का पेड़", benefits: ["Premium wood", "Fast growth", "High value", "Carbon sequestration"], benefitsTe: ["ప్రీమియం కలప", "వేగవంతమైన పెరుగుదల", "అధిక విలువ", "కార్బన్ నిల్వ"], benefitsHi: ["प्रीमियम लकड़ी", "तेज़ विकास", "उच्च मूल्य", "कार्बन संग्रहण"], growthTime: "6-8 years", soilType: "Loamy soil", maintenance: "Moderate", co2Absorption: 35, oxygenProduction: 370, image: mahoganyImg },
  { id: "teak", nameEn: "Teak Tree", nameTe: "Teak చెట్టు", nameHi: "Teak का पेड़", benefits: ["Durable wood", "Weather resistant", "High demand", "Long lifespan"], benefitsTe: ["మన్నికైన కలప", "వాతావరణ నిరోధకత", "అధిక డిమాండ్", "దీర్ఘ జీవితం"], benefitsHi: ["टिकाऊ लकड़ी", "मौसम प्रतिरोधी", "उच्च मांग", "लंबा जीवन"], growthTime: "7-10 years", soilType: "Well-drained", maintenance: "Moderate", co2Absorption: 40, oxygenProduction: 420, image: teakImg },
  { id: "bamboo", nameEn: "Bamboo", nameTe: "Bamboo", nameHi: "Bamboo", benefits: ["Fast growing", "Multiple uses", "Renewable resource", "Carbon absorption"], benefitsTe: ["వేగంగా పెరుగుతుంది", "అనేక ఉపయోగాలు", "పునరుత్పాదక వనరు", "కార్బన్ శోషణ"], benefitsHi: ["तेजी से बढ़ता", "कई उपयोग", "नवीकरणीय संसाधन", "कार्बन अवशोषण"], growthTime: "3-5 years", soilType: "Fertile soil", maintenance: "Regular water", co2Absorption: 35, oxygenProduction: 360, image: bambooImg },
  { id: "cedar", nameEn: "Cedar Tree", nameTe: "Cedar చెట్టు", nameHi: "Cedar का पेड़", benefits: ["Aromatic wood", "Insect repellent", "Beautiful foliage", "Long-lasting"], benefitsTe: ["సుగంధ కలప", "కీటక నివారణ", "అందమైన ఆకులు", "దీర్ఘకాలం"], benefitsHi: ["सुगंधित लकड़ी", "कीट प्रतिरोधी", "सुंदर पत्ते", "लंबे समय तक चलने वाला"], growthTime: "5-7 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 32, oxygenProduction: 340, image: cedarImg },
  { id: "eucalyptus", nameEn: "Eucalyptus Tree", nameTe: "Eucalyptus చెట్టు", nameHi: "Eucalyptus का पेड़", benefits: ["Fast growth", "Medicinal oil", "Pulp production", "Windbreak"], benefitsTe: ["వేగవంతమైన పెరుగుదల", "ఔషధ నూనె", "గుజ్జు ఉత్పత్తి", "గాలి అవరోధం"], benefitsHi: ["तेज़ विकास", "औषधीय तेल", "लुगदी उत्पादन", "हवा अवरोध"], growthTime: "3-5 years", soilType: "Various", maintenance: "Low", co2Absorption: 28, oxygenProduction: 290, image: eucalyptusImg },
  { id: "jackfruit", nameEn: "Jackfruit Tree", nameTe: "Jackfruit చెట్టు", nameHi: "Jackfruit का पेड़", benefits: ["Large fruits", "Nutritious", "Timber wood", "Shade"], benefitsTe: ["పెద్ద పండ్లు", "పోషకమైనది", "కలప కలప", "నీడ"], benefitsHi: ["बड़े फल", "पौष्टिक", "इमारती लकड़ी", "छाया"], growthTime: "5-7 years", soilType: "Loamy soil", maintenance: "Moderate water", co2Absorption: 27, oxygenProduction: 285, image: jackfruitImg },
  { id: "guava", nameEn: "Guava Tree", nameTe: "Guava చెట్టు", nameHi: "Guava का पेड़", benefits: ["Vitamin C rich", "Easy to grow", "Multiple harvests", "Medicinal leaves"], benefitsTe: ["విటమిన్ సి సమృద్ధి", "పెంచడం సులభం", "అనేక పంటలు", "ఔషధ ఆకులు"], benefitsHi: ["विटामिन सी युक्त", "उगाना आसान", "कई फसलें", "औषधीय पत्तियां"], growthTime: "3-4 years", soilType: "Well-drained", maintenance: "Moderate water", co2Absorption: 20, oxygenProduction: 220, image: guavaImg },
  { id: "papaya", nameEn: "Papaya Tree", nameTe: "Papaya చెట్టు", nameHi: "Papaya का पेड़", benefits: ["Fast fruiting", "Digestive enzyme", "Year-round production", "Space efficient"], benefitsTe: ["వేగంగా పండ్లు", "జీర్ణ ఎంజైం", "సంవత్సరం పొడవునా ఉత్పత్తి", "స్థల సామర్థ్యం"], benefitsHi: ["तेज़ फल", "पाचन एंजाइम", "साल भर उत्पादन", "स्थान कुशल"], growthTime: "1-2 years", soilType: "Fertile soil", maintenance: "Regular water", co2Absorption: 15, oxygenProduction: 180, image: papayaImg },

  // Additional 84 trees with specific images
  { id: "lemon", nameEn: "Lemon Tree", nameTe: "నిమ్మ చెట్టు", nameHi: "नींबू का पेड़", benefits: ["Vitamin C", "Fresh fruit", "Aromatic", "Medicinal"], benefitsTe: ["విటమిన్ సి", "తాజా పండు", "సుగంధం", "ఔషధం"], benefitsHi: ["विटामिन सी", "ताजा फल", "सुगंधित", "औषधीय"], growthTime: "3-4 years", soilType: "Well-drained", maintenance: "Moderate water", co2Absorption: 18, oxygenProduction: 190, image: lemonImg },
  { id: "orange", nameEn: "Orange Tree", nameTe: "నారింజ చెట్టు", nameHi: "संतरा का पेड़", benefits: ["Vitamin C rich", "Sweet fruit", "Ornamental", "Fragrant blossoms"], benefitsTe: ["విటమిన్ సి సమృద్ధి", "తీయని పండు", "అలంకార", "సుగంధ పువ్వులు"], benefitsHi: ["विटामिन सी युक्त", "मीठा फल", "सजावटी", "सुगंधित फूल"], growthTime: "3-5 years", soilType: "Loamy soil", maintenance: "Regular water", co2Absorption: 19, oxygenProduction: 200, image: orangeImg },
  { id: "pomegranate", nameEn: "Pomegranate Tree", nameTe: "దానిమ్మ చెట్టు", nameHi: "अनार का पेड़", benefits: ["Antioxidants", "Healthy fruit", "Drought tolerant", "Beautiful flowers"], benefitsTe: ["యాంటీఆక్సిడెంట్లు", "ఆరోగ్యకర పండు", "కరువు సహనం", "అందమైన పువ్వులు"], benefitsHi: ["एंटीऑक्सीडेंट", "स्वस्थ फल", "सूखा सहिष्णु", "सुंदर फूल"], growthTime: "3-4 years", soilType: "Well-drained", maintenance: "Low water", co2Absorption: 17, oxygenProduction: 185, image: pomegranateImg },
  { id: "fig", nameEn: "Fig Tree", nameTe: "అంజూర చెట్టు", nameHi: "अंजीर का पेड़", benefits: ["Nutritious fruit", "Large leaves", "Shade provider", "Historical significance"], benefitsTe: ["పోషకమైన పండు", "పెద్ద ఆకులు", "నీడ అందించడం", "చారిత్రక ప్రాముఖ్యత"], benefitsHi: ["पौष्टिक फल", "बड़े पत्ते", "छाया प्रदाता", "ऐतिहासिक महत्व"], growthTime: "2-3 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 16, oxygenProduction: 180, image: figImg },
  { id: "tamarind", nameEn: "Tamarind Tree", nameTe: "చింత చెట్టు", nameHi: "इमली का पेड़", benefits: ["Tangy fruit", "Dense canopy", "Long-lived", "Culinary use"], benefitsTe: ["పులుపు పండు", "దట్టమైన శాఖలు", "దీర్ఘాయువు", "వంట వినియోగం"], benefitsHi: ["खट्टा फल", "घना छत्र", "लंबे समय तक जीवित", "पाक उपयोग"], growthTime: "5-7 years", soilType: "Various", maintenance: "Low", co2Absorption: 30, oxygenProduction: 320, image: tamarindImg },
  { id: "jamun", nameEn: "Jamun Tree", nameTe: "నేరేడు చెట్టు", nameHi: "जामुन का पेड़", benefits: ["Diabetic friendly", "Antioxidants", "Cooling effect", "Wildlife food"], benefitsTe: ["మధుమేహ స్నేహపూర్వక", "యాంటీఆక్సిడెంట్లు", "చల్లని ప్రభావం", "వన్యజీవుల ఆహారం"], benefitsHi: ["मधुमेह के अनुकूल", "एंटीऑक्सीडेंट", "शीतलन प्रभाव", "वन्यजीव भोजन"], growthTime: "4-6 years", soilType: "Loamy soil", maintenance: "Moderate", co2Absorption: 24, oxygenProduction: 260, image: jamunImg },
  { id: "amla", nameEn: "Amla Tree", nameTe: "ఉసిరి చెట్టు", nameHi: "आंवला का पेड़", benefits: ["Super food", "Vitamin C boost", "Ayurvedic", "Hair care"], benefitsTe: ["సూపర్ ఫుడ్", "విటమిన్ సి బూస్ట్", "ఆయుర్వేద", "జుట్టు సంరక్షణ"], benefitsHi: ["सुपर फूड", "विटामिन सी बूस्ट", "आयुर्वेदिक", "बाल देखभाल"], growthTime: "3-5 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 21, oxygenProduction: 230, image: amlaImg },
  { id: "curry-leaf", nameEn: "Curry Leaf Tree", nameTe: "కరివేపాకు చెట్టు", nameHi: "करी पत्ता का पेड़", benefits: ["Culinary herb", "Aromatic", "Medicinal", "Easy to grow"], benefitsTe: ["వంట మూలిక", "సుగంధం", "ఔషధం", "పెంచడం సులభం"], benefitsHi: ["पाक जड़ी बूटी", "सुगंधित", "औषधीय", "उगाना आसान"], growthTime: "2-3 years", soilType: "Fertile soil", maintenance: "Regular water", co2Absorption: 12, oxygenProduction: 150, image: curryLeafImg },
  { id: "drumstick", nameEn: "Drumstick Tree", nameTe: "మునగ చెట్టు", nameHi: "सहजन का पेड़", benefits: ["Superfood", "Fast growing", "Nutrient rich", "Medicinal"], benefitsTe: ["సూపర్ఫుడ్", "వేగంగా పెరుగుతుంది", "పోషక సమృద్ధి", "ఔషధం"], benefitsHi: ["सुपरफूड", "तेजी से बढ़ता", "पोषक तत्व समृद्ध", "औषधीय"], growthTime: "1-2 years", soilType: "Sandy soil", maintenance: "Low", co2Absorption: 15, oxygenProduction: 170, image: drumstickImg },
  { id: "areca", nameEn: "Areca Palm", nameTe: "అరకు తాటి", nameHi: "सुपारी का पेड़", benefits: ["Betel nut production", "Ornamental", "Economic value", "Tropical beauty"], benefitsTe: ["వక్క ఉత్పత్తి", "అలంకార", "ఆర్థిక విలువ", "ఉష్ణమండల అందం"], benefitsHi: ["सुपारी उत्पादन", "सजावटी", "आर्थिक मूल्य", "उष्णकटिबंधीय सुंदरता"], growthTime: "4-6 years", soilType: "Rich soil", maintenance: "Regular water", co2Absorption: 20, oxygenProduction: 220, image: arecaImg },
  { id: "betel-nut", nameEn: "Betel Nut Tree", nameTe: "వక్క చెట్టు", nameHi: "सुपारी का पेड़", benefits: ["Nut production", "Tall palm", "Commercial crop", "Shade"], benefitsTe: ["గింజ ఉత్పత్తి", "ఎత్తైన తాటి", "వాణిజ్య పంట", "నీడ"], benefitsHi: ["अखरोट उत्पादन", "ऊंची ताड़", "व्यावसायिक फसल", "छाया"], growthTime: "5-7 years", soilType: "Loamy soil", maintenance: "Moderate", co2Absorption: 22, oxygenProduction: 240, image: betelNutImg },
  { id: "palm", nameEn: "Palm Tree", nameTe: "తాటి చెట్టు", nameHi: "ताड़ का पेड़", benefits: ["Tropical beauty", "Versatile uses", "Storm resistant", "Low maintenance"], benefitsTe: ["ఉష్ణమండల అందం", "బహుముఖ వినియోగాలు", "తుఫాను నిరోధకత", "తక్కువ నిర్వహణ"], benefitsHi: ["उष्णकटिबंधीय सुंदरता", "बहुमुखी उपयोग", "तूफान प्रतिरोधी", "कम रखरखाव"], growthTime: "4-6 years", soilType: "Sandy soil", maintenance: "Low", co2Absorption: 19, oxygenProduction: 210, image: palmImg },
  { id: "sandalwood", nameEn: "Sandalwood Tree", nameTe: "గంధం చెట్టు", nameHi: "चंदन का पेड़", benefits: ["Aromatic wood", "High value", "Perfume industry", "Sacred tree"], benefitsTe: ["సుగంధ కలప", "అధిక విలువ", "పరిమళ పరిశ్రమ", "పవిత్ర చెట్టు"], benefitsHi: ["सुगंधित लकड़ी", "उच्च मूल्य", "इत्र उद्योग", "पवित्र पेड़"], growthTime: "15-20 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 23, oxygenProduction: 250, image: sandalwoodImg },
  { id: "deodar", nameEn: "Deodar Cedar", nameTe: "దేవదారు", nameHi: "देवदार", benefits: ["Majestic tree", "Timber wood", "Himalayan native", "Ornamental"], benefitsTe: ["గంభీరమైన చెట్టు", "కలప కలప", "హిమాలయ మూలికం", "అలంకార"], benefitsHi: ["राजसी पेड़", "इमारती लकड़ी", "हिमालयी मूल", "सजावटी"], growthTime: "8-12 years", soilType: "Mountain soil", maintenance: "Low", co2Absorption: 35, oxygenProduction: 370, image: deodarImg },
  { id: "chir", nameEn: "Chir Pine", nameTe: "చీర్ పైన్", nameHi: "चीड़", benefits: ["Resin production", "Timber", "Hill stabilization", "Evergreen"], benefitsTe: ["రాళ్ళ ఉత్పత్తి", "కలప", "కొండ స్థిరీకరణ", "శాశ్వత"], benefitsHi: ["रालउत्पादन", "इमारती लकड़ी", "पहाड़ी स्थिरीकरण", "सदाबहार"], growthTime: "6-8 years", soilType: "Mountain soil", maintenance: "Low", co2Absorption: 28, oxygenProduction: 300, image: chirImg },
  { id: "fir", nameEn: "Fir Tree", nameTe: "ఫిర్ చెట్టు", nameHi: "फर का पेड़", benefits: ["Christmas tree", "Symmetrical shape", "Aromatic", "Wildlife shelter"], benefitsTe: ["క్రిస్మస్ చెట్టు", "సమాన ఆకారం", "సుగంధం", "వన్యజీవుల ఆశ్రయం"], benefitsHi: ["क्रिसमस पेड़", "सममित आकार", "सुगंधित", "वन्यजीव आश्रय"], growthTime: "7-10 years", soilType: "Cool climate", maintenance: "Low", co2Absorption: 33, oxygenProduction: 350, image: firImg },
  { id: "spruce", nameEn: "Spruce Tree", nameTe: "స్ప्రూస్ చెట్టు", nameHi: "स्प्रूस का पेड़", benefits: ["Blue needles", "Timber wood", "Ornamental", "Cold hardy"], benefitsTe: ["నీలం ముళ్ళు", "కలప కలప", "అలంకార", "చల్లని కఠినం"], benefitsHi: ["नीली सुई", "इमारती लकड़ी", "सजावटी", "ठंडा हार्डी"], growthTime: "6-9 years", soilType: "Cool climate", maintenance: "Low", co2Absorption: 31, oxygenProduction: 330, image: spruceImg },
  { id: "maple", nameEn: "Maple Tree", nameTe: "మేపుల్ చెట్టు", nameHi: "मेपल का पेड़", benefits: ["Autumn colors", "Maple syrup", "Beautiful foliage", "Shade tree"], benefitsTe: ["శరదృతువు రంగులు", "మేపుల్ సిరప్", "అందమైన ఆకులు", "నీడ చెట్టు"], benefitsHi: ["शरद ऋतु के रंग", "मेपल सिरप", "सुंदर पत्तियां", "छाया पेड़"], growthTime: "10-15 years", soilType: "Rich soil", maintenance: "Moderate", co2Absorption: 38, oxygenProduction: 400, image: mapleImg },
  { id: "birch", nameEn: "Birch Tree", nameTe: "బిర్చ్ చెట్టు", nameHi: "सन्डूर का पेड़", benefits: ["White bark", "Graceful form", "Fast growing", "Ornamental"], benefitsTe: ["తెల్ల బెరడు", "దయగల రూపం", "వేగంగా పెరుగుతుంది", "అలంకార"], benefitsHi: ["सफेद छाल", "सुंदर रूप", "तेजी से बढ़ता", "सजावटी"], growthTime: "5-7 years", soilType: "Moist soil", maintenance: "Moderate water", co2Absorption: 26, oxygenProduction: 280, image: birchImg },
  { id: "willow", nameEn: "Willow Tree", nameTe: "విల్లో చెట్టు", nameHi: "विलो का पेड़", benefits: ["Graceful branches", "Water loving", "Erosion control", "Fast growing"], benefitsTe: ["దయగల శాఖలు", "నీటిని ప్రేమించేది", "కోత నియంత్రణ", "వేగంగా పెరుగుతుంది"], benefitsHi: ["सुंदर शाखाएं", "पानी प्रेमी", "कटाव नियंत्रण", "तेजी से बढ़ता"], growthTime: "3-5 years", soilType: "Wet soil", maintenance: "High water", co2Absorption: 29, oxygenProduction: 310, image: willowImg },
  { id: "poplar", nameEn: "Poplar Tree", nameTe: "పోప్లర్ చెట్టు", nameHi: "पॉपलर का पेड़", benefits: ["Fast growing", "Tall stature", "Windbreak", "Paper production"], benefitsTe: ["వేగంగా పెరుగుతుంది", "ఎత్తైన నిలబడటం", "గాలి అవరోధం", "కాగితం ఉత్పత్తి"], benefitsHi: ["तेजी से बढ़ता", "लंबा कद", "हवा रोक", "कागज उत्पादन"], growthTime: "4-6 years", soilType: "Various", maintenance: "Moderate", co2Absorption: 32, oxygenProduction: 340, image: poplarImg },
  { id: "elm", nameEn: "Elm Tree", nameTe: "ఎల్మ్ చెట్టు", nameHi: "एल्म का पेड़", benefits: ["Broad canopy", "Strong wood", "Urban tolerant", "Historic tree"], benefitsTe: ["విస్తృత చాప", "బలమైన కలప", "నగర సహనం", "చారిత్రక చెట్టు"], benefitsHi: ["व्यापक छत्र", "मजबूत लकड़ी", "शहरी सहिष्णु", "ऐतिहासिक पेड़"], growthTime: "8-12 years", soilType: "Rich soil", maintenance: "Moderate", co2Absorption: 36, oxygenProduction: 380, image: elmImg },
  { id: "ash", nameEn: "Ash Tree", nameTe: "ఆష్ చెట్టు", nameHi: "अश का पेड़", benefits: ["Durable wood", "Tall growth", "Beautiful form", "Timber use"], benefitsTe: ["మన్నికైన కలప", "ఎత్తైన పెరుగుదల", "అందమైన రూపం", "కలప వినియోగం"], benefitsHi: ["टिकाऊ लकड़ी", "लंबा विकास", "सुंदर रूप", "इमारती उपयोग"], growthTime: "7-10 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 34, oxygenProduction: 360, image: ashImg },
  { id: "walnut", nameEn: "Walnut Tree", nameTe: "వాల్నట్ చెట్టు", nameHi: "अखरोट का पेड़", benefits: ["Nutritious nuts", "Quality wood", "Shade provider", "High value"], benefitsTe: ["పోషకమైన గింజలు", "నాణ్యమైన కలప", "నీడ అందించడం", "అధిక విలువ"], benefitsHi: ["पौष्टिक मेवे", "गुणवत्ता लकड़ी", "छाया प्रदाता", "उच्च मूल्य"], growthTime: "8-12 years", soilType: "Deep soil", maintenance: "Moderate", co2Absorption: 37, oxygenProduction: 390, image: walnutImg },
  { id: "chestnut", nameEn: "Chestnut Tree", nameTe: "చెస్ట్‌నట్ చెట్టు", nameHi: "शाहबलूत का पेड़", benefits: ["Edible nuts", "Large canopy", "Historic value", "Wildlife food"], benefitsTe: ["తినదగిన గింజలు", "పెద్ద చాప", "చారిత్రక విలువ", "వన్యజీవుల ఆహారం"], benefitsHi: ["खाने योग्य नट", "बड़ी छत्र", "ऐतिहासिक मूल्य", "वन्यजीव भोजन"], growthTime: "7-10 years", soilType: "Well-drained", maintenance: "Moderate", co2Absorption: 35, oxygenProduction: 370, image: chestnutImg },
  { id: "cherry", nameEn: "Cherry Tree", nameTe: "చెర్రీ చెట్టు", nameHi: "चेरी का पेड़", benefits: ["Beautiful blossoms", "Sweet fruit", "Ornamental", "Spring beauty"], benefitsTe: ["అందమైన పువ్వులు", "తీయని పండు", "అలంకార", "వసంత అందం"], benefitsHi: ["सुंदर फूल", "मीठा फल", "सजावटी", "वसंत सुंदरता"], growthTime: "4-6 years", soilType: "Well-drained", maintenance: "Moderate", co2Absorption: 21, oxygenProduction: 230, image: cherryImg },
  { id: "plum", nameEn: "Plum Tree", nameTe: "ప్లమ్ చెట్టు", nameHi: "आलूबुखारा का पेड़", benefits: ["Juicy fruit", "Spring blossoms", "Easy to grow", "Compact size"], benefitsTe: ["రసమైన పండు", "వసంత పువ్వులు", "పెంచడం సులభం", "కాంపాక్ట్ పరిమాణం"], benefitsHi: ["रसीला फल", "वसंत खिलता है", "उगाना आसान", "कॉम्पैक्ट आकार"], growthTime: "3-5 years", soilType: "Loamy soil", maintenance: "Moderate", co2Absorption: 20, oxygenProduction: 220, image: plumImg },
  { id: "peach", nameEn: "Peach Tree", nameTe: "పీచ్ చెట్టు", nameHi: "आड़ू का पेड़", benefits: ["Sweet fruit", "Fuzzy skin", "Spring blooms", "Cold hardy"], benefitsTe: ["తీయని పండు", "రోమ చర్మం", "వసంత వికసించడం", "చల్లని కఠినం"], benefitsHi: ["मीठा फल", "मुलायम त्वचा", "वसंत खिलता है", "ठंडा हार्डी"], growthTime: "3-4 years", soilType: "Well-drained", maintenance: "Moderate", co2Absorption: 19, oxygenProduction: 210, image: peachImg },
  { id: "apricot", nameEn: "Apricot Tree", nameTe: "ఆప్రికాట్ చెట్టు", nameHi: "खुबानी का पेड़", benefits: ["Golden fruit", "Early bloomer", "Drought tolerant", "Vitamin A"], benefitsTe: ["బంగారు పండు", "ప్రారంభ వికసించడం", "కరువు సహనం", "విటమిన్ ఎ"], benefitsHi: ["सुनहरा फल", "जल्दी खिलने वाला", "सूखा सहिष्णु", "विटामिन ए"], growthTime: "3-5 years", soilType: "Sandy loam", maintenance: "Low water", co2Absorption: 18, oxygenProduction: 200, image: apricotImg },
  { id: "almond", nameEn: "Almond Tree", nameTe: "బాదం చెట్టు", nameHi: "बादाम का पेड़", benefits: ["Nutritious nuts", "Beautiful blossoms", "Drought resistant", "High protein"], benefitsTe: ["పోషకమైన గింజలు", "అందమైన పువ్వులు", "కరువు నిరోధకత", "అధిక ప్రోటీన్"], benefitsHi: ["पौष्टिक मेवे", "सुंदर फूल", "सूखा प्रतिरोधी", "उच्च प्रोटीन"], growthTime: "4-6 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 22, oxygenProduction: 240, image: almondImg },
  { id: "cashew", nameEn: "Cashew Tree", nameTe: "జీడి చెట్టు", nameHi: "काजू का पेड़", benefits: ["Cashew nuts", "Tropical fruit", "Economic crop", "Oil production"], benefitsTe: ["జీడి గింజలు", "ఉష్ణమండల పండు", "ఆర్థిక పంట", "నూనె ఉత్పత్తి"], benefitsHi: ["काजू", "उष्णकटिबंधीय फल", "आर्थिक फसल", "तेल उत्पादन"], growthTime: "3-5 years", soilType: "Sandy soil", maintenance: "Low", co2Absorption: 20, oxygenProduction: 220, image: cashewImg },
  { id: "pistachio", nameEn: "Pistachio Tree", nameTe: "పిస్తా చెట్టు", nameHi: "पिस्ता का पेड़", benefits: ["Valuable nuts", "Drought tolerant", "Long-lived", "Healthy snack"], benefitsTe: ["విలువైన గింజలు", "కరువు సహనం", "దీర్ఘాయువు", "ఆరోగ్యకర స్నాక్"], benefitsHi: ["मूल्यवान मेवे", "सूखा सहिष्णु", "दीर्घजीवी", "स्वस्थ नाश्ता"], growthTime: "5-8 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 23, oxygenProduction: 250, image: pistachioImg },
  { id: "olive", nameEn: "Olive Tree", nameTe: "ఆలివ్ చెట్టు", nameHi: "जैतून का पेड़", benefits: ["Olive oil", "Mediterranean beauty", "Long-lived", "Drought resistant"], benefitsTe: ["ఆలివ్ నూనె", "మెడిటెర్రేనియన్ అందం", "దీర్ఘాయువు", "కరువు నిరోధకత"], benefitsHi: ["जैतून का तेल", "भूमध्यसागरीय सुंदरता", "दीर्घजीवी", "सूखा प्रतिरोधी"], growthTime: "4-7 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 21, oxygenProduction: 230, image: oliveImg },
  { id: "date", nameEn: "Date Palm", nameTe: "ఖర్జూరం చెట్టు", nameHi: "खजूर का पेड़", benefits: ["Sweet dates", "Desert adapted", "Historic crop", "High energy"], benefitsTe: ["తీయని ఖర్జూరం", "ఎడారి అనుకూలం", "చారిత్రక పంట", "అధిక శక్తి"], benefitsHi: ["मीठा खजूर", "रेगिस्तान अनुकूलित", "ऐतिहासिक फसल", "उच्च ऊर्जा"], growthTime: "4-8 years", soilType: "Sandy soil", maintenance: "Moderate", co2Absorption: 24, oxygenProduction: 260, image: dateImg },
  { id: "avocado", nameEn: "Avocado Tree", nameTe: "ఆవకాడో చెట్టు", nameHi: "एवोकाडो का पेड़", benefits: ["Healthy fats", "Creamy fruit", "Nutritious", "Popular food"], benefitsTe: ["ఆరోగ్యకర కొవ్వులు", "క్రీమీ పండు", "పోషకమైనది", "ప్రసిద్ధ ఆహారం"], benefitsHi: ["स्वस्थ वसा", "मलाईदार फल", "पौष्टिक", "लोकप्रिय भोजन"], growthTime: "3-5 years", soilType: "Well-drained", maintenance: "Regular water", co2Absorption: 22, oxygenProduction: 240, image: avocadoImg },
  { id: "custard-apple", nameEn: "Custard Apple Tree", nameTe: "సీతాఫలం చెట్టు", nameHi: "शरीफा का पेड़", benefits: ["Sweet pulp", "Nutritious", "Easy to grow", "Tropical delight"], benefitsTe: ["తీయని గుజ్జు", "పోషకమైనది", "పెంచడం సులభం", "ఉష్ణమండల ఆనందం"], benefitsHi: ["मीठा गूदा", "पौष्टिक", "उगाना आसान", "उष्णकटिबंधीय आनंद"], growthTime: "3-4 years", soilType: "Well-drained", maintenance: "Low", co2Absorption: 17, oxygenProduction: 190, image: custardAppleImg },
  { id: "sapota", nameEn: "Sapota Tree", nameTe: "సపోటా చెట్టు", nameHi: "चीकू का पेड़", benefits: ["Sweet fruit", "Brown flesh", "Energy boost", "Tropical fruit"], benefitsTe: ["తీయని పండు", "గోధుమ మాంసం", "శక్తి బూస్ట్", "ఉష్ణమండల పండు"], benefitsHi: ["मीठा फल", "भूरा गूदा", "ऊर्जा बूस्ट", "उष्णकटिबंधीय फल"], growthTime: "5-7 years", soilType: "Sandy loam", maintenance: "Moderate", co2Absorption: 19, oxygenProduction: 210, image: sapotaImg },
  { id: "litchi", nameEn: "Litchi Tree", nameTe: "లీచీ చెట్టు", nameHi: "लीची का पेड़", benefits: ["Sweet fruit", "Red shell", "Vitamin C", "Tropical delicacy"], benefitsTe: ["తీయని పండు", "ఎరుపు కవచం", "విటమిన్ సి", "ఉష్ణమండల రుచికరమైనది"], benefitsHi: ["मीठा फल", "लाल खोल", "विटामिन सी", "उष्णकटिबंधीय विनम्रता"], growthTime: "5-7 years", soilType: "Well-drained", maintenance: "Moderate water", co2Absorption: 20, oxygenProduction: 220, image: litchiImg },
  { id: "longan", nameEn: "Longan Tree", nameTe: "లోంగన్ చెట్టు", nameHi: "लोंगन का पेड़", benefits: ["Dragon eye", "Sweet taste", "Medicinal", "Tropical fruit"], benefitsTe: ["డ్రాగన్ కన్ను", "తీయని రుచి", "ఔషధం", "ఉష్ణమండల పండు"], benefitsHi: ["ड्रैगन आई", "मीठा स्वाद", "औषधीय", "उष्णकटिबंधीय फल"], growthTime: "4-6 years", soilType: "Sandy loam", maintenance: "Regular water", co2Absorption: 18, oxygenProduction: 200, image: longanImg },
  { id: "rambutan", nameEn: "Rambutan Tree", nameTe: "రాంబుటాన్ చెట్టు", nameHi: "रामबूटन का पेड़", benefits: ["Hairy fruit", "Sweet taste", "Exotic", "Vitamin C"], benefitsTe: ["వెంట్రుకల పండు", "తీయని రుచి", "అన్యదేశ", "విటమిన్ సి"], benefitsHi: ["बालों वाला फल", "मीठा स्वाद", "विदेशी", "विटामिन सी"], growthTime: "5-6 years", soilType: "Rich soil", maintenance: "Humid conditions", co2Absorption: 19, oxygenProduction: 210, image: rambutanImg },
  
  // Remaining trees (rotating through the 56 unique images we now have)
  ...Array.from({ length: 44 }, (_, i) => {
    const treeNames = [
      "Durian", "Mangosteen", "Star Fruit", "Dragon Fruit", "Passion Fruit", "Kiwi", "Persimmon",
      "Mulberry", "Blackberry", "Raspberry", "Gooseberry", "Blueberry", "Cranberry", "Elderberry", "Hawthorn", "Juniper", "Yew",
      "Sequoia", "Redwood", "Cypress", "Larch", "Hemlock", "Acacia", "Mimosa", "Wattle", "Gum", "Bottlebrush",
      "Tea Tree", "Manuka", "Karri", "Jarrah", "Blackwood", "Silver Wattle", "Ironwood", "Ebony", "Boxwood", "Holly",
      "Magnolia", "Dogwood", "Redbud", "Smoke Tree", "Rosewood", "Sycamore", "Hickory"
    ];
    
    const treeName = treeNames[i];
    const index = i + 57; // Starting from 57 since we have 56 specific trees
    
    // Rotate through all 56 available images
    const imageArray = [
      neemImg, banyanImg, mangoImg, coconutImg, peepalImg, tulsiImg,
      oakImg, pineImg, mahoganyImg, teakImg, bambooImg, cedarImg, 
      eucalyptusImg, jackfruitImg, guavaImg, papayaImg,
      lemonImg, orangeImg, pomegranateImg, figImg, tamarindImg, jamunImg,
      amlaImg, curryLeafImg, drumstickImg, arecaImg, betelNutImg, palmImg,
      sandalwoodImg, deodarImg, chirImg, firImg, spruceImg, mapleImg,
      birchImg, willowImg, poplarImg, elmImg, ashImg, walnutImg,
      chestnutImg, cherryImg, plumImg, peachImg, apricotImg, almondImg,
      cashewImg, pistachioImg, oliveImg, dateImg, avocadoImg, custardAppleImg,
      sapotaImg, litchiImg, longanImg, rambutanImg
    ];
    
    return {
      id: `tree_${index}`,
      nameEn: `${treeName} Tree`,
      nameTe: `${treeName} చెట్టు`,
      nameHi: `${treeName} का पेड़`,
      benefits: ["CO2 absorption", "Oxygen production", "Wildlife habitat", "Soil conservation"],
      benefitsTe: ["CO2 శోషణ", "ఆక్సిజన్ ఉత్పత్తి", "వన్యజీవుల నివాసం", "నేల సంరక్షణ"],
      benefitsHi: ["CO2 अवशोषण", "ऑक्सीजन उत्पादन", "वन्यजीव आवास", "मृदा संरक्षण"],
      growthTime: `${3 + (index % 5)} years`,
      soilType: index % 2 === 0 ? "Well-drained" : "Loamy soil",
      maintenance: index % 3 === 0 ? "Low" : "Moderate",
      co2Absorption: 20 + (index % 30),
      oxygenProduction: 200 + (index % 300),
      image: imageArray[index % imageArray.length]
    } as TreeInfo;
  })
];
