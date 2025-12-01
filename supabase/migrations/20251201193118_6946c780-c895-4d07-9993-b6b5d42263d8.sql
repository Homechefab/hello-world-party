-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Anyone can create chef application" ON public.chefs;

-- Create new policy that allows both authenticated and unauthenticated users
CREATE POLICY "Anyone can create chef application" 
ON public.chefs 
FOR INSERT 
WITH CHECK (
  -- Allow if user_id is null (unauthenticated application)
  user_id IS NULL 
  OR 
  -- Allow if user_id matches authenticated user (authenticated application)
  user_id = auth.uid()
);