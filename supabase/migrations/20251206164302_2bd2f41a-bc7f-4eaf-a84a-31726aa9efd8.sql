-- Drop and recreate with ALL roles
DROP POLICY IF EXISTS "Anyone can create chef application" ON public.chefs;

CREATE POLICY "Anyone can create chef application" 
ON public.chefs 
AS PERMISSIVE
FOR INSERT 
TO public
WITH CHECK (contact_email IS NOT NULL);