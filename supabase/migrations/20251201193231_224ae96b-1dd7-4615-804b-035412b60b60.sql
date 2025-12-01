-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can create chef application" ON public.chefs;

-- Create new policy that requires authentication
CREATE POLICY "Authenticated users can create chef application" 
ON public.chefs 
FOR INSERT 
WITH CHECK (
  -- Only allow if user_id matches authenticated user
  auth.uid() = user_id
);