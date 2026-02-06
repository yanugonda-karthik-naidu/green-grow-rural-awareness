import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock } from "lucide-react";
import { quizBadges, UserQuizProgress } from "@/lib/advancedQuizData";

interface QuizBadgesProps {
  userProgress: UserQuizProgress;
}

export const QuizBadges = ({ userProgress }: QuizBadgesProps) => {
  const earned = quizBadges.filter(b => userProgress.earnedBadges.includes(b.id));
  const locked = quizBadges.filter(b => !userProgress.earnedBadges.includes(b.id));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full">
          <Award className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Quiz Badges</h3>
          <p className="text-sm text-muted-foreground">
            {earned.length} of {quizBadges.length} earned
          </p>
        </div>
      </div>

      {/* Earned badges */}
      {earned.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            ✨ Earned
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {earned.map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-center hover:scale-105 transition-transform"
              >
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <h5 className="font-semibold text-sm">{badge.name}</h5>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            🔒 To Unlock ({locked.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {locked.map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-xl bg-muted/30 border border-dashed border-muted-foreground/20 text-center opacity-60"
              >
                <div className="relative inline-block">
                  <span className="text-3xl block mb-2 grayscale">{badge.icon}</span>
                  <Lock className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-muted-foreground" />
                </div>
                <h5 className="font-semibold text-sm text-muted-foreground">{badge.name}</h5>
                <p className="text-xs text-muted-foreground/70 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
