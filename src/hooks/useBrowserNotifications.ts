import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SoundType, playNotificationSound } from '@/lib/notificationSounds';

interface UseBrowserNotificationsOptions {
  soundEnabled?: boolean;
  soundType?: SoundType;
  onNotificationReceived?: (notification: { title: string; message: string; notification_type: string }) => void;
}

export const useBrowserNotifications = (
  userId: string | undefined, 
  options: UseBrowserNotificationsOptions = {}
) => {
  const { soundEnabled = true, soundType = 'chime', onNotificationReceived } = options;
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    const supported = 'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const playSound = useCallback(() => {
    if (soundEnabled) {
      playNotificationSound(soundType);
    }
  }, [soundEnabled, soundType]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') return;

    try {
      // Play sound
      playSound();

      const notification = new Notification(title, {
        icon: '/favicon.ico',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, [isSupported, permission, playSound]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!userId || permission !== 'granted') return;

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as {
            title: string;
            message: string;
            notification_type: string;
          };

          // Call callback if provided
          onNotificationReceived?.(newNotification);

          // Show browser notification (sound will respect quiet hours via preferences)
          showNotification(newNotification.title, {
            body: newNotification.message,
            tag: newNotification.notification_type,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, permission, showNotification, onNotificationReceived]);

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    playSound,
  };
};
