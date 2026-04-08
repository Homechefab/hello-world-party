
-- Create security definer function to check chef approval without RLS
CREATE OR REPLACE FUNCTION public.is_chef_approved(_chef_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chefs
    WHERE id = _chef_id
      AND kitchen_approved = true
  )
$$;

-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can view available dishes" ON public.dishes;

-- Recreate with security definer function
CREATE POLICY "Anyone can view available dishes"
ON public.dishes
FOR SELECT
USING (available = true AND public.is_chef_approved(chef_id));
