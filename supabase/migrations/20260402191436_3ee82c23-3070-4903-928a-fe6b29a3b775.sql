
-- Fix document_submissions INSERT: require either chef_id or restaurant_id
DROP POLICY IF EXISTS "Users can create their own document submissions" ON public.document_submissions;
CREATE POLICY "Users can create their own document submissions"
ON public.document_submissions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    (chef_id IS NOT NULL AND chef_id IN (SELECT id FROM chefs WHERE user_id = auth.uid()))
    OR
    (restaurant_id IS NOT NULL AND restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid()))
  )
);
