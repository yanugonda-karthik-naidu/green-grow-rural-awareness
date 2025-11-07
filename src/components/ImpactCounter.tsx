import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeDeciduous, Cloud, Wind, Bird, Calendar, Droplet, Map, Zap, TrendingUp, Sparkles, Award, Volume2 } from "lucide-react";
import { UserProgress, PlantedTree } from "@/hooks/useUserProgress";
import { treeData } from "@/lib/treeData";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface ImpactCounterProps {
  progress: UserProgress;
  plantedTrees: PlantedTree[];
  t: any;
}

export const ImpactCounter = ({ progress, plantedTrees, t }: ImpactCounterProps) => {
  const [selectedStat, setSelectedStat] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const safeProgress = {
    treesPlanted: progress.trees_planted || 0,
    co2Reduced: progress.co2_reduced || 0,
    oxygenGenerated: progress.oxygen_generated || 0,
    wildlifeSheltered: progress.wildlife_sheltered || 0,
    waterSaved: progress.water_saved || 0,
    greenAreaExpanded: progress.green_area_expanded || 0,
    energySaved: progress.energy_saved || 0,
    seedPoints: progress.seed_points || 0,
    plantedTrees: plantedTrees,
    badges: [],
  };

  const stats = [
    {
      icon: TreeDeciduous,
      label: t.treesPlanted,
      value: safeProgress.treesPlanted,
      unit: "",
      color: "text-emerald-600",
      bgGradient: "bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-emerald-300/5",
      description: "Your contribution to a greener planet",
      trend: "+12%"
    },
    {
      icon: Cloud,
      label: t.co2Reduced,
      value: safeProgress.co2Reduced,
      unit: "kg",
      color: "text-sky-600",
      bgGradient: "bg-gradient-to-br from-sky-500/20 via-sky-400/10 to-sky-300/5",
      description: "Carbon dioxide absorbed by your trees",
      trend: "+8%"
    },
    {
      icon: Wind,
      label: t.oxygenGenerated,
      value: safeProgress.oxygenGenerated,
      unit: "L/day",
      color: "text-cyan-600",
      bgGradient: "bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-cyan-300/5",
      description: "Fresh oxygen produced daily",
      trend: "+10%"
    },
    {
      icon: Bird,
      label: t.wildlifeSheltered,
      value: safeProgress.wildlifeSheltered,
      unit: "birds",
      color: "text-amber-600",
      bgGradient: "bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-300/5",
      description: "Wildlife provided with shelter",
      trend: "+15%"
    },
    {
      icon: Droplet,
      label: t.waterSaved,
      value: safeProgress.waterSaved,
      unit: "L",
      color: "text-blue-600",
      bgGradient: "bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-blue-300/5",
      description: t.waterSavedDesc,
      trend: "+18%"
    },
    {
      icon: Map,
      label: t.greenArea,
      value: safeProgress.greenAreaExpanded,
      unit: "m²",
      color: "text-green-600",
      bgGradient: "bg-gradient-to-br from-green-500/20 via-green-400/10 to-green-300/5",
      description: t.greenAreaDesc,
      trend: "+7%"
    },
    {
      icon: Zap,
      label: t.energySaved,
      value: safeProgress.energySaved,
      unit: "kWh",
      color: "text-yellow-600",
      bgGradient: "bg-gradient-to-br from-yellow-500/20 via-yellow-400/10 to-yellow-300/5",
      description: t.energySavedDesc,
      trend: "+5%"
    }
  ];

  const maxTrees = 100;
  const progressPercent = Math.min((safeProgress.treesPlanted / maxTrees) * 100, 100);

  // Impact distribution for pie chart
  const impactData = [
    { name: t.co2Reduced, value: safeProgress.co2Reduced, color: '#0ea5e9' },
    { name: t.oxygenGenerated, value: safeProgress.oxygenGenerated / 10, color: '#06b6d4' },
    { name: t.wildlifeSheltered, value: safeProgress.wildlifeSheltered * 10, color: '#f59e0b' },
    { name: t.waterSaved, value: safeProgress.waterSaved / 10, color: '#3b82f6' },
  ];

  // Weekly progress data - calculate from actual planted trees grouped by week
  const weeklyData = React.useMemo(() => {
    if (plantedTrees.length === 0) return [];
    
    const weeklyMap: Record<string, { trees: number; co2: number }> = {};
    const now = Date.now();
    
    plantedTrees.forEach((tree) => {
      const plantedTime = new Date(tree.planted_date).getTime();
      const weeksPassed = Math.ceil((now - plantedTime) / (7 * 24 * 60 * 60 * 1000));
      const weekKey = `${t.week || 'Week'} ${weeksPassed}`;
      
      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = { trees: 0, co2: 0 };
      }
      weeklyMap[weekKey].trees += 1;
      weeklyMap[weekKey].co2 += tree.impact_co2_kg || 25;
    });
    
    return Object.entries(weeklyMap)
      .map(([week, data]) => ({ week, ...data }))
      .slice(-4);
  }, [plantedTrees, t.week]);

  // AI Suggestions
  const aiSuggestions = [
    { icon: TreeDeciduous, text: t.aiSuggestion1, action: t.plantNowAction },
    { icon: Cloud, text: t.aiSuggestion2, action: t.learnMore },
    { icon: Droplet, text: t.aiSuggestion3, action: t.setReminderAction },
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
    if (safeProgress.treesPlanted > 0 && safeProgress.treesPlanted % 10 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [safeProgress.treesPlanted]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-2 p-6 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl border-2 border-emerald-500/20">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
          🌍 {t.impactCounter}
        </h2>
        <p className="text-muted-foreground text-lg">{t.impactGlance}</p>
        <p className="text-sm text-muted-foreground">{t.impactContribution}</p>
      </div>

      {/* Dynamic Stats Grid */}
      <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            {t.liveMetrics}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t.realtimeTracking}</p>
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
                <TreeDeciduous className="h-4 w-4 text-emerald-600" />
                {t.myProgress}
              </span>
              <span className="font-bold text-emerald-600 text-lg">
                {safeProgress.treesPlanted} / {maxTrees}
              </span>
            </div>
            <Progress value={progressPercent} className="h-4 shadow-inner" />
            <p className="text-xs text-muted-foreground text-center font-medium">
              🎯 {maxTrees - safeProgress.treesPlanted} more trees to reach your goal!
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
              🌿 Your greenery supports <strong>{safeProgress.wildlifeSheltered} birds</strong>, covers <strong>{safeProgress.greenAreaExpanded} m²</strong> of shade area, and absorbs <strong>{safeProgress.co2Reduced} kg</strong> of CO₂ every year.
            </p>
            <p className="text-md text-muted-foreground">
              🎯 Keep planting more trees to increase your environmental impact!
            </p>
            <Button 
              onClick={() => speakMotivation(`You have planted ${safeProgress.treesPlanted} trees and reduced ${safeProgress.co2Reduced} kilograms of carbon dioxide. Keep up the amazing work!`)}
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
      {safeProgress.plantedTrees.length > 0 && (
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
                {safeProgress.plantedTrees.map((tree, idx) => {
                  const treeInfo = treeData.find(t => t.nameEn === tree.tree_name);
                  const growthStage = Math.min(tree.stage, 6);
                  const growthPercent = (growthStage / 6) * 100;
                  
                  // Get the uploaded image from Supabase storage or fallback to tree data
                  const displayImage = tree.image_path 
                    ? `https://zxbnkivvrrfpzwfcfidk.supabase.co/storage/v1/object/public/plant-images/${tree.image_path}`
                    : treeInfo?.image;
                  
                  return (
                    <Card 
                      key={idx} 
                      className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-primary/20"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                        {displayImage && (
                          <img 
                            src={displayImage} 
                            alt={tree.tree_name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <div className={`h-2 w-2 rounded-full ${growthStage === 6 ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                          <span className="text-xs font-semibold">Stage {growthStage}/6</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-lg mb-2 text-primary">{tree.tree_name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3 w-3" />
                          <span>Planted: {new Date(tree.planted_date).toLocaleDateString()}</span>
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
