-- Allow chefs to delete their own rejected applications
CREATE POLICY "Chefs can delete their own rejected applications"
ON public.chefs
FOR DELETE
USING (
  auth.uid() = user_id 
  AND application_status = 'rejected'
);