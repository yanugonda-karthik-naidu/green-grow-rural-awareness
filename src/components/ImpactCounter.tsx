import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeDeciduous, Cloud, Wind, Bird, Trophy, Star, Sparkles, Calendar, Droplet, Map, Zap, TrendingUp, Target, Award, Share2, Volume2 } from "lucide-react";
import { UserProgress } from "@/hooks/useLocalStorage";
import { treeData } from "@/lib/treeData";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface ImpactCounterProps {
  progress: UserProgress;
  t: any;
}

export const ImpactCounter = ({ progress, t }: ImpactCounterProps) => {
  const [selectedStat, setSelectedStat] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const stats = [
    {
      icon: TreeDeciduous,
      label: t.treesPlanted,
      value: progress.treesPlanted,
      unit: "",
      color: "text-emerald-600",
      bgGradient: "bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-emerald-300/5",
      description: "Your contribution to a greener planet",
      trend: "+12%"
    },
    {
      icon: Cloud,
      label: t.co2Reduced,
      value: progress.co2Reduced,
      unit: "kg",
      color: "text-sky-600",
      bgGradient: "bg-gradient-to-br from-sky-500/20 via-sky-400/10 to-sky-300/5",
      description: "Carbon dioxide absorbed by your trees",
      trend: "+8%"
    },
    {
      icon: Wind,
      label: t.oxygenGenerated,
      value: progress.oxygenGenerated,
      unit: "L/day",
      color: "text-cyan-600",
      bgGradient: "bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-cyan-300/5",
      description: "Fresh oxygen produced daily",
      trend: "+10%"
    },
    {
      icon: Bird,
      label: t.wildlifeSheltered,
      value: progress.wildlifeSheltered,
      unit: "birds",
      color: "text-amber-600",
      bgGradient: "bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-300/5",
      description: "Wildlife provided with shelter",
      trend: "+15%"
    },
    {
      icon: Droplet,
      label: "Water Saved",
      value: progress.waterSaved,
      unit: "L",
      color: "text-blue-600",
      bgGradient: "bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-blue-300/5",
      description: "Water conservation through greenery",
      trend: "+18%"
    },
    {
      icon: Map,
      label: "Green Area",
      value: progress.greenAreaExpanded,
      unit: "m²",
      color: "text-green-600",
      bgGradient: "bg-gradient-to-br from-green-500/20 via-green-400/10 to-green-300/5",
      description: "Land area covered with plantation",
      trend: "+7%"
    },
    {
      icon: Zap,
      label: "Energy Saved",
      value: progress.energySaved,
      unit: "kWh",
      color: "text-yellow-600",
      bgGradient: "bg-gradient-to-br from-yellow-500/20 via-yellow-400/10 to-yellow-300/5",
      description: "Energy saved through shade & cooling",
      trend: "+5%"
    }
  ];

  const maxTrees = 100;
  const progressPercent = Math.min((progress.treesPlanted / maxTrees) * 100, 100);

  // Enhanced achievement tiers
  const achievementTiers = [
    { icon: Star, name: "Green Beginner", threshold: 1, color: "text-green-400", bgColor: "bg-green-500/10", desc: "Started your eco journey" },
    { icon: TreeDeciduous, name: "Eco Explorer", threshold: 10, color: "text-teal-400", bgColor: "bg-teal-500/10", desc: "Actively planting trees" },
    { icon: Sparkles, name: "Forest Friend", threshold: 25, color: "text-emerald-400", bgColor: "bg-emerald-500/10", desc: "Creating mini forests" },
    { icon: Award, name: "Green Guardian", threshold: 50, color: "text-cyan-400", bgColor: "bg-cyan-500/10", desc: "Protecting the environment" },
    { icon: Trophy, name: "Village Hero", threshold: 100, color: "text-blue-400", bgColor: "bg-blue-500/10", desc: "Community role model" },
    { icon: Target, name: "Earth Saver", threshold: 200, color: "text-purple-400", bgColor: "bg-purple-500/10", desc: "Planet guardian champion" },
  ];

  const currentTier = achievementTiers
    .slice()
    .reverse()
    .find(tier => progress.treesPlanted >= tier.threshold) || achievementTiers[0];

  const nextTier = achievementTiers.find(tier => tier.threshold > progress.treesPlanted);

  // Enhanced badges with more types
  const allBadgeTypes = [
    { id: "water_saver", name: "💧 Water Saver", desc: "Regular tree maintenance", condition: () => progress.plantedTrees.length >= 3 },
    { id: "climate_warrior", name: "🌤 Climate Warrior", desc: "Active in all seasons", condition: () => progress.treesPlanted >= 15 },
    { id: "eco_educator", name: "🐝 Eco Educator", desc: "Completed awareness quiz", condition: () => progress.badges.includes("Quiz Master") },
    { id: "bird_saver", name: "🕊 Bird Saver", desc: "Increased wildlife shelter", condition: () => progress.wildlifeSheltered >= 10 },
    { id: "soil_protector", name: "💚 Soil Protector", desc: "Planted diverse tree types", condition: () => progress.plantedTrees.length >= 5 },
  ];

  const earnedBadges = allBadgeTypes.filter(badge => badge.condition());

  // Impact distribution for pie chart
  const impactData = [
    { name: 'CO₂ Reduced', value: progress.co2Reduced, color: '#0ea5e9' },
    { name: 'O₂ Generated', value: progress.oxygenGenerated / 10, color: '#06b6d4' },
    { name: 'Wildlife', value: progress.wildlifeSheltered * 10, color: '#f59e0b' },
    { name: 'Water Saved', value: progress.waterSaved / 10, color: '#3b82f6' },
  ];

  // Weekly progress data
  const weeklyData = progress.weeklyProgress.length > 0 
    ? progress.weeklyProgress 
    : [
        { week: 'Week 1', trees: 2, co2: 50 },
        { week: 'Week 2', trees: 5, co2: 125 },
        { week: 'Week 3', trees: 3, co2: 75 },
        { week: 'Week 4', trees: Math.max(1, progress.treesPlanted), co2: progress.co2Reduced },
      ];

  // Leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Ravi Kumar", trees: 127, impact: 3175, avatar: "🌟" },
    { rank: 2, name: "Priya Sharma", trees: 98, impact: 2450, avatar: "🌿" },
    { rank: 3, name: "You", trees: progress.treesPlanted, impact: progress.co2Reduced, avatar: "🌱" },
    { rank: 4, name: "Amit Patel", trees: 76, impact: 1900, avatar: "🌲" },
    { rank: 5, name: "Sneha Reddy", trees: 64, impact: 1600, avatar: "🍃" },
  ].sort((a, b) => b.trees - a.trees).map((item, idx) => ({ ...item, rank: idx + 1 }));

  // AI Suggestions
  const aiSuggestions = [
    { icon: TreeDeciduous, text: "Plant 3 Neem Trees this week to boost your CO₂ reduction by 75 kg/year!", action: "Plant Now" },
    { icon: Cloud, text: "Monsoon Alert 🌧 — this week's weather is ideal for planting mango saplings.", action: "Learn More" },
    { icon: Droplet, text: "Water your planted trees every 2 days during this dry season.", action: "Set Reminder" },
  ];

  const speakMotivation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.pitch = 1.2;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (progress.treesPlanted > 0 && progress.treesPlanted % 10 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [progress.treesPlanted]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-2 p-6 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl border-2 border-emerald-500/20">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
          🌍 Impact Counter
        </h2>
        <p className="text-muted-foreground text-lg">Your Environmental Impact at a Glance</p>
        <p className="text-sm text-muted-foreground">See how your plantation contributes to a greener Earth</p>
      </div>

      {/* Dynamic Stats Grid */}
      <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            Live Impact Metrics
          </CardTitle>
          <p className="text-sm text-muted-foreground">Real-time environmental contribution tracking</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.bgGradient} p-6 rounded-xl border border-border/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up group relative overflow-hidden`}
                style={{ animationDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setSelectedStat(idx)}
                onMouseLeave={() => setSelectedStat(null)}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl" />
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <stat.icon className={`h-10 w-10 ${stat.color} transition-transform duration-300 group-hover:scale-110 drop-shadow-lg`} />
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mb-1 drop-shadow-md`}>
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
          <div className="mt-8 space-y-3 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 p-6 rounded-xl border-2 border-emerald-500/20">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-600" />
                {t.myProgress}
              </span>
              <span className="font-bold text-emerald-600 text-lg">
                {progress.treesPlanted} / {maxTrees}
              </span>
            </div>
            <Progress value={progressPercent} className="h-4 shadow-inner" />
            <p className="text-xs text-muted-foreground text-center font-medium">
              🎯 {maxTrees - progress.treesPlanted} more trees to reach your goal!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="overflow-hidden border-2 border-purple-500/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-purple-600">
            <Sparkles className="h-6 w-6 animate-pulse" />
            AI-Powered Eco Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {aiSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 hover:shadow-lg transition-all duration-300"
            >
              <suggestion.icon className="h-6 w-6 text-purple-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{suggestion.text}</p>
              </div>
              <Button size="sm" variant="secondary" className="shrink-0">
                {suggestion.action}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Impact Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time-based Progress */}
        <Card className="overflow-hidden border-2 border-teal-500/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-teal-600">
              <TrendingUp className="h-5 w-5" />
              Your Impact Over Time
            </CardTitle>
            <p className="text-xs text-muted-foreground">Weekly growth timeline</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="trees" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} name="Trees Planted" />
                <Line type="monotone" dataKey="co2" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', r: 5 }} name="CO₂ Reduced (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impact Distribution */}
        <Card className="overflow-hidden border-2 border-blue-500/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-600">
              <Award className="h-5 w-5" />
              Impact Distribution
            </CardTitle>
            <p className="text-xs text-muted-foreground">Your environmental contributions</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={impactData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {impactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Eco Impact Summary */}
      <Card className="overflow-hidden border-2 border-green-500/30 shadow-2xl bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full mb-4">
              <TreeDeciduous className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600">Your Eco Impact Summary</h3>
            <p className="text-lg text-foreground max-w-3xl mx-auto">
              🌿 Your greenery supports <strong>{progress.wildlifeSheltered} birds</strong>, covers <strong>{progress.greenAreaExpanded} m²</strong> of shade area, and absorbs <strong>{progress.co2Reduced} kg</strong> of CO₂ every year.
            </p>
            <p className="text-md text-muted-foreground">
              🎯 At this pace, you'll become a <strong>{nextTier?.name || "Earth Saver"}</strong> in {nextTier ? Math.ceil((nextTier.threshold - progress.treesPlanted) / (progress.treesPlanted || 1)) : 0} days!
            </p>
            <Button 
              onClick={() => speakMotivation(`You have planted ${progress.treesPlanted} trees and reduced ${progress.co2Reduced} kilograms of carbon dioxide. Keep up the amazing work!`)}
              variant="secondary"
              className="mt-4"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Hear Your Impact
            </Button>
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

      {/* Hall of Achievements */}
      <Card className="overflow-hidden border-2 border-yellow-500/30 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10">
          <CardTitle className="text-3xl font-bold text-yellow-600 flex items-center gap-3">
            <Trophy className="h-8 w-8 animate-pulse" />
            🌟 Hall of Achievements
          </CardTitle>
          <p className="text-sm text-muted-foreground">Celebrate your milestones and eco-journey!</p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Personal Stats Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/10 border-2 border-yellow-500/30 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="flex flex-col items-center">
                <div className={`${currentTier.bgColor} p-6 rounded-2xl mb-2`}>
                  <currentTier.icon className={`h-16 w-16 ${currentTier.color}`} />
                </div>
                <p className="text-xs text-muted-foreground">Current Rank</p>
                <h3 className={`text-xl font-bold ${currentTier.color}`}>{currentTier.name}</h3>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">{progress.treesPlanted}</p>
                <p className="text-xs text-muted-foreground">Total Trees</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-600">{progress.co2Reduced}</p>
                <p className="text-xs text-muted-foreground">Impact Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600">{earnedBadges.length}</p>
                <p className="text-xs text-muted-foreground">Badges Earned</p>
              </div>
              <div className="text-center">
                {nextTier && (
                  <>
                    <p className="text-2xl font-bold text-purple-600">{nextTier.threshold - progress.treesPlanted}</p>
                    <p className="text-xs text-muted-foreground">Trees to {nextTier.name}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Achievement Tiers */}
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Achievement Ranks
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievementTiers.map((tier, idx) => {
                const isUnlocked = progress.treesPlanted >= tier.threshold;
                const isCurrent = tier.name === currentTier.name;
                
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      isCurrent
                        ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 shadow-xl scale-105'
                        : isUnlocked
                        ? 'border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5'
                        : 'border-border/30 bg-muted/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${tier.bgColor} p-3 rounded-xl ${isUnlocked ? '' : 'grayscale'}`}>
                        <tier.icon className={`h-8 w-8 ${tier.color}`} />
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-bold ${tier.color}`}>{tier.name}</h5>
                        <p className="text-xs text-muted-foreground">{tier.threshold}+ trees</p>
                      </div>
                      {isUnlocked && <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{tier.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Showcase */}
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Special Badges
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allBadgeTypes.map((badge, idx) => {
                const isEarned = earnedBadges.some(eb => eb.id === badge.id);
                
                return (
                  <div
                    key={idx}
                    className={`group relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      isEarned
                        ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5'
                        : 'border-border/30 bg-muted/30 opacity-50'
                    }`}
                  >
                    {isEarned && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                    )}
                    <div className="relative flex items-center gap-4">
                      <div className={`text-4xl ${isEarned ? '' : 'grayscale'}`}>
                        {badge.name.split(' ')[0]}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{badge.name.split(' ').slice(1).join(' ')}</h4>
                        <p className="text-xs text-muted-foreground">{badge.desc}</p>
                      </div>
                      {isEarned && (
                        <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Community Leaderboard
            </h4>
            <div className="space-y-3">
              {leaderboardData.map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    entry.name === "You"
                      ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-green-500/5 shadow-lg'
                      : 'border-border/30 bg-card'
                  }`}
                >
                  <div className={`text-2xl font-bold ${
                    entry.rank === 1 ? 'text-yellow-500' :
                    entry.rank === 2 ? 'text-gray-400' :
                    entry.rank === 3 ? 'text-amber-600' :
                    'text-muted-foreground'
                  }`}>
                    #{entry.rank}
                  </div>
                  <div className="text-3xl">{entry.avatar}</div>
                  <div className="flex-1">
                    <h5 className="font-bold text-lg">{entry.name}</h5>
                    <p className="text-xs text-muted-foreground">{entry.trees} trees planted</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">{entry.impact}</p>
                    <p className="text-xs text-muted-foreground">Impact Score</p>
                  </div>
                  {entry.rank <= 3 && (
                    <Trophy className={`h-6 w-6 ${
                      entry.rank === 1 ? 'text-yellow-500' :
                      entry.rank === 2 ? 'text-gray-400' :
                      'text-amber-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Share Achievement */}
          <div className="text-center p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
            <h4 className="text-lg font-bold mb-3">Share Your Achievement!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Inspire others in your community to join the green revolution
            </p>
            <Button className="gap-2">
              <Share2 className="h-4 w-4" />
              Share My Impact
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              🌿
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
