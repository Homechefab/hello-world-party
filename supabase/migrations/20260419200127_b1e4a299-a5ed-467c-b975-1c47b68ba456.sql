-- Allow admins to delete orders
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Remove the test order and related rows
DELETE FROM public.swish_payments WHERE order_id = 'd32c8d7b-cd9c-4dd9-9ce5-036d2039d325';
DELETE FROM public.klarna_payments WHERE order_id = 'd32c8d7b-cd9c-4dd9-9ce5-036d2039d325';
DELETE FROM public.order_items WHERE order_id = 'd32c8d7b-cd9c-4dd9-9ce5-036d2039d325';
DELETE FROM public.orders WHERE id = 'd32c8d7b-cd9c-4dd9-9ce5-036d2039d325';