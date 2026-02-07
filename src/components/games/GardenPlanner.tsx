import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FlowerIcon, Zap, CheckCircle, XCircle, ArrowRight, Info } from "lucide-react";
import { gardenScenarios, cropOptions, GardenScenario } from "@/lib/ecoGameData";
import confetti from "canvas-confetti";

interface GardenPlannerProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

export const GardenPlanner = ({ onComplete, onBack }: GardenPlannerProps) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: string[]; wrong: string[]; missed: string[] }>({ correct: [], wrong: [], missed: [] });
  const [completed, setCompleted] = useState(false);

  const scenario = gardenScenarios[scenarioIndex];

  const toggleCrop = (cropName: string) => {
    if (submitted) return;
    setSelectedCrops(prev =>
      prev.includes(cropName)
        ? prev.filter(c => c !== cropName)
        : prev.length < 5 ? [...prev, cropName] : prev
    );
  };

  const submitPlan = () => {
    const correct = selectedCrops.filter(c => scenario.idealCrops.includes(c));
    const wrong = selectedCrops.filter(c => !scenario.idealCrops.includes(c));
    const missed = scenario.idealCrops.filter(c => !selectedCrops.includes(c));

    // Check companion planting bonus
    let companionBonus = 0;
    selectedCrops.forEach(cropName => {
      const crop = cropOptions.find(c => c.name === cropName);
      if (crop) {
        selectedCrops.forEach(otherCrop => {
          if (otherCrop !== cropName && crop.companionPlants.includes(otherCrop)) {
            companionBonus += 5;
          }
        });
      }
    });

    const roundScore = (correct.length * 20) + companionBonus - (wrong.length * 10);
    setScore(prev => prev + Math.max(0, roundScore));
    setFeedback({ correct, wrong, missed });
    setSubmitted(true);

    if (correct.length >= Math.ceil(scenario.idealCrops.length / 2)) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
  };

  const nextScenario = () => {
    if (scenarioIndex + 1 >= gardenScenarios.length) {
      setCompleted(true);
      const totalSeeds = score + 40;
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => onComplete(totalSeeds), 1500);
    } else {
      setScenarioIndex(prev => prev + 1);
      setSelectedCrops([]);
      setSubmitted(false);
      setFeedback({ correct: [], wrong: [], missed: [] });
    }
  };

  const seasonEmoji = { summer: '☀️', winter: '❄️', monsoon: '🌧️' };
  const waterEmoji = { low: '💧', medium: '💧💧', high: '💧💧💧' };

  return (
    <Card className="border-2 border-amber-500/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FlowerIcon className="h-6 w-6 text-amber-600" />
            Garden Planner
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">{scenarioIndex + 1}/{gardenScenarios.length}</Badge>
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <Progress value={((scenarioIndex + (submitted ? 1 : 0)) / gardenScenarios.length) * 100} className="h-2" />

        {/* Scenario description */}
        <div className="p-4 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-xl border border-amber-500/20">
          <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{seasonEmoji[scenario.season]} {scenario.season}</Badge>
            <Badge variant="outline">🌍 {scenario.soilType}</Badge>
            <Badge variant="outline">{scenario.sunlight === 'full' ? '☀️ Full sun' : '⛅ Partial shade'}</Badge>
            <Badge variant="outline">{waterEmoji[scenario.waterAvailability]} {scenario.waterAvailability} water</Badge>
          </div>
        </div>

        <p className="font-medium text-center">Select the best crops for this garden (up to 5):</p>

        {/* Crop selection grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {cropOptions.map((crop) => {
            const isSelected = selectedCrops.includes(crop.name);
            const isIdeal = submitted && scenario.idealCrops.includes(crop.name);
            const isWrong = submitted && isSelected && !scenario.idealCrops.includes(crop.name);

            let borderClass = isSelected ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50';
            if (submitted && isIdeal && isSelected) borderClass = 'border-green-500 bg-green-500/10';
            else if (submitted && isIdeal && !isSelected) borderClass = 'border-green-500/50 bg-green-500/5';
            else if (isWrong) borderClass = 'border-red-500 bg-red-500/10';

            return (
              <button
                key={crop.name}
                onClick={() => toggleCrop(crop.name)}
                disabled={submitted}
                className={`p-2 rounded-lg border-2 text-center transition-all ${borderClass}`}
              >
                <div className="text-2xl">{crop.emoji}</div>
                <div className="text-xs font-medium mt-1">{crop.name}</div>
                <div className="text-[10px] text-muted-foreground">{crop.season}</div>
                {submitted && isIdeal && <CheckCircle className="h-3 w-3 text-green-500 mx-auto mt-1" />}
                {isWrong && <XCircle className="h-3 w-3 text-red-500 mx-auto mt-1" />}
              </button>
            );
          })}
        </div>

        {/* Companion planting info */}
        {selectedCrops.length >= 2 && !submitted && (
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-xs flex items-center gap-1"><Info className="h-3 w-3" /> Companion planting bonuses apply when you pair compatible crops!</p>
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div className="space-y-2">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-sm font-medium">📖 {scenario.explanation}</p>
            </div>
            {feedback.correct.length > 0 && (
              <p className="text-sm text-green-600">✅ Good picks: {feedback.correct.join(', ')}</p>
            )}
            {feedback.wrong.length > 0 && (
              <p className="text-sm text-red-600">❌ Not ideal: {feedback.wrong.join(', ')}</p>
            )}
            {feedback.missed.length > 0 && (
              <p className="text-sm text-muted-foreground">💡 Also consider: {feedback.missed.join(', ')}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!submitted ? (
            <Button onClick={submitPlan} disabled={selectedCrops.length === 0} className="flex-1" size="lg">
              Submit Garden Plan
            </Button>
          ) : (
            <Button onClick={nextScenario} className="flex-1" size="lg">
              {scenarioIndex + 1 >= gardenScenarios.length ? '🎉 See Results' : 'Next Scenario'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button onClick={onBack} variant="outline" size="lg">Exit</Button>
        </div>
      </CardContent>
    </Card>
  );
};
