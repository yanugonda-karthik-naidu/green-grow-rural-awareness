import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Droplets, Zap, CheckCircle, XCircle, ArrowRight, Info } from "lucide-react";
import { balanceScenarios, BalanceAction } from "@/lib/ecoGameData";
import confetti from "canvas-confetti";

interface WaterSoilBalanceProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

export const WaterSoilBalance = ({ onComplete, onBack }: WaterSoilBalanceProps) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [appliedActions, setAppliedActions] = useState<number[]>([]);
  const [currentPH, setCurrentPH] = useState(balanceScenarios[0].soilpH);
  const [currentMoisture, setCurrentMoisture] = useState(balanceScenarios[0].currentMoisture);
  const [currentN, setCurrentN] = useState(balanceScenarios[0].nutrientN);
  const [currentP, setCurrentP] = useState(balanceScenarios[0].nutrientP);
  const [currentK, setCurrentK] = useState(balanceScenarios[0].nutrientK);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const scenario = balanceScenarios[scenarioIndex];

  const applyAction = (actionIndex: number, action: BalanceAction) => {
    if (appliedActions.includes(actionIndex) || showResults) return;
    setAppliedActions(prev => [...prev, actionIndex]);

    if (action.effect.pH) setCurrentPH(prev => Math.max(0, Math.min(14, prev + action.effect.pH)));
    if (action.effect.moisture) setCurrentMoisture(prev => Math.max(0, Math.min(100, prev + action.effect.moisture)));
    if (action.effect.N) setCurrentN(prev => Math.max(0, Math.min(100, prev + action.effect.N)));
    if (action.effect.P) setCurrentP(prev => Math.max(0, Math.min(100, prev + action.effect.P)));
    if (action.effect.K) setCurrentK(prev => Math.max(0, Math.min(100, prev + action.effect.K)));

    setFeedback(prev => [...prev, `${action.emoji} ${action.explanation}`]);

    if (action.isCorrect) {
      setScore(prev => prev + 15);
      confetti({ particleCount: 15, spread: 30, origin: { y: 0.7 } });
    }
  };

  const checkBalance = () => {
    const phOk = currentPH >= scenario.idealPH[0] && currentPH <= scenario.idealPH[1];
    const moistureOk = currentMoisture >= scenario.idealMoisture[0] && currentMoisture <= scenario.idealMoisture[1];
    const nOk = currentN >= scenario.idealN[0] && currentN <= scenario.idealN[1];

    if (phOk && moistureOk) {
      setScore(prev => prev + 30);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    setShowResults(true);
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
      setAppliedActions([]);
      setCurrentPH(next.soilpH);
      setCurrentMoisture(next.currentMoisture);
      setCurrentN(next.nutrientN);
      setCurrentP(next.nutrientP);
      setCurrentK(next.nutrientK);
      setFeedback([]);
      setShowResults(false);
    }
  };

  const isInRange = (val: number, range: [number, number]) => val >= range[0] && val <= range[1];
  const rangeColor = (val: number, range: [number, number]) => isInRange(val, range) ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="border-2 border-cyan-500/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-cyan-600" />
            Water & Soil Balance
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">{scenarioIndex + 1}/{balanceScenarios.length}</Badge>
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <Progress value={((scenarioIndex + (showResults ? 1 : 0)) / balanceScenarios.length) * 100} className="h-2" />

        {/* Plant & problem */}
        <div className="text-center p-4 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-xl border border-cyan-500/20">
          <div className="text-6xl mb-2">{scenario.emoji}</div>
          <h3 className="text-lg font-bold">{scenario.plantName}</h3>
          <p className="text-sm text-muted-foreground mt-1">{scenario.problem}</p>
        </div>

        {/* Current soil metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-muted/50 border">
            <div className="flex justify-between text-xs mb-1">
              <span>🧪 Soil pH</span>
              <span className={rangeColor(currentPH, scenario.idealPH)}>
                {currentPH.toFixed(1)} (ideal: {scenario.idealPH[0]}-{scenario.idealPH[1]})
              </span>
            </div>
            <Progress value={(currentPH / 14) * 100} className="h-2" />
          </div>
          <div className="p-2 rounded-lg bg-muted/50 border">
            <div className="flex justify-between text-xs mb-1">
              <span>💧 Moisture</span>
              <span className={rangeColor(currentMoisture, scenario.idealMoisture)}>
                {Math.round(currentMoisture)}% (ideal: {scenario.idealMoisture[0]}-{scenario.idealMoisture[1]}%)
              </span>
            </div>
            <Progress value={currentMoisture} className="h-2" />
          </div>
          <div className="p-2 rounded-lg bg-muted/50 border">
            <div className="flex justify-between text-xs mb-1">
              <span>🌿 Nitrogen (N)</span>
              <span className={rangeColor(currentN, scenario.idealN)}>
                {Math.round(currentN)} (ideal: {scenario.idealN[0]}-{scenario.idealN[1]})
              </span>
            </div>
            <Progress value={currentN} className="h-2" />
          </div>
          <div className="p-2 rounded-lg bg-muted/50 border">
            <div className="flex justify-between text-xs mb-1">
              <span>⚗️ Phosphorus (P)</span>
              <span className={rangeColor(currentP, scenario.idealP)}>
                {Math.round(currentP)} (ideal: {scenario.idealP[0]}-{scenario.idealP[1]})
              </span>
            </div>
            <Progress value={currentP} className="h-2" />
          </div>
        </div>

        {/* Actions */}
        <p className="font-medium text-center text-sm">Apply soil amendments:</p>
        <div className="grid grid-cols-2 gap-2">
          {scenario.actions.map((action, i) => {
            const applied = appliedActions.includes(i);
            return (
              <button
                key={i}
                onClick={() => applyAction(i, action)}
                disabled={applied || showResults}
                className={`p-3 rounded-lg border-2 text-left text-sm transition-all ${
                  applied
                    ? action.isCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                    : 'border-muted hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <span className="text-lg">{action.emoji}</span>
                <p className="text-xs font-medium mt-1">{action.label}</p>
                {applied && (
                  action.isCorrect
                    ? <CheckCircle className="h-3 w-3 text-green-500 mt-1" />
                    : <XCircle className="h-3 w-3 text-red-500 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback log */}
        {feedback.length > 0 && (
          <div className="max-h-32 overflow-y-auto space-y-1 p-3 bg-muted/30 rounded-lg">
            {feedback.map((f, i) => (
              <p key={i} className="text-xs text-muted-foreground">{f}</p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!showResults ? (
            <Button onClick={checkBalance} disabled={appliedActions.length === 0} className="flex-1" size="lg">
              Check Balance
            </Button>
          ) : (
            <Button onClick={nextScenario} className="flex-1" size="lg">
              {scenarioIndex + 1 >= balanceScenarios.length ? '🎉 See Results' : 'Next Plant'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button onClick={onBack} variant="outline" size="lg">Exit</Button>
        </div>
      </CardContent>
    </Card>
  );
};
