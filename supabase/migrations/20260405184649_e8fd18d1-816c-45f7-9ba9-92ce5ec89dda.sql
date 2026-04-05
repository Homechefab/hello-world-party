
-- =============================================
-- FIX 1: payment_transactions — add user_id, update RLS
-- =============================================

-- Add user_id column
ALTER TABLE public.payment_transactions
ADD COLUMN user_id uuid;

-- Backfill user_id from profiles.email where possible
UPDATE public.payment_transactions pt
SET user_id = p.id
FROM public.profiles p
WHERE pt.customer_email = p.email AND pt.user_id IS NULL;

-- Drop old email-based SELECT policy
DROP POLICY IF EXISTS "Users can view their own transactions by auth uid" ON public.payment_transactions;

-- Create new user_id-based SELECT policy
CREATE POLICY "Users can view their own transactions"
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Keep admin policy as-is (already uses user_roles)

-- =============================================
-- FIX 2: swish_payments — block client INSERT/UPDATE/DELETE
-- =============================================

-- No client should directly insert/update/delete swish_payments.
-- Only service-role edge functions do this.
-- Explicitly deny all write operations for non-service-role users.

-- Block INSERT from regular users (service role bypasses RLS)
CREATE POLICY "No client inserts on swish_payments"
ON public.swish_payments
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Block UPDATE from regular users
CREATE POLICY "No client updates on swish_payments"
ON public.swish_payments
FOR UPDATE
TO authenticated
USING (false);

-- Block DELETE from regular users
CREATE POLICY "No client deletes on swish_payments"
ON public.swish_payments
FOR DELETE
TO authenticated
USING (false);
