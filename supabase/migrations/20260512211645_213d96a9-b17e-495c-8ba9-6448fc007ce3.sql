
-- Add stripe_session_id to orders for strong idempotency
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_session_id text;
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_chef_unique
  ON public.orders (stripe_session_id, chef_id)
  WHERE stripe_session_id IS NOT NULL;

-- Allow admin SELECT on order_items so admin overview can show items
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items"
ON public.order_items FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
