import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Stethoscope, Zap, Search, Beaker, Heart, AlertTriangle } from "lucide-react";
import { diseaseCards } from "@/lib/ecoGameData";
import { ParticleEffects, GlowRing } from "./ParticleEffects";
import { GameSounds } from "@/lib/gameSounds";
import confetti from "canvas-confetti";

interface DiseaseIdentifierProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

interface Symptom {
  id: string;
  text: string;
  found: boolean;
  area: string;
}

interface TreatmentIngredient {
  id: string;
  name: string;
  emoji: string;
  isCorrect: boolean;
  added: boolean;
}

export const DiseaseIdentifier = ({ onComplete, onBack }: DiseaseIdentifierProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'examine' | 'diagnose' | 'treat' | 'result'>('examine');
  const [symptomsFound, setSymptomsFound] = useState<string[]>([]);
  const [treatmentMix, setTreatmentMix] = useState<string[]>([]);
  const [plantHealth, setPlantHealth] = useState(40);
  const [diagnosisGuess, setDiagnosisGuess] = useState<string | null>(null);
  const [shakeArea, setShakeArea] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [healingAnimation, setHealingAnimation] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particleType, setParticleType] = useState<'heal' | 'damage' | 'sparkle'>('heal');
  const card = diseaseCards[currentIndex];

  // Generate examination areas for the plant
  const examAreas = [
    { id: 'leaves', label: '🍃 Leaves', area: 'top-left' },
    { id: 'stem', label: '🌿 Stem', area: 'center' },
    { id: 'roots', label: '🌱 Roots', area: 'bottom' },
    { id: 'flowers', label: '🌸 Flowers/Fruit', area: 'top-right' },
  ];

  // Generate symptoms from card data
  const symptoms: Symptom[] = card.symptoms.split(', ').map((s, i) => ({
    id: `s${i}`,
    text: s.trim(),
    found: symptomsFound.includes(`s${i}`),
    area: examAreas[i % examAreas.length].id,
  }));

  // Generate treatment ingredients
  const treatmentIngredients: TreatmentIngredient[] = [
    { id: 't1', name: card.correctTreatment.split(' ').slice(0, 3).join(' '), emoji: '✅', isCorrect: true, added: treatmentMix.includes('t1') },
    ...card.wrongTreatments.map((t, i) => ({
      id: `tw${i}`,
      name: t,
      emoji: ['💧', '🧪', '☀️'][i] || '❌',
      isCorrect: false,
      added: treatmentMix.includes(`tw${i}`),
    })),
  ].sort(() => Math.random() - 0.5);

  // Disease name options for diagnosis phase
  const diseaseOptions = [
    card.diseaseName,
    ...['Root Rot', 'Leaf Spot', 'Wilt Disease', 'Mosaic Virus', 'Rust Fungus']
      .filter(d => d !== card.diseaseName)
      .slice(0, 2)
  ].sort(() => Math.random() - 0.5);

  const examineArea = (areaId: string) => {
    const areaSymptoms = symptoms.filter(s => s.area === areaId && !s.found);
    if (areaSymptoms.length > 0) {
      const found = areaSymptoms[0];
      setSymptomsFound(prev => [...prev, found.id]);
      setScore(prev => prev + 5);
      setShakeArea(areaId);
      setTimeout(() => setShakeArea(null), 500);
      GameSounds.pestClick();
      confetti({ particleCount: 8, spread: 30, origin: { y: 0.5 }, colors: ['#f59e0b', '#ef4444'] });
    } else {
      setShakeArea(areaId);
      setTimeout(() => setShakeArea(null), 300);
    }
  };

  const handleDiagnosis = (disease: string) => {
    setDiagnosisGuess(disease);
    if (disease === card.diseaseName) {
      setScore(prev => prev + 20);
      GameSounds.ecoKill();
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 }, colors: ['#10b981'] });
      setTimeout(() => setPhase('treat'), 800);
    } else {
      // Wrong diagnosis - shake and let them try again
      setShakeArea('diagnosis');
      setTimeout(() => {
        setShakeArea(null);
        setDiagnosisGuess(null);
      }, 600);
    }
  };

  const addToTreatment = (ingredientId: string) => {
    if (treatmentMix.includes(ingredientId)) return;
    setTreatmentMix(prev => [...prev, ingredientId]);

    const ingredient = treatmentIngredients.find(t => t.id === ingredientId);
    if (ingredient?.isCorrect) {
      setPlantHealth(prev => Math.min(100, prev + 30));
      setScore(prev => prev + 15);
      setHealingAnimation(true);
      setParticleType('heal');
      setParticleTrigger(p => p + 1);
      GameSounds.heal();
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.5 }, colors: ['#10b981', '#34d399'] });
      setTimeout(() => setHealingAnimation(false), 1000);
    } else {
      setPlantHealth(prev => Math.max(10, prev - 10));
      setParticleType('damage');
      setParticleTrigger(p => p + 1);
      setShakeArea('plant');
      setTimeout(() => setShakeArea(null), 500);
    }
  };

  const applyTreatment = () => {
    const hasCorrect = treatmentMix.some(id => treatmentIngredients.find(t => t.id === id)?.isCorrect);
    if (hasCorrect) {
      setPlantHealth(100);
      setHealingAnimation(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    }
    setPhase('result');
  };

  const nextPlant = () => {
    if (currentIndex + 1 >= diseaseCards.length) {
      setCompleted(true);
      GameSounds.gameWin();
      const totalSeeds = score + 30;
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => onComplete(totalSeeds), 1500);
    } else {
      setCurrentIndex(prev => prev + 1);
      setPhase('examine');
      setSymptomsFound([]);
      setTreatmentMix([]);
      setPlantHealth(40);
      setDiagnosisGuess(null);
      setHealingAnimation(false);
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
            Plant Doctor
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">{currentIndex + 1}/{diseaseCards.length}</Badge>
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <Progress value={((currentIndex + (phase === 'result' ? 1 : 0)) / diseaseCards.length) * 100} className="h-2" />

        {/* Phase indicator */}
        <div className="flex gap-1">
          {['examine', 'diagnose', 'treat', 'result'].map((p, i) => (
            <div key={p} className={`flex-1 h-1.5 rounded-full transition-colors ${
              p === phase ? 'bg-primary animate-pulse' : 
              ['examine', 'diagnose', 'treat', 'result'].indexOf(phase) > i ? 'bg-primary' : 'bg-muted'
            }`} />
          ))}
        </div>

        {/* Plant display with health */}
        <div className={`relative text-center py-6 rounded-xl border transition-all ${
          healingAnimation ? 'bg-green-500/10 border-green-500/30 scale-105' : 
          shakeArea === 'plant' ? 'bg-red-500/10 border-red-500/30 animate-pulse' :
          'bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20'
        }`}>
          <ParticleEffects trigger={particleTrigger} type={particleType} intensity={1} />
          <GlowRing active={healingAnimation} color={healingAnimation ? 'green' : 'red'} />
          <div className={`text-7xl mb-2 transition-all duration-500 ${healingAnimation ? 'scale-110' : ''}`}>
            {plantHealth >= 80 ? '🌳' : plantHealth >= 50 ? card.emoji : '🥀'}
          </div>
          <h3 className="text-lg font-bold">{card.plantName}</h3>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Heart className={`h-4 w-4 ${plantHealth < 30 ? 'text-red-500' : plantHealth < 60 ? 'text-yellow-500' : 'text-green-500'}`} />
            <Progress value={plantHealth} className="w-32 h-2" />
            <span className="text-xs font-semibold">{plantHealth}%</span>
          </div>
        </div>

        {/* EXAMINE PHASE */}
        {phase === 'examine' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold flex items-center justify-center gap-2">
                <Search className="h-4 w-4" /> Examine the plant — find all symptoms!
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Click each part of the plant to investigate</p>
            </div>

            {/* Interactive examination areas */}
            <div className="grid grid-cols-2 gap-3">
              {examAreas.map(area => {
                const areaSymptomCount = symptoms.filter(s => s.area === area.id).length;
                const foundCount = symptoms.filter(s => s.area === area.id && s.found).length;
                const allFound = foundCount === areaSymptomCount;
                
                return (
                  <button
                    key={area.id}
                    onClick={() => examineArea(area.id)}
                    className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 active:scale-95 ${
                      shakeArea === area.id ? 'animate-pulse' : ''
                    } ${
                      allFound && areaSymptomCount > 0
                        ? 'border-green-500 bg-green-500/10'
                        : foundCount > 0
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-muted hover:border-primary/50 hover:bg-accent cursor-pointer'
                    }`}
                  >
                    <span className="text-3xl block mb-1">{area.label.split(' ')[0]}</span>
                    <span className="text-xs font-medium">{area.label.split(' ').slice(1).join(' ')}</span>
                    {areaSymptomCount > 0 && (
                      <div className="mt-1">
                        <span className="text-[10px] text-muted-foreground">{foundCount}/{areaSymptomCount} clues</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Found symptoms log */}
            {symptomsFound.length > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg space-y-1 max-h-28 overflow-y-auto">
                <p className="text-xs font-semibold text-muted-foreground">🔍 Clues Found:</p>
                {symptoms.filter(s => s.found).map(s => (
                  <p key={s.id} className="text-xs text-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-yellow-500" /> {s.text}
                  </p>
                ))}
              </div>
            )}

            <Button 
              onClick={() => setPhase('diagnose')} 
              disabled={symptomsFound.length < Math.min(2, symptoms.length)} 
              className="w-full" 
              size="lg"
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              {symptomsFound.length < Math.min(2, symptoms.length) 
                ? `Find at least ${Math.min(2, symptoms.length)} clues to proceed`
                : 'Make Diagnosis →'
              }
            </Button>
          </div>
        )}

        {/* DIAGNOSE PHASE */}
        {phase === 'diagnose' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold">🩺 What disease does this plant have?</h4>
              <p className="text-xs text-muted-foreground mt-1">Based on the symptoms you found, identify the disease</p>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-semibold mb-1">Your clues:</p>
              {symptoms.filter(s => s.found).map(s => (
                <p key={s.id} className="text-xs">• {s.text}</p>
              ))}
            </div>

            <div className={`grid gap-2 ${shakeArea === 'diagnosis' ? 'animate-pulse' : ''}`}>
              {diseaseOptions.map(disease => (
                <button
                  key={disease}
                  onClick={() => handleDiagnosis(disease)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    diagnosisGuess === disease && disease === card.diseaseName
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-muted hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <span className="font-medium">{disease}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TREAT PHASE */}
        {phase === 'treat' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold flex items-center justify-center gap-2">
                <Beaker className="h-4 w-4" /> Mix the right treatment!
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Diagnosed: <span className="font-semibold text-primary">{card.diseaseName}</span> — Choose remedies to heal the plant
              </p>
            </div>

            {/* Treatment mixing area */}
            <div className="p-4 rounded-xl border-2 border-dashed border-muted bg-muted/20 min-h-[60px]">
              {treatmentMix.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground">Click remedies below to add to the mix</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {treatmentMix.map(id => {
                    const ingredient = treatmentIngredients.find(t => t.id === id);
                    return ingredient ? (
                      <Badge key={id} variant={ingredient.isCorrect ? 'default' : 'destructive'} className="text-xs">
                        {ingredient.emoji} {ingredient.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Available ingredients */}
            <div className="grid grid-cols-2 gap-2">
              {treatmentIngredients.map(ingredient => (
                <button
                  key={ingredient.id}
                  onClick={() => addToTreatment(ingredient.id)}
                  disabled={treatmentMix.includes(ingredient.id)}
                  className={`p-3 rounded-xl border-2 text-left text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    treatmentMix.includes(ingredient.id)
                      ? ingredient.isCorrect
                        ? 'border-green-500/50 bg-green-500/5 opacity-60'
                        : 'border-red-500/50 bg-red-500/5 opacity-60'
                      : 'border-muted hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <span className="text-lg">{ingredient.emoji}</span>
                  <p className="text-xs font-medium mt-1">{ingredient.name}</p>
                </button>
              ))}
            </div>

            <Button 
              onClick={applyTreatment} 
              disabled={treatmentMix.length === 0} 
              className="w-full" 
              size="lg"
            >
              🌿 Apply Treatment
            </Button>
          </div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${plantHealth >= 80 ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
              <p className="text-sm font-semibold mb-2">
                {plantHealth >= 80 ? '🎉 Excellent treatment!' : '⚠️ The plant partially recovered'}
              </p>
              <p className="text-xs text-muted-foreground">{card.explanation}</p>
              <p className="text-xs mt-2 font-medium">
                ✅ Best treatment: {card.correctTreatment}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={nextPlant} className="flex-1" size="lg">
                {currentIndex + 1 >= diseaseCards.length ? '🎉 See Final Score' : '🔬 Next Patient'}
              </Button>
              <Button onClick={onBack} variant="outline" size="lg">Exit</Button>
            </div>
          </div>
        )}

        {phase === 'examine' && (
          <Button onClick={onBack} variant="outline" className="w-full">Exit</Button>
        )}
      </CardContent>
    </Card>
  );
};
