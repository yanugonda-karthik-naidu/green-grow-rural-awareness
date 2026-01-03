import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NotificationPreferences {
  sound_enabled: boolean;
  achievements_enabled: boolean;
  leaderboard_enabled: boolean;
  challenges_enabled: boolean;
  streak_enabled: boolean;
  community_enabled: boolean;
  browser_notifications_enabled: boolean;
}

const defaultPreferences: NotificationPreferences = {
  sound_enabled: true,
  achievements_enabled: true,
  leaderboard_enabled: true,
  challenges_enabled: true,
  streak_enabled: true,
  community_enabled: true,
  browser_notifications_enabled: true,
};

export const useNotificationPreferences = (userId: string | undefined) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences({
          sound_enabled: data.sound_enabled ?? true,
          achievements_enabled: data.achievements_enabled ?? true,
          leaderboard_enabled: data.leaderboard_enabled ?? true,
          challenges_enabled: data.challenges_enabled ?? true,
          streak_enabled: data.streak_enabled ?? true,
          community_enabled: data.community_enabled ?? true,
          browser_notifications_enabled: data.browser_notifications_enabled ?? true,
        });
      } else {
        // Create default preferences for new users
        await supabase.from('notification_preferences').insert({
          user_id: userId,
          ...defaultPreferences,
        });
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!userId) return;

    // Optimistic update
    setPreferences(prev => ({ ...prev, [key]: value }));

    const { error } = await supabase
      .from('notification_preferences')
      .update({ [key]: value })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating preference:', error);
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !value }));
    }
  };

  const shouldNotify = (type: string): boolean => {
    switch (type) {
      case 'achievement':
        return preferences.achievements_enabled;
      case 'leaderboard':
        return preferences.leaderboard_enabled;
      case 'challenge':
        return preferences.challenges_enabled;
      case 'streak':
        return preferences.streak_enabled;
      case 'community':
        return preferences.community_enabled;
      default:
        return true;
    }
  };

  return {
    preferences,
    loading,
    updatePreference,
    shouldNotify,
    refetch: fetchPreferences,
  };
};
