
-- 1. Fix chef order UPDATE policy: add WITH CHECK to lock immutable fields
DROP POLICY IF EXISTS "Chefs can update orders for their dishes" ON public.orders;
CREATE POLICY "Chefs can update orders for their dishes"
ON public.orders FOR UPDATE TO public
USING (chef_id IN (SELECT chefs.id FROM chefs WHERE chefs.user_id = auth.uid()))
WITH CHECK (
  chef_id IN (SELECT chefs.id FROM chefs WHERE chefs.user_id = auth.uid())
  AND total_amount = (SELECT o.total_amount FROM orders o WHERE o.id = orders.id)
  AND customer_id = (SELECT o.customer_id FROM orders o WHERE o.id = orders.id)
  AND delivery_address = (SELECT o.delivery_address FROM orders o WHERE o.id = orders.id)
  AND chef_id = (SELECT o.chef_id FROM orders o WHERE o.id = orders.id)
);

-- 2. Fix profiles UPDATE policy: lock role field
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO public
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = (SELECT p.role FROM profiles p WHERE p.id = profiles.id)
  AND municipality_approved = (SELECT p.municipality_approved FROM profiles p WHERE p.id = profiles.id)
);

-- 3. Fix reviews UPDATE policy: lock chef_id and order_id
DROP POLICY IF EXISTS "Customers can update their own reviews" ON public.reviews;
CREATE POLICY "Customers can update their own reviews"
ON public.reviews FOR UPDATE TO public
USING (auth.uid() = customer_id)
WITH CHECK (
  auth.uid() = customer_id
  AND chef_id = (SELECT r.chef_id FROM reviews r WHERE r.id = reviews.id)
  AND order_id = (SELECT r.order_id FROM reviews r WHERE r.id = reviews.id)
  AND customer_id = (SELECT r.customer_id FROM reviews r WHERE r.id = reviews.id)
);

-- 4. Fix anonymous document upload: restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can upload application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to chef applications" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to restaurant applications" ON storage.objects;

CREATE POLICY "Authenticated users can upload application documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  ((storage.foldername(name))[1] = 'chef-applications' OR
   (storage.foldername(name))[1] = 'restaurant-applications')
);

-- 5. Fix payment_transactions policy: use auth.uid() via orders join instead of JWT email
DROP POLICY IF EXISTS "Users can view their own transactions by jwt email" ON public.payment_transactions;
CREATE POLICY "Users can view their own transactions by auth uid"
ON public.payment_transactions FOR SELECT TO authenticated
USING (
  customer_email = (SELECT email FROM profiles WHERE id = auth.uid())
);
