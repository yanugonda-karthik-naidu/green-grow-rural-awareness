import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface NotificationSystemProps {
  userId?: string;
  currentRank?: number;
  previousRank?: number;
  challengeStreak?: number;
  newBadge?: string;
  seedsEarned?: number;
}

export const useNotifications = () => {
  const lastRankRef = useRef<number | null>(null);
  const lastStreakRef = useRef<number>(0);

  const notifyLeaderboardPosition = (rank: number, isImprovement: boolean) => {
    if (rank <= 3) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4']
      });
      
      const messages = {
        1: '🥇 You reached #1 on the leaderboard! Amazing!',
        2: '🥈 You reached #2 on the leaderboard! Outstanding!',
        3: '🥉 You reached #3 on the leaderboard! Great job!'
      };
      
      toast.success(messages[rank as keyof typeof messages], {
        duration: 5000,
        icon: '🏆'
      });
    } else if (rank <= 10 && isImprovement) {
      toast.success(`📈 You moved up to #${rank} on the leaderboard!`, {
        duration: 4000,
        icon: '🌟'
      });
    }
  };

  const notifyChallengeStreak = (streak: number) => {
    if (streak > lastStreakRef.current && streak >= 3) {
      const milestones = [3, 5, 7, 10, 14, 21, 30];
      
      if (milestones.includes(streak)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
        });
        
        toast.success(`🔥 ${streak}-day challenge streak! Keep it going!`, {
          duration: 5000,
          icon: '🔥'
        });
      }
    }
    lastStreakRef.current = streak;
  };

  const notifyBadgeEarned = (badgeName: string) => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#9333EA', '#A855F7', '#C084FC', '#E9D5FF']
    });
    
    toast.success(`🏅 New badge earned: ${badgeName}!`, {
      duration: 5000,
      icon: '🎖️'
    });
  };

  const notifyRewardPurchase = (itemName: string, cost: number) => {
    toast.success(`🎁 Purchased: ${itemName} for ${cost} seeds!`, {
      duration: 4000,
      icon: '✨'
    });
  };

  const notifySeedsEarned = (amount: number, source: string) => {
    if (amount >= 50) {
      toast.success(`🌱 Earned ${amount} seeds from ${source}!`, {
        duration: 3000,
        icon: '💰'
      });
    }
  };

  return {
    notifyLeaderboardPosition,
    notifyChallengeStreak,
    notifyBadgeEarned,
    notifyRewardPurchase,
    notifySeedsEarned
  };
};
