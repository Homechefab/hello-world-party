CREATE OR REPLACE FUNCTION public.get_chef_contacts_for_customer(_chef_ids uuid[])
RETURNS TABLE(
  id uuid,
  business_name text,
  full_name text,
  phone text,
  address text,
  postal_code text,
  city text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.business_name, c.full_name, c.phone, c.address, c.postal_code, c.city
  FROM public.chefs c
  WHERE c.id = ANY(_chef_ids)
    AND EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.chef_id = c.id
        AND o.customer_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_chef_contacts_for_customer(uuid[]) TO authenticated;