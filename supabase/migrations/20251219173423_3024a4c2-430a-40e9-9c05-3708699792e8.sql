-- Create daily challenges table
CREATE TABLE public.daily_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  challenge_type text NOT NULL DEFAULT 'daily', -- 'daily' or 'weekly'
  seed_reward integer NOT NULL DEFAULT 10,
  target_value integer NOT NULL DEFAULT 1,
  metric text NOT NULL DEFAULT 'trees', -- 'trees', 'quiz_score', 'games_played'
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone NOT NULL DEFAULT (now() + interval '1 day'),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user challenge completions tracking
CREATE TABLE public.user_challenge_completions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  challenge_id uuid NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  seeds_earned integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_completions ENABLE ROW LEVEL SECURITY;

-- Policies for daily_challenges
CREATE POLICY "Anyone can view daily challenges" ON public.daily_challenges
  FOR SELECT USING (true);

-- Policies for user_challenge_completions
CREATE POLICY "Users can view own completions" ON public.user_challenge_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON public.user_challenge_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default daily and weekly challenges
INSERT INTO public.daily_challenges (title, description, challenge_type, seed_reward, target_value, metric, end_date) VALUES
('Daily Planter', 'Plant 1 tree today', 'daily', 15, 1, 'trees', now() + interval '1 day'),
('Quiz Master', 'Complete a quiz with score 15+', 'daily', 10, 15, 'quiz_score', now() + interval '1 day'),
('Game Time', 'Play any mini-game', 'daily', 5, 1, 'games_played', now() + interval '1 day'),
('Weekly Forest', 'Plant 5 trees this week', 'weekly', 50, 5, 'trees', now() + interval '7 days'),
('Knowledge Seeker', 'Complete 3 quizzes this week', 'weekly', 30, 3, 'quizzes_completed', now() + interval '7 days');