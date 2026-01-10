-- Create disease diagnoses table to log plant health history
CREATE TABLE public.disease_diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plant_name TEXT NOT NULL,
  disease_name TEXT,
  symptoms TEXT,
  diagnosis TEXT NOT NULL,
  severity TEXT DEFAULT 'mild',
  treatment TEXT,
  image_url TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plant care reminders table
CREATE TABLE public.plant_care_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plant_name TEXT NOT NULL,
  plant_id UUID,
  reminder_type TEXT NOT NULL DEFAULT 'watering',
  frequency_days INTEGER NOT NULL DEFAULT 7,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  next_due_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disease_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_care_reminders ENABLE ROW LEVEL SECURITY;

-- Disease diagnoses policies
CREATE POLICY "Users can view own diagnoses" 
ON public.disease_diagnoses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnoses" 
ON public.disease_diagnoses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagnoses" 
ON public.disease_diagnoses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diagnoses" 
ON public.disease_diagnoses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Plant care reminders policies
CREATE POLICY "Users can view own reminders" 
ON public.plant_care_reminders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" 
ON public.plant_care_reminders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" 
ON public.plant_care_reminders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" 
ON public.plant_care_reminders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_disease_diagnoses_user_id ON public.disease_diagnoses(user_id);
CREATE INDEX idx_disease_diagnoses_created_at ON public.disease_diagnoses(created_at DESC);
CREATE INDEX idx_plant_care_reminders_user_id ON public.plant_care_reminders(user_id);
CREATE INDEX idx_plant_care_reminders_next_due ON public.plant_care_reminders(next_due_at);

-- Enable realtime for reminders
ALTER PUBLICATION supabase_realtime ADD TABLE public.plant_care_reminders;