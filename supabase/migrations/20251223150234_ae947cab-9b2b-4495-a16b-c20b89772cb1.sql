-- Drop existing INSERT policy that requires authentication
DROP POLICY IF EXISTS "Users can create their own business application" ON public.business_partners;

-- Create new INSERT policy that allows anyone to submit applications
CREATE POLICY "Anyone can submit business application"
ON public.business_partners
FOR INSERT
WITH CHECK (true);

-- Make user_id nullable (already is, but ensure it)
ALTER TABLE public.business_partners ALTER COLUMN user_id DROP NOT NULL;