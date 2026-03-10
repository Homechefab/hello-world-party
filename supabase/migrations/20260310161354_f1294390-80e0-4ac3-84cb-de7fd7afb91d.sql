-- Chef operating hours: defines when each chef accepts orders per day of week
CREATE TABLE public.chef_operating_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chef_id UUID NOT NULL REFERENCES public.chefs(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_open BOOLEAN NOT NULL DEFAULT false,
  open_time TIME NOT NULL DEFAULT '08:00',
  close_time TIME NOT NULL DEFAULT '18:00',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (chef_id, day_of_week)
);

-- Enable RLS
ALTER TABLE public.chef_operating_hours ENABLE ROW LEVEL SECURITY;

-- Anyone can view operating hours (public info)
CREATE POLICY "Anyone can view chef operating hours"
  ON public.chef_operating_hours FOR SELECT
  USING (true);

-- Chefs can manage their own hours
CREATE POLICY "Chefs can insert their own operating hours"
  ON public.chef_operating_hours FOR INSERT
  WITH CHECK (chef_id IN (SELECT id FROM chefs WHERE user_id = auth.uid()));

CREATE POLICY "Chefs can update their own operating hours"
  ON public.chef_operating_hours FOR UPDATE
  USING (chef_id IN (SELECT id FROM chefs WHERE user_id = auth.uid()));

CREATE POLICY "Chefs can delete their own operating hours"
  ON public.chef_operating_hours FOR DELETE
  USING (chef_id IN (SELECT id FROM chefs WHERE user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_chef_operating_hours_updated_at
  BEFORE UPDATE ON public.chef_operating_hours
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();