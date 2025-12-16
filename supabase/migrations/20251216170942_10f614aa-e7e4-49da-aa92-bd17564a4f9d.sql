-- Add location column to community_posts
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS location text;

-- Create community_challenges table for location-based challenges
CREATE TABLE IF NOT EXISTS public.community_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location text NOT NULL,
  title text NOT NULL,
  description text,
  target_trees integer NOT NULL DEFAULT 100,
  current_trees integer NOT NULL DEFAULT 0,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone NOT NULL DEFAULT (now() + interval '30 days'),
  is_active boolean NOT NULL DEFAULT true,
  participants text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on community_challenges
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;

-- RLS policies for community_challenges
CREATE POLICY "Anyone can view challenges" ON public.community_challenges
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert challenges" ON public.community_challenges
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update challenges" ON public.community_challenges
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create location_stats table for real-time location statistics
CREATE TABLE IF NOT EXISTS public.location_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location text NOT NULL UNIQUE,
  total_trees integer NOT NULL DEFAULT 0,
  total_users integer NOT NULL DEFAULT 0,
  total_co2_kg numeric NOT NULL DEFAULT 0,
  total_o2_lpd numeric NOT NULL DEFAULT 0,
  last_updated timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on location_stats
ALTER TABLE public.location_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for location_stats
CREATE POLICY "Anyone can view location stats" ON public.location_stats
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert location stats" ON public.location_stats
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update location stats" ON public.location_stats
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_stats;

-- Create function to update location stats
CREATE OR REPLACE FUNCTION public.update_location_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_location text;
BEGIN
  -- Get user's location from profiles
  SELECT location INTO user_location FROM profiles WHERE id = NEW.user_id;
  
  IF user_location IS NOT NULL AND user_location != '' THEN
    -- Upsert location stats
    INSERT INTO location_stats (location, total_trees, total_users, total_co2_kg, total_o2_lpd, last_updated)
    VALUES (
      user_location,
      1,
      1,
      COALESCE(NEW.impact_co2_kg, 25),
      COALESCE(NEW.impact_o2_l_per_day, 260),
      now()
    )
    ON CONFLICT (location) DO UPDATE SET
      total_trees = location_stats.total_trees + 1,
      total_co2_kg = location_stats.total_co2_kg + COALESCE(NEW.impact_co2_kg, 25),
      total_o2_lpd = location_stats.total_o2_lpd + COALESCE(NEW.impact_o2_l_per_day, 260),
      last_updated = now();
      
    -- Update community challenges for this location
    UPDATE community_challenges
    SET current_trees = current_trees + 1,
        participants = array_append(
          CASE WHEN NOT (NEW.user_id::text = ANY(participants)) THEN participants ELSE participants END,
          CASE WHEN NOT (NEW.user_id::text = ANY(participants)) THEN NEW.user_id::text ELSE NULL END
        )
    WHERE location = user_location AND is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for planted_trees to update location stats
DROP TRIGGER IF EXISTS on_tree_planted_update_location ON public.planted_trees;
CREATE TRIGGER on_tree_planted_update_location
  AFTER INSERT ON public.planted_trees
  FOR EACH ROW EXECUTE FUNCTION public.update_location_stats();