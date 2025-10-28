import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Trophy, Star, Sparkles, TreeDeciduous, Leaf, 
  Target, Award, Flame, Users, Volume2, Share2, Zap,
  CheckCircle2, XCircle, Play, RotateCcw, Crown, Gift
} from "lucide-react";
import { UserProgress } from "@/hooks/useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

interface QuizGamesProps {
  progress: UserProgress;
  onProgressUpdate: (update: Partial<UserProgress>) => void;
  t: any;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  funFact: string;
}

const quizQuestions: Question[] = [
  // Easy Questions
  { id: 'e1', question: 'What do trees produce that humans breathe?', options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correct: 1, difficulty: 'easy', category: 'Trees', funFact: 'One large tree can provide a day\'s supply of oxygen for 4 people!' },
  { id: 'e2', question: 'Which color are most leaves?', options: ['Red', 'Blue', 'Green', 'Yellow'], correct: 2, difficulty: 'easy', category: 'Plants', funFact: 'Leaves are green because of chlorophyll, which helps plants make food from sunlight!' },
  { id: 'e3', question: 'What do plants need to grow?', options: ['Darkness', 'Sunlight', 'Ice', 'Fire'], correct: 1, difficulty: 'easy', category: 'Plants', funFact: 'Plants use sunlight to make food through photosynthesis!' },
  { id: 'e4', question: 'Which tree gives us coconuts?', options: ['Mango Tree', 'Coconut Palm', 'Neem Tree', 'Banyan Tree'], correct: 1, difficulty: 'easy', category: 'Trees', funFact: 'Coconut palms can grow up to 30 meters tall!' },
  { id: 'e5', question: 'What is the largest land animal?', options: ['Lion', 'Elephant', 'Giraffe', 'Bear'], correct: 1, difficulty: 'easy', category: 'Wildlife', funFact: 'Elephants help spread tree seeds through their dung!' },
  
  // Medium Questions
  { id: 'm1', question: 'How much CO₂ can a mature tree absorb per year?', options: ['5 kg', '10 kg', '25 kg', '50 kg'], correct: 2, difficulty: 'medium', category: 'Environment', funFact: 'A mature tree absorbs approximately 25 kg of CO₂ annually!' },
  { id: 'm2', question: 'What is the process by which plants make food?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], correct: 1, difficulty: 'medium', category: 'Science', funFact: 'Photosynthesis converts CO₂ and water into glucose and oxygen!' },
  { id: 'm3', question: 'Which Indian tree is known as the "Tree of Life"?', options: ['Mango', 'Neem', 'Banyan', 'Peepal'], correct: 1, difficulty: 'medium', category: 'Trees', funFact: 'Neem has over 140 medicinal compounds!' },
  { id: 'm4', question: 'How long can a banyan tree live?', options: ['50 years', '100 years', '200+ years', '500+ years'], correct: 3, difficulty: 'medium', category: 'Trees', funFact: 'Some banyan trees can live for over 500 years!' },
  { id: 'm5', question: 'What percentage of Earth\'s oxygen comes from forests?', options: ['10%', '20%', '30%', '50%'], correct: 2, difficulty: 'medium', category: 'Environment', funFact: 'Forests produce about 30% of Earth\'s oxygen!' },
  
  // Hard Questions
  { id: 'h1', question: 'How many species of trees exist worldwide?', options: ['5,000', '30,000', '60,000', '100,000'], correct: 2, difficulty: 'hard', category: 'Biodiversity', funFact: 'Scientists estimate there are over 60,000 tree species on Earth!' },
  { id: 'h2', question: 'What is the oldest known tree species?', options: ['Oak', 'Bristlecone Pine', 'Sequoia', 'Cypress'], correct: 1, difficulty: 'hard', category: 'Trees', funFact: 'Bristlecone pines can live over 5,000 years!' },
  { id: 'h3', question: 'How much water can a large tree transpire daily?', options: ['50 liters', '100 liters', '200 liters', '400+ liters'], correct: 3, difficulty: 'hard', category: 'Environment', funFact: 'A large tree can release over 400 liters of water into the atmosphere daily!' },
  { id: 'h4', question: 'What is mycorrhizal network?', options: ['Tree roots', 'Fungal network connecting trees', 'Bird migration path', 'Water channels'], correct: 1, difficulty: 'hard', category: 'Science', funFact: 'Trees communicate and share nutrients through underground fungal networks!' },
  { id: 'h5', question: 'How much can forests reduce air temperature?', options: ['1-2°C', '3-5°C', '5-7°C', '10°C'], correct: 1, difficulty: 'hard', category: 'Climate', funFact: 'Urban forests can reduce local temperatures by 5-7°C!' },
];

export const QuizGames = ({ progress, onProgressUpdate, t }: QuizGamesProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [virtualForest, setVirtualForest] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const { toast } = useToast();

  const filteredQuestions = quizQuestions.filter(q => q.difficulty === difficulty);
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  const unlockedLevels = {
    easy: true,
    medium: score >= 3,
    hard: score >= 8
  };

  const getAIFeedback = async (question: string, userAnswer: string, correctAnswer: string, isCorrect: boolean) => {
    setIsLoadingFeedback(true);
    try {
      const { data, error } = await supabase.functions.invoke('eco-tutor', {
        body: { question, userAnswer, correctAnswer, isCorrect }
      });

      if (error) throw error;
      setAiFeedback(data.feedback);
    } catch (error) {
      console.error('AI feedback error:', error);
      setAiFeedback(isCorrect 
        ? '🌟 Great job! Keep learning about our environment!'
        : '🌱 Keep trying! Every mistake helps you grow stronger!');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setVirtualForest(prev => prev + 1);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });

      // Award seeds
      const seedsEarned = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
      onProgressUpdate({ seedPoints: seedsEarned });
    } else {
      setStreak(0);
    }

    await getAIFeedback(
      currentQuestion.question,
      currentQuestion.options[answerIndex],
      currentQuestion.options[currentQuestion.correct],
      isCorrect
    );

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAiFeedback('');
    } else {
      setQuizComplete(true);
      if (score >= filteredQuestions.length * 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizComplete(false);
    setAiFeedback('');
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (quizComplete) {
    const percentage = (score / filteredQuestions.length) * 100;
    const seedsEarned = score * (difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10);
    
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5">
          <CardContent className="p-8 text-center space-y-6">
            <div className="inline-block p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full">
              <Trophy className="h-16 w-16 text-yellow-600 animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Quiz Complete! 🎉
            </h2>
            
            <div className="space-y-4">
              <div className="text-6xl font-bold text-primary">{score}/{filteredQuestions.length}</div>
              <Progress value={percentage} className="h-4" />
              <p className="text-lg text-muted-foreground">
                {percentage >= 80 ? '🌟 Outstanding!' : percentage >= 60 ? '🌱 Great job!' : '💚 Keep learning!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <Gift className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{seedsEarned}</div>
                <div className="text-xs text-muted-foreground">Seeds Earned</div>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <TreeDeciduous className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{virtualForest}</div>
                <div className="text-xs text-muted-foreground">Trees Grown</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={resetQuiz} size="lg">
                <RotateCcw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
              <Button variant="secondary" size="lg" onClick={() => {}}>
                <Share2 className="mr-2 h-5 w-5" />
                Share Score
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 p-6 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl border-2 border-green-500/20">
        <div className="inline-block p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full">
          <Brain className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          🎮 Fun Quiz & Games
        </h2>
        <p className="text-muted-foreground text-lg">Learn, Play, and Grow Your Virtual Forest!</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-green-500/20">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <TreeDeciduous className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-600">{virtualForest}</div>
            <div className="text-xs text-muted-foreground">Trees Grown</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-yellow-500/20">
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{progress.seedPoints || 0}</div>
            <div className="text-xs text-muted-foreground">Total Seeds</div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Selection */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Select Difficulty Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={difficulty === 'easy' ? 'default' : 'outline'}
              onClick={() => { setDifficulty('easy'); resetQuiz(); }}
              className="h-20"
              disabled={!unlockedLevels.easy}
            >
              <div className="text-center">
                <Leaf className="h-6 w-6 mx-auto mb-1" />
                <div className="font-bold">Easy</div>
                <div className="text-xs">+2 Seeds</div>
              </div>
            </Button>
            
            <Button
              variant={difficulty === 'medium' ? 'default' : 'outline'}
              onClick={() => { setDifficulty('medium'); resetQuiz(); }}
              className="h-20"
              disabled={!unlockedLevels.medium}
            >
              <div className="text-center">
                <Sparkles className="h-6 w-6 mx-auto mb-1" />
                <div className="font-bold">Medium</div>
                <div className="text-xs">+5 Seeds</div>
                {!unlockedLevels.medium && <div className="text-xs text-red-500">Score 3+ to unlock</div>}
              </div>
            </Button>
            
            <Button
              variant={difficulty === 'hard' ? 'default' : 'outline'}
              onClick={() => { setDifficulty('hard'); resetQuiz(); }}
              className="h-20"
              disabled={!unlockedLevels.hard}
            >
              <div className="text-center">
                <Crown className="h-6 w-6 mx-auto mb-1" />
                <div className="font-bold">Hard</div>
                <div className="text-xs">+10 Seeds</div>
                {!unlockedLevels.hard && <div className="text-xs text-red-500">Score 8+ to unlock</div>}
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="border-2 border-primary/30 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary" className="text-sm">
              {currentQuestion.category}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => speakText(currentQuestion.question)}
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
          <Progress value={progressPercent} className="h-2 mb-2" />
          <CardTitle className="text-xl">
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-2xl font-semibold">{currentQuestion.question}</h3>
          
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`h-auto p-4 text-left justify-start text-base transition-all ${
                  selectedAnswer === index
                    ? index === currentQuestion.correct
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                    : showFeedback && index === currentQuestion.correct
                    ? 'border-green-500 bg-green-500/10'
                    : 'hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showFeedback && index === currentQuestion.correct && (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  )}
                  {selectedAnswer === index && index !== currentQuestion.correct && (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </Button>
            ))}
          </div>

          {/* AI Feedback */}
          {showFeedback && (
            <div className="space-y-4 animate-fade-in">
              {isLoadingFeedback ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-muted-foreground">EcoBot is thinking...</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-full">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-600 mb-2">🤖 EcoBot Says:</h4>
                      <p className="text-foreground">{aiFeedback}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <h4 className="font-semibold text-blue-600 mb-2">💡 Fun Fact:</h4>
                <p className="text-foreground">{currentQuestion.funFact}</p>
              </div>

              <Button onClick={handleNext} size="lg" className="w-full">
                {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Virtual Forest Progress */}
      {virtualForest > 0 && (
        <Card className="border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-emerald-600 mb-3">🌳 Your Virtual Forest</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {Array.from({ length: virtualForest }).map((_, i) => (
                <TreeDeciduous 
                  key={i} 
                  className="h-8 w-8 text-green-600 animate-pulse" 
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {virtualForest} tree{virtualForest > 1 ? 's' : ''} grown from your correct answers!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
