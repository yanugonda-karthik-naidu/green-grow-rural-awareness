import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TreeDeciduous, BarChart3, BookOpen, GamepadIcon, Mic, Users, Library, Trophy, Gamepad2, LogOut, Loader2, User as UserIcon, Leaf, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useRealtimeProgress } from "@/hooks/useRealtimeProgress";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PlantTree } from "@/components/PlantTree";
import { ImpactCounter } from "@/components/ImpactCounter";
import { AchievementsDashboard } from "@/components/AchievementsDashboard";
import { TreeLibraryExpanded } from "@/components/TreeLibraryExpanded";
import { Quiz } from "@/components/Quiz";
import { MiniGamesExpanded } from "@/components/MiniGamesExpanded";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { CommunityWall as CommunityWallUpdated } from "@/components/CommunityWallUpdated";
import { LearnSection } from "@/components/LearnSection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import heroImage from "@/assets/hero-forest.jpg";
import confetti from "canvas-confetti";

const Index = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    progress, 
    plantedTrees, 
    badges, 
    achievements, 
    loading: progressLoading,
    updateProgress: dbUpdateProgress,
    addPlantedTree,
    addBadge,
    addAchievement,
    refetch
  } = useUserProgress(user?.id);

  // Translation
  const { t, isTranslating, currentLanguage } = useAutoTranslate();
  const { translate } = useTranslation();

  // Slogans - will be translated
  const [slogans, setSlogans] = useState([
    "One tree at a time, we change the world",
    "Plant today for a greener tomorrow",
    "Every tree counts in our fight against climate change",
    "Growing forests, growing hope"
  ]);

  // Translate slogans when language changes
  useEffect(() => {
    const translateSlogans = async () => {
      if (currentLanguage === 'en') {
        setSlogans([
          "One tree at a time, we change the world",
          "Plant today for a greener tomorrow",
          "Every tree counts in our fight against climate change",
          "Growing forests, growing hope"
        ]);
        return;
      }
      
      const baseSlogans = [
        "One tree at a time, we change the world",
        "Plant today for a greener tomorrow",
        "Every tree counts in our fight against climate change",
        "Growing forests, growing hope"
      ];
      
      try {
        const translated = await Promise.all(baseSlogans.map(s => translate(s)));
        setSlogans(translated);
      } catch (error) {
        console.error('Slogan translation error:', error);
      }
    };
    
    translateSlogans();
  }, [currentLanguage, translate]);

  // Realtime updates
  useRealtimeProgress(() => {
    refetch();
  });

  // Rotate slogans
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slogans.length]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!user || !progress) {
    return null;
  }

  const updateProgress = async (newData: Partial<{ treesPlanted?: number; co2Reduced?: number; oxygenGenerated?: number; wildlifeSheltered?: number; waterSaved?: number; greenAreaExpanded?: number; energySaved?: number }>) => {
    const treesAdded = newData.treesPlanted || 0;
    
    // Calculate seed rewards
    let seedsEarned = 0;
    if (treesAdded > 0) {
      seedsEarned += treesAdded * 5; // 5 seeds per tree
    }

    // Check and award badges
    const currentTrees = progress.trees_planted || 0;
    const newTreesTotal = currentTrees + treesAdded;
    const currentBadgeNames = badges.map(b => b.badge_name);
    
    const badgeNames = {
      starter: "Eco Starter",
      hero: "Eco Hero",
      guardian: "Green Guardian",
      maker: "Change Maker"
    };
    
    if (newTreesTotal >= 1 && !currentBadgeNames.includes(badgeNames.starter)) {
      await addBadge(badgeNames.starter);
      seedsEarned += 10;
      await addAchievement(`Earned "${badgeNames.starter}" badge`, 10);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    if (newTreesTotal >= 10 && !currentBadgeNames.includes(badgeNames.hero)) {
      await addBadge(badgeNames.hero);
      seedsEarned += 25;
      await addAchievement(`Earned "${badgeNames.hero}" badge`, 25);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    if (newTreesTotal >= 50 && !currentBadgeNames.includes(badgeNames.guardian)) {
      await addBadge(badgeNames.guardian);
      seedsEarned += 100;
      await addAchievement(`Earned "${badgeNames.guardian}" badge`, 100);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    if (newTreesTotal >= 100 && !currentBadgeNames.includes(badgeNames.maker)) {
      await addBadge(badgeNames.maker);
      seedsEarned += 200;
      await addAchievement(`Earned "${badgeNames.maker}" badge`, 200);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    if (treesAdded > 0) {
      await addAchievement(`Planted ${treesAdded} tree${treesAdded > 1 ? 's' : ''}`, treesAdded * 5);
    }

    // Update progress in database
    await dbUpdateProgress({
      trees_planted: (progress.trees_planted || 0) + (newData.treesPlanted || 0),
      co2_reduced: (progress.co2_reduced || 0) + (newData.co2Reduced || 0),
      oxygen_generated: (progress.oxygen_generated || 0) + (newData.oxygenGenerated || 0),
      wildlife_sheltered: (progress.wildlife_sheltered || 0) + (newData.wildlifeSheltered || 0),
      water_saved: (progress.water_saved || 0) + (newData.waterSaved || 0),
      green_area_expanded: (progress.green_area_expanded || 0) + (newData.greenAreaExpanded || 0),
      energy_saved: (progress.energy_saved || 0) + (newData.energySaved || 0),
      seed_points: (progress.seed_points || 0) + seedsEarned,
    });
  };

  const navItems = [
    { id: 'plant', label: t.plantTree, icon: TreeDeciduous },
    { id: 'impact', label: t.impactCounter, icon: BarChart3 },
    { id: 'achievements', label: t.achievements, icon: Trophy },
    { id: 'library', label: t.treeLibrary, icon: Library },
    { id: 'learn', label: t.learnGrow, icon: BookOpen },
    { id: 'quiz', label: t.quiz, icon: GamepadIcon },
    { id: 'games', label: t.miniGames, icon: Gamepad2 },
    { id: 'voice', label: t.voiceAssistant, icon: Mic },
    { id: 'community', label: t.communityWall, icon: Users },
  ];

  const nextTier = progress.trees_planted >= 100 ? null : 
    progress.trees_planted >= 50 ? 100 :
    progress.trees_planted >= 25 ? 50 :
    progress.trees_planted >= 10 ? 25 :
    progress.trees_planted >= 1 ? 10 : 1;

  const tierProgress = nextTier ? (progress.trees_planted / nextTier) * 100 : 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Translation loading indicator */}
      {isTranslating && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/90 text-primary-foreground py-1 text-center text-sm">
          <Loader2 className="h-3 w-3 animate-spin inline mr-2" />
          Translating...
        </div>
      )}

      {/* Hero Section with Animated Background */}
      <div 
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        <AnimatedBackground />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Leaf className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium">{t.digitalPlatform}</span>
            <Sparkles className="h-4 w-4 text-yellow-400" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-slide-up bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
            {t.welcome}
          </h1>
          <p className="text-xl md:text-2xl mb-6 animate-slide-up text-white/90" style={{ animationDelay: '0.1s' }}>
            {t.subtitle}
          </p>
          
          <div 
            className="text-lg md:text-xl font-semibold bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm px-8 py-4 rounded-full inline-block animate-pulse-soft shadow-2xl border border-white/20"
          >
            ✨ {slogans[currentSlogan]}
          </div>

          {/* Personal Progress Preview */}
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 max-w-md mx-auto border border-white/20">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <TreeDeciduous className="h-4 w-4 text-green-400" />
                {t.yourForest}: {progress.trees_planted || 0} {t.trees}
              </span>
              <span className="text-yellow-400">🌱 {progress.seed_points || 0} {t.seeds}</span>
            </div>
            <Progress value={tierProgress} className="h-2 bg-white/20" />
            <p className="text-xs mt-2 text-white/70">
              {nextTier ? `${nextTier - progress.trees_planted} ${t.moreToNextRank}` : `🏆 ${t.maxRankAchieved}`}
            </p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 z-20 flex gap-2 flex-wrap justify-end">
          <LanguageSwitcher />
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/profile')}
            className="gap-2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
          >
            <UserIcon className="h-4 w-4" />
            {t.profile}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={signOut}
            className="gap-2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
          >
            <LogOut className="h-4 w-4" />
            {t.logout}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="plant" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2 h-auto p-2 bg-card">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs md:text-sm">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="plant" className="space-y-6">
            <PlantTree 
              language={currentLanguage} 
              onTreePlanted={updateProgress} 
              addPlantedTree={addPlantedTree}
              t={t} 
            />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactCounter 
              plantedTrees={plantedTrees}
              achievements={achievements}
              t={t} 
              onRefresh={refetch}
            />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsDashboard 
              progress={progress}
              badges={badges}
              achievements={achievements}
              t={t}
              onRefresh={refetch}
            />
          </TabsContent>

          <TabsContent value="library">
            <TreeLibraryExpanded language={currentLanguage} t={t} />
          </TabsContent>

          <TabsContent value="learn">
            <LearnSection language={currentLanguage} t={t} />
          </TabsContent>

          <TabsContent value="quiz">
            <Quiz 
              language={currentLanguage} 
              t={t} 
              onQuizComplete={async (score) => {
                // Calculate seeds based on quiz score
                const seedsEarned = Math.max(5, Math.floor(score * 2)); // Minimum 5 seeds, 2 seeds per point
                
                // Update database with seeds
                await dbUpdateProgress({ 
                  seed_points: (progress.seed_points || 0) + seedsEarned 
                });
                
                // Log achievement
                await addAchievement(`Quiz completed with score ${score}`, seedsEarned);
                
                // Bonus: if high score, also count as tree planting
                if (score >= 25) {
                  await updateProgress({ treesPlanted: 1, co2Reduced: 5, oxygenGenerated: 50, wildlifeSheltered: 1 });
                }
                
                // Trigger confetti for good scores
                if (score >= 15) {
                  confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
                }
                
                // Refresh data
                await refetch();
              }}
            />
          </TabsContent>

          <TabsContent value="games">
            <MiniGamesExpanded 
              progress={progress} 
              onProgressUpdate={async (update) => {
                // Update seeds in database
                await dbUpdateProgress({ 
                  seed_points: (progress.seed_points || 0) + update.seedPoints 
                });
                
                // Log achievement for game completion
                if (update.seedPoints > 0) {
                  await addAchievement(`Earned ${update.seedPoints} seeds from mini-game`, update.seedPoints);
                }
                
                // Refresh data
                await refetch();
              }}
            />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceAssistant language={currentLanguage} t={t} />
          </TabsContent>

          <TabsContent value="community">
            <CommunityWallUpdated t={t} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
