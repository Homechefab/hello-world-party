
-- =============================================
-- FIX 1: user_roles — prevent non-admin INSERT/UPDATE/DELETE
-- Add RESTRICTIVE policies so only admins can modify roles.
-- The existing trigger (prevent_admin_role_assignment) provides
-- an extra layer but RLS should be the primary guard.
-- =============================================

-- Block non-admin INSERT on user_roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Block non-admin UPDATE on user_roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Block non-admin DELETE on user_roles
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- FIX 2: swish_payments — remove customer SELECT that exposes phone numbers
-- Customers don't need direct access to swish_payments records.
-- Payment status is tracked via the orders table instead.
-- Only admins should see these records.
-- =============================================

DROP POLICY IF EXISTS "Users can view their own swish payments" ON public.swish_payments;
