import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Zap, Leaf, Bug, Heart } from "lucide-react";
import { pests, Pest } from "@/lib/ecoGameData";
import { ParticleEffects } from "./ParticleEffects";
import confetti from "canvas-confetti";

interface PestDefenderProps {
  onComplete: (seeds: number) => void;
  onBack: () => void;
}

interface ActivePest {
  pest: Pest;
  position: number;
  lane: number; // 0, 1, 2 (top, middle, bottom)
  id: number;
  defeated: boolean;
  defeatType?: 'eco' | 'chemical';
}

type DefenseTool = 'ladybug' | 'neemoil' | 'trap' | 'spray';

interface ToolDef {
  id: DefenseTool;
  name: string;
  emoji: string;
  type: 'eco' | 'chemical';
  power: number;
  description: string;
}

const defenseTools: ToolDef[] = [
  { id: 'ladybug', name: 'Ladybugs', emoji: '🐞', type: 'eco', power: 3, description: 'Natural predators' },
  { id: 'neemoil', name: 'Neem Oil', emoji: '🌿', type: 'eco', power: 2, description: 'Organic repellent' },
  { id: 'trap', name: 'Sticky Trap', emoji: '🪤', type: 'eco', power: 2, description: 'Chemical-free catch' },
  { id: 'spray', name: 'Pesticide', emoji: '☠️', type: 'chemical', power: 4, description: 'Harms ecosystem!' },
];

