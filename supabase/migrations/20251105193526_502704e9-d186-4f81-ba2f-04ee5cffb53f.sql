-- Enhance planted_trees table with new fields
ALTER TABLE planted_trees
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS species TEXT,
ADD COLUMN IF NOT EXISTS image_path TEXT,
ADD COLUMN IF NOT EXISTS growth_stage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS impact_co2_kg NUMERIC DEFAULT 25,
ADD COLUMN IF NOT EXISTS impact_o2_l_per_day NUMERIC DEFAULT 260,
ADD COLUMN IF NOT EXISTS area_m2 NUMERIC DEFAULT 2,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Enhance user_progress with language preference
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- Create analytics_counters table for global aggregates
CREATE TABLE IF NOT EXISTS analytics_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_trees INTEGER DEFAULT 0,
  total_co2_kg NUMERIC DEFAULT 0,
  total_o2_lpd NUMERIC DEFAULT 0,
  total_area_m2 NUMERIC DEFAULT 0,
  total_seeds_issued INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row for analytics
INSERT INTO analytics_counters (id)
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Create translations table for i18n
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  en TEXT NOT NULL,
  te TEXT NOT NULL,
  hi TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE analytics_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- RLS policies for analytics_counters
CREATE POLICY "Anyone can view analytics"
ON analytics_counters FOR SELECT
USING (true);

CREATE POLICY "Only authenticated users can update analytics"
ON analytics_counters FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- RLS policies for translations
CREATE POLICY "Anyone can view translations"
ON translations FOR SELECT
USING (true);

-- Create storage bucket for plant images
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for plant-images bucket
CREATE POLICY "Users can upload their own plant images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'plant-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view plant images"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-images');

CREATE POLICY "Users can update their own plant images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'plant-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own plant images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'plant-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Function to update analytics counters
CREATE OR REPLACE FUNCTION update_analytics_counters()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE analytics_counters
  SET 
    total_trees = (SELECT COUNT(*) FROM planted_trees),
    total_co2_kg = (SELECT COALESCE(SUM(impact_co2_kg), 0) FROM planted_trees),
    total_o2_lpd = (SELECT COALESCE(SUM(impact_o2_l_per_day), 0) FROM planted_trees),
    total_area_m2 = (SELECT COALESCE(SUM(area_m2), 0) FROM planted_trees),
    last_updated = NOW();
  RETURN NEW;
END;
$$;

-- Trigger to update analytics on plant insert/update
CREATE TRIGGER update_analytics_on_plant_change
AFTER INSERT OR UPDATE OR DELETE ON planted_trees
FOR EACH STATEMENT
EXECUTE FUNCTION update_analytics_counters();

-- Enable realtime for new tables only
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_counters;