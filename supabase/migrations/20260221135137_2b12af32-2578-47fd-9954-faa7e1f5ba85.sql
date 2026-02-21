CREATE POLICY "Anon can check existing application by email"
ON public.chefs
FOR SELECT
TO anon
USING (true);