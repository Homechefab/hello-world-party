ALTER TABLE public.reviews ALTER COLUMN order_id DROP NOT NULL;

DROP POLICY IF EXISTS "Customers can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Customers can create reviews for their orders" ON public.reviews;

CREATE POLICY "Authenticated users can create reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = customer_id);