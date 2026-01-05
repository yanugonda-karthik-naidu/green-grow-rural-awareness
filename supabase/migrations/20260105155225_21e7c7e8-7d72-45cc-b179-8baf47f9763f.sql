-- Create user goals table
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL DEFAULT 'trees',
  target_value INTEGER NOT NULL DEFAULT 5,
  current_value INTEGER NOT NULL DEFAULT 0,
  month DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own goals" 
ON public.user_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" 
ON public.user_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" 
ON public.user_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" 
ON public.user_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add unique constraint for one goal per type per month per user
CREATE UNIQUE INDEX idx_user_goals_unique ON public.user_goals (user_id, goal_type, month);

-- Create trigger for updated_at
CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON public.user_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();