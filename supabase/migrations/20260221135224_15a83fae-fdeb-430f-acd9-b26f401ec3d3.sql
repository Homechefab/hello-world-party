CREATE POLICY "Anon can delete rejected chef applications"
ON public.chefs
FOR DELETE
TO anon
USING (application_status = 'rejected');