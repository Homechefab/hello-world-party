-- Fix: Validate that chef_id on review matches the chef on the order
DROP POLICY IF EXISTS "Customers can create reviews" ON public.reviews;
CREATE POLICY "Customers can create reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = customer_id
    AND chef_id = (SELECT o.chef_id FROM public.orders o WHERE o.id = order_id)
  );