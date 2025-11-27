-- Add columns to chefs table to store application data
ALTER TABLE public.chefs
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS specialties TEXT;

-- Add comment to document the purpose of these columns
COMMENT ON COLUMN public.chefs.full_name IS 'Chef full name from application';
COMMENT ON COLUMN public.chefs.phone IS 'Chef phone number from application';
COMMENT ON COLUMN public.chefs.address IS 'Chef address from application';
COMMENT ON COLUMN public.chefs.city IS 'Chef city from application';
COMMENT ON COLUMN public.chefs.postal_code IS 'Chef postal code from application';
COMMENT ON COLUMN public.chefs.experience IS 'Chef cooking experience and background';
COMMENT ON COLUMN public.chefs.specialties IS 'Chef specialties and cooking style';