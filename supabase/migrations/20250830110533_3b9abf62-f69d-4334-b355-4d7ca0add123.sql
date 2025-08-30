-- Create kitchen partners table
CREATE TABLE public.kitchen_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  kitchen_description TEXT,
  kitchen_size INTEGER, -- i kvm
  address TEXT NOT NULL,
  hourly_rate NUMERIC(10,2),
  equipment_details TEXT,
  municipality TEXT,
  approved BOOLEAN DEFAULT false,
  rejection_reason TEXT,
  application_status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.kitchen_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kitchen partners
CREATE POLICY "Kitchen partners can view their own data"
ON public.kitchen_partners
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Kitchen partners can update their own data"
ON public.kitchen_partners
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can create kitchen partner profile"
ON public.kitchen_partners
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all kitchen partners"
ON public.kitchen_partners
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update kitchen partner status"
ON public.kitchen_partners
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_kitchen_partners_updated_at
  BEFORE UPDATE ON public.kitchen_partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to approve kitchen partner
CREATE OR REPLACE FUNCTION public.approve_kitchen_partner(partner_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  partner_user_id UUID;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can approve kitchen partners';
  END IF;

  -- Get the user_id of the partner
  SELECT user_id INTO partner_user_id
  FROM public.kitchen_partners
  WHERE id = partner_id;

  -- Update kitchen partner status
  UPDATE public.kitchen_partners
  SET 
    approved = true,
    application_status = 'approved',
    updated_at = now()
  WHERE id = partner_id;

  -- Update user role to kitchen_partner
  UPDATE public.profiles
  SET 
    role = 'kitchen_partner',
    updated_at = now()
  WHERE id = partner_user_id;
END;
$$;

-- Create function to reject kitchen partner
CREATE OR REPLACE FUNCTION public.reject_kitchen_partner(partner_id UUID, reason TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can reject kitchen partners';
  END IF;

  -- Update kitchen partner status
  UPDATE public.kitchen_partners
  SET 
    approved = false,
    application_status = 'rejected',
    rejection_reason = reason,
    updated_at = now()
  WHERE id = partner_id;
END;
$$;