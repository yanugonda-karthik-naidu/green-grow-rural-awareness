import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FlowerIcon, Zap, Trash2, Info, CheckCircle, XCircle } from "lucide-react";
import { gardenScenarios, cropOptions } from "@/lib/ecoGameData";
import confetti from "canvas-confetti";

interface GardenPlannerProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

interface PlotCell {
  crop: string | null;
  emoji: string;
}

export const GardenPlanner = ({ onComplete, onBack }: GardenPlannerProps) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<PlotCell[]>(Array(9).fill(null).map(() => ({ crop: null, emoji: '' })));
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [phase, setPhase] = useState<'plant' | 'grow' | 'result'>('plant');
  const [growthLevel, setGrowthLevel] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = gardenScenarios[scenarioIndex];

  // Filter crops available for current season
  const availableCrops = cropOptions.filter(
    c => c.season === scenario.season || c.season === 'all'
  );

  // Calculate real-time compatibility for each placed crop
  const compatibility = useMemo(() => {
    const placed = grid.filter(cell => cell.crop).map(cell => cell.crop!);
    const result: Record<string, { companions: string[]; conflicts: string[] }> = {};

    placed.forEach(cropName => {
      const crop = cropOptions.find(c => c.name === cropName);
      if (!crop) return;
      const companions = placed.filter(c => c !== cropName && crop.companionPlants.includes(c));
      const conflicts = placed.filter(c => c !== cropName && crop.incompatiblePlants.includes(c));
      result[cropName] = { companions, conflicts };
    });

    return result;
  }, [grid]);

  const placedCount = grid.filter(c => c.crop).length;
  const totalCompanions = Object.values(compatibility).reduce((sum, c) => sum + c.companions.length, 0) / 2;
  const totalConflicts = Object.values(compatibility).reduce((sum, c) => sum + c.conflicts.length, 0) / 2;

  const placeCrop = (cellIndex: number) => {
    if (!selectedCrop || phase !== 'plant') return;
    const crop = cropOptions.find(c => c.name === selectedCrop);
    if (!crop) return;

    // Check if already placed max of this crop
    const alreadyPlaced = grid.filter(c => c.crop === selectedCrop).length;
    if (alreadyPlaced >= 2) return;

    setGrid(prev => {
      const updated = [...prev];
      updated[cellIndex] = { crop: selectedCrop, emoji: crop.emoji };
      return updated;
    });
  };

  const removeCrop = (cellIndex: number) => {
    if (phase !== 'plant') return;
    setGrid(prev => {
      const updated = [...prev];
      updated[cellIndex] = { crop: null, emoji: '' };
      return updated;
    });
  };

  const startGrowing = () => {
    setPhase('grow');
    // Simulate growth animation
    let level = 0;
    const interval = setInterval(() => {
      level += 20;
      setGrowthLevel(level);
      if (level >= 100) {
        clearInterval(interval);
        evaluateGarden();
      }
    }, 400);
  };

  const evaluateGarden = () => {
    const placed = grid.filter(c => c.crop).map(c => c.crop!);
    const idealMatches = placed.filter(c => scenario.idealCrops.includes(c)).length;
    
    // Scoring
    const matchScore = idealMatches * 15;
    const companionScore = totalCompanions * 10;
    const conflictPenalty = totalConflicts * 15;
    const roundScore = Math.max(0, matchScore + companionScore - conflictPenalty);
    
    setScore(prev => prev + roundScore);
    
    if (roundScore > 30) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 }, colors: ['#10b981', '#f59e0b', '#84cc16'] });
    }
    
    setPhase('result');
  };

  const nextScenario = () => {
    if (scenarioIndex + 1 >= gardenScenarios.length) {
      setCompleted(true);
      const totalSeeds = score + 40;
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => onComplete(totalSeeds), 1500);
    } else {
      setScenarioIndex(prev => prev + 1);
      setGrid(Array(9).fill(null).map(() => ({ crop: null, emoji: '' })));
      setSelectedCrop(null);
      setPhase('plant');
      setGrowthLevel(0);
    }
  };

  const seasonEmoji = { summer: '☀️', winter: '❄️', monsoon: '🌧️' };

  // Get cell border color based on compatibility
  const getCellStyle = (cell: PlotCell, index: number) => {
    if (!cell.crop) return 'border-dashed border-muted hover:border-primary/40 hover:bg-accent/50 cursor-pointer';
    const compat = compatibility[cell.crop];
    if (!compat) return 'border-primary/50 bg-primary/5';
    if (compat.conflicts.length > 0) return 'border-red-500 bg-red-500/10 animate-pulse';
    if (compat.companions.length > 0) return 'border-green-500 bg-green-500/10';
    return 'border-primary/50 bg-primary/5';
  };

  return (
    <Card className="border-2 border-amber-500/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FlowerIcon className="h-6 w-6 text-amber-600" />
            Garden Builder
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">{scenarioIndex + 1}/{gardenScenarios.length}</Badge>
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <Progress value={((scenarioIndex + (phase === 'result' ? 1 : 0)) / gardenScenarios.length) * 100} className="h-2" />

        {/* Scenario info */}
        <div className="p-3 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-xl border border-amber-500/20">
          <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{seasonEmoji[scenario.season]} {scenario.season}</Badge>
            <Badge variant="outline">🌍 {scenario.soilType}</Badge>
            <Badge variant="outline">{scenario.sunlight === 'full' ? '☀️ Full sun' : '⛅ Partial'}</Badge>
          </div>
        </div>

        {/* Live compatibility stats */}
        {placedCount > 0 && (
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {totalCompanions} companion bonus{totalCompanions !== 1 ? 'es' : ''}
            </span>
            {totalConflicts > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <XCircle className="h-3 w-3" />
                {totalConflicts} conflict{totalConflicts !== 1 ? 's' : ''}!
              </span>
            )}
          </div>
        )}

        {/* Garden grid */}
        <div className="grid grid-cols-3 gap-2 aspect-square max-w-[300px] mx-auto">
          {grid.map((cell, index) => (
            <button
              key={index}
              onClick={() => cell.crop ? removeCrop(index) : placeCrop(index)}
              disabled={phase !== 'plant'}
              className={`relative rounded-xl border-2 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${getCellStyle(cell, index)}`}
            >
              {cell.crop ? (
                <>
                  <span className={`text-3xl ${phase === 'grow' ? 'animate-bounce' : ''}`} 
                    style={phase === 'grow' ? { animationDelay: `${index * 100}ms` } : undefined}>
                    {growthLevel < 30 ? '🌱' : growthLevel < 70 ? cell.emoji : `${cell.emoji}`}
                  </span>
                  <span className="text-[9px] font-medium mt-0.5">{cell.crop}</span>
                  {phase === 'plant' && (
                    <Trash2 className="absolute top-1 right-1 h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  )}
                </>
              ) : (
                <span className="text-2xl opacity-30">+</span>
              )}
            </button>
          ))}
        </div>

        {/* Growth progress bar */}
        {phase === 'grow' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>🌱 Growing...</span>
              <span>{growthLevel}%</span>
            </div>
            <Progress value={growthLevel} className="h-2" />
          </div>
        )}

        {/* Crop picker */}
        {phase === 'plant' && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-center">
              {selectedCrop ? `Tap a plot to plant ${selectedCrop}` : 'Select a crop, then tap a plot'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {availableCrops.map(crop => {
                const isSelected = selectedCrop === crop.name;
                const placedOfThis = grid.filter(c => c.crop === crop.name).length;
                
                return (
                  <button
                    key={crop.name}
                    onClick={() => setSelectedCrop(isSelected ? null : crop.name)}
                    className={`px-3 py-2 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                      isSelected ? 'border-primary bg-primary/10 scale-105' : 'border-muted hover:border-primary/30'
                    } ${placedOfThis >= 2 ? 'opacity-40' : ''}`}
                  >
                    <span className="text-xl">{crop.emoji}</span>
                    <span className="text-[10px] block font-medium">{crop.name}</span>
                    {placedOfThis > 0 && (
                      <span className="text-[9px] text-muted-foreground">×{placedOfThis}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected crop info */}
            {selectedCrop && (
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                <p className="text-xs flex items-center justify-center gap-1">
                  <Info className="h-3 w-3" />
                  {cropOptions.find(c => c.name === selectedCrop)?.benefit}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Companions: {cropOptions.find(c => c.name === selectedCrop)?.companionPlants.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Result phase */}
        {phase === 'result' && (
          <div className="space-y-3">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-sm font-medium mb-1">📖 {scenario.explanation}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Best crops: {scenario.idealCrops.map(c => {
                  const crop = cropOptions.find(cr => cr.name === c);
                  return `${crop?.emoji} ${c}`;
                }).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {phase === 'plant' && (
            <Button onClick={startGrowing} disabled={placedCount < 2} className="flex-1" size="lg">
              🌱 {placedCount < 2 ? `Plant at least 2 crops (${placedCount}/2)` : `Grow Garden (${placedCount} crops)`}
            </Button>
          )}
          {phase === 'result' && (
            <Button onClick={nextScenario} className="flex-1" size="lg">
              {scenarioIndex + 1 >= gardenScenarios.length ? '🎉 See Final Score' : '🌿 Next Garden'}
            </Button>
          )}
          {phase !== 'grow' && (
            <Button onClick={onBack} variant="outline" size="lg">Exit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
