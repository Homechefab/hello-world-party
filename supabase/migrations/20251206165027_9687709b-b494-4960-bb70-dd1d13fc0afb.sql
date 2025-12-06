-- Add policy to allow users to view their own applications by contact_email
CREATE POLICY "Users can view their own applications by email" 
ON public.chefs 
AS PERMISSIVE
FOR SELECT 
TO public
USING (contact_email IS NOT NULL);