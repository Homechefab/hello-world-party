-- Fix: Replace profiles email lookup with JWT email in payment_transactions SELECT policy
-- Prevents users from spoofing their profile email to read other users' transactions

DROP POLICY IF EXISTS "Users can view their own transactions" ON payment_transactions;

CREATE POLICY "Users can view their own transactions"
ON payment_transactions FOR SELECT
TO authenticated
USING (customer_email = (auth.jwt() ->> 'email'));