import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Notification sound as base64 data URL (short chime)
const NOTIFICATION_SOUND_URL = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleW0pUaDC3buZYCwrZZ694LqQV0VZm77jt5BAMESQu+bQqXo3UY2z6c6idEpblq7nxph1U2qls+O6l3ZgdKiv4rWUe3x7p63fs4+EiYWYq97AkIF/h5eo3K+Ogop8lKfSx56FfHyPps/NqI9zdXmSpsm7m5N0Z3GPoMm1l5d7aWeNnb+0nJZ8a2aQnLy1lpd8bmiPnL21lpZ6a2eQnLy1lpZ8bmiPnLy1lpd8bmeQnLy0lpd9bmeQnLy1lpd9bmiQnLy1lpd9bmiQnL21lpd9bmiQnLy1lpd9bmiQnL21lph9bmiQnLy1l5h9bmiQnLy1l5h9bmiQnLy1';

interface UseBrowserNotificationsOptions {
  soundEnabled?: boolean;
  onNotificationReceived?: (notification: { title: string; message: string; notification_type: string }) => void;
}

export const useBrowserNotifications = (
  userId: string | undefined, 
  options: UseBrowserNotificationsOptions = {}
) => {
  const { soundEnabled = true, onNotificationReceived } = options;
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if browser supports notifications
    const supported = 'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }

    // Initialize audio element
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.5;
  }, []);

  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [soundEnabled]);

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

          // Show browser notification
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
