-- Allow anonymous/unauthenticated chef applications with null user_id
CREATE POLICY "Anyone can submit chef application without account"
ON public.chefs
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);