-- Create treatment tips table for community sharing
CREATE TABLE public.treatment_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plant_name TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  treatment TEXT NOT NULL,
  success_rate TEXT DEFAULT 'effective',
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create helpful votes table to track who found tips helpful
CREATE TABLE public.treatment_tip_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tip_id UUID NOT NULL REFERENCES public.treatment_tips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tip_id, user_id)
);

-- Enable RLS
ALTER TABLE public.treatment_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_tip_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for treatment_tips
CREATE POLICY "Anyone can view treatment tips" ON public.treatment_tips
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own tips" ON public.treatment_tips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tips" ON public.treatment_tips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tips" ON public.treatment_tips
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for votes
CREATE POLICY "Anyone can view votes" ON public.treatment_tip_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own votes" ON public.treatment_tip_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.treatment_tip_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_treatment_tips_plant ON public.treatment_tips(plant_name);
CREATE INDEX idx_treatment_tips_disease ON public.treatment_tips(disease_name);
CREATE INDEX idx_treatment_tip_votes_tip ON public.treatment_tip_votes(tip_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.treatment_tips;