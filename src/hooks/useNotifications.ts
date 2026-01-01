import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = async (title: string, message: string, type: string = 'achievement') => {
    if (!userId) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        title,
        message,
        notification_type: type
      });

    if (!error) {
      const newNotification: Notification = {
        id: crypto.randomUUID(),
        user_id: userId,
        title,
        message,
        notification_type: type,
        is_read: false,
        created_at: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }

    return { error };
  };

  const markAsRead = async (notificationId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  // Check for leaderboard position achievements
  const checkLeaderboardAchievement = async (rank: number, category: string) => {
    if (!userId || rank > 10) return;

    const titles: Record<number, string> = {
      1: '🥇 You reached #1!',
      2: '🥈 You reached #2!',
      3: '🥉 You reached #3!',
    };

    const title = titles[rank] || `🏆 Top 10 Achievement!`;
    const message = rank <= 3 
      ? `Congratulations! You're now #${rank} on the ${category} leaderboard!`
      : `You've reached position #${rank} on the ${category} leaderboard. Keep going!`;

    await addNotification(title, message, 'leaderboard');
  };

  // Check for streak achievements
  const checkStreakAchievement = async (streakCount: number) => {
    if (!userId) return;

    const milestones = [3, 7, 14, 30, 50, 100];
    if (milestones.includes(streakCount)) {
      const title = `🔥 ${streakCount}-Day Streak!`;
      const message = `Amazing! You've completed challenges for ${streakCount} days in a row!`;
      await addNotification(title, message, 'streak');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    checkLeaderboardAchievement,
    checkStreakAchievement,
    refetch: fetchNotifications
  };
};
