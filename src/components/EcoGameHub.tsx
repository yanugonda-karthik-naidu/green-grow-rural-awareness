import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gamepad2, Sprout, Stethoscope, FlowerIcon, Droplets, Shield,
  Trophy, Star, Zap, Play
} from "lucide-react";
import { UserProgress } from "@/hooks/useUserProgress";
import { PlantCareSimulator } from "./games/PlantCareSimulator";
import { DiseaseIdentifier } from "./games/DiseaseIdentifier";
import { GardenPlanner } from "./games/GardenPlanner";
import { WaterSoilBalance } from "./games/WaterSoilBalance";
import { PestDefender } from "./games/PestDefender";
import { GameLeaderboard } from "./games/GameLeaderboard";

interface EcoGameHubProps {
  progress: UserProgress;
  onProgressUpdate: (update: { seedPoints: number }) => void;
}

type GameType = 'plant-care' | 'disease-id' | 'garden-plan' | 'water-soil' | 'pest-defend' | null;

interface GameDef {
  id: GameType;
  title: string;
  description: string;
  icon: React.ElementType;
  seedReward: string;
  color: string;
  gradient: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  gameplayType: string;
}

const games: GameDef[] = [
  {
    id: 'plant-care',
    title: 'Plant Care Simulator',
    description: 'Manage water, sunlight & nutrients in real-time to grow a plant from seed to bloom.',
    icon: Sprout,
    seedReward: 'Up to 230',
    color: 'text-green-600',
    gradient: 'from-green-500/10 to-emerald-500/10',
    difficulty: 'Beginner',
    gameplayType: '🎮 Resource Management',
  },
  {
    id: 'disease-id',
    title: 'Plant Doctor',
    description: 'Examine sick plants, investigate symptoms, diagnose diseases & mix the right treatment.',
    icon: Stethoscope,
    seedReward: 'Up to 230',
    color: 'text-red-600',
    gradient: 'from-red-500/10 to-orange-500/10',
    difficulty: 'Intermediate',
    gameplayType: '🔬 Detective Investigation',
  },
  {
    id: 'garden-plan',
    title: 'Garden Builder',
    description: 'Place crops on a 3×3 garden grid with real-time companion planting feedback.',
    icon: FlowerIcon,
    seedReward: 'Up to 160',
    color: 'text-amber-600',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    difficulty: 'Intermediate',
    gameplayType: '🏗️ Strategy Builder',
  },
  {
    id: 'water-soil',
    title: 'Soil Lab',
    description: 'Mix soil amendments to balance pH, moisture & nutrients — watch the plant react live!',
    icon: Droplets,
    seedReward: 'Up to 170',
    color: 'text-cyan-600',
    gradient: 'from-cyan-500/10 to-teal-500/10',
    difficulty: 'Advanced',
    gameplayType: '🧪 Lab Simulation',
  },
  {
    id: 'pest-defend',
    title: 'Pest Defender',
    description: 'Click pests in real-time to defend your garden! Choose eco-friendly tools for combo bonuses.',
    icon: Shield,
    seedReward: 'Up to 200',
    color: 'text-purple-600',
    gradient: 'from-purple-500/10 to-pink-500/10',
    difficulty: 'Beginner',
    gameplayType: '⚡ Action Defense',
  },
];

const difficultyColor = {
  Beginner: 'bg-green-500/10 text-green-700 border-green-500/30',
  Intermediate: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
  Advanced: 'bg-red-500/10 text-red-700 border-red-500/30',
};

export const EcoGameHub = ({ progress, onProgressUpdate }: EcoGameHubProps) => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const handleGameComplete = (seedsEarned: number) => {
    onProgressUpdate({ seedPoints: seedsEarned });
    setActiveGame(null);
  };

  const handleBack = () => {
    setActiveGame(null);
  };

  if (activeGame === 'plant-care') return <PlantCareSimulator onComplete={handleGameComplete} onBack={handleBack} />;
  if (activeGame === 'disease-id') return <DiseaseIdentifier onComplete={handleGameComplete} onBack={handleBack} />;
  if (activeGame === 'garden-plan') return <GardenPlanner onComplete={handleGameComplete} onBack={handleBack} />;
  if (activeGame === 'water-soil') return <WaterSoilBalance onComplete={handleGameComplete} onBack={handleBack} />;
  if (activeGame === 'pest-defend') return <PestDefender onComplete={handleGameComplete} onBack={handleBack} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 p-6 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl border-2 border-green-500/20">
        <div className="inline-block p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full">
          <Gamepad2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          🎮 Interactive Eco Games
        </h2>
        <p className="text-muted-foreground text-lg">Hands-on games — click, mix, build, defend & earn seeds!</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Play className="h-3 w-3 mr-1" /> 5 Interactive Games
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Zap className="h-3 w-3 mr-1" /> Real-Time Gameplay
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Trophy className="h-3 w-3 mr-1" /> Earn Seed Points
          </Badge>
        </div>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card
              key={game.id}
              className="border-2 border-muted/50 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group overflow-hidden hover:scale-[1.02]"
              onClick={() => setActiveGame(game.id)}
            >
              <CardHeader className={`bg-gradient-to-br ${game.gradient} pb-3`}>
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-background/50 backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Icon className={`h-8 w-8 ${game.color}`} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className={`text-[10px] ${difficultyColor[game.difficulty]}`}>
                      {game.difficulty}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{game.gameplayType}</span>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{game.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{game.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-muted">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1 text-yellow-600" />
                    {game.seedReward} Seeds
                  </Badge>
                  <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Play className="h-3 w-3 mr-1" /> Play
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Game Leaderboard */}
      <GameLeaderboard />
    </div>
  );
};
