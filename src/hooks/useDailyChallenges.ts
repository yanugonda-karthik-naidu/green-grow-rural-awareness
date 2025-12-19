import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DailyChallenge {
  id: string;
  title: string;
  description: string | null;
  challenge_type: string;
  seed_reward: number;
  target_value: number;
  metric: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface ChallengeCompletion {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  seeds_earned: number;
}

export const useDailyChallenges = (userId: string | undefined) => {
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [weeklyChallenges, setWeeklyChallenges] = useState<DailyChallenge[]>([]);
  const [completions, setCompletions] = useState<ChallengeCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = useCallback(async () => {
    try {
      // Fetch active challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('is_active', true)
        .gt('end_date', new Date().toISOString());

      if (challengesError) throw challengesError;

      const daily = challenges?.filter(c => c.challenge_type === 'daily') || [];
      const weekly = challenges?.filter(c => c.challenge_type === 'weekly') || [];
      
      setDailyChallenges(daily);
      setWeeklyChallenges(weekly);

      // Fetch user completions if logged in
      if (userId) {
        const { data: userCompletions } = await supabase
          .from('user_challenge_completions')
          .select('*')
          .eq('user_id', userId);

        setCompletions(userCompletions || []);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const completeChallenge = async (challengeId: string, seedsEarned: number) => {
    if (!userId) return { error: 'Not authenticated' };

    // Check if already completed
    const alreadyCompleted = completions.some(c => c.challenge_id === challengeId);
    if (alreadyCompleted) return { error: 'Already completed' };

    const { error } = await supabase
      .from('user_challenge_completions')
      .insert({
        user_id: userId,
        challenge_id: challengeId,
        seeds_earned: seedsEarned
      });

    if (!error) {
      // Update local state
      setCompletions(prev => [...prev, {
        id: crypto.randomUUID(),
        user_id: userId,
        challenge_id: challengeId,
        completed_at: new Date().toISOString(),
        seeds_earned: seedsEarned
      }]);
    }

    return { error };
  };

  const isCompleted = (challengeId: string) => {
    return completions.some(c => c.challenge_id === challengeId);
  };

  return {
    dailyChallenges,
    weeklyChallenges,
    completions,
    loading,
    completeChallenge,
    isCompleted,
    refetch: fetchChallenges
  };
};
