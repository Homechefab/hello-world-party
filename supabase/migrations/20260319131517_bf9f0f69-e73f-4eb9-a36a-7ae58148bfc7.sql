
-- Fix: Replace permissive customer UPDATE policy with a restricted one
-- Customers can only update special_instructions and delivery_address on non-finalized orders
DROP POLICY IF EXISTS "Customers can update their own orders" ON orders;

CREATE POLICY "Customers can update limited order fields"
ON orders FOR UPDATE
TO public
USING (auth.uid() = customer_id)
WITH CHECK (
  auth.uid() = customer_id
  AND status IN ('pending', 'confirmed')
);
