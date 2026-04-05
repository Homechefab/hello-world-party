
-- Fix: recreate view with SECURITY INVOKER
DROP VIEW IF EXISTS public.swish_payments_safe;

CREATE VIEW public.swish_payments_safe
WITH (security_invoker = true) AS
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
