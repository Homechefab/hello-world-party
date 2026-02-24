CREATE POLICY "Chefs can delete their own dishes"
ON public.dishes
FOR DELETE
USING (chef_id IN (
  SELECT chefs.id FROM chefs WHERE chefs.user_id = auth.uid()
));