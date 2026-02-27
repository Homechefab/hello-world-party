
-- Add tracking columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS estimated_ready_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS preparation_started_at timestamp with time zone;
