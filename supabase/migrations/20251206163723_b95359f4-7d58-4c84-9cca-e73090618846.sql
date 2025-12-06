-- Fix the INSERT policy - correct syntax order
DROP POLICY IF EXISTS "Anyone can create chef application" ON public.chefs;

CREATE POLICY "Anyone can create chef application" 
ON public.chefs 
AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (user_id IS NULL AND contact_email IS NOT NULL);