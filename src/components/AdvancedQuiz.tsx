import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, XCircle, Trophy, Lock, Unlock, BookOpen, Timer, 
  ArrowRight, ArrowLeft, RotateCcw, Award, Star, Brain, Zap,
  GraduationCap, Target, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { 
  quizTopics, QuizTopic, QuizLevel, QuizQuestion, 
  UserQuizProgress, getDefaultProgress 
} from "@/lib/advancedQuizData";

interface AdvancedQuizProps {
  language: string;
  t: any;
  onQuizComplete: (score: number) => void;
}

type QuizMode = 'learning' | 'test';
type QuizState = 'topic-select' | 'level-select' | 'mode-select' | 'quiz' | 'result';

export const AdvancedQuiz = ({ language, t, onQuizComplete }: AdvancedQuizProps) => {
  const [quizState, setQuizState] = useState<QuizState>('topic-select');
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>('learning');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | number[] | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [userProgress, setUserProgress] = useState<UserQuizProgress>(getDefaultProgress());
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([]);
  const [retryMode, setRetryMode] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('advancedQuizProgress');
    if (saved) {
      setUserProgress(JSON.parse(saved));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (progress: UserQuizProgress) => {
    localStorage.setItem('advancedQuizProgress', JSON.stringify(progress));
    setUserProgress(progress);
  };

  // Timer for test mode
  useEffect(() => {
    if (quizState === 'quiz' && quizMode === 'test' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizState === 'quiz' && quizMode === 'test' && timeLeft === 0 && quizStartTime > 0) {
      finishQuiz();
    }
  }, [timeLeft, quizState, quizMode]);

  const getText = (textObj: { en: string; te: string; hi: string }) => {
    return textObj[language as 'en' | 'te' | 'hi'] || textObj.en;
  };

  const isLevelUnlocked = (topic: QuizTopic, levelIndex: number): boolean => {
    if (levelIndex === 0) return true;
    const prevLevel = topic.levels[levelIndex - 1];
    const progress = userProgress.topics[topic.id]?.[prevLevel.id];
    return progress?.completed && progress.bestScore >= prevLevel.requiredScore;
  };

  const startQuiz = () => {
    if (!selectedLevel) return;
    const questions = retryMode && wrongQuestions.length > 0
      ? wrongQuestions.map(i => selectedLevel.questions[i])
      : selectedLevel.questions;
    
    setSelectedAnswers(new Array(questions.length).fill(null));
    setCurrentQuestion(0);
    setScore(0);
    setShowExplanation(false);
    setQuizStartTime(Date.now());
    
    if (quizMode === 'test') {
      setTimeLeft(questions.length * 30); // 30 seconds per question
    }
    
    setQuizState('quiz');
  };

  const getCurrentQuestions = (): QuizQuestion[] => {
    if (!selectedLevel) return [];
    if (retryMode && wrongQuestions.length > 0) {
      return wrongQuestions.map(i => selectedLevel.questions[i]);
    }
    return selectedLevel.questions;
  };

  const handleAnswer = (answerIndex: number | number[]) => {
    const questions = getCurrentQuestions();
    const question = questions[currentQuestion];
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    const correctAns = question.correctAnswer;
    const isCorrect = Array.isArray(correctAns)
      ? Array.isArray(answerIndex) && 
        correctAns.length === answerIndex.length &&
        (correctAns as number[]).every(a => answerIndex.includes(a))
      : answerIndex === correctAns;

    if (isCorrect) {
      const points = question.difficulty === 'beginner' ? 10 : 
                     question.difficulty === 'intermediate' ? 15 : 20;
      setScore(prev => prev + points);
      
      if (quizMode === 'learning') {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        toast.success("✅ Correct!");
      }
    } else if (quizMode === 'learning') {
      toast.error("❌ Not quite right");
    }

    if (quizMode === 'learning') {
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    const questions = getCurrentQuestions();
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!selectedTopic || !selectedLevel) return;
    
    const questions = getCurrentQuestions();
    const wrong: number[] = [];
    
    questions.forEach((q, idx) => {
      const answer = selectedAnswers[idx];
      const correctAns = q.correctAnswer;
      const isCorrect = Array.isArray(correctAns)
        ? Array.isArray(answer) && 
          (correctAns as number[]).length === (answer as number[]).length &&
          (correctAns as number[]).every(a => (answer as number[]).includes(a))
        : answer === correctAns;
      if (!isCorrect) {
        wrong.push(retryMode ? wrongQuestions[idx] : idx);
      }
    });
    
    setWrongQuestions(wrong);
    
    const percentage = Math.round((score / (questions.length * 15)) * 100);
    const passed = percentage >= selectedLevel.requiredScore;
    
    // Update progress
    const newProgress = { ...userProgress };
    if (!newProgress.topics[selectedTopic.id]) {
      newProgress.topics[selectedTopic.id] = {};
    }
    
    const currentProgress = newProgress.topics[selectedTopic.id][selectedLevel.id] || {
      topicId: selectedTopic.id,
      levelId: selectedLevel.id,
      completed: false,
      bestScore: 0,
      attempts: 0,
      unlockedLevels: [],
      lastAttemptDate: ''
    };
    
    currentProgress.attempts += 1;
    currentProgress.lastAttemptDate = new Date().toISOString();
    if (percentage > currentProgress.bestScore) {
      currentProgress.bestScore = percentage;
    }
    if (passed && !currentProgress.completed) {
      currentProgress.completed = true;
      newProgress.completedQuizzes += 1;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    
    newProgress.topics[selectedTopic.id][selectedLevel.id] = currentProgress;
    newProgress.totalScore += score;
    
    saveProgress(newProgress);
    onQuizComplete(score);
    setQuizState('result');
  };

  const resetQuiz = () => {
    setQuizState('topic-select');
    setSelectedTopic(null);
    setSelectedLevel(null);
    setRetryMode(false);
    setWrongQuestions([]);
  };

  const retryWrongQuestions = () => {
    setRetryMode(true);
    startQuiz();
  };

  // Render topic selection
  if (quizState === 'topic-select') {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Advanced Learning Quiz
          </h2>
          <p className="text-muted-foreground">Choose a topic to begin your learning journey</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {quizTopics.map((topic) => {
            const topicProgress = userProgress.topics[topic.id];
            const completedLevels = topicProgress 
              ? Object.values(topicProgress).filter(p => p.completed).length 
              : 0;
            
            return (
              <Card 
                key={topic.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
                onClick={() => {
                  setSelectedTopic(topic);
                  setQuizState('level-select');
                }}
              >
                <div className={`w-16 h-16 rounded-full ${topic.color} flex items-center justify-center text-3xl mb-4 mx-auto`}>
                  {topic.icon}
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{getText(topic.name)}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{getText(topic.description)}</p>
                <div className="flex items-center justify-center gap-2">
                  <Progress value={(completedLevels / topic.levels.length) * 100} className="flex-1" />
                  <span className="text-sm font-medium">{completedLevels}/{topic.levels.length}</span>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Overall Stats */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{userProgress.totalScore}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div>
              <Star className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{userProgress.completedQuizzes}</p>
              <p className="text-sm text-muted-foreground">Quizzes Completed</p>
            </div>
            <div>
              <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">
                {quizTopics.reduce((acc, t) => acc + t.levels.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Levels</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Render level selection
  if (quizState === 'level-select' && selectedTopic) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setQuizState('topic-select')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Topics
        </Button>
        
        <div className="text-center mb-8">
          <span className="text-4xl mb-2 block">{selectedTopic.icon}</span>
          <h2 className="text-2xl font-bold">{getText(selectedTopic.name)}</h2>
          <p className="text-muted-foreground">Select a difficulty level</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {selectedTopic.levels.map((level, idx) => {
            const unlocked = isLevelUnlocked(selectedTopic, idx);
            const progress = userProgress.topics[selectedTopic.id]?.[level.id];
            
            return (
              <Card 
                key={level.id}
                className={`p-6 ${unlocked ? 'cursor-pointer hover:shadow-lg hover:border-primary' : 'opacity-60'} border-2 transition-all`}
                onClick={() => {
                  if (unlocked) {
                    setSelectedLevel(level);
                    setQuizState('mode-select');
                  }
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={level.difficulty === 'beginner' ? 'secondary' : level.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                    {getText(level.name)}
                  </Badge>
                  {unlocked ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                
                <h3 className="font-semibold mb-2">{getText(level.description)}</h3>
                <p className="text-sm text-muted-foreground mb-4">{level.questions.length} questions</p>
                
                {progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Best Score</span>
                      <span className="font-bold">{progress.bestScore}%</span>
                    </div>
                    {progress.completed && (
                      <Badge variant="outline" className="w-full justify-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                  </div>
                )}
                
                {!unlocked && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Score {selectedTopic.levels[idx - 1]?.requiredScore}% on previous level to unlock
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Render mode selection
  if (quizState === 'mode-select' && selectedLevel) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => setQuizState('level-select')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Levels
        </Button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Choose Your Mode</h2>
          <p className="text-muted-foreground">{getText(selectedLevel.name)} - {selectedLevel.questions.length} questions</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className={`p-6 cursor-pointer hover:shadow-lg border-2 transition-all ${quizMode === 'learning' ? 'border-primary bg-primary/5' : ''}`}
            onClick={() => setQuizMode('learning')}
          >
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-bold text-center mb-2">Learning Mode</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Instant feedback after each question</li>
              <li>✓ Detailed explanations</li>
              <li>✓ No time limit</li>
              <li>✓ Perfect for understanding concepts</li>
            </ul>
          </Card>
          
          <Card 
            className={`p-6 cursor-pointer hover:shadow-lg border-2 transition-all ${quizMode === 'test' ? 'border-primary bg-primary/5' : ''}`}
            onClick={() => setQuizMode('test')}
          >
            <Timer className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h3 className="text-xl font-bold text-center mb-2">Test Mode</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Timed challenge</li>
              <li>✓ Results at the end</li>
              <li>✓ Test your knowledge</li>
              <li>✓ Review after completion</li>
            </ul>
          </Card>
        </div>
        
        <Button onClick={startQuiz} size="lg" className="w-full">
          <Zap className="h-5 w-5 mr-2" /> Start Quiz
        </Button>
      </div>
    );
  }

  // Render quiz
  if (quizState === 'quiz' && selectedLevel) {
    const questions = getCurrentQuestions();
    const question = questions[currentQuestion];
    const answered = selectedAnswers[currentQuestion] !== null;
    
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Q {currentQuestion + 1}/{questions.length}</Badge>
            <Badge>{question.difficulty}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="font-bold">{score} pts</span>
            </div>
            {quizMode === 'test' && (
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span className={timeLeft < 30 ? 'text-red-500 font-bold' : ''}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
        </div>
        
        <Progress value={(currentQuestion / questions.length) * 100} />
        
        {/* Question */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <Brain className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <h3 className="text-xl font-semibold">{getText(question.question)}</h3>
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            {question.options?.map((option, idx) => {
              const isSelected = Array.isArray(selectedAnswers[currentQuestion])
                ? (selectedAnswers[currentQuestion] as number[]).includes(idx)
                : selectedAnswers[currentQuestion] === idx;
              const correctAns = question.correctAnswer;
              const isCorrect = Array.isArray(correctAns)
                ? (correctAns as number[]).includes(idx)
                : correctAns === idx;
              const showResult = answered && quizMode === 'learning';
              
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (answered && quizMode === 'learning') return;
                    if (question.type === 'mcq-multiple') {
                      const current = (selectedAnswers[currentQuestion] as number[]) || [];
                      const newSelection = current.includes(idx)
                        ? current.filter(i => i !== idx)
                        : [...current, idx];
                      handleAnswer(newSelection);
                    } else {
                      handleAnswer(idx);
                    }
                  }}
                  disabled={answered && quizMode === 'learning'}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : isSelected
                          ? 'border-red-500 bg-red-50 dark:bg-red-950'
                          : 'border-muted'
                      : isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{getText(option)}</span>
                    {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 ml-auto" />}
                  </div>
                </button>
              );
            })}
          </div>
          
          {question.type === 'mcq-multiple' && (
            <p className="text-sm text-muted-foreground mt-2">Select all that apply</p>
          )}
        </Card>
        
        {/* Explanation (Learning Mode) */}
        {showExplanation && quizMode === 'learning' && (
          <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Explanation</h4>
                <p className="text-sm">{getText(question.explanation)}</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="ghost" onClick={resetQuiz}>
            <RotateCcw className="h-4 w-4 mr-2" /> Quit
          </Button>
          
          {(answered || quizMode === 'test') && (
            <Button onClick={nextQuestion}>
              {currentQuestion + 1 < questions.length ? (
                <>Next <ArrowRight className="h-4 w-4 ml-2" /></>
              ) : (
                <>Finish <Award className="h-4 w-4 ml-2" /></>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Render result
  if (quizState === 'result' && selectedLevel) {
    const questions = getCurrentQuestions();
    const correctCount = questions.length - wrongQuestions.length;
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= selectedLevel.requiredScore;
    
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Card className="p-8 text-center">
          {passed ? (
            <Trophy className="h-20 w-20 mx-auto mb-4 text-yellow-500" />
          ) : (
            <Target className="h-20 w-20 mx-auto mb-4 text-orange-500" />
          )}
          
          <h2 className="text-3xl font-bold mb-2">
            {passed ? "Congratulations! 🎉" : "Keep Learning! 📚"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed ? "You've passed this level!" : `You need ${selectedLevel.requiredScore}% to pass`}
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-green-500">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{correctCount}/{questions.length}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={resetQuiz} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Topics
            </Button>
            {wrongQuestions.length > 0 && (
              <Button onClick={retryWrongQuestions} variant="secondary">
                <RotateCcw className="h-4 w-4 mr-2" /> Retry Wrong ({wrongQuestions.length})
              </Button>
            )}
            <Button onClick={startQuiz}>
              <Zap className="h-4 w-4 mr-2" /> Try Again
            </Button>
          </div>
        </Card>
        
        {/* Review Section */}
        {wrongQuestions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Review Incorrect Answers
            </h3>
            <div className="space-y-4">
              {wrongQuestions.slice(0, 5).map((qIdx) => {
                const q = selectedLevel.questions[qIdx];
                return (
                  <div key={qIdx} className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="font-medium mb-2">{getText(q.question)}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ Correct: {typeof q.correctAnswer === 'number' && q.options?.[q.correctAnswer] ? getText(q.options[q.correctAnswer]) : 'Multiple answers'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{getText(q.explanation)}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return null;
};
