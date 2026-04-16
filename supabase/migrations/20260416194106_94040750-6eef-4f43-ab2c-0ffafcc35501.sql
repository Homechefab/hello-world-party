
-- Restrict user access to klarna_payments: drop the user-facing SELECT policy
-- (which exposed html_snippet, customer_email, klarna_order_id), and replace with
-- a safe view that excludes sensitive columns. Admins keep full access via the
-- existing admin policy.

DROP POLICY IF EXISTS "Users can view their own klarna payments" ON public.klarna_payments;

-- Create safe view exposing only non-sensitive columns
CREATE OR REPLACE VIEW public.klarna_payments_safe
WITH (security_invoker = true)
AS
SELECT
  id,
  order_id,
  amount,
  currency,
  status,
  payment_method,
  error_message,
  created_at,
  updated_at
FROM public.klarna_payments
WHERE order_id IN (
  SELECT o.id FROM public.orders o WHERE o.customer_id = auth.uid()
);

GRANT SELECT ON public.klarna_payments_safe TO authenticated;
