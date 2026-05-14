-- Prevent duplicate orders from being created twice for the same Stripe session + chef
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_chef_unique
ON public.orders (stripe_session_id, chef_id)
WHERE stripe_session_id IS NOT NULL;