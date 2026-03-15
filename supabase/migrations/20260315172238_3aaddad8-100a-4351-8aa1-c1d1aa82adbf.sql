
-- Fix: visitors table allows anyone to insert records with arbitrary user_id
DROP POLICY IF EXISTS "Anyone can log visits" ON public.visitors;

CREATE POLICY "Anyone can log visits"
  ON public.visitors FOR INSERT
  TO public
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
  );
