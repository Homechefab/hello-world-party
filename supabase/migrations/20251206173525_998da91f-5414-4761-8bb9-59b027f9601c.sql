-- Add bio column to chefs table
ALTER TABLE public.chefs ADD COLUMN IF NOT EXISTS bio TEXT;