-- Create shop items table
CREATE TABLE public.shop_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'virtual_item',
  seed_cost INTEGER NOT NULL DEFAULT 100,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user purchases table
CREATE TABLE public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id UUID NOT NULL REFERENCES public.shop_items(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  seeds_spent INTEGER NOT NULL DEFAULT 0
);

-- Create user notifications table
CREATE TABLE public.user_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'achievement',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Shop items policies (anyone can view)
CREATE POLICY "Anyone can view shop items" 
ON public.shop_items 
FOR SELECT 
USING (true);

-- User purchases policies
CREATE POLICY "Users can view own purchases" 
ON public.user_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" 
ON public.user_purchases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- User notifications policies
CREATE POLICY "Users can view own notifications" 
ON public.user_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" 
ON public.user_notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
ON public.user_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert default shop items
INSERT INTO public.shop_items (name, description, category, seed_cost, image_url) VALUES
('Golden Badge', 'A shiny golden badge to display on your profile', 'badge', 500, '🏅'),
('Silver Badge', 'A beautiful silver badge for your achievements', 'badge', 300, '🥈'),
('Bronze Badge', 'A starter bronze badge', 'badge', 100, '🥉'),
('Rainbow Tree Frame', 'Add a rainbow frame to your planted trees', 'frame', 250, '🌈'),
('Sparkle Effect', 'Add sparkle effects to your profile', 'effect', 400, '✨'),
('Premium Title: Guardian', 'Unlock the "Tree Guardian" title', 'title', 750, '🛡️'),
('Premium Title: Champion', 'Unlock the "Eco Champion" title', 'title', 1000, '🏆'),
('Custom Avatar Border', 'A special animated border for your avatar', 'cosmetic', 600, '💫'),
('Double Seeds Weekend', 'Earn double seeds for one weekend', 'boost', 800, '🌱'),
('Exclusive Tree Pack', 'Unlock 5 rare tree species', 'content', 1500, '🌳'),
('VIP Supporter Badge', 'Show your support with this VIP badge', 'badge', 2000, '💎'),
('Nature Sound Pack', 'Relaxing nature sounds for your app', 'content', 350, '🎵');