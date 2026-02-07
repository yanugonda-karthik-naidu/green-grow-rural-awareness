import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Zap, Bug, Leaf, Info } from "lucide-react";
import { pests, Pest } from "@/lib/ecoGameData";
import confetti from "canvas-confetti";

interface PestDefenderProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

interface ActivePest {
  pest: Pest;
  position: number; // 0-100, moving toward plant
  id: number;
}

export const PestDefender = ({ onComplete, onBack }: PestDefenderProps) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [plantHealth, setPlantHealth] = useState(100);
  const [activePests, setActivePests] = useState<ActivePest[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentPest, setCurrentPest] = useState<ActivePest | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [ecoScore, setEcoScore] = useState(0); // eco-friendliness rating
  const [completed, setCompleted] = useState(false);
  const [spawnTimer, setSpawnTimer] = useState(0);
  const [pestQueue, setPestQueue] = useState<Pest[]>(() => [...pests].sort(() => Math.random() - 0.5));
  const [pestsDefeated, setPestsDefeated] = useState(0);

  // Spawn pests
  useEffect(() => {
    if (completed || showQuestion) return;
    const timer = setInterval(() => {
      setSpawnTimer(prev => {
        if (prev >= 4 && pestQueue.length > 0 && activePests.length < 3) {
          const pest = pestQueue[0];
          setPestQueue(q => q.slice(1));
          setActivePests(prev => [...prev, {
            pest,
            position: 0,
            id: Date.now()
          }]);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [completed, showQuestion, pestQueue, activePests.length]);

  // Move pests toward plant
  useEffect(() => {
    if (completed || showQuestion) return;
    const timer = setInterval(() => {
      setActivePests(prev => {
        const updated = prev.map(ap => ({
          ...ap,
          position: ap.position + ap.pest.speed
        }));

        // Check if any pest reached the plant
        const reached = updated.filter(ap => ap.position >= 100);
        if (reached.length > 0) {
          setPlantHealth(h => Math.max(0, h - reached.length * 15));
        }

        return updated.filter(ap => ap.position < 100);
      });
    }, 500);
    return () => clearInterval(timer);
  }, [completed, showQuestion]);

  // Check game over
  useEffect(() => {
    if (plantHealth <= 0 && !completed) {
      setCompleted(true);
      const totalSeeds = score + Math.round(ecoScore / 2);
      setTimeout(() => onComplete(totalSeeds), 1000);
    }
    if (pestsDefeated >= pests.length && activePests.length === 0 && pestQueue.length === 0 && !completed) {
      setCompleted(true);
      const bonus = plantHealth >= 50 ? 50 : 20;
      const totalSeeds = score + Math.round(ecoScore / 2) + bonus;
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => onComplete(totalSeeds), 1500);
    }
  }, [plantHealth, pestsDefeated, activePests.length, pestQueue.length, completed]);

  const interceptPest = (activePest: ActivePest) => {
    setCurrentPest(activePest);
    setShowQuestion(true);
    setAnswered(false);
  };

  const chooseSolution = (isEcoFriendly: boolean) => {
    if (!currentPest || answered) return;
    setAnswered(true);

    if (isEcoFriendly) {
      setScore(prev => prev + 25);
      setEcoScore(prev => prev + 20);
      setIsCorrect(true);
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 }, colors: ['#10b981', '#34d399'] });
    } else {
      setScore(prev => prev + 10);
      setEcoScore(prev => Math.max(0, prev - 5));
      setIsCorrect(false);
    }

    // Remove pest
    setActivePests(prev => prev.filter(ap => ap.id !== currentPest.id));
    setPestsDefeated(prev => prev + 1);
  };

  const continueGame = () => {
    setShowQuestion(false);
    setCurrentPest(null);
    setAnswered(false);
  };

  return (
    <Card className="border-2 border-purple-500/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            Pest Defender
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">🌿 {ecoScore}</Badge>
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* Plant health */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>🌱 Plant Health</span>
            <span className={`font-semibold ${plantHealth < 30 ? 'text-red-500' : plantHealth < 60 ? 'text-yellow-500' : 'text-green-500'}`}>
              {Math.round(plantHealth)}%
            </span>
          </div>
          <Progress value={plantHealth} className="h-3" />
        </div>

        {/* Game area */}
        {!showQuestion ? (
          <div className="relative h-48 rounded-xl bg-gradient-to-r from-red-500/5 via-yellow-500/5 to-green-500/10 border-2 border-green-500/20 overflow-hidden">
            {/* Plant at the right */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl">
              {plantHealth > 70 ? '🌳' : plantHealth > 30 ? '🌿' : '🥀'}
            </div>

            {/* Pests */}
            {activePests.map(ap => (
              <button
                key={ap.id}
                onClick={() => interceptPest(ap)}
                className="absolute top-1/2 -translate-y-1/2 text-3xl hover:scale-125 transition-transform cursor-pointer animate-pulse"
                style={{ left: `${Math.min(ap.position, 85)}%` }}
                title={`Click to defend against ${ap.pest.name}!`}
              >
                {ap.pest.emoji}
              </button>
            ))}

            {activePests.length === 0 && pestQueue.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Pests are approaching... get ready! 🛡️
              </div>
            )}
            {activePests.length === 0 && pestQueue.length === 0 && !completed && (
              <div className="absolute inset-0 flex items-center justify-center text-green-600 font-medium">
                All pests defeated! 🎉
              </div>
            )}
          </div>
        ) : currentPest && (
          <div className="space-y-4">
            {/* Pest info */}
            <div className="text-center p-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl border border-purple-500/20">
              <div className="text-5xl mb-2">{currentPest.pest.emoji}</div>
              <h3 className="text-lg font-bold">{currentPest.pest.name}</h3>
              <p className="text-sm text-muted-foreground">Attacking: {currentPest.pest.targetPlant}</p>
              <p className="text-xs text-muted-foreground mt-1">Damage: {currentPest.pest.damage}</p>
            </div>

            <p className="font-medium text-center text-sm">How do you defend?</p>

            {/* Options */}
            <div className="grid gap-3">
              <button
                onClick={() => chooseSolution(true)}
                disabled={answered}
                className={`p-3 rounded-lg border-2 text-left text-sm transition-all ${
                  answered && isCorrect ? 'border-green-500 bg-green-500/10' : 'border-green-500/30 hover:border-green-500 hover:bg-green-500/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-700 dark:text-green-400">🌿 Eco-Friendly</span>
                </div>
                <p className="mt-1 text-muted-foreground">{currentPest.pest.ecoFriendlySolution}</p>
              </button>

              <button
                onClick={() => chooseSolution(false)}
                disabled={answered}
                className={`p-3 rounded-lg border-2 text-left text-sm transition-all ${
                  answered && !isCorrect ? 'border-orange-500 bg-orange-500/10' : 'border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-orange-700 dark:text-orange-400">🧪 Chemical</span>
                </div>
                <p className="mt-1 text-muted-foreground">{currentPest.pest.chemicalSolution}</p>
              </button>
            </div>

            {/* Explanation */}
            {answered && (
              <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                <p className="text-xs flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  {currentPest.pest.explanation}
                </p>
              </div>
            )}

            {answered && (
              <Button onClick={continueGame} className="w-full">Continue Defending</Button>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Defeated: {pestsDefeated}/{pests.length}</span>
          <span>Eco Rating: {ecoScore >= 80 ? '🌟 Excellent' : ecoScore >= 50 ? '👍 Good' : ecoScore >= 20 ? '⚡ Fair' : '💪 Keep trying'}</span>
        </div>

        {!showQuestion && (
          <Button onClick={onBack} variant="outline" className="w-full">Exit Game</Button>
        )}
      </CardContent>
    </Card>
  );
};
