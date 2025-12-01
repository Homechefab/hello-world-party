-- Create kitchen_availability table for managing kitchen partner schedules
CREATE TABLE public.kitchen_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kitchen_partner_id uuid REFERENCES public.kitchen_partners(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  time_slot text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(kitchen_partner_id, date, time_slot)
);

-- Enable RLS
ALTER TABLE public.kitchen_availability ENABLE ROW LEVEL SECURITY;

-- Kitchen partners can view their own availability
CREATE POLICY "Kitchen partners can view their own availability"
ON public.kitchen_availability
FOR SELECT
USING (
  kitchen_partner_id IN (
    SELECT id FROM public.kitchen_partners WHERE user_id = auth.uid()
  )
);

-- Kitchen partners can insert their own availability
CREATE POLICY "Kitchen partners can insert their own availability"
ON public.kitchen_availability
FOR INSERT
WITH CHECK (
  kitchen_partner_id IN (
    SELECT id FROM public.kitchen_partners WHERE user_id = auth.uid()
  )
);

-- Kitchen partners can update their own availability
CREATE POLICY "Kitchen partners can update their own availability"
ON public.kitchen_availability
FOR UPDATE
USING (
  kitchen_partner_id IN (
    SELECT id FROM public.kitchen_partners WHERE user_id = auth.uid()
  )
);

-- Kitchen partners can delete their own availability
CREATE POLICY "Kitchen partners can delete their own availability"
ON public.kitchen_availability
FOR DELETE
USING (
  kitchen_partner_id IN (
    SELECT id FROM public.kitchen_partners WHERE user_id = auth.uid()
  )
);

-- Admins can view all availability
CREATE POLICY "Admins can view all availability"
ON public.kitchen_availability
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_kitchen_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_kitchen_availability_updated_at
BEFORE UPDATE ON public.kitchen_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_kitchen_availability_updated_at();