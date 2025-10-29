import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreeDeciduous, BarChart3, BookOpen, GamepadIcon, Mic, Users, Library, Trophy, Gamepad2, LogOut, Loader2 } from "lucide-react";
import { translations, Language } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useRealtimeProgress } from "@/hooks/useRealtimeProgress";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PlantTree } from "@/components/PlantTree";
import { ImpactCounter } from "@/components/ImpactCounter";
import { AchievementsDashboard } from "@/components/AchievementsDashboard";
import { TreeLibrary } from "@/components/TreeLibrary";
import { Quiz } from "@/components/Quiz";
import { MiniGames } from "@/components/MiniGames";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { CommunityWall } from "@/components/CommunityWall";
import { LearnSection } from "@/components/LearnSection";
import heroImage from "@/assets/hero-forest.jpg";
import confetti from "canvas-confetti";

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');
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

  // Realtime updates
  useRealtimeProgress(() => {
    refetch();
  });

  const t = translations[language];

  // Rotate slogans
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % t.slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [t.slogans.length]);

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
          <p className="text-lg text-muted-foreground">Loading...</p>
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
    
    if (newTreesTotal >= 1 && !currentBadgeNames.includes(t.badges.starter)) {
      await addBadge(t.badges.starter);
      seedsEarned += 10;
      await addAchievement(`Earned "${t.badges.starter}" badge`, 10);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    if (newTreesTotal >= 10 && !currentBadgeNames.includes(t.badges.hero)) {
      await addBadge(t.badges.hero);
      seedsEarned += 25;
      await addAchievement(`Earned "${t.badges.hero}" badge`, 25);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    if (newTreesTotal >= 50 && !currentBadgeNames.includes(t.badges.guardian)) {
      await addBadge(t.badges.guardian);
      seedsEarned += 100;
      await addAchievement(`Earned "${t.badges.guardian}" badge`, 100);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    if (newTreesTotal >= 100 && !currentBadgeNames.includes(t.badges.maker)) {
      await addBadge(t.badges.maker);
      seedsEarned += 200;
      await addAchievement(`Earned "${t.badges.maker}" badge`, 200);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (treesAdded > 0) {
      await addAchievement(`Planted ${treesAdded} tree${treesAdded > 1 ? 's' : ''}`, treesAdded * 5);
    }

    // Update progress in database - map camelCase to snake_case
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
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'library', label: t.treeLibrary, icon: Library },
    { id: 'learn', label: t.learnGrow, icon: BookOpen },
    { id: 'quiz', label: t.quiz, icon: GamepadIcon },
    { id: 'games', label: 'Mini Games', icon: Gamepad2 },
    { id: 'voice', label: t.voiceAssistant, icon: Mic },
    { id: 'community', label: t.communityWall, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-up">
            {t.welcome}
          </h1>
          <p className="text-2xl md:text-3xl mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t.subtitle}
          </p>
          <div 
            className="text-xl md:text-2xl font-semibold bg-primary/80 backdrop-blur-sm px-6 py-3 rounded-full inline-block animate-pulse-soft"
          >
            {t.slogans[currentSlogan]}
          </div>
        </div>
        
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={signOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
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
              language={language} 
              onTreePlanted={updateProgress} 
              addPlantedTree={addPlantedTree}
              t={t} 
            />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactCounter 
              progress={progress} 
              plantedTrees={plantedTrees}
              t={t} 
            />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsDashboard 
              progress={progress}
              badges={badges}
              achievements={achievements}
              t={t} 
            />
          </TabsContent>

          <TabsContent value="library">
            <TreeLibrary language={language} t={t} />
          </TabsContent>

          <TabsContent value="learn">
            <LearnSection language={language} t={t} />
          </TabsContent>

          <TabsContent value="quiz">
            <Quiz 
              language={language} 
              t={t} 
              onQuizComplete={(score) => {
                if (score >= 2) {
                  updateProgress({ treesPlanted: 1, co2Reduced: 5, oxygenGenerated: 50, wildlifeSheltered: 1 });
                }
              }}
            />
          </TabsContent>

          <TabsContent value="games">
            <MiniGames 
              progress={progress} 
              onProgressUpdate={(update) => dbUpdateProgress({ seed_points: update.seedPoints })}
            />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceAssistant language={language} t={t} />
          </TabsContent>

          <TabsContent value="community">
            <CommunityWall t={t} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
