import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gamepad2, Sprout, Stethoscope, FlowerIcon, Droplets, Shield,
  Trophy, Star, Zap
} from "lucide-react";
import { UserProgress } from "@/hooks/useUserProgress";
import { PlantCareSimulator } from "./games/PlantCareSimulator";
import { DiseaseIdentifier } from "./games/DiseaseIdentifier";
import { GardenPlanner } from "./games/GardenPlanner";
import { WaterSoilBalance } from "./games/WaterSoilBalance";
import { PestDefender } from "./games/PestDefender";
import confetti from "canvas-confetti";

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
  learnTopics: string[];
}

const games: GameDef[] = [
  {
    id: 'plant-care',
    title: 'Plant Care Simulator',
    description: 'Guide a plant from seed to full bloom by managing water, sunlight, and nutrients through 6 lifecycle stages.',
    icon: Sprout,
    seedReward: 'Up to 230',
    color: 'text-green-600',
    gradient: 'from-green-500/10 to-emerald-500/10',
    difficulty: 'Beginner',
    learnTopics: ['Plant lifecycle', 'Resource management', 'Over/under watering']
  },
  {
    id: 'disease-id',
    title: 'Disease Identifier',
    description: 'Diagnose plant diseases from symptoms and choose the correct eco-friendly treatment for 8 common plants.',
    icon: Stethoscope,
    seedReward: 'Up to 230',
    color: 'text-red-600',
    gradient: 'from-red-500/10 to-orange-500/10',
    difficulty: 'Intermediate',
    learnTopics: ['Plant diseases', 'Organic treatments', 'Prevention methods']
  },
  {
    id: 'garden-plan',
    title: 'Garden Planner',
    description: 'Plan the perfect garden by selecting crops based on season, soil, and companion planting science.',
    icon: FlowerIcon,
    seedReward: 'Up to 160',
    color: 'text-amber-600',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    difficulty: 'Intermediate',
    learnTopics: ['Companion planting', 'Seasonal crops', 'Soil types']
  },
  {
    id: 'water-soil',
    title: 'Water & Soil Balance',
    description: 'Adjust soil pH, moisture, and nutrients to create the perfect growing conditions for different plants.',
    icon: Droplets,
    seedReward: 'Up to 170',
    color: 'text-cyan-600',
    gradient: 'from-cyan-500/10 to-teal-500/10',
    difficulty: 'Advanced',
    learnTopics: ['Soil chemistry', 'NPK nutrients', 'pH management']
  },
  {
    id: 'pest-defend',
    title: 'Pest Defender',
    description: 'Defend your garden from pests using eco-friendly solutions. Choose wisely — chemicals harm the ecosystem!',
    icon: Shield,
    seedReward: 'Up to 200',
    color: 'text-purple-600',
    gradient: 'from-purple-500/10 to-pink-500/10',
    difficulty: 'Beginner',
    learnTopics: ['Biological control', 'Eco pest management', 'Beneficial insects']
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
          🌿 Eco Learning Games
        </h2>
        <p className="text-muted-foreground text-lg">Play, learn about plants & environment, earn seeds!</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Star className="h-3 w-3 mr-1" /> 5 Educational Games
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Zap className="h-3 w-3 mr-1" /> Earn Real Seed Points
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Trophy className="h-3 w-3 mr-1" /> Track Progress
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
              className="border-2 border-muted/50 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group overflow-hidden"
              onClick={() => setActiveGame(game.id)}
            >
              <CardHeader className={`bg-gradient-to-br ${game.gradient} pb-3`}>
                <div className="flex items-start justify-between">
                  <Icon className={`h-10 w-10 ${game.color} group-hover:scale-110 transition-transform`} />
                  <Badge variant="outline" className={`text-[10px] ${difficultyColor[game.difficulty]}`}>
                    {game.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{game.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{game.description}</p>

                {/* Learn topics */}
                <div className="flex flex-wrap gap-1">
                  {game.learnTopics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-[10px] px-2 py-0.5">
                      {topic}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-muted">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1 text-yellow-600" />
                    {game.seedReward} Seeds
                  </Badge>
                  <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
