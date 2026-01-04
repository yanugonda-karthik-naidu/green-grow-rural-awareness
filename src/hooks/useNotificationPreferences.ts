import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SoundType } from '@/lib/notificationSounds';

export interface NotificationPreferences {
  sound_enabled: boolean;
  sound_type: SoundType;
  achievements_enabled: boolean;
  leaderboard_enabled: boolean;
  challenges_enabled: boolean;
  streak_enabled: boolean;
  community_enabled: boolean;
  browser_notifications_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

const defaultPreferences: NotificationPreferences = {
  sound_enabled: true,
  sound_type: 'chime',
  achievements_enabled: true,
  leaderboard_enabled: true,
  challenges_enabled: true,
  streak_enabled: true,
  community_enabled: true,
  browser_notifications_enabled: true,
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '07:00',
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
          sound_type: (data.sound_type as SoundType) ?? 'chime',
          achievements_enabled: data.achievements_enabled ?? true,
          leaderboard_enabled: data.leaderboard_enabled ?? true,
          challenges_enabled: data.challenges_enabled ?? true,
          streak_enabled: data.streak_enabled ?? true,
          community_enabled: data.community_enabled ?? true,
          browser_notifications_enabled: data.browser_notifications_enabled ?? true,
          quiet_hours_enabled: data.quiet_hours_enabled ?? false,
          quiet_hours_start: data.quiet_hours_start ?? '22:00',
          quiet_hours_end: data.quiet_hours_end ?? '07:00',
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

  const updatePreference = async <K extends keyof NotificationPreferences>(
    key: K, 
    value: NotificationPreferences[K]
  ) => {
    if (!userId) return;

    const previousValue = preferences[key];
    
    // Optimistic update
    setPreferences(prev => ({ ...prev, [key]: value }));

    const { error } = await supabase
      .from('notification_preferences')
      .update({ [key]: value })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating preference:', error);
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: previousValue }));
    }
  };

  const isInQuietHours = (): boolean => {
    if (!preferences.quiet_hours_enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = preferences.quiet_hours_start.split(':').map(Number);
    const [endHour, endMin] = preferences.quiet_hours_end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Handle overnight quiet hours (e.g., 22:00 - 07:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime;
    }
    
    return currentTime >= startTime && currentTime < endTime;
  };

  const shouldNotify = (type: string): boolean => {
    // Check quiet hours first
    if (isInQuietHours()) return false;

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
    isInQuietHours,
    refetch: fetchPreferences,
  };
};
