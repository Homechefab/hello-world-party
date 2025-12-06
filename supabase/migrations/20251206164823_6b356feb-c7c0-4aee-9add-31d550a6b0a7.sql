-- Temporarily allow all inserts to debug the issue
DROP POLICY IF EXISTS "Anyone can create chef application" ON public.chefs;

CREATE POLICY "Anyone can create chef application" 
ON public.chefs 
AS PERMISSIVE
FOR INSERT 
TO public
WITH CHECK (true);