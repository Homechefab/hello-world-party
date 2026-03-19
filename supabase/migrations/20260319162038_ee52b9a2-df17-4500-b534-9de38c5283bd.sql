
-- ============================================================
-- FIX 1: ORDER_STATUS_MANIPULATION
-- Restrict customer updates to orders that are still in non-terminal status
-- ============================================================
DROP POLICY IF EXISTS "Customers can update limited order fields" ON public.orders;
CREATE POLICY "Customers can update limited order fields"
  ON public.orders
  FOR UPDATE
  TO public
  USING (
    auth.uid() = customer_id
    AND status IN ('pending', 'confirmed')
  )
  WITH CHECK (
    auth.uid() = customer_id
    AND status IN ('pending', 'confirmed')
  );

-- ============================================================
-- FIX 2: PAYMENT_RECORD_INJECTION
-- Remove ALL (INSERT/UPDATE/DELETE) policies from end users on
-- swish_payments and klarna_payments. Keep SELECT-only for users
-- and full access for admins (server-side/service_role handles writes).
-- ============================================================

-- swish_payments: drop the permissive ALL policy
DROP POLICY IF EXISTS "Authenticated users can manage their swish payments" ON public.swish_payments;

-- klarna_payments: drop the permissive ALL policy
DROP POLICY IF EXISTS "Authenticated users can manage their klarna payments" ON public.klarna_payments;
