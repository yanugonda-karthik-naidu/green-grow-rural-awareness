import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Clock, CheckCircle2, Flame, Calendar, 
  TreeDeciduous, Gamepad2, Brain, Gift, Sparkles 
} from 'lucide-react';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface DailyChallengesProps {
  userId?: string;
  userStats: {
    treesToday: number;
    quizScoreToday: number;
    gamesPlayedToday: number;
    treesThisWeek: number;
    quizzesThisWeek: number;
  };
  onClaimReward: (seeds: number) => Promise<void>;
}

export const DailyChallenges = ({ userId, userStats, onClaimReward }: DailyChallengesProps) => {
  const { dailyChallenges, weeklyChallenges, isCompleted, completeChallenge, loading } = useDailyChallenges(userId);
  const [claiming, setClaiming] = useState<string | null>(null);

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'trees': return <TreeDeciduous className="h-4 w-4" />;
      case 'quiz_score': return <Brain className="h-4 w-4" />;
      case 'games_played': return <Gamepad2 className="h-4 w-4" />;
      case 'quizzes_completed': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCurrentProgress = (metric: string, targetValue: number): number => {
    switch (metric) {
      case 'trees': return Math.min(userStats.treesToday, targetValue);
      case 'quiz_score': return Math.min(userStats.quizScoreToday, targetValue);
      case 'games_played': return Math.min(userStats.gamesPlayedToday, targetValue);
      case 'quizzes_completed': return Math.min(userStats.quizzesThisWeek, targetValue);
      default: return 0;
    }
  };

  const getWeeklyProgress = (metric: string, targetValue: number): number => {
    switch (metric) {
      case 'trees': return Math.min(userStats.treesThisWeek, targetValue);
      case 'quizzes_completed': return Math.min(userStats.quizzesThisWeek, targetValue);
      default: return 0;
    }
  };

  const handleClaimReward = async (challengeId: string, seedReward: number) => {
    if (!userId) {
      toast.error('Please log in to claim rewards');
      return;
    }

    setClaiming(challengeId);
    try {
      const { error } = await completeChallenge(challengeId, seedReward);
      if (error) {
        toast.error(error === 'Already completed' ? 'Already claimed!' : 'Failed to claim reward');
        return;
      }

      await onClaimReward(seedReward);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      toast.success(`🎉 Claimed ${seedReward} seed points!`);
    } catch (error) {
      toast.error('Failed to claim reward');
    } finally {
      setClaiming(null);
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h left`;
    return `${hours}h left`;
  };

  const ChallengeCard = ({ 
    challenge, 
    isWeekly = false 
  }: { 
    challenge: any;
    isWeekly?: boolean;
  }) => {
    const completed = isCompleted(challenge.id);
    const currentProgress = isWeekly 
      ? getWeeklyProgress(challenge.metric, challenge.target_value)
      : getCurrentProgress(challenge.metric, challenge.target_value);
    const progressPercent = Math.min((currentProgress / challenge.target_value) * 100, 100);
    const canClaim = currentProgress >= challenge.target_value && !completed;

    return (
      <Card className={`p-4 transition-all ${
        completed 
          ? 'bg-green-500/10 border-green-500/30' 
          : canClaim 
            ? 'bg-yellow-500/10 border-yellow-500/30 animate-pulse-soft'
            : 'bg-card hover:bg-accent/30'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${
              completed 
                ? 'bg-green-500/20' 
                : isWeekly 
                  ? 'bg-purple-500/20' 
                  : 'bg-primary/20'
            }`}>
              {completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                getMetricIcon(challenge.metric)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                <Badge variant={isWeekly ? 'secondary' : 'outline'} className="text-xs">
                  {isWeekly ? <Calendar className="h-3 w-3 mr-1" /> : <Flame className="h-3 w-3 mr-1" />}
                  {isWeekly ? 'Weekly' : 'Daily'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {currentProgress} / {challenge.target_value}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {getTimeRemaining(challenge.end_date)}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
              <Gift className="h-3 w-3 mr-1" />
              +{challenge.seed_reward} 🌱
            </Badge>
            
            {canClaim && (
              <Button 
                size="sm" 
                onClick={() => handleClaimReward(challenge.id, challenge.seed_reward)}
                disabled={claiming === challenge.id}
                className="gap-1"
              >
                <Sparkles className="h-3 w-3" />
                {claiming === challenge.id ? 'Claiming...' : 'Claim'}
              </Button>
            )}
            
            {completed && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Claimed
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse text-muted-foreground">Loading challenges...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-secondary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full">
          <Flame className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Daily & Weekly Challenges</h2>
          <p className="text-sm text-muted-foreground">Complete challenges to earn bonus seeds!</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Daily Challenges */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Today's Challenges
          </h3>
          <div className="space-y-3">
            {dailyChallenges.length > 0 ? (
              dailyChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No daily challenges available</p>
            )}
          </div>
        </div>

        {/* Weekly Challenges */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            This Week's Challenges
          </h3>
          <div className="space-y-3">
            {weeklyChallenges.length > 0 ? (
              weeklyChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} isWeekly />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No weekly challenges available</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
