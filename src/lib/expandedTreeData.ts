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

  // Additional 84 trees with rotated images
  ...Array.from({ length: 84 }, (_, i) => {
    const treeNames = [
      "Lemon", "Orange", "Pomegranate", "Fig", "Tamarind", "Jamun", "Amla",
      "Curry Leaf", "Drumstick", "Areca", "Betel Nut", "Palm", "Sandalwood", "Deodar", "Chir", "Fir", "Spruce",
      "Maple", "Birch", "Willow", "Poplar", "Elm", "Ash", "Walnut", "Chestnut", "Cherry", "Plum",
      "Peach", "Apricot", "Almond", "Cashew", "Pistachio", "Olive", "Date", "Avocado", "Custard Apple", "Sapota",
      "Litchi", "Longan", "Rambutan", "Durian", "Mangosteen", "Star Fruit", "Dragon Fruit", "Passion Fruit", "Kiwi", "Persimmon",
      "Mulberry", "Blackberry", "Raspberry", "Gooseberry", "Blueberry", "Cranberry", "Elderberry", "Hawthorn", "Juniper", "Yew",
      "Sequoia", "Redwood", "Cypress", "Larch", "Hemlock", "Acacia", "Mimosa", "Wattle", "Gum", "Bottlebrush",
      "Tea Tree", "Manuka", "Karri", "Jarrah", "Blackwood", "Silver Wattle", "Ironwood", "Ebony", "Boxwood", "Holly",
      "Magnolia", "Dogwood", "Redbud", "Smoke Tree", "Rosewood"
    ];
    
    const treeName = treeNames[i % treeNames.length];
    const index = i + 17; // Starting from 17 since we have 16 unique trees now
    
    // Rotate through the 16 available images
    const imageArray = [
      neemImg, banyanImg, mangoImg, coconutImg, peepalImg, tulsiImg,
      oakImg, pineImg, mahoganyImg, teakImg, bambooImg, cedarImg, 
      eucalyptusImg, jackfruitImg, guavaImg, papayaImg
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
