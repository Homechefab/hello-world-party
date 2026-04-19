ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_phone text;

-- Optional sanity constraint: keep it short
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_customer_phone_length_chk;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_customer_phone_length_chk
  CHECK (customer_phone IS NULL OR char_length(customer_phone) BETWEEN 6 AND 30);