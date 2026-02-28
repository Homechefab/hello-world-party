
-- Add pickup_instructions column to orders (chef fills this when marking as ready)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pickup_instructions text;

-- Add offers_delivery flag to chefs table
ALTER TABLE public.chefs ADD COLUMN IF NOT EXISTS offers_delivery boolean DEFAULT false;
