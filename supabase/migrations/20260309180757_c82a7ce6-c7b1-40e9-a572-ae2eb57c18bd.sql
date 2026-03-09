
-- Table for weekly schedule: which days of the week a dish is available
CREATE TABLE public.dish_weekly_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id uuid NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (dish_id, day_of_week)
);

-- Table for date-specific exceptions (override weekly schedule)
CREATE TABLE public.dish_date_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id uuid NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  exception_date date NOT NULL,
  is_available boolean NOT NULL DEFAULT false,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (dish_id, exception_date)
);

-- Enable RLS
ALTER TABLE public.dish_weekly_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_date_exceptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for dish_weekly_schedule
CREATE POLICY "Chefs can manage their own dish schedules" ON public.dish_weekly_schedule
  FOR ALL TO public
  USING (dish_id IN (SELECT d.id FROM dishes d JOIN chefs c ON d.chef_id = c.id WHERE c.user_id = auth.uid()))
  WITH CHECK (dish_id IN (SELECT d.id FROM dishes d JOIN chefs c ON d.chef_id = c.id WHERE c.user_id = auth.uid()));

CREATE POLICY "Anyone can view dish schedules" ON public.dish_weekly_schedule
  FOR SELECT TO public
  USING (true);

-- RLS policies for dish_date_exceptions
CREATE POLICY "Chefs can manage their own dish exceptions" ON public.dish_date_exceptions
  FOR ALL TO public
  USING (dish_id IN (SELECT d.id FROM dishes d JOIN chefs c ON d.chef_id = c.id WHERE c.user_id = auth.uid()))
  WITH CHECK (dish_id IN (SELECT d.id FROM dishes d JOIN chefs c ON d.chef_id = c.id WHERE c.user_id = auth.uid()));

CREATE POLICY "Anyone can view dish exceptions" ON public.dish_date_exceptions
  FOR SELECT TO public
  USING (true);

-- Updated_at trigger for weekly schedule
CREATE TRIGGER update_dish_weekly_schedule_updated_at
  BEFORE UPDATE ON public.dish_weekly_schedule
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
