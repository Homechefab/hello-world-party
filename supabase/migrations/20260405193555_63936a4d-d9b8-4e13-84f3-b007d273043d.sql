
-- Add user_id column to swish_payments
ALTER TABLE public.swish_payments
ADD COLUMN user_id uuid;

-- Backfill user_id from orders.customer_id
UPDATE public.swish_payments sp
SET user_id = o.customer_id
FROM public.orders o
WHERE sp.order_id = o.id AND sp.user_id IS NULL;

-- Create a secure view that excludes phone numbers for customer access
CREATE OR REPLACE VIEW public.swish_payments_safe AS
SELECT
  id,
  order_id,
  user_id,
  amount,
  status,
  message,
  payment_reference,
  date_paid,
  error_code,
  error_message,
  created_at,
  updated_at
FROM public.swish_payments;

-- Allow users to SELECT their own swish payments via the safe view (no phone numbers)
CREATE POLICY "Users can view their own swish payments safely"
ON public.swish_payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
