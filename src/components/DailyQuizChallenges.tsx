import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Flame, CheckCircle2, Gift, Sparkles, Calendar, Trophy
} from "lucide-react";
import {
  getTodaysChallenges, DailyQuizChallenge, UserQuizProgress, getTodayString
} from "@/lib/advancedQuizData";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface DailyQuizChallengesProps {
  userProgress: UserQuizProgress;
  onClaimReward: (challengeId: string, reward: number) => void;
}

export const DailyQuizChallenges = ({ userProgress, onClaimReward }: DailyQuizChallengesProps) => {
  const todaysChallenges = getTodaysChallenges();
  const daily = userProgress.dailyProgress;
  const isToday = daily.date === getTodayString();

  const getChallengeProgress = (challenge: DailyQuizChallenge): number => {
    if (!isToday) return 0;
    switch (challenge.type) {
      case 'complete_quiz':
        return Math.min(daily.quizzesCompleted, challenge.target);
      case 'perfect_score':
        return Math.min(daily.perfectScores, challenge.target);
      case 'complete_topic':
        return Math.min(daily.topicsAttempted.length, challenge.target);
      case 'streak':
        return userProgress.quizStreak >= 1 ? 1 : 0;
      case 'speed_run':
        return Math.min(daily.quizzesCompleted, challenge.target);
      default:
        return 0;
    }
  };

  const isChallengeCompleted = (challengeId: string): boolean => {
    return isToday && daily.challengesCompleted.includes(challengeId);
  };

  const handleClaim = (challenge: DailyQuizChallenge) => {
    if (isChallengeCompleted(challenge.id)) return;
    const progress = getChallengeProgress(challenge);
    if (progress < challenge.target) return;

    onClaimReward(challenge.id, challenge.reward);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    toast.success(`🎉 +${challenge.reward} seed points earned!`);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Daily Quiz Challenges</h3>
            <p className="text-sm text-muted-foreground">Complete for bonus rewards!</p>
          </div>
        </div>

        {/* Streak display */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <Flame className="h-5 w-5 text-orange-500" />
          <div className="text-center">
            <p className="text-lg font-bold leading-none">{userProgress.quizStreak}</p>
            <p className="text-[10px] text-muted-foreground">Day Streak</p>
          </div>
          {userProgress.longestStreak > 0 && (
            <>
              <div className="w-px h-6 bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold leading-none text-yellow-600">{userProgress.longestStreak}</p>
                <p className="text-[10px] text-muted-foreground">Best</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {todaysChallenges.map((challenge) => {
          const progress = getChallengeProgress(challenge);
          const completed = isChallengeCompleted(challenge.id);
          const canClaim = progress >= challenge.target && !completed;
          const progressPercent = Math.min((progress / challenge.target) * 100, 100);

          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                completed
                  ? 'bg-green-500/5 border-green-500/30'
                  : canClaim
                    ? 'bg-yellow-500/5 border-yellow-500/30'
                    : 'bg-card border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold">{challenge.title}</h4>
                      {completed && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{progress}/{challenge.target}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
                    <Gift className="h-3 w-3 mr-1" />
                    +{challenge.reward} 🌱
                  </Badge>

                  {canClaim && (
                    <Button size="sm" onClick={() => handleClaim(challenge)} className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Claim
                    </Button>
                  )}

                  {completed && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
                      Claimed ✓
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Streak milestones */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4" /> Streak Milestones
        </h4>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[3, 7, 14, 30].map((target) => {
            const achieved = userProgress.longestStreak >= target;
            return (
              <div
                key={target}
                className={`flex-shrink-0 px-4 py-3 rounded-lg text-center min-w-[80px] ${
                  achieved
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                    : 'bg-muted/30 border border-dashed border-muted-foreground/20 opacity-50'
                }`}
              >
                <p className="text-lg font-bold">{target}</p>
                <p className="text-[10px] text-muted-foreground">days</p>
                {achieved && <span className="text-xs">✅</span>}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
