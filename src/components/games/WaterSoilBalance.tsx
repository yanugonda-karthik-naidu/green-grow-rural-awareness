import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Droplets, Zap, ArrowRight, Beaker, Leaf } from "lucide-react";
import { balanceScenarios } from "@/lib/ecoGameData";
import confetti from "canvas-confetti";

interface WaterSoilBalanceProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

export const WaterSoilBalance = ({ onComplete, onBack }: WaterSoilBalanceProps) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [currentPH, setCurrentPH] = useState(balanceScenarios[0].soilpH);
  const [currentMoisture, setCurrentMoisture] = useState(balanceScenarios[0].currentMoisture);
  const [currentN, setCurrentN] = useState(balanceScenarios[0].nutrientN);
  const [currentP, setCurrentP] = useState(balanceScenarios[0].nutrientP);
  const [currentK, setCurrentK] = useState(balanceScenarios[0].nutrientK);
  const [score, setScore] = useState(0);
  const [actionsUsed, setActionsUsed] = useState(0);
  const [maxActions] = useState(8);
  const [phase, setPhase] = useState<'mix' | 'result'>('mix');
  const [plantMood, setPlantMood] = useState<'sad' | 'neutral' | 'happy'>('sad');
  const [completed, setCompleted] = useState(false);

  const scenario = balanceScenarios[scenarioIndex];

  // Calculate plant mood based on how close values are to ideal
  useEffect(() => {
    const phOk = currentPH >= scenario.idealPH[0] && currentPH <= scenario.idealPH[1];
    const moistureOk = currentMoisture >= scenario.idealMoisture[0] && currentMoisture <= scenario.idealMoisture[1];
    const nOk = currentN >= scenario.idealN[0] && currentN <= scenario.idealN[1];
    
    const score = [phOk, moistureOk, nOk].filter(Boolean).length;
    if (score >= 3) setPlantMood('happy');
    else if (score >= 1) setPlantMood('neutral');
    else setPlantMood('sad');
  }, [currentPH, currentMoisture, currentN, scenario]);

  const isInRange = (val: number, range: [number, number]) => val >= range[0] && val <= range[1];

  // Mixing controls
  const adjustments = [
    { 
      label: 'Add Sulfur', emoji: '🧪', 
      action: () => { setCurrentPH(prev => Math.max(0, prev - 0.5)); setActionsUsed(a => a + 1); },
      description: 'Lowers pH (more acidic)'
    },
    { 
      label: 'Add Lime', emoji: 'ite', 
      action: () => { setCurrentPH(prev => Math.min(14, prev + 0.5)); setActionsUsed(a => a + 1); },
      description: 'Raises pH (more alkaline)'
    },
    { 
      label: 'Water', emoji: '💧', 
      action: () => { setCurrentMoisture(prev => Math.min(100, prev + 15)); setActionsUsed(a => a + 1); },
      description: 'Increases soil moisture'
    },
    { 
      label: 'Drain', emoji: '🚰', 
      action: () => { setCurrentMoisture(prev => Math.max(0, prev - 15)); setActionsUsed(a => a + 1); },
      description: 'Decreases soil moisture'
    },
    { 
      label: 'Nitrogen', emoji: '🌿', 
      action: () => { setCurrentN(prev => Math.min(100, prev + 15)); setActionsUsed(a => a + 1); },
      description: 'Add nitrogen fertilizer'
    },
    { 
      label: 'Phosphorus', emoji: '⚗️', 
      action: () => { setCurrentP(prev => Math.min(100, prev + 15)); setActionsUsed(a => a + 1); },
      description: 'Add phosphorus'
    },
    { 
      label: 'Potassium', emoji: '🧂', 
      action: () => { setCurrentK(prev => Math.min(100, prev + 15)); setActionsUsed(a => a + 1); },
      description: 'Add potassium'
    },
    { 
      label: 'Sand', emoji: '🏖️', 
      action: () => { setCurrentMoisture(prev => Math.max(0, prev - 10)); setCurrentPH(prev => Math.min(14, prev + 0.3)); setActionsUsed(a => a + 1); },
      description: 'Improves drainage, slightly raises pH'
    },
  ];

  const checkBalance = () => {
    const phOk = isInRange(currentPH, scenario.idealPH);
    const moistureOk = isInRange(currentMoisture, scenario.idealMoisture);
    const nOk = isInRange(currentN, scenario.idealN);
    const pOk = isInRange(currentP, scenario.idealP);

    let roundScore = 0;
    if (phOk) roundScore += 20;
    if (moistureOk) roundScore += 20;
    if (nOk) roundScore += 15;
    if (pOk) roundScore += 10;
    
    // Efficiency bonus (fewer actions = more points)
    const efficiency = Math.max(0, maxActions - actionsUsed);
    roundScore += efficiency * 3;

    setScore(prev => prev + roundScore);
    
    if (roundScore >= 50) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#06b6d4', '#10b981', '#3b82f6'] });
    }
    
    setPhase('result');
  };

  const nextScenario = () => {
    if (scenarioIndex + 1 >= balanceScenarios.length) {
      setCompleted(true);
      const totalSeeds = score + 35;
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => onComplete(totalSeeds), 1500);
    } else {
      const next = balanceScenarios[scenarioIndex + 1];
      setScenarioIndex(prev => prev + 1);
      setCurrentPH(next.soilpH);
      setCurrentMoisture(next.currentMoisture);
      setCurrentN(next.nutrientN);
      setCurrentP(next.nutrientP);
      setCurrentK(next.nutrientK);
      setActionsUsed(0);
      setPhase('mix');
    }
  };

  const getMeterColor = (val: number, range: [number, number]) => {
    if (isInRange(val, range)) return 'text-green-500';
    const mid = (range[0] + range[1]) / 2;
    const distance = Math.abs(val - mid);
    return distance > 30 ? 'text-red-500' : 'text-yellow-500';
  };

  const plantEmoji = plantMood === 'happy' ? '😊🌱' : plantMood === 'neutral' ? '😐🌿' : '😢🥀';

  return (
    <Card className="border-2 border-cyan-500/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Beaker className="h-6 w-6 text-cyan-600" />
            Soil Lab
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">{scenarioIndex + 1}/{balanceScenarios.length}</Badge>
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <Progress value={((scenarioIndex + (phase === 'result' ? 1 : 0)) / balanceScenarios.length) * 100} className="h-2" />

        {/* Plant with mood */}
        <div className={`text-center py-4 rounded-xl border transition-all duration-500 ${
          plantMood === 'happy' ? 'bg-green-500/10 border-green-500/30' :
          plantMood === 'neutral' ? 'bg-yellow-500/10 border-yellow-500/30' :
          'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="text-5xl mb-1 transition-all">{scenario.emoji}</div>
          <h3 className="text-lg font-bold">{scenario.plantName}</h3>
          <p className="text-xs text-muted-foreground mt-1">{scenario.problem}</p>
          <div className="text-2xl mt-2">{plantEmoji}</div>
        </div>

        {/* Live meters */}
        <div className="space-y-3">
          {/* pH meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>🧪 Soil pH</span>
              <span className={getMeterColor(currentPH, scenario.idealPH)}>
                {currentPH.toFixed(1)} <span className="text-muted-foreground">(ideal: {scenario.idealPH[0]}–{scenario.idealPH[1]})</span>
              </span>
            </div>
            <div className="relative h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 overflow-hidden">
              {/* Ideal range indicator */}
              <div 
                className="absolute top-0 h-full border-2 border-white/80 rounded bg-white/20"
                style={{
                  left: `${(scenario.idealPH[0] / 14) * 100}%`,
                  width: `${((scenario.idealPH[1] - scenario.idealPH[0]) / 14) * 100}%`
                }}
              />
              {/* Current value marker */}
              <div 
                className="absolute top-0 h-full w-1 bg-foreground rounded transition-all duration-300"
                style={{ left: `${(currentPH / 14) * 100}%` }}
              />
            </div>
          </div>

          {/* Moisture */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>💧 Moisture</span>
              <span className={getMeterColor(currentMoisture, scenario.idealMoisture)}>
                {Math.round(currentMoisture)}% <span className="text-muted-foreground">(ideal: {scenario.idealMoisture[0]}–{scenario.idealMoisture[1]}%)</span>
              </span>
            </div>
            <div className="relative">
              <Progress value={currentMoisture} className="h-3" />
              {/* Ideal range overlay */}
              <div 
                className="absolute top-0 h-full border-2 border-green-500/60 rounded pointer-events-none"
                style={{
                  left: `${scenario.idealMoisture[0]}%`,
                  width: `${scenario.idealMoisture[1] - scenario.idealMoisture[0]}%`
                }}
              />
            </div>
          </div>

          {/* Nutrients */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>🌿 N</span>
                <span className={getMeterColor(currentN, scenario.idealN)}>{Math.round(currentN)}</span>
              </div>
              <Progress value={currentN} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>⚗️ P</span>
                <span className={getMeterColor(currentP, scenario.idealP)}>{Math.round(currentP)}</span>
              </div>
              <Progress value={currentP} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>🧂 K</span>
                <span className={getMeterColor(currentK, scenario.idealK)}>{Math.round(currentK)}</span>
              </div>
              <Progress value={currentK} className="h-2" />
            </div>
          </div>
        </div>

        {/* Mixing controls */}
        {phase === 'mix' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">🧪 Add amendments:</p>
              <span className="text-xs text-muted-foreground">{actionsUsed}/{maxActions} used</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {adjustments.map((adj, i) => (
                <button
                  key={i}
                  onClick={adj.action}
                  disabled={actionsUsed >= maxActions}
                  title={adj.description}
                  className="p-2 rounded-xl border-2 border-muted hover:border-primary/50 hover:bg-accent transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <span className="text-xl block">{adj.emoji}</span>
                  <span className="text-[9px] font-medium block mt-0.5">{adj.label}</span>
                </button>
              ))}
            </div>

            <Button 
              onClick={checkBalance} 
              disabled={actionsUsed === 0} 
              className="w-full" 
              size="lg"
            >
              <Leaf className="mr-2 h-4 w-4" />
              {plantMood === 'happy' ? '🌱 Apply & Check!' : 'Apply & Check Balance'}
            </Button>
          </div>
        )}

        {/* Result */}
        {phase === 'result' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className={`p-2 rounded-lg border ${isInRange(currentPH, scenario.idealPH) ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <span className="text-xs font-medium">{isInRange(currentPH, scenario.idealPH) ? '✅' : '❌'} pH</span>
              </div>
              <div className={`p-2 rounded-lg border ${isInRange(currentMoisture, scenario.idealMoisture) ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <span className="text-xs font-medium">{isInRange(currentMoisture, scenario.idealMoisture) ? '✅' : '❌'} Moisture</span>
              </div>
              <div className={`p-2 rounded-lg border ${isInRange(currentN, scenario.idealN) ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <span className="text-xs font-medium">{isInRange(currentN, scenario.idealN) ? '✅' : '❌'} Nitrogen</span>
              </div>
              <div className={`p-2 rounded-lg border ${isInRange(currentP, scenario.idealP) ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <span className="text-xs font-medium">{isInRange(currentP, scenario.idealP) ? '✅' : '❌'} Phosphorus</span>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Efficiency: used {actionsUsed} of {maxActions} actions
                {actionsUsed <= 4 && ' — Great efficiency! 🌟'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={nextScenario} className="flex-1" size="lg">
                {scenarioIndex + 1 >= balanceScenarios.length ? '🎉 See Final Score' : 'Next Plant'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={onBack} variant="outline" size="lg">Exit</Button>
            </div>
          </div>
        )}

        {phase === 'mix' && (
          <Button onClick={onBack} variant="outline" className="w-full">Exit</Button>
        )}
      </CardContent>
    </Card>
  );
};
