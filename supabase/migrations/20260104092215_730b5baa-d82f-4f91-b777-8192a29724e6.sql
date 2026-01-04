-- Add quiet hours and email digest columns to notification_preferences
ALTER TABLE public.notification_preferences 
ADD COLUMN quiet_hours_enabled boolean DEFAULT false,
ADD COLUMN quiet_hours_start time DEFAULT '22:00:00',
ADD COLUMN quiet_hours_end time DEFAULT '07:00:00',
ADD COLUMN email_digest_enabled boolean DEFAULT false,
ADD COLUMN email_address text;