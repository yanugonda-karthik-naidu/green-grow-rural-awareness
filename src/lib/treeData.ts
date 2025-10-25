export interface TreeInfo {
  id: string;
  nameEn: string;
  nameTe: string;
  nameHi: string;
  benefits: string[];
  benefitsTe: string[];
  benefitsHi: string[];
  growthTime: string;
  soilType: string;
  maintenance: string;
  co2Absorption: number; // kg per year
  oxygenProduction: number; // liters per day
}

export const treeData: TreeInfo[] = [
  {
    id: "neem",
    nameEn: "Neem Tree",
    nameTe: "వేప చెట్టు",
    nameHi: "नीम का पेड़",
    benefits: ["Air purification", "Medicinal properties", "Natural pesticide", "Shade provider"],
    benefitsTe: ["గాలి శుద్ధి", "ఔషధ గుణాలు", "సహజ పురుగుమందు", "నీడ అందించడం"],
    benefitsHi: ["वायु शुद्धिकरण", "औषधीय गुण", "प्राकृतिक कीटनाशक", "छाया प्रदाता"],
    growthTime: "3-5 years to maturity",
    soilType: "Dry, well-drained soil",
    maintenance: "Low water needs, drought resistant",
    co2Absorption: 25,
    oxygenProduction: 260
  },
  {
    id: "banyan",
    nameEn: "Banyan Tree",
    nameTe: "మర్రి చెట్టు",
    nameHi: "बरगद का पेड़",
    benefits: ["Large canopy", "Oxygen production", "Wildlife habitat", "Cultural significance"],
    benefitsTe: ["పెద్ద చాప", "ఆక్సిజన్ ఉత్పత్తి", "వన్యజీవుల ఆవాసం", "సాంస్కృతిక ప్రాముఖ్యత"],
    benefitsHi: ["बड़ी छतरी", "ऑक्सीजन उत्पादन", "वन्यजीव आवास", "सांस्कृतिक महत्व"],
    growthTime: "5-10 years to establish",
    soilType: "Rich, moist soil",
    maintenance: "Regular watering when young",
    co2Absorption: 50,
    oxygenProduction: 500
  },
  {
    id: "mango",
    nameEn: "Mango Tree",
    nameTe: "మామిడి చెట్టు",
    nameHi: "आम का पेड़",
    benefits: ["Delicious fruits", "Dense foliage", "Shade", "Economic value"],
    benefitsTe: ["రుచికరమైన పండ్లు", "దట్టమైన ఆకులు", "నీడ", "ఆర్థిక విలువ"],
    benefitsHi: ["स्वादिष्ट फल", "घना पत्ते", "छाया", "आर्थिक मूल्य"],
    growthTime: "4-6 years for fruiting",
    soilType: "Well-drained, sandy loam",
    maintenance: "Moderate watering, pruning needed",
    co2Absorption: 28,
    oxygenProduction: 300
  },
  {
    id: "coconut",
    nameEn: "Coconut Tree",
    nameTe: "కొబ్బరి చెట్టు",
    nameHi: "नारियल का पेड़",
    benefits: ["Coconut production", "Versatile uses", "Coastal protection", "Income source"],
    benefitsTe: ["కొబ్బరి ఉత్పత్తి", "బహుముఖ వినియోగాలు", "తీర రక్షణ", "ఆదాయ వనరు"],
    benefitsHi: ["नारियल उत्पादन", "बहुमुखी उपयोग", "तटीय सुरक्षा", "आय स्रोत"],
    growthTime: "5-7 years for fruiting",
    soilType: "Sandy, coastal soil",
    maintenance: "Regular watering, coastal climate",
    co2Absorption: 22,
    oxygenProduction: 250
  },
  {
    id: "peepal",
    nameEn: "Peepal Tree",
    nameTe: "రావి చెట్టు",
    nameHi: "पीपल का पेड़",
    benefits: ["24/7 oxygen", "Sacred tree", "Large shade", "Long lifespan"],
    benefitsTe: ["24/7 ఆక్సిజన్", "పవిత్ర చెట్టు", "పెద్ద నీడ", "దీర్ఘ జీవితకాలం"],
    benefitsHi: ["24/7 ऑक्सीजन", "पवित्र पेड़", "बड़ी छाया", "लंबा जीवनकाल"],
    growthTime: "4-6 years to establish",
    soilType: "Various soil types",
    maintenance: "Low maintenance once established",
    co2Absorption: 45,
    oxygenProduction: 450
  },
  {
    id: "tulsi",
    nameEn: "Tulsi (Holy Basil)",
    nameTe: "తులసి",
    nameHi: "तुलसी",
    benefits: ["Medicinal plant", "Air purification", "Aromatic", "Easy to grow"],
    benefitsTe: ["ఔషధ మొక్క", "గాలి శుద్ధి", "సుగంధం", "సులభంగా పెరుగుతుంది"],
    benefitsHi: ["औषधीय पौधा", "वायु शुद्धिकरण", "सुगंधित", "उगाने में आसान"],
    growthTime: "3-6 months",
    soilType: "Well-drained, fertile soil",
    maintenance: "Regular watering, sunlight",
    co2Absorption: 2,
    oxygenProduction: 20
  }
];

export const getTreeRecommendation = (climate: string, soil: string): TreeInfo[] => {
  const recommendations = [];
  
  if (soil.includes("dry") || climate.includes("hot")) {
    recommendations.push(treeData.find(t => t.id === "neem")!);
  }
  
  if (soil.includes("coastal") || climate.includes("humid")) {
    recommendations.push(treeData.find(t => t.id === "coconut")!);
  }
  
  if (soil.includes("rich") || soil.includes("fertile")) {
    recommendations.push(treeData.find(t => t.id === "mango")!);
    recommendations.push(treeData.find(t => t.id === "banyan")!);
  }
  
  // Always recommend these versatile trees
  recommendations.push(treeData.find(t => t.id === "peepal")!);
  recommendations.push(treeData.find(t => t.id === "tulsi")!);
  
  return [...new Set(recommendations)].slice(0, 4);
};
