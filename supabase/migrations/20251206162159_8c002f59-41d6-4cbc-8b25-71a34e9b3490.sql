-- Update DELETE policy to work with contact_email instead of user_id
DROP POLICY IF EXISTS "Chefs can delete their own rejected applications" ON public.chefs;

-- Allow public to insert applications (they just need a valid contact_email)
DROP POLICY IF EXISTS "Authenticated users can create chef application" ON public.chefs;

CREATE POLICY "Anyone can create chef application" 
ON public.chefs 
FOR INSERT 
TO public
WITH CHECK (user_id IS NULL AND contact_email IS NOT NULL);