-- 1. PROFILES: Block anonymous access explicitly
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 2. CHEFS: Fix the email-based policy to require authentication and ownership
DROP POLICY IF EXISTS "Users can view own applications by email" ON public.chefs;
CREATE POLICY "Users can view own chef application by user_id or email"
ON public.chefs FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  (auth.uid() = user_id OR (auth.jwt() ->> 'email') = contact_email)
);

-- 3. DELIVERY_ADDRESSES: Require authentication for all operations
CREATE POLICY "Block anonymous access to delivery addresses"
ON public.delivery_addresses FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 4. ORDERS: Block anonymous access
CREATE POLICY "Block anonymous access to orders"
ON public.orders FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 5. PAYMENT_TRANSACTIONS: Tighten service policies - drop overly permissive policies
-- Note: service role bypasses RLS anyway, so we remove the 'true' policies

-- 6. SWISH_PAYMENTS: Drop the overly permissive policy
DROP POLICY IF EXISTS "Service can manage swish payments" ON public.swish_payments;

-- Create proper policy for authenticated access
CREATE POLICY "Authenticated users can manage their swish payments"
ON public.swish_payments FOR ALL
USING (
  auth.uid() IS NOT NULL AND 
  (
    order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (
    order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  )
);

-- 7. KLARNA_PAYMENTS: Drop the overly permissive policy
DROP POLICY IF EXISTS "Service can manage klarna payments" ON public.klarna_payments;

-- Create proper policy for authenticated access
CREATE POLICY "Authenticated users can manage their klarna payments"
ON public.klarna_payments FOR ALL
USING (
  auth.uid() IS NOT NULL AND 
  (
    order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (
    order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  )
);

-- 8. LOGIN_LOGS: Block anonymous access and allow users to view own logs
CREATE POLICY "Block anonymous access to login logs"
ON public.login_logs FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own login logs"
ON public.login_logs FOR SELECT
USING (auth.uid() = user_id);

-- 9. RESTAURANTS: Block anonymous access
CREATE POLICY "Block anonymous access to restaurants"
ON public.restaurants FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 10. KITCHEN_PARTNERS: Block anonymous access
CREATE POLICY "Block anonymous access to kitchen partners"
ON public.kitchen_partners FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 11. DOCUMENT_SUBMISSIONS: Block anonymous access
CREATE POLICY "Block anonymous access to documents"
ON public.document_submissions FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 12. PAYMENT_METHODS: Block anonymous access  
CREATE POLICY "Block anonymous access to payment methods"
ON public.payment_methods FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 13. ORDER_ITEMS: Block anonymous access
CREATE POLICY "Block anonymous access to order items"
ON public.order_items FOR SELECT
USING (auth.uid() IS NOT NULL);