import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, TreeDeciduous, Leaf, Trash2, Award, 
  RotateCcw, Target, Timer, Zap
} from "lucide-react";
import { UserProgress } from "@/hooks/useLocalStorage";
import confetti from 'canvas-confetti';

interface MiniGamesProps {
  progress: UserProgress;
  onProgressUpdate: (update: Partial<UserProgress>) => void;
}

type GameType = 'forest' | 'match' | 'clean' | null;

const leafImages = ['🍃', '🌿', '🍀', '🌱', '🌾', '🍂'];

export const MiniGames = ({ progress, onProgressUpdate }: MiniGamesProps) => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Grow Your Forest Game
  const [forestTrees, setForestTrees] = useState(0);
  const [waterLevel, setWaterLevel] = useState(100);
  const [sunLevel, setSunLevel] = useState(100);

  // Match the Leaf Game
  const [cards, setCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  // Clean the Planet Game
  const [trashItems, setTrashItems] = useState<{ id: number; x: number; y: number }[]>([]);
  const [cleaned, setCleaned] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setGameTime(prev => prev + 1);
        
        if (activeGame === 'forest') {
          setWaterLevel(prev => Math.max(0, prev - 1));
          setSunLevel(prev => Math.max(0, prev - 0.5));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeGame]);

  const startForestGame = () => {
    setActiveGame('forest');
    setIsPlaying(true);
    setForestTrees(0);
    setWaterLevel(100);
    setSunLevel(100);
    setGameTime(0);
    setGameScore(0);
  };

  const plantTree = () => {
    if (waterLevel >= 10 && sunLevel >= 10) {
      setForestTrees(prev => prev + 1);
      setWaterLevel(prev => prev - 10);
      setSunLevel(prev => prev - 10);
      setGameScore(prev => prev + 10);
      
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399']
      });
    }
  };

  const addWater = () => {
    setWaterLevel(prev => Math.min(100, prev + 20));
  };

  const addSun = () => {
    setSunLevel(prev => Math.min(100, prev + 20));
  };

  const startMatchGame = () => {
    setActiveGame('match');
    setIsPlaying(true);
    setGameTime(0);
    setMoves(0);
    setMatchedCards([]);
    setFlippedCards([]);
    
    const gameLeaves = [...leafImages, ...leafImages]
      .sort(() => Math.random() - 0.5);
    setCards(gameLeaves);
  };

  const flipCard = (index: number) => {
    if (flippedCards.length === 2 || matchedCards.includes(index) || flippedCards.includes(index)) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatchedCards(prev => [...prev, ...newFlipped]);
        setGameScore(prev => prev + 20);
        setFlippedCards([]);
        
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 }
        });

        if (matchedCards.length + 2 === cards.length) {
          completeGame(100);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const startCleanGame = () => {
    setActiveGame('clean');
    setIsPlaying(true);
    setGameTime(0);
    setCleaned(0);
    setGameScore(0);
    
    const items = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80,
      y: Math.random() * 80
    }));
    setTrashItems(items);
  };

  const cleanTrash = (id: number) => {
    setTrashItems(prev => prev.filter(item => item.id !== id));
    setCleaned(prev => prev + 1);
    setGameScore(prev => prev + 10);
    
    if (trashItems.length === 1) {
      completeGame(150);
    }
  };

  const completeGame = (seedsEarned: number) => {
    setIsPlaying(false);
    onProgressUpdate({ seedPoints: seedsEarned });
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const endGame = () => {
    setIsPlaying(false);
    const seedsEarned = Math.floor(gameScore / 10);
    onProgressUpdate({ seedPoints: seedsEarned });
  };

  if (!activeGame) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-3 p-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl border-2 border-purple-500/20">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
            <Gamepad2 className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            🎮 Mini Games
          </h2>
          <p className="text-muted-foreground text-lg">Play games and earn seeds!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-green-500/30 hover:shadow-xl transition-all cursor-pointer group" onClick={startForestGame}>
            <CardHeader className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <TreeDeciduous className="h-12 w-12 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-center">Grow Your Forest</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                Plant trees by managing water and sunlight. Build the biggest forest!
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">+10 Seeds per tree</Badge>
                <Button size="sm">Play</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-500/30 hover:shadow-xl transition-all cursor-pointer group" onClick={startMatchGame}>
            <CardHeader className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
              <Leaf className="h-12 w-12 text-yellow-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-center">Match the Leaf</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                Test your memory! Match pairs of leaves to win.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">+20 Seeds per match</Badge>
                <Button size="sm">Play</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500/30 hover:shadow-xl transition-all cursor-pointer group" onClick={startCleanGame}>
            <CardHeader className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <Trash2 className="h-12 w-12 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-center">Clean the Planet</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                Tap to clean trash and save the environment!
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">+10 Seeds per item</Badge>
                <Button size="sm">Play</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => { setActiveGame(null); setIsPlaying(false); }}>
          ← Back to Games
        </Button>
        <div className="flex gap-4 items-center">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Timer className="h-4 w-4 mr-2" />
            {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Zap className="h-4 w-4 mr-2 text-yellow-600" />
            {gameScore}
          </Badge>
        </div>
      </div>

      {/* Grow Your Forest Game */}
      {activeGame === 'forest' && (
        <Card className="border-2 border-green-500/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
            <CardTitle className="flex items-center gap-2">
              <TreeDeciduous className="h-6 w-6 text-green-600" />
              Grow Your Forest - {forestTrees} Trees
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>💧 Water</span>
                  <span className="font-semibold">{Math.round(waterLevel)}%</span>
                </div>
                <Progress value={waterLevel} className="h-3" />
                <Button onClick={addWater} size="sm" className="w-full">Add Water</Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>☀️ Sunlight</span>
                  <span className="font-semibold">{Math.round(sunLevel)}%</span>
                </div>
                <Progress value={sunLevel} className="h-3" />
                <Button onClick={addSun} size="sm" className="w-full">Add Sunlight</Button>
              </div>
            </div>

            <div className="min-h-[300px] p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-2 border-green-500/20 flex flex-wrap gap-3 content-start justify-center">
              {Array.from({ length: forestTrees }).map((_, i) => (
                <TreeDeciduous 
                  key={i} 
                  className="h-12 w-12 text-green-600 animate-bounce"
                  style={{ animationDelay: `${i * 100}ms`, animationDuration: '2s' }}
                />
              ))}
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={plantTree} 
                size="lg" 
                className="flex-1"
                disabled={waterLevel < 10 || sunLevel < 10}
              >
                <TreeDeciduous className="mr-2 h-5 w-5" />
                Plant Tree
              </Button>
              <Button onClick={endGame} variant="secondary" size="lg">
                End Game
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match the Leaf Game */}
      {activeGame === 'match' && (
        <Card className="border-2 border-yellow-500/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-yellow-600" />
                Match the Leaf
              </span>
              <Badge variant="secondary">Moves: {moves}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-3">
              {cards.map((leaf, index) => (
                <div
                  key={index}
                  onClick={() => flipCard(index)}
                  className={`aspect-square rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center text-4xl ${
                    flippedCards.includes(index) || matchedCards.includes(index)
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:scale-105'
                  }`}
                >
                  {(flippedCards.includes(index) || matchedCards.includes(index)) ? leaf : '🃏'}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clean the Planet Game */}
      {activeGame === 'clean' && (
        <Card className="border-2 border-blue-500/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trash2 className="h-6 w-6 text-blue-600" />
                Clean the Planet
              </span>
              <Badge variant="secondary">Cleaned: {cleaned}/15</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative h-[400px] rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2 border-blue-500/20 overflow-hidden">
              {trashItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => cleanTrash(item.id)}
                  className="absolute text-3xl hover:scale-125 transition-transform"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  🗑️
                </button>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-4">
              Tap the trash items to clean them up!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