export const PestDefender = ({ onComplete, onBack }: PestDefenderProps) => {
  const [score, setScore] = useState(0);
  const [ecoScore, setEcoScore] = useState(0);
  const [plantHealth, setPlantHealth] = useState(100);
  const [activePests, setActivePests] = useState<ActivePest[]>([]);
  const [selectedTool, setSelectedTool] = useState<DefenseTool>('ladybug');
  const [completed, setCompleted] = useState(false);
  const [pestsDefeated, setPestsDefeated] = useState(0);
  const [totalPests] = useState(pests.length * 2); // Each pest spawns twice
  const [defenseLog, setDefenseLog] = useState<string[]>([]);
  const [combo, setCombo] = useState(0);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particleType, setParticleType] = useState<'eco' | 'damage'>('eco');
  const [shake, setShake] = useState(false);
  const [comboFlash, setComboFlash] = useState(0);
  const pestIdRef = useRef(0);
  const spawnQueueRef = useRef([...pests, ...pests].sort(() => Math.random() - 0.5));

  // Spawn pests periodically
  useEffect(() => {
    if (completed) return;
    const timer = setInterval(() => {
      if (spawnQueueRef.current.length === 0 || activePests.filter(p => !p.defeated).length >= 4) return;
      
      const pest = spawnQueueRef.current.shift()!;
      const id = ++pestIdRef.current;
      setActivePests(prev => [...prev, {
        pest,
        position: 0,
        lane: Math.floor(Math.random() * 3),
        id,
        defeated: false,
      }]);
    }, 2500);
    return () => clearInterval(timer);
  }, [completed, activePests]);

  // Move pests
  useEffect(() => {
    if (completed) return;
    const timer = setInterval(() => {
      setActivePests(prev => {
        const updated = prev.map(ap => 
          ap.defeated ? ap : { ...ap, position: ap.position + ap.pest.speed * 1.5 }
        );
        
        // Check plant damage
        const reached = updated.filter(ap => !ap.defeated && ap.position >= 100);
        if (reached.length > 0) {
          setPlantHealth(h => Math.max(0, h - reached.length * 12));
          setCombo(0);
        }
        
        return updated.filter(ap => ap.defeated || ap.position < 100);
      });
    }, 400);
    return () => clearInterval(timer);
  }, [completed]);

  // Check game end
  useEffect(() => {
    if (completed) return;
    if (plantHealth <= 0) {
      setCompleted(true);
      const totalSeeds = score + Math.round(ecoScore / 2);
      setTimeout(() => onComplete(totalSeeds), 1000);
    }
    if (pestsDefeated >= totalPests && activePests.filter(p => !p.defeated).length === 0) {
      setCompleted(true);
      const bonus = plantHealth >= 50 ? 50 : 20;
      const totalSeeds = score + Math.round(ecoScore / 2) + bonus;
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => onComplete(totalSeeds), 1500);
    }
  }, [plantHealth, pestsDefeated, activePests, completed, totalPests]);

  // Click pest to defend
  const defendAgainst = useCallback((pestId: number) => {
    if (completed) return;
    
    const tool = defenseTools.find(t => t.id === selectedTool)!;
    
    setActivePests(prev => prev.map(ap => {
      if (ap.id !== pestId || ap.defeated) return ap;
      return { ...ap, defeated: true, defeatType: tool.type };
    }));

    setPestsDefeated(p => p + 1);

    if (tool.type === 'eco') {
      const newCombo = combo + 1;
      const comboBonus = newCombo >= 5 ? 25 : newCombo >= 3 ? 15 : newCombo >= 2 ? 8 : 0;
      setScore(prev => prev + 20 + comboBonus);
      setEcoScore(prev => prev + 15);
      setCombo(newCombo);
      setParticleType('eco');
      setParticleTrigger(p => p + 1);
      if (newCombo >= 3) {
        setComboFlash(newCombo);
        setTimeout(() => setComboFlash(0), 800);
      }
      confetti({ particleCount: 10 + newCombo * 3, spread: 30 + newCombo * 5, origin: { y: 0.5 }, colors: ['#10b981', '#34d399'] });
      setDefenseLog(prev => [`🌿 ${tool.name} vs ${pests.find(p => p.name === activePests.find(a => a.id === pestId)?.pest.name)?.name || 'pest'}${comboBonus > 0 ? ` (+${comboBonus} combo!)` : ''}`, ...prev.slice(0, 4)]);
    } else {
      setScore(prev => prev + 10);
      setEcoScore(prev => Math.max(0, prev - 10));
      setCombo(0);
      setPlantHealth(prev => Math.max(0, prev - 3));
      setParticleType('damage');
      setParticleTrigger(p => p + 1);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setDefenseLog(prev => [`☠️ Chemical used — ecosystem damaged!`, ...prev.slice(0, 4)]);
    }
  }, [selectedTool, completed, combo, activePests]);

  // Clean up defeated pests after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivePests(prev => prev.filter(ap => !ap.defeated));
    }, 500);
    return () => clearTimeout(timer);
  }, [activePests.filter(p => p.defeated).length]);

  const getLaneY = (lane: number) => {
    return lane === 0 ? '15%' : lane === 1 ? '45%' : '75%';
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
            {combo >= 2 && <Badge className={`bg-orange-500 ${combo >= 5 ? 'animate-bounce' : 'animate-pulse'}`}>🔥 ×{combo}{combo >= 5 ? ' MEGA!' : combo >= 3 ? ' HOT!' : ''}</Badge>}
            <Badge variant="secondary">🌿 {ecoScore}</Badge>
            <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" />{score}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Plant health bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" /> Garden Health
            </span>
            <span className={`font-semibold ${plantHealth < 30 ? 'text-red-500' : plantHealth < 60 ? 'text-yellow-500' : 'text-green-500'}`}>
              {Math.round(plantHealth)}%
            </span>
          </div>
          <Progress value={plantHealth} className="h-3" />
        </div>

        {/* Defense tool selector */}
        <div className="flex gap-2 justify-center">
          {defenseTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-2 rounded-xl border-2 text-center transition-all hover:scale-110 active:scale-95 ${
                selectedTool === tool.id 
                  ? tool.type === 'eco' 
                    ? 'border-green-500 bg-green-500/10 scale-105' 
                    : 'border-red-500 bg-red-500/10 scale-105'
                  : 'border-muted hover:border-primary/30'
              }`}
              title={tool.description}
            >
              <span className="text-xl">{tool.emoji}</span>
              <span className="text-[9px] block font-medium">{tool.name}</span>
              <span className={`text-[8px] ${tool.type === 'eco' ? 'text-green-600' : 'text-red-500'}`}>
                {tool.type === 'eco' ? '♻️ Eco' : '⚠️ Toxic'}
              </span>
            </button>
          ))}
        </div>

        {/* Game field */}
        <div className={`relative h-56 rounded-xl bg-gradient-to-r from-red-500/5 via-yellow-500/5 to-green-500/10 border-2 border-green-500/20 overflow-hidden transition-transform ${shake ? 'animate-screen-shake' : ''}`}>
          <ParticleEffects trigger={particleTrigger} type={particleType} intensity={0.8} />
          {/* Combo multiplier popup */}
          {comboFlash >= 3 && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none animate-combo-flash">
              <span className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 drop-shadow-lg ${comboFlash >= 5 ? 'text-6xl' : 'text-5xl'}`}>
                🔥 ×{comboFlash}
              </span>
            </div>
          )}
          {/* Lane lines */}
          <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-muted/30" />
          <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-muted/30" />
          
          {/* Garden at the right */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <span className="text-4xl">{plantHealth > 70 ? '🌳' : plantHealth > 30 ? '🌿' : '🥀'}</span>
            <span className="text-[10px] text-muted-foreground">Garden</span>
          </div>

          {/* Defense zone indicator */}
          <div className="absolute right-16 top-0 bottom-0 w-px border-l-2 border-dashed border-green-500/30" />

          {/* Active pests */}
          {activePests.map(ap => (
            <button
              key={ap.id}
              onClick={() => defendAgainst(ap.id)}
              disabled={ap.defeated}
              className={`absolute -translate-y-1/2 transition-all duration-200 ${
                ap.defeated 
                  ? ap.defeatType === 'eco'
                    ? 'scale-0 opacity-0'
                    : 'scale-0 opacity-0 rotate-180'
                  : 'hover:scale-150 active:scale-75 cursor-crosshair'
              }`}
              style={{ 
                left: `${Math.min(ap.position, 80)}%`, 
                top: getLaneY(ap.lane),
                transition: ap.defeated ? 'all 0.3s' : 'left 0.4s linear'
              }}
              title={`${ap.pest.name} — Click to defend!`}
            >
              <span className="text-3xl animate-pulse">{ap.pest.emoji}</span>
            </button>
          ))}

          {/* Empty state */}
          {activePests.filter(p => !p.defeated).length === 0 && spawnQueueRef.current.length > 0 && !completed && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Pests approaching... pick your defense! 🛡️
            </div>
          )}

          {completed && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="text-center">
                <span className="text-5xl">{plantHealth > 50 ? '🎉' : '😅'}</span>
                <p className="font-bold mt-2">{plantHealth > 50 ? 'Garden Saved!' : 'Garden Survived!'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Defense log */}
        {defenseLog.length > 0 && (
          <div className="max-h-20 overflow-y-auto space-y-0.5 p-2 bg-muted/30 rounded-lg">
            {defenseLog.map((log, i) => (
              <p key={i} className="text-[10px] text-muted-foreground">{log}</p>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Defeated: {pestsDefeated}/{totalPests}</span>
          <span>Eco Rating: {ecoScore >= 80 ? '🌟 Excellent' : ecoScore >= 50 ? '👍 Good' : ecoScore >= 20 ? '⚡ Fair' : '💪 Keep trying'}</span>
        </div>

        {!completed && (
          <Button onClick={onBack} variant="outline" className="w-full">Exit Game</Button>
        )}
      </CardContent>
    </Card>
  );
};
