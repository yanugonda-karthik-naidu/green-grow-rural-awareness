import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Stethoscope, Zap, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { diseaseCards, DiseaseCard } from "@/lib/ecoGameData";
import confetti from "canvas-confetti";

interface DiseaseIdentifierProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

export const DiseaseIdentifier = ({ onComplete, onBack }: DiseaseIdentifierProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>(() => getShuffledOptions(diseaseCards[0]));
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  function getShuffledOptions(card: DiseaseCard): string[] {
    return [card.correctTreatment, ...card.wrongTreatments].sort(() => Math.random() - 0.5);
  }

  const card = diseaseCards[currentIndex];

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    const correct = answer === card.correctTreatment;
    setIsCorrect(correct);

    if (correct) {
      const streakBonus = streak >= 3 ? 10 : streak >= 2 ? 5 : 0;
      setScore(prev => prev + 25 + streakBonus);
      setStreak(prev => prev + 1);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else {
      setStreak(0);
    }
  };

  const nextCard = () => {
    if (currentIndex + 1 >= diseaseCards.length) {
      setCompleted(true);
      const totalSeeds = score + 30; // completion bonus
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => onComplete(totalSeeds), 1500);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setShowResult(false);
      setShuffledOptions(getShuffledOptions(diseaseCards[nextIdx]));
    }
  };

  const severityColor = {
    mild: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30',
    moderate: 'text-orange-600 bg-orange-500/10 border-orange-500/30',
    severe: 'text-red-600 bg-red-500/10 border-red-500/30',
  };

  return (
    <Card className="border-2 border-red-500/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-red-600" />
            Disease Identifier
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">{currentIndex + 1}/{diseaseCards.length}</Badge>
            {streak >= 2 && <Badge className="bg-orange-500">🔥 {streak} streak</Badge>}
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <Progress value={((currentIndex + (showResult ? 1 : 0)) / diseaseCards.length) * 100} className="h-2" />

        {/* Plant & Disease info */}
        <div className="text-center p-4 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-xl border border-red-500/20">
          <div className="text-6xl mb-2">{card.emoji}</div>
          <h3 className="text-lg font-bold">{card.plantName} — {card.diseaseName}</h3>
          <Badge className={`mt-2 ${severityColor[card.severity]}`} variant="outline">
            {card.severity.toUpperCase()} severity
          </Badge>
        </div>

        {/* Symptoms */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-1">🔍 Symptoms observed:</p>
          <p className="text-sm text-muted-foreground">{card.symptoms}</p>
        </div>

        <p className="font-medium text-center">What's the best treatment?</p>

        {/* Treatment options */}
        <div className="grid gap-3">
          {shuffledOptions.map((option, i) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === card.correctTreatment;
            let borderClass = 'border-muted hover:border-primary/50 hover:bg-accent';
            if (showResult && isCorrectOption) borderClass = 'border-green-500 bg-green-500/10';
            else if (showResult && isSelected && !isCorrectOption) borderClass = 'border-red-500 bg-red-500/10';

            return (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-3 rounded-lg border-2 text-left text-sm transition-all flex items-center gap-2 ${borderClass}`}
              >
                {showResult && isCorrectOption && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                {showResult && isSelected && !isCorrectOption && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                {!showResult && <span className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0 flex items-center justify-center text-xs">{i + 1}</span>}
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
            <p className="text-sm font-medium mb-1">{isCorrect ? '✅ Correct!' : '❌ Not quite right'}</p>
            <p className="text-sm text-muted-foreground">{card.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {showResult && (
            <Button onClick={nextCard} className="flex-1" size="lg">
              {currentIndex + 1 >= diseaseCards.length ? '🎉 See Results' : 'Next Disease'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button onClick={onBack} variant="outline" size="lg">Exit</Button>
        </div>
      </CardContent>
    </Card>
  );
};
