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
    id: 'd1',
    plantName: 'Tomato',
    diseaseName: 'Late Blight',
    symptoms: 'Dark brown spots on leaves, white fuzzy growth underneath, fruit turning brown',
    emoji: '🍅',
    correctTreatment: 'Remove infected parts and apply copper-based fungicide',
    wrongTreatments: ['Add more water', 'Use nitrogen fertilizer', 'Expose to more sunlight'],
    explanation: 'Late blight is caused by Phytophthora infestans. It thrives in cool, wet conditions. Copper fungicides create a protective barrier.',
    severity: 'severe'
  },
  {
    id: 'd2',
    plantName: 'Rose',
    diseaseName: 'Powdery Mildew',
    symptoms: 'White powdery coating on leaves, curling leaves, stunted growth',
    emoji: '🌹',
    correctTreatment: 'Improve air circulation and apply neem oil spray',
    wrongTreatments: ['Water the leaves directly', 'Add chemical pesticide', 'Plant closer together'],
    explanation: 'Powdery mildew spreads in humid, crowded conditions. Neem oil is an organic fungicide that disrupts the fungus lifecycle.',
    severity: 'moderate'
  },
  {
    id: 'd3',
    plantName: 'Mango',
    diseaseName: 'Anthracnose',
    symptoms: 'Black spots on flowers and fruit, leaf spots with yellow halos',
    emoji: '🥭',
    correctTreatment: 'Prune affected branches and apply Bordeaux mixture',
    wrongTreatments: ['Increase watering', 'Use insecticide spray', 'Add more compost'],
    explanation: 'Anthracnose is a fungal disease common in tropical fruits. Bordeaux mixture (copper sulfate + lime) is an effective organic treatment.',
    severity: 'moderate'
  },
  {
    id: 'd4',
    plantName: 'Rice',
    diseaseName: 'Bacterial Leaf Blight',
    symptoms: 'Yellow-white lesions along leaf veins, wilting leaf tips, grey-white leaves',
    emoji: '🌾',
    correctTreatment: 'Use resistant varieties and practice proper field drainage',
    wrongTreatments: ['Flood the field more', 'Apply fungicide', 'Add nitrogen fertilizer'],
    explanation: 'Bacterial leaf blight is caused by Xanthomonas oryzae. It spreads through water, so good drainage and resistant varieties are key.',
    severity: 'severe'
  },
  {
    id: 'd5',
    plantName: 'Coconut',
    diseaseName: 'Bud Rot',
    symptoms: 'Yellowing of central leaves, blackening of the bud, foul smell from crown',
    emoji: '🥥',
    correctTreatment: 'Remove infected tissue and apply Bordeaux paste to cut area',
    wrongTreatments: ['Water more frequently', 'Apply insecticide', 'Ignore and wait'],
    explanation: 'Bud rot is a fatal disease if untreated. Early detection and removal of infected tissue is critical for saving the palm.',
    severity: 'severe'
  },
  {
    id: 'd6',
    plantName: 'Banana',
    diseaseName: 'Panama Disease',
    symptoms: 'Yellowing of older leaves, splitting of stem base, internal discoloration',
    emoji: '🍌',
    correctTreatment: 'Remove and destroy infected plants, use disease-free planting material',
    wrongTreatments: ['Apply more fertilizer', 'Increase irrigation', 'Prune affected leaves only'],
    explanation: 'Panama disease (Fusarium wilt) has no cure once infected. Prevention through clean planting material and crop rotation is essential.',
    severity: 'severe'
  },
  {
    id: 'd7',
    plantName: 'Chili',
    diseaseName: 'Leaf Curl Virus',
    symptoms: 'Upward curling of leaves, stunted growth, reduced fruit set',
    emoji: '🌶️',
    correctTreatment: 'Control whitefly vectors with sticky traps and neem oil',
    wrongTreatments: ['Apply fungicide', 'Increase watering', 'Add more fertilizer'],
    explanation: 'Leaf curl is caused by a virus transmitted by whiteflies. Controlling the insect vector is more effective than treating the plant.',
    severity: 'moderate'
  },
  {
    id: 'd8',
    plantName: 'Potato',
    diseaseName: 'Early Blight',
    symptoms: 'Dark concentric rings on lower leaves (target spots), yellowing around spots',
    emoji: '🥔',
    correctTreatment: 'Remove infected leaves, practice crop rotation, apply organic fungicide',
    wrongTreatments: ['Plant potatoes in same spot next year', 'Overhead watering', 'Ignore the spots'],
    explanation: 'Early blight (Alternaria solani) survives in soil. Crop rotation breaks the disease cycle and reduces pathogen buildup.',
    severity: 'mild'
  }
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
    explanation: 'Summer crops that love full sun and can handle sandy loam drainage are ideal. Basil with tomato is a classic companion planting.'
  },
  {
    id: 'g2', season: 'winter', soilType: 'Clay loam', sunlight: 'partial', waterAvailability: 'high',
    description: 'A partially shaded winter plot with clay soil and good water.',
    idealCrops: ['Spinach', 'Lettuce', 'Carrot'],
    explanation: 'Winter crops prefer cooler temps and partial shade. Leafy greens thrive in moist clay loam soils.'
  },
  {
    id: 'g3', season: 'monsoon', soilType: 'Red soil', sunlight: 'full', waterAvailability: 'high',
    description: 'Monsoon season garden with red soil and abundant rainfall.',
    idealCrops: ['Cucumber', 'Mint'],
    explanation: 'Monsoon-friendly crops handle heavy moisture well. Cucumbers love the warmth and water.'
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
    problem: 'Your blueberry bush has yellowing leaves and poor growth. The soil seems too alkaline.',
    actions: [
      { label: 'Add sulfur to soil', emoji: '🧪', effect: { pH: -2 }, explanation: 'Sulfur lowers soil pH, making it more acidic — perfect for blueberries!', isCorrect: true },
      { label: 'Add lime', emoji: 'ite', effect: { pH: 1 }, explanation: 'Lime raises pH further! Blueberries need acidic soil (pH 4.5-5.5).', isCorrect: false },
      { label: 'Water deeply', emoji: '💧', effect: { moisture: 25 }, explanation: 'Good! Blueberries like consistent moisture.', isCorrect: true },
      { label: 'Add nitrogen fertilizer', emoji: '🌿', effect: { N: 20 }, explanation: 'Moderate nitrogen helps leaf growth.', isCorrect: true },
    ]
  },
  {
    id: 'b2', plantName: 'Cactus', emoji: '🌵',
    soilpH: 5.0, idealPH: [6.0, 7.5], currentMoisture: 80, idealMoisture: [10, 30],
    nutrientN: 60, nutrientP: 30, nutrientK: 40, idealN: [20, 40], idealP: [30, 50], idealK: [40, 60],
    problem: 'Your cactus is rotting at the base. The soil is too wet and acidic for a desert plant.',
    actions: [
      { label: 'Add sand to soil', emoji: '🏖️', effect: { moisture: -30 }, explanation: 'Sandy soil improves drainage — essential for cacti!', isCorrect: true },
      { label: 'Add lime', emoji: 'ite', effect: { pH: 1.5 }, explanation: 'Lime raises pH toward neutral, better for most cacti.', isCorrect: true },
      { label: 'Water more', emoji: '💧', effect: { moisture: 20 }, explanation: 'More water will worsen root rot! Cacti need dry conditions.', isCorrect: false },
      { label: 'Add potassium', emoji: '🧂', effect: { K: 15 }, explanation: 'Potassium helps root strength and drought resistance.', isCorrect: true },
    ]
  },
  {
    id: 'b3', plantName: 'Rice Paddy', emoji: '🌾',
    soilpH: 6.5, idealPH: [5.5, 6.5], currentMoisture: 40, idealMoisture: [80, 100],
    nutrientN: 30, nutrientP: 20, nutrientK: 25, idealN: [60, 90], idealP: [30, 50], idealK: [30, 50],
    problem: 'Your rice paddy is not flooded enough and nitrogen levels are low, causing poor tillering.',
    actions: [
      { label: 'Flood the field', emoji: '🌊', effect: { moisture: 50 }, explanation: 'Rice needs standing water (paddy flooding) for optimal growth!', isCorrect: true },
      { label: 'Add urea fertilizer', emoji: '🧪', effect: { N: 35 }, explanation: 'Urea provides quick nitrogen boost for rice tillering.', isCorrect: true },
      { label: 'Drain the field', emoji: '🚰', effect: { moisture: -20 }, explanation: 'Draining goes against rice cultivation needs!', isCorrect: false },
      { label: 'Add phosphorus', emoji: '⚗️', effect: { P: 15 }, explanation: 'Phosphorus helps root development in rice.', isCorrect: true },
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
  { id: 'p3', name: 'Whiteflies', emoji: '🦟', targetPlant: '🍅 Tomato', damage: 'Transmit viruses, weaken plants', ecoFriendlySolution: 'Install yellow sticky traps', chemicalSolution: 'Use systemic insecticide', explanation: 'Yellow sticky traps attract and catch whiteflies without chemicals. Add neem oil for extra protection.', speed: 3 },
  { id: 'p4', name: 'Slugs', emoji: '🐌', targetPlant: '🥗 Lettuce', damage: 'Eat tender leaves at night', ecoFriendlySolution: 'Create beer traps or use crushed eggshells', chemicalSolution: 'Use slug pellets', explanation: 'Beer traps attract slugs, and eggshell barriers physically block them. Chemical pellets can harm wildlife.', speed: 1 },
  { id: 'p5', name: 'Mealybugs', emoji: '🪳', targetPlant: '🪴 Houseplant', damage: 'Create white cotton-like masses, weaken plant', ecoFriendlySolution: 'Wipe with rubbing alcohol on cotton swab', chemicalSolution: 'Spray systemic insecticide', explanation: 'Manual removal with alcohol is effective for mealybugs. Introducing parasitic wasps provides long-term control.', speed: 1.5 },
  { id: 'p6', name: 'Fruit Flies', emoji: '🪰', targetPlant: '🥭 Mango', damage: 'Lay eggs in fruit causing rot', ecoFriendlySolution: 'Hang pheromone traps', chemicalSolution: 'Spray chemical insecticide on fruit', explanation: 'Pheromone traps lure and catch male flies, breaking the breeding cycle naturally without contaminating fruit.', speed: 3.5 },
];
