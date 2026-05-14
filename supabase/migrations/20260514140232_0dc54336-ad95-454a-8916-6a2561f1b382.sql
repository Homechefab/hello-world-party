-- Allow approved chefs to fetch limited contact info for their own customers.
-- Direct SELECT on profiles is denied by RLS (users can only see their own profile),
-- so we expose a SECURITY DEFINER function that validates the calling chef
-- actually has an order from each requested customer.

CREATE OR REPLACE FUNCTION public.get_customer_contacts_for_chef(_customer_ids uuid[])
RETURNS TABLE (id uuid, full_name text, phone text, email text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.phone, p.email
  FROM public.profiles p
  WHERE p.id = ANY(_customer_ids)
    AND EXISTS (
      SELECT 1
      FROM public.orders o
      JOIN public.chefs c ON c.id = o.chef_id
      WHERE o.customer_id = p.id
        AND c.user_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.get_customer_contacts_for_chef(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_customer_contacts_for_chef(uuid[]) TO authenticated;