import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreeDeciduous, BarChart3, BookOpen, GamepadIcon, Mic, Users, Library, Trophy } from "lucide-react";
import { translations, Language } from "@/lib/translations";
import { useUserProgress } from "@/hooks/useLocalStorage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PlantTree } from "@/components/PlantTree";
import { ImpactCounter } from "@/components/ImpactCounter";
import { AchievementsDashboard } from "@/components/AchievementsDashboard";
import { TreeLibrary } from "@/components/TreeLibrary";
import { Quiz } from "@/components/Quiz";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { CommunityWall } from "@/components/CommunityWall";
import { LearnSection } from "@/components/LearnSection";
import heroImage from "@/assets/hero-forest.jpg";

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [progress, setProgress] = useUserProgress();
  const [currentSlogan, setCurrentSlogan] = useState(0);
  
  const t = translations[language];

  const updateProgress = (newData: Partial<typeof progress>) => {
    const treesAdded = newData.treesPlanted || 0;
    const updated = {
      ...progress,
      treesPlanted: (progress.treesPlanted || 0) + treesAdded,
      co2Reduced: (progress.co2Reduced || 0) + (newData.co2Reduced || 0),
      oxygenGenerated: (progress.oxygenGenerated || 0) + (newData.oxygenGenerated || 0),
      wildlifeSheltered: (progress.wildlifeSheltered || 0) + (newData.wildlifeSheltered || 0),
      waterSaved: (progress.waterSaved || 0) + (newData.waterSaved || 0),
      greenAreaExpanded: (progress.greenAreaExpanded || 0) + (newData.greenAreaExpanded || 0),
      energySaved: (progress.energySaved || 0) + (newData.energySaved || 0),
    };

    // Calculate seed rewards
    let seedsEarned = 0;
    if (treesAdded > 0) {
      seedsEarned += treesAdded * 5; // 5 seeds per tree
    }

    // Award badges and seeds
    const badges = [...progress.badges];
    const achievementTimeline = [...(progress.achievementTimeline || [])];
    
    if (updated.treesPlanted >= 1 && !badges.includes(t.badges.starter)) {
      badges.push(t.badges.starter);
      seedsEarned += 10;
      achievementTimeline.unshift({
        date: new Date().toLocaleDateString(),
        achievement: `Earned "${t.badges.starter}" badge`,
        seedsEarned: 10
      });
    }
    if (updated.treesPlanted >= 10 && !badges.includes(t.badges.hero)) {
      badges.push(t.badges.hero);
      seedsEarned += 25;
      achievementTimeline.unshift({
        date: new Date().toLocaleDateString(),
        achievement: `Earned "${t.badges.hero}" badge`,
        seedsEarned: 25
      });
    }
    if (updated.treesPlanted >= 50 && !badges.includes(t.badges.guardian)) {
      badges.push(t.badges.guardian);
      seedsEarned += 100;
      achievementTimeline.unshift({
        date: new Date().toLocaleDateString(),
        achievement: `Earned "${t.badges.guardian}" badge`,
        seedsEarned: 100
      });
    }
    if (updated.treesPlanted >= 100 && !badges.includes(t.badges.maker)) {
      badges.push(t.badges.maker);
      seedsEarned += 200;
      achievementTimeline.unshift({
        date: new Date().toLocaleDateString(),
        achievement: `Earned "${t.badges.maker}" badge`,
        seedsEarned: 200
      });
    }

    if (treesAdded > 0) {
      achievementTimeline.unshift({
        date: new Date().toLocaleDateString(),
        achievement: `Planted ${treesAdded} tree${treesAdded > 1 ? 's' : ''}`,
        seedsEarned: treesAdded * 5
      });
    }

    setProgress({ 
      ...updated, 
      badges,
      seedPoints: (progress.seedPoints || 0) + seedsEarned,
      achievementTimeline: achievementTimeline.slice(0, 20) // Keep last 20 entries
    });
  };

  // Rotate slogans
  useState(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % t.slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  const navItems = [
    { id: 'plant', label: t.plantTree, icon: TreeDeciduous },
    { id: 'impact', label: t.impactCounter, icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'library', label: t.treeLibrary, icon: Library },
    { id: 'learn', label: t.learnGrow, icon: BookOpen },
    { id: 'quiz', label: t.quiz, icon: GamepadIcon },
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
        
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="plant" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-2 bg-card">
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
            <PlantTree language={language} onTreePlanted={updateProgress} t={t} />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactCounter progress={progress} t={t} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsDashboard progress={progress} t={t} />
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
