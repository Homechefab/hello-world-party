CREATE OR REPLACE FUNCTION public.order_original_matches_chef_editable_fields(
  p_order_id uuid,
  p_total_amount numeric,
  p_customer_id uuid,
  p_delivery_address text,
  p_chef_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = p_order_id
      AND o.total_amount = p_total_amount
      AND o.customer_id = p_customer_id
      AND o.delivery_address = p_delivery_address
      AND o.chef_id = p_chef_id
  )
$$;

CREATE OR REPLACE FUNCTION public.order_original_matches_customer_editable_fields(
  p_order_id uuid,
  p_total_amount numeric,
  p_chef_id uuid,
  p_customer_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = p_order_id
      AND o.total_amount = p_total_amount
      AND o.chef_id = p_chef_id
      AND o.customer_id = p_customer_id
  )
$$;

REVOKE ALL ON FUNCTION public.order_original_matches_chef_editable_fields(uuid, numeric, uuid, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.order_original_matches_chef_editable_fields(uuid, numeric, uuid, text, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.order_original_matches_customer_editable_fields(uuid, numeric, uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.order_original_matches_customer_editable_fields(uuid, numeric, uuid, uuid) TO authenticated;

DROP POLICY IF EXISTS "Chefs can update orders for their dishes" ON public.orders;
DROP POLICY IF EXISTS "Customers can update limited order fields" ON public.orders;

CREATE POLICY "Chefs can update orders for their dishes"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  chef_id IN (
    SELECT c.id
    FROM public.chefs c
    WHERE c.user_id = auth.uid()
  )
)
WITH CHECK (
  chef_id IN (
    SELECT c.id
    FROM public.chefs c
    WHERE c.user_id = auth.uid()
  )
  AND public.order_original_matches_chef_editable_fields(
    id,
    total_amount,
    customer_id,
    delivery_address,
    chef_id
  )
);

CREATE POLICY "Customers can update limited order fields"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  auth.uid() = customer_id
  AND status = ANY (ARRAY['pending'::text, 'confirmed'::text])
)
WITH CHECK (
  auth.uid() = customer_id
  AND status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text])
  AND public.order_original_matches_customer_editable_fields(
    id,
    total_amount,
    chef_id,
    customer_id
  )
);