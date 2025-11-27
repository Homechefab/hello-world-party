-- Make user_id nullable in chefs table since it will be set after approval
ALTER TABLE public.chefs ALTER COLUMN user_id DROP NOT NULL;

-- Add email column to store chef's contact email for sending credentials
ALTER TABLE public.chefs ADD COLUMN IF NOT EXISTS contact_email text;

-- Update RLS policies to allow unauthenticated users to create applications
DROP POLICY IF EXISTS "Users can create chef profile" ON public.chefs;

CREATE POLICY "Anyone can create chef application"
ON public.chefs
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Add policy to allow updating user_id after approval
CREATE POLICY "System can update chef user_id"
ON public.chefs
FOR UPDATE
USING (true)
WITH CHECK (true);