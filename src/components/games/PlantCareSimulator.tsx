import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sprout, Droplets, Sun, Leaf, Zap, Info } from "lucide-react";
import { plantLifecycleStages } from "@/lib/ecoGameData";
import confetti from "canvas-confetti";

interface PlantCareSimulatorProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

export const PlantCareSimulator = ({ onComplete, onBack }: PlantCareSimulatorProps) => {
  const [stage, setStage] = useState(0);
  const [water, setWater] = useState(0);
  const [sun, setSun] = useState(0);
  const [nutrients, setNutrients] = useState(0);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [overwatered, setOverwatered] = useState(false);
  const [sunburned, setSunburned] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentStage = plantLifecycleStages[stage];

  useEffect(() => {
    const timer = setInterval(() => {
      if (completed) return;
      setGameTime(prev => prev + 1);
      // Resources decay over time
      setWater(prev => Math.max(0, prev - 1));
      setSun(prev => Math.max(0, prev - 0.5));
      setNutrients(prev => Math.max(0, prev - 0.3));

      // Health drops if resources are too low or too high
      setHealth(prev => {
        let delta = 0;
        if (water < 10) delta -= 2;
        if (sun < 10) delta -= 1;
        if (water > 90) { delta -= 3; setOverwatered(true); } else { setOverwatered(false); }
        if (sun > 90) { delta -= 2; setSunburned(true); } else { setSunburned(false); }
        return Math.max(0, Math.min(100, prev + delta));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [completed, water, sun]);

  const addWater = () => {
    setWater(prev => Math.min(100, prev + 15));
    setShowTip(false);
  };

  const addSun = () => {
    setSun(prev => Math.min(100, prev + 20));
    setShowTip(false);
  };

  const addNutrients = () => {
    setNutrients(prev => Math.min(100, prev + 20));
    setShowTip(false);
  };

  const tryAdvanceStage = () => {
    if (
      water >= currentStage.requiredWater &&
      sun >= currentStage.requiredSun &&
      nutrients >= currentStage.requiredNutrients &&
      health >= 50
    ) {
      const stageScore = Math.round((health / 100) * 30);
      setScore(prev => prev + stageScore);

      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 }, colors: ['#10b981', '#34d399', '#6ee7b7'] });

      if (stage + 1 >= plantLifecycleStages.length) {
        setCompleted(true);
        const totalSeeds = score + stageScore + 50; // bonus for completion
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        setTimeout(() => onComplete(totalSeeds), 1500);
      } else {
        setStage(prev => prev + 1);
        setShowTip(true);
      }
    }
  };

  const canAdvance = water >= currentStage.requiredWater &&
    sun >= currentStage.requiredSun &&
    nutrients >= currentStage.requiredNutrients &&
    health >= 50;

  return (
    <Card className="border-2 border-green-500/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            Plant Care Simulator
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">Stage {stage + 1}/{plantLifecycleStages.length}</Badge>
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* Plant display */}
        <div className="text-center py-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl border border-green-500/20">
          <div className="text-7xl mb-3 transition-all duration-500">{currentStage.emoji}</div>
          <h3 className="text-xl font-bold text-foreground">{currentStage.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{currentStage.description}</p>
          {overwatered && <p className="text-sm text-red-500 mt-2 font-medium">⚠️ Over-watered! Roots may rot!</p>}
          {sunburned && <p className="text-sm text-orange-500 mt-2 font-medium">⚠️ Too much sun! Leaves are burning!</p>}
        </div>

        {/* Tip */}
        {showTip && (
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">{currentStage.tip}</p>
          </div>
        )}

        {/* Health bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>❤️ Plant Health</span>
            <span className={`font-semibold ${health < 30 ? 'text-red-500' : health < 60 ? 'text-yellow-500' : 'text-green-500'}`}>
              {Math.round(health)}%
            </span>
          </div>
          <Progress value={health} className="h-3" />
        </div>

        {/* Resource bars */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>💧 Water</span>
              <span className={water >= currentStage.requiredWater ? 'text-green-500' : 'text-muted-foreground'}>
                {Math.round(water)}/{currentStage.requiredWater}
              </span>
            </div>
            <Progress value={water} className="h-2" />
            <Button onClick={addWater} size="sm" variant="outline" className="w-full text-xs">
              <Droplets className="h-3 w-3 mr-1" /> Water
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>☀️ Sun</span>
              <span className={sun >= currentStage.requiredSun ? 'text-green-500' : 'text-muted-foreground'}>
                {Math.round(sun)}/{currentStage.requiredSun}
              </span>
            </div>
            <Progress value={sun} className="h-2" />
            <Button onClick={addSun} size="sm" variant="outline" className="w-full text-xs">
              <Sun className="h-3 w-3 mr-1" /> Sunlight
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>🧪 Nutrients</span>
              <span className={nutrients >= currentStage.requiredNutrients ? 'text-green-500' : 'text-muted-foreground'}>
                {Math.round(nutrients)}/{currentStage.requiredNutrients}
              </span>
            </div>
            <Progress value={nutrients} className="h-2" />
            <Button onClick={addNutrients} size="sm" variant="outline" className="w-full text-xs">
              <Leaf className="h-3 w-3 mr-1" /> Feed
            </Button>
          </div>
        </div>

        {/* Progress bar through stages */}
        <div className="flex gap-1">
          {plantLifecycleStages.map((s, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i < stage ? 'bg-green-500' : i === stage ? 'bg-green-400 animate-pulse' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={tryAdvanceStage} disabled={!canAdvance || completed} className="flex-1" size="lg">
            {completed ? '🎉 Complete!' : canAdvance ? `Grow to ${plantLifecycleStages[stage + 1]?.name || 'Full Growth'}` : 'Meet resource requirements first'}
          </Button>
          <Button onClick={onBack} variant="outline" size="lg">Exit</Button>
        </div>
      </CardContent>
    </Card>
  );
};
