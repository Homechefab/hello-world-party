-- Fix is_chef_approved to also check application_status
CREATE OR REPLACE FUNCTION public.is_chef_approved(_chef_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chefs
    WHERE id = _chef_id
      AND kitchen_approved = true
      AND application_status = 'approved'
  );
$$;