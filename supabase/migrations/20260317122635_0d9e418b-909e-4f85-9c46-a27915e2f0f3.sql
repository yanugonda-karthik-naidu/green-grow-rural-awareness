
-- 1. Restrict profiles SELECT to own row only (hide email/phone from others)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Create SECURITY DEFINER function to fetch public profile info (no email/phone)
CREATE OR REPLACE FUNCTION public.get_public_profiles(user_ids uuid[])
RETURNS TABLE(id uuid, display_name text, location text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.display_name, p.location
  FROM public.profiles p
  WHERE p.id = ANY(user_ids);
$$;

-- 3. Create SECURITY DEFINER function to award badges (validates allowed names)
CREATE OR REPLACE FUNCTION public.award_badge(p_user_id uuid, p_badge_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_badges text[] := ARRAY[
    'Goal Crusher', 'Weekly Warrior', 'Consistent Planter', 'Goal Champion',
    'First Sapling', 'Eco Warrior', 'Forest Friend', 'Sustainability Leader'
  ];
BEGIN
  -- Only allow awarding to yourself
  IF p_user_id != auth.uid() THEN
    RETURN false;
  END IF;

  -- Only allow known badge names
  IF NOT (p_badge_name = ANY(allowed_badges)) THEN
    RETURN false;
  END IF;

  -- Insert only if not already earned
  INSERT INTO public.user_badges (user_id, badge_name)
  VALUES (p_user_id, p_badge_name)
  ON CONFLICT DO NOTHING;

  RETURN true;
END;
$$;

-- 4. Remove client INSERT policy on user_badges (edge function uses service role)
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;

-- 5. Remove client INSERT policy on achievements (edge function uses service role)
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.achievements;
