
-- Helper function to check if the current user is a customer of a given chef
CREATE OR REPLACE FUNCTION public.is_customer_of_chef(_chef_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.chef_id = _chef_id
      AND o.customer_id = auth.uid()
  );
$$;

-- Drop and recreate the recursive policy using the helper
DROP POLICY IF EXISTS "Customers with orders can view their chef contact info" ON public.chefs;

CREATE POLICY "Customers with orders can view their chef contact info"
ON public.chefs
FOR SELECT
TO authenticated
USING (
  kitchen_approved = true
  AND application_status = 'approved'
  AND public.is_customer_of_chef(id)
);
