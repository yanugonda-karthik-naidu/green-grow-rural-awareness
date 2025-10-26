import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Trophy, Medal, Award } from "lucide-react";
import { toast } from "sonner";

interface QuizProps {
  language: string;
  t: any;
  onQuizComplete: (score: number) => void;
}

const leaderboardData = [
  { name: "Ravi Kumar", score: 28, trees: 15 },
  { name: "Priya Sharma", score: 25, trees: 12 },
  { name: "Amit Patel", score: 22, trees: 10 },
  { name: "Anjali Singh", score: 20, trees: 9 },
  { name: "Rahul Verma", score: 18, trees: 8 }
];

export const Quiz = ({ language, t, onQuizComplete }: QuizProps) => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = {
    easy: [
      {
        question: { en: "Trees produce oxygen during the day", te: "చెట్లు పగటి పూట ఆక్సిజన్ ఉత్పత్తి చేస్తాయి", hi: "पेड़ दिन में ऑक्सीजन पैदा करते हैं" },
        options: [{ en: "True", te: "నిజం", hi: "सच" }, { en: "False", te: "అబద్ధం", hi: "झूठ" }],
        correct: 0
      },
      {
        question: { en: "Which tree is known as 'Tree of Life'?", te: "'జీవిత వృక్షం' గా ఏ చెట్టు పిలువబడుతుంది?", hi: "किस पेड़ को 'जीवन का वृक्ष' कहा जाता है?" },
        options: [{ en: "Neem", te: "వేప", hi: "नीम" }, { en: "Coconut", te: "కొబ్బరి", hi: "नारियल" }, { en: "Mango", te: "మామిడి", hi: "आम" }],
        correct: 1
      },
      {
        question: { en: "Trees help reduce air pollution", te: "చెట్లు వాయు కాలుష్యాన్ని తగ్గించడంలో సహాయపడతాయి", hi: "पेड़ वायु प्रदूषण कम करने में मदद करते हैं" },
        options: [{ en: "True", te: "నిజం", hi: "सच" }, { en: "False", te: "అబద్ధం", hi: "झूठ" }],
        correct: 0
      }
    ],
    medium: [
      {
        question: { en: "One tree can absorb how much CO₂ per year?", te: "ఒక చెట్టు సంవత్సరానికి ఎంత CO₂ గ్రహిస్తుంది?", hi: "एक पेड़ प्रति वर्ष कितना CO₂ अवशोषित कर सकता है?" },
        options: [{ en: "5 kg", te: "5 కిలోలు", hi: "5 किलो" }, { en: "25 kg", te: "25 కిలోలు", hi: "25 किलो" }, { en: "50 kg", te: "50 కిలోలు", hi: "50 किलो" }],
        correct: 1
      },
      {
        question: { en: "Which tree produces oxygen even at night?", te: "రాత్రి కూడా ఆక్సిజన్ ఉత్పత్తి చేసే చెట్టు ఏది?", hi: "कौन सा पेड़ रात में भी ऑक्सीजन पैदा करता है?" },
        options: [{ en: "Mango", te: "మామిడి", hi: "आम" }, { en: "Peepal", te: "రావి", hi: "पीपल" }, { en: "Neem", te: "వేప", hi: "नीम" }],
        correct: 1
      },
      {
        question: { en: "Best time to plant trees in India?", te: "భారతదేశంలో చెట్లు నాటడానికి ఉత్తమ సమయం?", hi: "भारत में पेड़ लगाने का सर्वोत्तम समय?" },
        options: [{ en: "Summer", te: "వేసవి", hi: "गर्मी" }, { en: "Monsoon", te: "రుతుకాలం", hi: "मानसून" }, { en: "Winter", te: "చలి", hi: "सर्दी" }],
        correct: 1
      }
    ],
    hard: [
      {
        question: { en: "How much oxygen does a mature tree produce daily?", te: "పరిపక్వ చెట్టు రోజూ ఎంత ఆక్సిజన్ ఉత్పత్తి చేస్తుంది?", hi: "एक परिपक्व पेड़ प्रतिदिन कितनी ऑक्सीजन पैदा करता है?" },
        options: [{ en: "50 liters", te: "50 లీటర్లు", hi: "50 लीटर" }, { en: "120 liters", te: "120 లీటర్లు", hi: "120 लीटर" }, { en: "260 liters", te: "260 లీటర్లు", hi: "260 लीटर" }],
        correct: 2
      },
      {
        question: { en: "Trees can increase rainfall in their region by:", te: "చెట్లు వారి ప్రాంతంలో వర్షపాతాన్ని ఎంత పెంచగలవు:", hi: "पेड़ अपने क्षेत्र में वर्षा को बढ़ा सकते हैं:" },
        options: [{ en: "5-10%", te: "5-10%", hi: "5-10%" }, { en: "20-30%", te: "20-30%", hi: "20-30%" }, { en: "50-60%", te: "50-60%", hi: "50-60%" }],
        correct: 1
      },
      {
        question: { en: "A single oak tree can support how many species?", te: "ఒక ఓక్ చెట్టు ఎన్ని జాతులకు మద్దతు ఇవ్వగలదు?", hi: "एक ओक का पेड़ कितनी प्रजातियों का समर्थन कर सकता है?" },
        options: [{ en: "100", te: "100", hi: "100" }, { en: "300", te: "300", hi: "300" }, { en: "500+", te: "500+", hi: "500+" }],
        correct: 2
      }
    ]
  };

  const currentQuestions = questions[difficulty];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + (difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15));
      toast.success("✅ Correct!");
    } else {
      toast.error("❌ Wrong answer");
    }

    setTimeout(() => {
      if (currentQuestion + 1 < currentQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        onQuizComplete(score + (isCorrect ? (difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15) : 0));
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <Tabs defaultValue="result" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="result">Result</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="result">
          <Card className="p-8 text-center">
            <Trophy className="h-20 w-20 mx-auto mb-4 text-yellow-500 animate-bounce" />
            <h2 className="text-3xl font-bold mb-4 text-primary">Quiz Complete!</h2>
            <p className="text-6xl font-bold my-8 text-accent">{score}</p>
            <p className="text-xl mb-6 text-muted-foreground">
              {score >= 40 ? "🏆 Outstanding!" : score >= 25 ? "🌟 Great Job!" : "🌱 Keep Learning!"}
            </p>
            <Button onClick={resetQuiz} size="lg">Try Again</Button>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-6 text-primary text-center">Top Eco Warriors</h3>
            <div className="space-y-3">
              {leaderboardData.map((player, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  {idx === 0 ? <Trophy className="h-6 w-6 text-yellow-500" /> :
                   idx === 1 ? <Medal className="h-6 w-6 text-gray-400" /> :
                   idx === 2 ? <Award className="h-6 w-6 text-amber-600" /> :
                   <span className="w-6 text-center font-bold text-muted-foreground">{idx + 1}</span>}
                  <div className="flex-1">
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.trees} trees planted</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{player.score}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  const q = currentQuestions[currentQuestion];
  const questionText = language === 'en' ? q.question.en : language === 'te' ? q.question.te : q.question.hi;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-3xl font-bold mb-4 text-primary text-center">{t.quiz}</h2>
        <p className="text-center text-muted-foreground mb-4">Test your knowledge about trees and nature!</p>
        
        <Tabs value={difficulty} onValueChange={(v) => { setDifficulty(v as any); resetQuiz(); }}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="easy">🌱 Easy</TabsTrigger>
            <TabsTrigger value="medium">🌿 Medium</TabsTrigger>
            <TabsTrigger value="hard">🌳 Hard</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      <Card className="p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Question {currentQuestion + 1} of {currentQuestions.length}
            </p>
            <p className="text-lg font-bold text-primary">Score: {score}</p>
          </div>
          <div className="flex gap-1">
            {currentQuestions.map((_, idx) => (
              <div key={idx} className={`h-2 flex-1 rounded ${idx <= currentQuestion ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6 text-foreground">{questionText}</h3>

        <div className="space-y-3">
          {q.options.map((option, idx) => {
            const optionText = language === 'en' ? option.en : language === 'te' ? option.te : option.hi;
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === q.correct;
            
            return (
              <Button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                variant="outline"
                className={`w-full justify-start text-left h-auto py-4 text-lg ${
                  isSelected ? (isCorrect ? 'border-secondary bg-secondary/10' : 'border-destructive bg-destructive/10') : ''
                }`}
              >
                {isSelected && (isCorrect ? <CheckCircle2 className="mr-2 h-5 w-5 text-secondary" /> : <XCircle className="mr-2 h-5 w-5 text-destructive" />)}
                {optionText}
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
