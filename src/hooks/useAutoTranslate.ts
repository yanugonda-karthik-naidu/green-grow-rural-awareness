import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

// Key UI strings that need translation
const BASE_UI_STRINGS = {
  // Navigation
  plantTree: "Plant Tree",
  impactCounter: "Impact Counter", 
  achievements: "Achievements",
  treeLibrary: "Tree Library",
  learnGrow: "Learn & Grow",
  quiz: "Quiz",
  miniGames: "Mini Games",
  voiceAssistant: "Voice Assistant",
  communityWall: "Community",
  
  // Hero
  welcome: "Welcome to GreenGrow",
  subtitle: "Plant trees, track your impact, grow together",
  digitalPlatform: "Digital Plantation Platform",
  yourForest: "Your Forest",
  trees: "trees",
  seeds: "seeds",
  moreToNextRank: "more trees to next rank!",
  maxRankAchieved: "Max rank achieved!",
  profile: "Profile",
  logout: "Logout",
  
  // Plant Tree
  plantNow: "Plant Now",
  growing: "Growing...",
  plantName: "Plant Name",
  species: "Species",
  selectSpecies: "Select species",
  description: "Description",
  shareStory: "Share your story about this tree...",
  location: "Location",
  locationPlaceholder: "e.g., Community Park, City",
  shareOnCommunity: "Share on Community Wall",
  loadDraft: "Load Saved Draft",
  plantImage: "Plant Image",
  clickToUpload: "Click to upload plant image",
  maxSize: "Max size: 10MB",
  clickToChange: "Click to change image",
  uploading: "Uploading...",
  
  // Growth stages
  stageSeed: "Seed",
  stageGermination: "Germination",
  stageSprout: "Sprout",
  stageSeedling: "Seedling",
  stageYoungTree: "Young Tree",
  stageMatureTree: "Mature Tree",
  congratsOxygen: "Congratulations! Your tree is now producing oxygen!",
  
  // Impact
  impactGlance: "Your environmental impact at a glance",
  treesPlanted: "Trees Planted",
  co2Reduced: "CO₂ Reduced",
  oxygenGenerated: "Oxygen Generated",
  waterSaved: "Water Saved",
  energySaved: "Energy Saved",
  greenAreaExpanded: "Green Area",
  wildlifeSheltered: "Wildlife Sheltered",
  growingStrongTogether: "Growing strong together",
  yourForestGallery: "Your Forest",
  noTreesYet: "No trees planted yet. Start your green journey!",
  yourImpactOverTime: "Your Impact Over Time",
  yourImpactJourney: "Your Impact Journey",
  
  // Achievements
  achievementsRewards: "Achievements & Rewards",
  trackJourney: "Track your green journey",
  ecoCurrency: "Your eco-currency",
  claimSeeds: "Claim Seeds",
  allClaimed: "All Claimed",
  claiming: "Claiming...",
  badgeRewardsAvailable: "badge reward(s) available",
  yourCurrentRank: "Your Current Rank",
  noRankYet: "No Rank Yet",
  plantFirstTree: "Plant your first tree to get started!",
  nextRank: "Next",
  plantMoreToUnlock: "Plant more trees to unlock!",
  yourBadges: "Your Badges",
  noBadgesYet: "No badges earned yet",
  plantTreesToUnlock: "Plant trees to unlock badges!",
  lockedBadges: "Locked Badges",
  shareAchievement: "Share Your Achievement",
  
  // Community
  communityPosts: "Community Posts",
  localCommunity: "Local Community",
  globalCommunity: "Global Community",
  leaderboard: "Leaderboard",
  challenges: "Challenges",
  createChallenge: "Create Challenge",
  joinChallenge: "Join Challenge",
  participants: "participants",
  targetTrees: "Target Trees",
  
  // Voice Assistant
  askAarunya: "Ask Aarunya",
  speakOrType: "Speak or type your question...",
  listening: "Listening...",
  
  // General
  loading: "Loading...",
  error: "Error",
  success: "Success",
  save: "Save",
  cancel: "Cancel",
  submit: "Submit",
  close: "Close",
};

export type UIStrings = typeof BASE_UI_STRINGS;

export const useAutoTranslate = () => {
  const { currentLanguage, translateBatch, isTranslating } = useTranslation();
  const [translatedStrings, setTranslatedStrings] = useState<UIStrings>(BASE_UI_STRINGS);
  const [isLoading, setIsLoading] = useState(false);
  const lastLanguageRef = useRef(currentLanguage);
  const cacheRef = useRef<Record<string, UIStrings>>({ en: BASE_UI_STRINGS });

  const translateUI = useCallback(async () => {
    if (currentLanguage === 'en') {
      setTranslatedStrings(BASE_UI_STRINGS);
      return;
    }

    // Check cache first
    if (cacheRef.current[currentLanguage]) {
      setTranslatedStrings(cacheRef.current[currentLanguage]);
      return;
    }

    setIsLoading(true);
    try {
      const keys = Object.keys(BASE_UI_STRINGS) as (keyof UIStrings)[];
      const values = Object.values(BASE_UI_STRINGS);
      
      const translatedValues = await translateBatch(values);
      
      const newStrings = {} as UIStrings;
      keys.forEach((key, index) => {
        newStrings[key] = translatedValues[index];
      });
      
      // Cache the translations
      cacheRef.current[currentLanguage] = newStrings;
      setTranslatedStrings(newStrings);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedStrings(BASE_UI_STRINGS);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, translateBatch]);

  useEffect(() => {
    if (lastLanguageRef.current !== currentLanguage) {
      lastLanguageRef.current = currentLanguage;
      translateUI();
    }
  }, [currentLanguage, translateUI]);

  // Initial translation on mount if not English
  useEffect(() => {
    if (currentLanguage !== 'en' && !cacheRef.current[currentLanguage]) {
      translateUI();
    }
  }, []);

  return {
    t: translatedStrings,
    isTranslating: isLoading || isTranslating,
    currentLanguage,
  };
};
