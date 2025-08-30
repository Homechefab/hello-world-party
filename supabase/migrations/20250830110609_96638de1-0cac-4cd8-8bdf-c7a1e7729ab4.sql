-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.approve_kitchen_partner(partner_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.reject_kitchen_partner(partner_id UUID, reason TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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