-- Drop and recreate with simpler check
DROP POLICY IF EXISTS "Anyone can create chef application" ON public.chefs;

-- Just check that contact_email is provided - user_id can be anything (null or not)
CREATE POLICY "Anyone can create chef application" 
ON public.chefs 
AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (contact_email IS NOT NULL);