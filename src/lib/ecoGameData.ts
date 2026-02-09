// Plant Care Simulator data
export interface PlantStage {
  name: string;
  emoji: string;
  requiredWater: number;
  requiredSun: number;
  requiredNutrients: number;
  description: string;
  tip: string;
}

export const plantLifecycleStages: PlantStage[] = [
  {
    name: 'Seed',
    emoji: '🫘',
    requiredWater: 20,
    requiredSun: 10,
    requiredNutrients: 10,
    description: 'A dormant seed waiting for the right conditions to germinate.',
    tip: 'Seeds need moisture to break dormancy. Start watering gently!'
  },
  {
    name: 'Sprout',
    emoji: '🌱',
    requiredWater: 30,
    requiredSun: 25,
    requiredNutrients: 15,
    description: 'The seed has germinated! A tiny root and shoot emerge.',
    tip: 'Young sprouts need consistent moisture but not waterlogging.'
  },
  {
    name: 'Seedling',
    emoji: '🪴',
    requiredWater: 40,
    requiredSun: 40,
    requiredNutrients: 25,
    description: 'True leaves are developing. Photosynthesis is increasing.',
    tip: 'Seedlings need more sunlight now for photosynthesis. Add nutrients.'
  },
  {
    name: 'Juvenile',
    emoji: '🌿',
    requiredWater: 50,
    requiredSun: 50,
    requiredNutrients: 35,
    description: 'The plant is growing stronger with a developed root system.',
    tip: 'Balance all resources. Over-watering can cause root rot!'
  },
  {
    name: 'Mature',
    emoji: '🌳',
    requiredWater: 40,
    requiredSun: 60,
    requiredNutrients: 40,
    description: 'A fully grown tree producing oxygen and sequestering CO₂!',
    tip: 'Mature trees are resilient but still need care during drought.'
  },
  {
    name: 'Flowering',
    emoji: '🌸',
    requiredWater: 50,
    requiredSun: 70,
    requiredNutrients: 50,
    description: 'Beautiful flowers attract pollinators to the ecosystem!',
    tip: 'Pollinators like bees depend on flowering plants. Great for biodiversity!'
  }
];

