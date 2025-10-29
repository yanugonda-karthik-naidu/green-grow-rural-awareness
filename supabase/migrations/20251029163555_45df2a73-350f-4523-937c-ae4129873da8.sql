-- Add phone_number to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone_number TEXT;
  END IF;
END $$;

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trees_planted INTEGER DEFAULT 0,
  co2_reduced NUMERIC DEFAULT 0,
  oxygen_generated NUMERIC DEFAULT 0,
  wildlife_sheltered INTEGER DEFAULT 0,
  water_saved NUMERIC DEFAULT 0,
  green_area_expanded NUMERIC DEFAULT 0,
  energy_saved NUMERIC DEFAULT 0,
  seed_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all progress" ON public.user_progress;
CREATE POLICY "Users can view all progress"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create planted_trees table
CREATE TABLE IF NOT EXISTS public.planted_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tree_name TEXT NOT NULL,
  planted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stage INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.planted_trees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all planted trees" ON public.planted_trees;
CREATE POLICY "Users can view all planted trees"
  ON public.planted_trees FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert own trees" ON public.planted_trees;
CREATE POLICY "Users can insert own trees"
  ON public.planted_trees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trees" ON public.planted_trees;
CREATE POLICY "Users can update own trees"
  ON public.planted_trees FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trees" ON public.planted_trees;
CREATE POLICY "Users can delete own trees"
  ON public.planted_trees FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all badges" ON public.user_badges;
CREATE POLICY "Users can view all badges"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
CREATE POLICY "Users can insert own badges"
  ON public.user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create achievements timeline table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_text TEXT NOT NULL,
  seeds_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all achievements" ON public.achievements;
CREATE POLICY "Users can view all achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.achievements;
CREATE POLICY "Users can insert own achievements"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create community posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all posts" ON public.community_posts;
CREATE POLICY "Users can view all posts"
  ON public.community_posts FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert own posts" ON public.community_posts;
CREATE POLICY "Users can insert own posts"
  ON public.community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
CREATE POLICY "Users can update own posts"
  ON public.community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.community_posts;
CREATE POLICY "Users can delete own posts"
  ON public.community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update or create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert initial progress
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Drop and recreate timestamp triggers
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Conditionally add tables to realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'user_progress'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'planted_trees'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.planted_trees;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'user_badges'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_badges;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'achievements'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.achievements;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'community_posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
  END IF;
END $$;