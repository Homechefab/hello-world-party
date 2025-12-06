-- Drop old INSERT policy that required user_id
DROP POLICY IF EXISTS "Authenticated users can create chef application" ON public.chefs;

-- Create new INSERT policy that allows anyone authenticated to create applications
-- (without user_id requirement since account is created on approval)
CREATE POLICY "Authenticated users can create chef application" 
ON public.chefs 
FOR INSERT 
TO authenticated
WITH CHECK (user_id IS NULL);