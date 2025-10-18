-- Fix search_path for existing functions to prevent security issues

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.delivery_addresses 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_single_default_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.payment_methods 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_kitchen_partner(partner_id UUID, reason TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
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
  IF NOT public.has_role(auth.uid(), 'admin') THEN
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

  -- Update user role in profiles (for backward compatibility)
  UPDATE public.profiles
  SET 
    role = 'kitchen_partner',
    updated_at = now()
  WHERE id = partner_user_id;
  
  -- Add role to user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (partner_user_id, 'kitchen_partner')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;