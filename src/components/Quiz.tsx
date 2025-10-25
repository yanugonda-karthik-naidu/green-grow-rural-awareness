import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface QuizProps {
  language: string;
  t: any;
  onQuizComplete: (score: number) => void;
}

export const Quiz = ({ language, t, onQuizComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = [
    {
      question: {
        en: "Trees produce oxygen during the day",
        te: "చెట్లు పగటి పూట ఆక్సిజన్ ఉత్పత్తి చేస్తాయి",
        hi: "पेड़ दिन में ऑक्सीजन पैदा करते हैं"
      },
      options: [
        { en: "True", te: "నిజం", hi: "सच" },
        { en: "False", te: "అబద్ధం", hi: "झूठ" }
      ],
      correct: 0
    },
    {
      question: {
        en: "Which tree is known as the 'Tree of Life'?",
        te: "'జీవిత వృక్షం' గా ఏ చెట్టు పిలువబడుతుంది?",
        hi: "किस पेड़ को 'जीवन का वृक्ष' कहा जाता है?"
      },
      options: [
        { en: "Neem", te: "వేప", hi: "नीम" },
        { en: "Coconut", te: "కొబ్బరి", hi: "नारियल" },
        { en: "Mango", te: "మామిడి", hi: "आम" }
      ],
      correct: 1
    },
    {
      question: {
        en: "One tree can absorb how much CO₂ per year?",
        te: "ఒక చెట్టు సంవత్సరానికి ఎంత CO₂ గ్రహిస్తుంది?",
        hi: "एक पेड़ प्रति वर्ष कितना CO₂ अवशोषित कर सकता है?"
      },
      options: [
        { en: "5 kg", te: "5 కిలోలు", hi: "5 किलो" },
        { en: "25 kg", te: "25 కిలోలు", hi: "25 किलो" },
        { en: "50 kg", te: "50 కిలోలు", hi: "50 किलो" }
      ],
      correct: 1
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success("✅ Correct!");
    } else {
      toast.error("❌ Wrong answer");
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        onQuizComplete(score + (isCorrect ? 1 : 0));
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
      <Card className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">Quiz Complete! 🎉</h2>
        <p className="text-5xl font-bold my-8 text-accent">
          {score} / {questions.length}
        </p>
        <p className="text-xl mb-6 text-muted-foreground">
          {score === questions.length ? "Perfect Score! 🌟" : 
           score >= questions.length / 2 ? "Great Job! 🌱" : "Keep Learning! 📚"}
        </p>
        <Button onClick={resetQuiz} size="lg">
          Try Again
        </Button>
      </Card>
    );
  }

  const q = questions[currentQuestion];
  const questionText = language === 'en' ? q.question.en : language === 'te' ? q.question.te : q.question.hi;

  return (
    <Card className="p-8">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded ${
                idx <= currentQuestion ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-foreground">{questionText}</h3>

      <div className="space-y-3">
        {q.options.map((option, idx) => {
          const optionText = language === 'en' ? option.en : language === 'te' ? option.te : option.hi;
          const isSelected = selectedAnswer === idx;
          const isCorrect = idx === q.correct;
          
          let buttonClass = "";
          if (isSelected) {
            buttonClass = isCorrect 
              ? "border-secondary bg-secondary/10" 
              : "border-destructive bg-destructive/10";
          }

          return (
            <Button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              variant="outline"
              className={`w-full justify-start text-left h-auto py-4 text-lg ${buttonClass}`}
            >
              {isSelected && (
                isCorrect ? (
                  <CheckCircle2 className="mr-2 h-5 w-5 text-secondary" />
                ) : (
                  <XCircle className="mr-2 h-5 w-5 text-destructive" />
                )
              )}
              {optionText}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
