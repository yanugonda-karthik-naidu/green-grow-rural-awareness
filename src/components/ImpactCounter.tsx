import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeDeciduous, Cloud, Wind, Bird, Trophy, Star, Sparkles, Calendar } from "lucide-react";
import { UserProgress } from "@/hooks/useLocalStorage";
import { treeData } from "@/lib/treeData";
import { useState } from "react";

interface ImpactCounterProps {
  progress: UserProgress;
  t: any;
}

export const ImpactCounter = ({ progress, t }: ImpactCounterProps) => {
  const [selectedStat, setSelectedStat] = useState<number | null>(null);

  const stats = [
    {
      icon: TreeDeciduous,
      label: t.treesPlanted,
      value: progress.treesPlanted,
      unit: "",
      color: "text-primary",
      bgGradient: "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5",
      description: "Your contribution to a greener planet"
    },
    {
      icon: Cloud,
      label: t.co2Reduced,
      value: progress.co2Reduced,
      unit: "kg",
      color: "text-secondary",
      bgGradient: "bg-gradient-to-br from-secondary/20 via-secondary/10 to-secondary/5",
      description: "Carbon dioxide absorbed by your trees"
    },
    {
      icon: Wind,
      label: t.oxygenGenerated,
      value: progress.oxygenGenerated,
      unit: "L/day",
      color: "text-accent",
      bgGradient: "bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5",
      description: "Fresh oxygen produced daily"
    },
    {
      icon: Bird,
      label: t.wildlifeSheltered,
      value: progress.wildlifeSheltered,
      unit: "birds",
      color: "text-primary",
      bgGradient: "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5",
      description: "Wildlife provided with shelter"
    }
  ];

  const maxTrees = 100;
  const progressPercent = Math.min((progress.treesPlanted / maxTrees) * 100, 100);

  const achievementTiers = [
    { icon: Star, name: "Green Beginner", threshold: 1, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { icon: TreeDeciduous, name: "Eco Warrior", threshold: 5, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { icon: Sparkles, name: "Nature Guardian", threshold: 10, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { icon: Trophy, name: "Planet Hero", threshold: 25, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  ];

  const currentTier = achievementTiers
    .reverse()
    .find(tier => progress.treesPlanted >= tier.threshold) || achievementTiers[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Stats Section */}
      <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {t.impactCounter}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Your environmental impact at a glance</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.bgGradient} p-6 rounded-xl border border-border/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl animate-slide-up group`}
                style={{ animationDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setSelectedStat(idx)}
                onMouseLeave={() => setSelectedStat(null)}
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`h-10 w-10 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
                  <div className={`h-2 w-2 rounded-full ${stat.color} animate-pulse`} />
                </div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value.toLocaleString()}
                  <span className="text-lg ml-1">{stat.unit}</span>
                </p>
                {selectedStat === idx && (
                  <p className="text-xs text-muted-foreground mt-2 animate-fade-in">{stat.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <TreeDeciduous className="h-4 w-4" />
                {t.myProgress}
              </span>
              <span className="font-bold text-primary text-lg">
                {progress.treesPlanted} / {maxTrees}
              </span>
            </div>
            <Progress value={progressPercent} className="h-4 shadow-inner" />
            <p className="text-xs text-muted-foreground text-center">
              {maxTrees - progress.treesPlanted} more trees to reach your goal!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Planted Trees Gallery */}
      {progress.plantedTrees.length > 0 && (
        <Card className="overflow-hidden border-2 border-secondary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
            <CardTitle className="text-2xl font-bold text-secondary flex items-center gap-2">
              <TreeDeciduous className="h-6 w-6" />
              Your Green Garden
            </CardTitle>
            <p className="text-sm text-muted-foreground">A living timeline of your plantation journey</p>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progress.plantedTrees.map((tree, idx) => {
                  const treeInfo = treeData.find(t => t.nameEn === tree.name);
                  const growthStage = Math.min(tree.stage, 6);
                  const growthPercent = (growthStage / 6) * 100;
                  
                  return (
                    <Card 
                      key={idx} 
                      className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-primary/20"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                        {treeInfo?.image && (
                          <img 
                            src={treeInfo.image} 
                            alt={tree.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <div className={`h-2 w-2 rounded-full ${growthStage === 6 ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                          <span className="text-xs font-semibold">Stage {growthStage}/6</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-lg mb-2 text-primary">{tree.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3 w-3" />
                          <span>Planted: {new Date(tree.plantedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Growth Progress</span>
                            <span className="font-semibold text-primary">{growthPercent.toFixed(0)}%</span>
                          </div>
                          <Progress value={growthPercent} className="h-2" />
                        </div>
                        {treeInfo && (
                          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                            {treeInfo.benefits[0]}
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Premium Achievements */}
      {progress.badges.length > 0 && (
        <Card className="overflow-hidden border-2 border-accent/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10">
            <CardTitle className="text-2xl font-bold text-accent flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Hall of Achievements
            </CardTitle>
            <p className="text-sm text-muted-foreground">Your milestones and accomplishments</p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Current Tier Display */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-2 border-primary/30 shadow-inner">
              <div className="flex items-center gap-4">
                <div className={`${currentTier.bgColor} p-4 rounded-xl`}>
                  <currentTier.icon className={`h-12 w-12 ${currentTier.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Current Rank</p>
                  <h3 className={`text-2xl font-bold ${currentTier.color}`}>{currentTier.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {progress.treesPlanted} trees planted
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
              </div>
            </div>

            {/* Achievement Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progress.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br from-background via-muted/30 to-background border-primary/20"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                  <div className="relative flex items-center gap-4">
                    <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-3 rounded-xl">
                      <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1 text-primary">{badge}</h4>
                      <p className="text-xs text-muted-foreground">
                        Unlocked with dedication and care
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Milestone Preview */}
            {progress.treesPlanted < maxTrees && (
              <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  🎯 Next milestone: Plant {achievementTiers.find(t => t.threshold > progress.treesPlanted)?.threshold || maxTrees} trees to unlock more rewards!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
