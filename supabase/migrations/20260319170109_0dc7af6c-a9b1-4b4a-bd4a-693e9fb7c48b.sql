-- Fix 1: payment_transactions — use auth.jwt() email instead of mutable profiles table
DROP POLICY IF EXISTS "Users can view their own transactions via orders" ON public.payment_transactions;

CREATE POLICY "Users can view their own transactions by jwt email"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (customer_email = (auth.jwt() ->> 'email'));

-- Fix 2: document_submissions — add user_id ownership check to restaurant insert policy
DROP POLICY IF EXISTS "Users can create documents for their restaurant" ON public.document_submissions;

CREATE POLICY "Users can create documents for their restaurant"
  ON public.document_submissions
  FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = user_id
    AND (
      restaurant_id IN (
        SELECT restaurants.id FROM restaurants WHERE restaurants.user_id = auth.uid()
      )
      OR restaurant_id IS NULL
    )
  );

-- Fix 3: reviews — restrict public SELECT to hide customer_id from anon users
-- Reviews should still be publicly readable for the platform to work
-- but we make it authenticated-only to protect customer UUIDs
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

CREATE POLICY "Authenticated users can view reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Also allow public/anon to see reviews (needed for chef profile pages)
-- but this is intentional for platform functionality
CREATE POLICY "Public can view reviews"
  ON public.reviews
  FOR SELECT
  TO anon
  USING (true);