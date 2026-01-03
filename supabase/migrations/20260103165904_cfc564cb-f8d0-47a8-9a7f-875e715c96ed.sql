-- Add sound preference column to notification_preferences
ALTER TABLE public.notification_preferences
ADD COLUMN sound_type TEXT DEFAULT 'chime';