// Disease Identification data
export interface DiseaseCard {
  id: string;
  plantName: string;
  diseaseName: string;
  symptoms: string;
  emoji: string;
  correctTreatment: string;
  wrongTreatments: string[];
  explanation: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export const diseaseCards: DiseaseCard[] = [
  {
    id: 'd1', plantName: 'Tomato', diseaseName: 'Late Blight',
    symptoms: 'Dark brown spots on leaves, white fuzzy growth underneath, fruit turning brown',
    emoji: '🍅', correctTreatment: 'Remove infected parts and apply copper-based fungicide',
    wrongTreatments: ['Add more water', 'Use nitrogen fertilizer', 'Expose to more sunlight'],
    explanation: 'Late blight is caused by Phytophthora infestans. It thrives in cool, wet conditions. Copper fungicides create a protective barrier.',
    severity: 'severe'
  },
  {
    id: 'd2', plantName: 'Rose', diseaseName: 'Powdery Mildew',
    symptoms: 'White powdery coating on leaves, curling leaves, stunted growth',
    emoji: '🌹', correctTreatment: 'Improve air circulation and apply neem oil spray',
    wrongTreatments: ['Water the leaves directly', 'Add chemical pesticide', 'Plant closer together'],
    explanation: 'Powdery mildew spreads in humid, crowded conditions. Neem oil is an organic fungicide that disrupts the fungus lifecycle.',
    severity: 'moderate'
  },
  {
    id: 'd3', plantName: 'Mango', diseaseName: 'Anthracnose',
    symptoms: 'Black spots on flowers and fruit, leaf spots with yellow halos',
    emoji: '🥭', correctTreatment: 'Prune affected branches and apply Bordeaux mixture',
    wrongTreatments: ['Increase watering', 'Use insecticide spray', 'Add more compost'],
    explanation: 'Anthracnose is a fungal disease common in tropical fruits. Bordeaux mixture (copper sulfate + lime) is an effective organic treatment.',
    severity: 'moderate'
  },
  {
    id: 'd4', plantName: 'Rice', diseaseName: 'Bacterial Leaf Blight',
    symptoms: 'Yellow-white lesions along leaf veins, wilting leaf tips, grey-white leaves',
    emoji: '🌾', correctTreatment: 'Use resistant varieties and practice proper field drainage',
    wrongTreatments: ['Flood the field more', 'Apply fungicide', 'Add nitrogen fertilizer'],
    explanation: 'Bacterial leaf blight is caused by Xanthomonas oryzae. It spreads through water, so good drainage and resistant varieties are key.',
    severity: 'severe'
  },
  {
    id: 'd5', plantName: 'Coconut', diseaseName: 'Bud Rot',
    symptoms: 'Yellowing of central leaves, blackening of the bud, foul smell from crown',
    emoji: '🥥', correctTreatment: 'Remove infected tissue and apply Bordeaux paste to cut area',
    wrongTreatments: ['Water more frequently', 'Apply insecticide', 'Ignore and wait'],
    explanation: 'Bud rot is a fatal disease if untreated. Early detection and removal of infected tissue is critical for saving the palm.',
    severity: 'severe'
  },
  {
    id: 'd6', plantName: 'Banana', diseaseName: 'Panama Disease',
    symptoms: 'Yellowing of older leaves, splitting of stem base, internal discoloration',
    emoji: '🍌', correctTreatment: 'Remove and destroy infected plants, use disease-free planting material',
    wrongTreatments: ['Apply more fertilizer', 'Increase irrigation', 'Prune affected leaves only'],
    explanation: 'Panama disease (Fusarium wilt) has no cure once infected. Prevention through clean planting material and crop rotation is essential.',
    severity: 'severe'
  },
  {
    id: 'd7', plantName: 'Chili', diseaseName: 'Leaf Curl Virus',
    symptoms: 'Upward curling of leaves, stunted growth, reduced fruit set',
    emoji: '🌶️', correctTreatment: 'Control whitefly vectors with sticky traps and neem oil',
    wrongTreatments: ['Apply fungicide', 'Increase watering', 'Add more fertilizer'],
    explanation: 'Leaf curl is caused by a virus transmitted by whiteflies. Controlling the insect vector is more effective than treating the plant.',
    severity: 'moderate'
  },
  {
    id: 'd8', plantName: 'Potato', diseaseName: 'Early Blight',
    symptoms: 'Dark concentric rings on lower leaves (target spots), yellowing around spots',
    emoji: '🥔', correctTreatment: 'Remove infected leaves, practice crop rotation, apply organic fungicide',
    wrongTreatments: ['Plant potatoes in same spot next year', 'Overhead watering', 'Ignore the spots'],
    explanation: 'Early blight (Alternaria solani) survives in soil. Crop rotation breaks the disease cycle and reduces pathogen buildup.',
    severity: 'mild'
  },
  {
    id: 'd9', plantName: 'Grape', diseaseName: 'Downy Mildew',
    symptoms: 'Oily yellowish spots on upper leaf surface, white-grey fuzz below, shriveling berries',
    emoji: '🍇', correctTreatment: 'Apply copper-based spray and improve vineyard ventilation',
    wrongTreatments: ['Mist leaves frequently', 'Add nitrogen fertilizer', 'Cover with plastic sheet'],
    explanation: 'Downy mildew (Plasmopara viticola) needs moisture on leaves. Better airflow and copper sprays are the organic standard.',
    severity: 'severe'
  },
  {
    id: 'd10', plantName: 'Apple', diseaseName: 'Fire Blight',
    symptoms: 'Blackened, wilted shoots that curl like a shepherd\'s crook, oozing cankers on bark',
    emoji: '🍎', correctTreatment: 'Prune infected branches 30 cm below visible damage and sterilize tools',
    wrongTreatments: ['Spray water on branches', 'Apply nitrogen-rich fertilizer', 'Prune during wet weather'],
    explanation: 'Fire blight (Erwinia amylovora) spreads through pruning wounds. Always sterilize tools between cuts and prune in dry weather.',
    severity: 'severe'
  },
  {
    id: 'd11', plantName: 'Citrus', diseaseName: 'Citrus Canker',
    symptoms: 'Raised brown lesions with yellow halos on leaves, fruit, and stems',
    emoji: '🍊', correctTreatment: 'Remove infected branches, apply copper hydroxide spray',
    wrongTreatments: ['Use overhead sprinklers', 'Transplant to new location', 'Apply insecticide'],
    explanation: 'Citrus canker (Xanthomonas citri) spreads via rain splash. Copper sprays and windbreaks reduce transmission.',
    severity: 'moderate'
  },
  {
    id: 'd12', plantName: 'Wheat', diseaseName: 'Rust',
    symptoms: 'Orange-red pustules on leaf surfaces and stems, premature leaf drying',
    emoji: '🌾', correctTreatment: 'Plant resistant varieties and apply triazole fungicide early',
    wrongTreatments: ['Increase irrigation', 'Add more nitrogen', 'Wait until harvest'],
    explanation: 'Wheat rust (Puccinia spp.) can devastate yields within weeks. Resistant cultivars and early fungicide application are critical.',
    severity: 'severe'
  },
  {
    id: 'd13', plantName: 'Strawberry', diseaseName: 'Grey Mould (Botrytis)',
    symptoms: 'Soft, brown rot covered with grey fuzzy mould on fruits and flowers',
    emoji: '🍓', correctTreatment: 'Remove infected fruits, improve spacing, mulch with straw',
    wrongTreatments: ['Water from above', 'Pack plants closer', 'Leave rotting fruit in place'],
    explanation: 'Botrytis cinerea thrives in humid, stagnant air. Good spacing, straw mulch, and prompt removal of infected tissue stop spread.',
    severity: 'moderate'
  },
  {
    id: 'd14', plantName: 'Coffee', diseaseName: 'Coffee Leaf Rust',
    symptoms: 'Orange-yellow powdery spots on leaf undersides, premature leaf drop',
    emoji: '☕', correctTreatment: 'Plant shade trees, apply copper fungicide, use resistant varieties',
    wrongTreatments: ['Remove all shade', 'Over-fertilize with nitrogen', 'Ignore—it will pass'],
    explanation: 'Hemileia vastatrix devastated global coffee production. Shade management and resistant varieties are sustainable solutions.',
    severity: 'severe'
  },
  {
    id: 'd15', plantName: 'Sunflower', diseaseName: 'Sclerotinia Head Rot',
    symptoms: 'White cottony growth on flower head, soft watery rot, black hard masses (sclerotia)',
    emoji: '🌻', correctTreatment: 'Rotate crops every 3-4 years, avoid overhead irrigation',
    wrongTreatments: ['Water flower heads directly', 'Plant sunflowers annually in same spot', 'Add extra compost around base'],
    explanation: 'Sclerotinia sclerotiorum persists in soil as sclerotia for years. Long crop rotations and drip irrigation are the best prevention.',
    severity: 'moderate'
  },
  {
    id: 'd16', plantName: 'Tulsi (Holy Basil)', diseaseName: 'Root Rot',
    symptoms: 'Wilting despite moist soil, brown mushy roots, yellowing lower leaves',
    emoji: '🌿', correctTreatment: 'Improve drainage, reduce watering, apply Trichoderma bio-fungicide',
    wrongTreatments: ['Water more frequently', 'Pack soil tighter', 'Add more organic matter to wet soil'],
    explanation: 'Root rot (Pythium/Fusarium) occurs in waterlogged soil. Trichoderma fungi naturally suppress root pathogens.',
    severity: 'moderate'
  },
];

// Garden Planning data
export interface CropOption {
  name: string;
  emoji: string;
  season: 'summer' | 'winter' | 'monsoon' | 'all';
  waterNeed: 'low' | 'medium' | 'high';
  sunNeed: 'partial' | 'full';
  companionPlants: string[];
  incompatiblePlants: string[];
  benefit: string;
  growthDays: number;
}

export const cropOptions: CropOption[] = [
  { name: 'Tomato', emoji: '🍅', season: 'summer', waterNeed: 'medium', sunNeed: 'full', companionPlants: ['Basil', 'Marigold', 'Carrot'], incompatiblePlants: ['Cabbage', 'Fennel'], benefit: 'Rich in lycopene & vitamins', growthDays: 80 },
  { name: 'Basil', emoji: '🌿', season: 'summer', waterNeed: 'medium', sunNeed: 'full', companionPlants: ['Tomato', 'Pepper'], incompatiblePlants: ['Sage'], benefit: 'Natural pest repellent', growthDays: 30 },
  { name: 'Carrot', emoji: '🥕', season: 'winter', waterNeed: 'medium', sunNeed: 'full', companionPlants: ['Tomato', 'Onion', 'Lettuce'], incompatiblePlants: ['Dill'], benefit: 'Improves soil structure', growthDays: 75 },
  { name: 'Spinach', emoji: '🥬', season: 'winter', waterNeed: 'medium', sunNeed: 'partial', companionPlants: ['Strawberry', 'Peas'], incompatiblePlants: [], benefit: 'Adds nitrogen to soil', growthDays: 45 },
  { name: 'Marigold', emoji: '🏵️', season: 'all', waterNeed: 'low', sunNeed: 'full', companionPlants: ['Tomato', 'Pepper', 'Cucumber'], incompatiblePlants: [], benefit: 'Repels nematodes & pests', growthDays: 50 },
  { name: 'Pepper', emoji: '🫑', season: 'summer', waterNeed: 'medium', sunNeed: 'full', companionPlants: ['Basil', 'Marigold'], incompatiblePlants: ['Fennel', 'Bean'], benefit: 'Attracts pollinators when flowering', growthDays: 90 },
  { name: 'Lettuce', emoji: '🥗', season: 'winter', waterNeed: 'high', sunNeed: 'partial', companionPlants: ['Carrot', 'Radish', 'Strawberry'], incompatiblePlants: [], benefit: 'Fast-growing ground cover', growthDays: 30 },
  { name: 'Cucumber', emoji: '🥒', season: 'monsoon', waterNeed: 'high', sunNeed: 'full', companionPlants: ['Marigold', 'Sunflower', 'Peas'], incompatiblePlants: ['Potato', 'Melon'], benefit: 'Natural trellis partner', growthDays: 60 },
  { name: 'Sunflower', emoji: '🌻', season: 'summer', waterNeed: 'low', sunNeed: 'full', companionPlants: ['Cucumber', 'Corn'], incompatiblePlants: ['Potato'], benefit: 'Attracts pollinators & birds', growthDays: 70 },
  { name: 'Mint', emoji: '🍃', season: 'all', waterNeed: 'high', sunNeed: 'partial', companionPlants: ['Tomato', 'Cabbage'], incompatiblePlants: [], benefit: 'Natural pest deterrent', growthDays: 20 },
  { name: 'Onion', emoji: '🧅', season: 'winter', waterNeed: 'low', sunNeed: 'full', companionPlants: ['Carrot', 'Lettuce', 'Beet'], incompatiblePlants: ['Peas', 'Bean'], benefit: 'Repels many garden pests', growthDays: 100 },
  { name: 'Peas', emoji: '🫛', season: 'winter', waterNeed: 'medium', sunNeed: 'full', companionPlants: ['Carrot', 'Cucumber', 'Radish'], incompatiblePlants: ['Onion', 'Garlic'], benefit: 'Fixes nitrogen in soil', growthDays: 60 },
  { name: 'Corn', emoji: '🌽', season: 'summer', waterNeed: 'high', sunNeed: 'full', companionPlants: ['Bean', 'Squash', 'Sunflower'], incompatiblePlants: ['Tomato'], benefit: 'Part of the Three Sisters planting', growthDays: 90 },
  { name: 'Bean', emoji: '🫘', season: 'monsoon', waterNeed: 'medium', sunNeed: 'full', companionPlants: ['Corn', 'Squash', 'Cucumber'], incompatiblePlants: ['Onion', 'Pepper'], benefit: 'Fixes atmospheric nitrogen', growthDays: 55 },
  { name: 'Squash', emoji: '🎃', season: 'monsoon', waterNeed: 'high', sunNeed: 'full', companionPlants: ['Corn', 'Bean', 'Marigold'], incompatiblePlants: ['Potato'], benefit: 'Ground cover suppresses weeds', growthDays: 85 },
  { name: 'Radish', emoji: '🔴', season: 'winter', waterNeed: 'low', sunNeed: 'partial', companionPlants: ['Lettuce', 'Peas', 'Cucumber'], incompatiblePlants: [], benefit: 'Fast harvest breaks up compacted soil', growthDays: 25 },
  { name: 'Garlic', emoji: '🧄', season: 'winter', waterNeed: 'low', sunNeed: 'full', companionPlants: ['Tomato', 'Rose', 'Carrot'], incompatiblePlants: ['Peas', 'Bean'], benefit: 'Natural fungicide and pest repellent', growthDays: 120 },
  { name: 'Strawberry', emoji: '🍓', season: 'winter', waterNeed: 'medium', sunNeed: 'full', companionPlants: ['Spinach', 'Lettuce', 'Onion'], incompatiblePlants: ['Cabbage'], benefit: 'Living ground cover reduces erosion', growthDays: 60 },
];

export interface GardenScenario {
  id: string;
  season: 'summer' | 'winter' | 'monsoon';
  soilType: string;
  sunlight: 'partial' | 'full';
  waterAvailability: 'low' | 'medium' | 'high';
  description: string;
  idealCrops: string[];
  explanation: string;
}

export const gardenScenarios: GardenScenario[] = [
  {
    id: 'g1', season: 'summer', soilType: 'Sandy loam', sunlight: 'full', waterAvailability: 'medium',
    description: 'A sunny summer plot with sandy loam soil and moderate water access.',
    idealCrops: ['Tomato', 'Basil', 'Pepper', 'Sunflower', 'Marigold'],
    explanation: 'Summer crops that love full sun and can handle sandy loam drainage are ideal.'
  },
  {
    id: 'g2', season: 'winter', soilType: 'Clay loam', sunlight: 'partial', waterAvailability: 'high',
    description: 'A partially shaded winter plot with clay soil and good water.',
    idealCrops: ['Spinach', 'Lettuce', 'Carrot'],
    explanation: 'Winter crops prefer cooler temps and partial shade. Leafy greens thrive in moist clay loam.'
  },
  {
    id: 'g3', season: 'monsoon', soilType: 'Red soil', sunlight: 'full', waterAvailability: 'high',
    description: 'Monsoon season garden with red soil and abundant rainfall.',
    idealCrops: ['Cucumber', 'Mint', 'Bean', 'Squash'],
    explanation: 'Monsoon-friendly crops handle heavy moisture well.'
  },
  {
    id: 'g4', season: 'summer', soilType: 'Black cotton soil', sunlight: 'full', waterAvailability: 'low',
    description: 'A hot, dry summer plot with rich black cotton soil and limited water.',
    idealCrops: ['Sunflower', 'Marigold', 'Corn'],
    explanation: 'Drought-tolerant crops with deep roots do well in water-scarce summers.'
  },
  {
    id: 'g5', season: 'winter', soilType: 'Alluvial soil', sunlight: 'full', waterAvailability: 'medium',
    description: 'A fertile winter garden in alluvial plains with moderate irrigation.',
    idealCrops: ['Peas', 'Carrot', 'Garlic', 'Onion', 'Radish'],
    explanation: 'Alluvial soil is nutrient-rich — perfect for root vegetables and legumes in winter.'
  },
  {
    id: 'g6', season: 'monsoon', soilType: 'Laterite soil', sunlight: 'partial', waterAvailability: 'high',
    description: 'A monsoon hillside plot with acidic laterite soil and heavy rainfall.',
    idealCrops: ['Mint', 'Bean', 'Cucumber'],
    explanation: 'Laterite drains fast despite heavy rain. Shade-tolerant, moisture-loving crops thrive here.'
  },
  {
    id: 'g7', season: 'winter', soilType: 'Sandy loam', sunlight: 'full', waterAvailability: 'medium',
    description: 'A well-drained winter kitchen garden with full sun exposure.',
    idealCrops: ['Strawberry', 'Lettuce', 'Spinach', 'Radish', 'Garlic'],
    explanation: 'Sandy loam with good drainage is perfect for strawberries. Garlic acts as a natural pest repellent.'
  },
  {
    id: 'g8', season: 'summer', soilType: 'Loamy soil', sunlight: 'full', waterAvailability: 'high',
    description: 'A well-irrigated summer farm — the Three Sisters challenge!',
    idealCrops: ['Corn', 'Bean', 'Squash'],
    explanation: 'The Three Sisters: corn provides structure for beans, beans fix nitrogen, squash shades soil.'
  },
];

// Water & Soil Balance data
export interface BalanceScenario {
  id: string;
  plantName: string;
  emoji: string;
  soilpH: number;
  idealPH: [number, number];
  currentMoisture: number;
  idealMoisture: [number, number];
  nutrientN: number;
  nutrientP: number;
  nutrientK: number;
  idealN: [number, number];
  idealP: [number, number];
  idealK: [number, number];
  problem: string;
  actions: BalanceAction[];
}

export interface BalanceAction {
  label: string;
  emoji: string;
  effect: { pH?: number; moisture?: number; N?: number; P?: number; K?: number };
  explanation: string;
  isCorrect: boolean;
}

export const balanceScenarios: BalanceScenario[] = [
  {
    id: 'b1', plantName: 'Blueberry', emoji: '🫐',
    soilpH: 7.5, idealPH: [4.5, 5.5], currentMoisture: 30, idealMoisture: [50, 70],
    nutrientN: 40, nutrientP: 50, nutrientK: 50, idealN: [50, 80], idealP: [40, 60], idealK: [40, 60],
    problem: 'Your blueberry bush has yellowing leaves. The soil is too alkaline.',
    actions: [
      { label: 'Add sulfur', emoji: '🧪', effect: { pH: -2 }, explanation: 'Sulfur lowers soil pH — perfect for blueberries!', isCorrect: true },
      { label: 'Add lime', emoji: 'ite', effect: { pH: 1 }, explanation: 'Lime raises pH further! Blueberries need acidic soil.', isCorrect: false },
      { label: 'Water deeply', emoji: '💧', effect: { moisture: 25 }, explanation: 'Blueberries like consistent moisture.', isCorrect: true },
      { label: 'Add nitrogen', emoji: '🌿', effect: { N: 20 }, explanation: 'Moderate nitrogen helps leaf growth.', isCorrect: true },
    ]
  },
  {
    id: 'b2', plantName: 'Cactus', emoji: '🌵',
    soilpH: 5.0, idealPH: [6.0, 7.5], currentMoisture: 80, idealMoisture: [10, 30],
    nutrientN: 60, nutrientP: 30, nutrientK: 40, idealN: [20, 40], idealP: [30, 50], idealK: [40, 60],
    problem: 'Your cactus is rotting at the base. The soil is too wet and acidic.',
    actions: [
      { label: 'Add sand', emoji: '🏖️', effect: { moisture: -30 }, explanation: 'Sandy soil improves drainage — essential for cacti!', isCorrect: true },
      { label: 'Add lime', emoji: 'ite', effect: { pH: 1.5 }, explanation: 'Lime raises pH toward neutral, better for cacti.', isCorrect: true },
      { label: 'Water more', emoji: '💧', effect: { moisture: 20 }, explanation: 'More water will worsen root rot!', isCorrect: false },
      { label: 'Add potassium', emoji: '🧂', effect: { K: 15 }, explanation: 'Potassium helps drought resistance.', isCorrect: true },
    ]
  },
  {
    id: 'b3', plantName: 'Rice Paddy', emoji: '🌾',
    soilpH: 6.5, idealPH: [5.5, 6.5], currentMoisture: 40, idealMoisture: [80, 100],
    nutrientN: 30, nutrientP: 20, nutrientK: 25, idealN: [60, 90], idealP: [30, 50], idealK: [30, 50],
    problem: 'Your rice paddy is not flooded enough and nitrogen levels are low.',
    actions: [
      { label: 'Flood the field', emoji: '🌊', effect: { moisture: 50 }, explanation: 'Rice needs standing water for optimal growth!', isCorrect: true },
      { label: 'Add urea', emoji: '🧪', effect: { N: 35 }, explanation: 'Urea provides quick nitrogen boost for rice.', isCorrect: true },
      { label: 'Drain the field', emoji: '🚰', effect: { moisture: -20 }, explanation: 'Draining goes against rice cultivation needs!', isCorrect: false },
      { label: 'Add phosphorus', emoji: '⚗️', effect: { P: 15 }, explanation: 'Phosphorus helps root development.', isCorrect: true },
    ]
  },
  {
    id: 'b4', plantName: 'Lavender', emoji: '💜',
    soilpH: 5.0, idealPH: [6.5, 7.5], currentMoisture: 70, idealMoisture: [20, 40],
    nutrientN: 70, nutrientP: 40, nutrientK: 30, idealN: [20, 40], idealP: [30, 50], idealK: [40, 60],
    problem: 'Your lavender is leggy with few flowers. Soil is too acidic, wet, and nitrogen-rich.',
    actions: [
      { label: 'Add lime', emoji: 'ite', effect: { pH: 1.5 }, explanation: 'Lavender prefers slightly alkaline soil.', isCorrect: true },
      { label: 'Add gravel mulch', emoji: '🪨', effect: { moisture: -25 }, explanation: 'Gravel improves drainage — lavender hates wet feet!', isCorrect: true },
      { label: 'Add compost', emoji: '🍂', effect: { N: 15, moisture: 10 }, explanation: 'Too much nitrogen makes lavender leggy, not flowery.', isCorrect: false },
      { label: 'Add potassium', emoji: '🧂', effect: { K: 20 }, explanation: 'Potassium promotes flower and oil production.', isCorrect: true },
    ]
  },
  {
    id: 'b5', plantName: 'Tea Plant', emoji: '🍵',
    soilpH: 7.0, idealPH: [4.5, 5.5], currentMoisture: 30, idealMoisture: [60, 80],
    nutrientN: 20, nutrientP: 60, nutrientK: 50, idealN: [60, 80], idealP: [30, 50], idealK: [40, 60],
    problem: 'Your tea plant has poor leaf growth. Soil is too alkaline and dry with low nitrogen.',
    actions: [
      { label: 'Add sulfur', emoji: '🧪', effect: { pH: -1.5 }, explanation: 'Tea thrives in highly acidic soil.', isCorrect: true },
      { label: 'Deep watering', emoji: '💧', effect: { moisture: 35 }, explanation: 'Tea plants need consistently moist soil.', isCorrect: true },
      { label: 'Add ammonium sulfate', emoji: '🌿', effect: { N: 30, pH: -0.5 }, explanation: 'Provides nitrogen AND lowers pH — ideal for tea!', isCorrect: true },
      { label: 'Add lime', emoji: 'ite', effect: { pH: 1 }, explanation: 'Tea needs acidic soil — lime makes it worse!', isCorrect: false },
    ]
  },
  {
    id: 'b6', plantName: 'Orchid', emoji: '🌺',
    soilpH: 7.5, idealPH: [5.5, 6.5], currentMoisture: 85, idealMoisture: [40, 60],
    nutrientN: 60, nutrientP: 15, nutrientK: 20, idealN: [30, 50], idealP: [30, 50], idealK: [30, 50],
    problem: 'Your orchid roots are brown and mushy. Media is waterlogged and too alkaline.',
    actions: [
      { label: 'Repot in bark mix', emoji: '🪵', effect: { moisture: -30, pH: -1 }, explanation: 'Bark provides drainage and is slightly acidic — orchids love it!', isCorrect: true },
      { label: 'Add phosphorus', emoji: '⚗️', effect: { P: 20 }, explanation: 'Phosphorus promotes orchid blooming.', isCorrect: true },
      { label: 'Mist daily', emoji: '💧', effect: { moisture: 15 }, explanation: 'Already too wet — more moisture worsens root rot!', isCorrect: false },
      { label: 'Add potassium', emoji: '🧂', effect: { K: 20 }, explanation: 'Potassium strengthens orchid cell walls.', isCorrect: true },
    ]
  },
];

// Pest Defender data
export interface Pest {
  id: string;
  name: string;
  emoji: string;
  targetPlant: string;
  damage: string;
  ecoFriendlySolution: string;
  chemicalSolution: string;
  explanation: string;
  speed: number;
}

export const pests: Pest[] = [
  { id: 'p1', name: 'Aphids', emoji: '🐛', targetPlant: '🌹 Rose', damage: 'Suck sap, cause wilting', ecoFriendlySolution: 'Release ladybugs', chemicalSolution: 'Spray insecticide', explanation: 'Ladybugs are natural predators of aphids. One ladybug eats 50+ aphids per day!', speed: 2 },
  { id: 'p2', name: 'Caterpillars', emoji: '🐛', targetPlant: '🥬 Cabbage', damage: 'Eat leaves rapidly', ecoFriendlySolution: 'Use Bt (Bacillus thuringiensis)', chemicalSolution: 'Spray chemical pesticide', explanation: 'Bt is a natural bacterium that specifically targets caterpillars without harming beneficial insects.', speed: 1.5 },
  { id: 'p3', name: 'Whiteflies', emoji: '🦟', targetPlant: '🍅 Tomato', damage: 'Transmit viruses, weaken plants', ecoFriendlySolution: 'Install yellow sticky traps', chemicalSolution: 'Use systemic insecticide', explanation: 'Yellow sticky traps attract and catch whiteflies without chemicals.', speed: 3 },
  { id: 'p4', name: 'Slugs', emoji: '🐌', targetPlant: '🥗 Lettuce', damage: 'Eat tender leaves at night', ecoFriendlySolution: 'Create beer traps or use crushed eggshells', chemicalSolution: 'Use slug pellets', explanation: 'Beer traps attract slugs, and eggshell barriers physically block them.', speed: 1 },
  { id: 'p5', name: 'Mealybugs', emoji: '🪳', targetPlant: '🪴 Houseplant', damage: 'Create white cotton-like masses', ecoFriendlySolution: 'Wipe with rubbing alcohol on cotton swab', chemicalSolution: 'Spray systemic insecticide', explanation: 'Manual removal with alcohol is effective. Parasitic wasps provide long-term control.', speed: 1.5 },
  { id: 'p6', name: 'Fruit Flies', emoji: '🪰', targetPlant: '🥭 Mango', damage: 'Lay eggs in fruit causing rot', ecoFriendlySolution: 'Hang pheromone traps', chemicalSolution: 'Spray chemical insecticide on fruit', explanation: 'Pheromone traps lure and catch male flies, breaking the breeding cycle naturally.', speed: 3.5 },
  { id: 'p7', name: 'Spider Mites', emoji: '🕷️', targetPlant: '🫑 Pepper', damage: 'Tiny webs on leaves, yellow speckling', ecoFriendlySolution: 'Spray with water jet + introduce predatory mites', chemicalSolution: 'Apply miticide spray', explanation: 'Predatory mites eat spider mites without harming plants. Water jets dislodge them.', speed: 2.5 },
  { id: 'p8', name: 'Japanese Beetles', emoji: '🪲', targetPlant: '🌹 Rose', damage: 'Skeletonize leaves, eat flowers', ecoFriendlySolution: 'Hand-pick into soapy water + apply milky spore', chemicalSolution: 'Spray carbaryl insecticide', explanation: 'Milky spore disease kills beetle grubs in soil naturally and lasts 15-20 years!', speed: 2 },
  { id: 'p9', name: 'Thrips', emoji: '🦗', targetPlant: '🌻 Sunflower', damage: 'Silver streaks on leaves, distorted flowers', ecoFriendlySolution: 'Blue sticky traps + release minute pirate bugs', chemicalSolution: 'Spray neonicotinoid pesticide', explanation: 'Minute pirate bugs are voracious thrips predators. Blue traps attract thrips specifically.', speed: 3 },
  { id: 'p10', name: 'Cutworms', emoji: '🪱', targetPlant: '🍅 Tomato', damage: 'Sever seedling stems at soil level', ecoFriendlySolution: 'Place cardboard collars around stems', chemicalSolution: 'Apply chemical soil drench', explanation: 'Cardboard collars create a physical barrier. Birds and ground beetles are natural predators.', speed: 1 },
  { id: 'p11', name: 'Scale Insects', emoji: '🐚', targetPlant: '🍊 Citrus', damage: 'Hard bumps on stems, sticky honeydew', ecoFriendlySolution: 'Apply horticultural oil + release parasitic wasps', chemicalSolution: 'Use systemic chemical treatment', explanation: 'Horticultural oil suffocates scale insects. Parasitic wasps provide biological control.', speed: 1 },
  { id: 'p12', name: 'Locusts', emoji: '🦗', targetPlant: '🌾 Wheat', damage: 'Swarm-level defoliation of crops', ecoFriendlySolution: 'Use Metarhizium fungal bio-pesticide', chemicalSolution: 'Aerial chemical spraying', explanation: 'Metarhizium acridum specifically infects locusts. Early detection prevents devastating swarms.', speed: 4 },
];
