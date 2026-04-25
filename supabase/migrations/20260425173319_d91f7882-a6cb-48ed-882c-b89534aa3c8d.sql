-- Fix 1: Lock down klarna_payments writes explicitly (defense in depth)
-- Currently no INSERT/UPDATE/DELETE policies exist, so by default no one can write.
-- We add explicit admin-only policies to make the security model clear and prevent any future relaxation from accidentally opening writes to all authenticated users.

DROP POLICY IF EXISTS "Only admins can insert klarna payments" ON public.klarna_payments;
CREATE POLICY "Only admins can insert klarna payments"
ON public.klarna_payments
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can update klarna payments" ON public.klarna_payments;
CREATE POLICY "Only admins can update klarna payments"
ON public.klarna_payments
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can delete klarna payments" ON public.klarna_payments;
CREATE POLICY "Only admins can delete klarna payments"
ON public.klarna_payments
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));


-- Fix 2: Restrict chef PII (phone, address, postal_code, contact_email) from general authenticated users.
-- Replace the broad "Authenticated users can view approved chefs" policy with one limited to:
--   - The chef themselves (existing separate policy)
--   - Admins (existing separate policy)
--   - Customers who have an existing order with the chef (need contact info for delivery/communication)
-- All other authenticated users must use the public_chef_profiles view, which excludes sensitive contact fields.

DROP POLICY IF EXISTS "Authenticated users can view approved chefs" ON public.chefs;

CREATE POLICY "Customers with orders can view their chef contact info"
ON public.chefs
FOR SELECT
TO authenticated
USING (
  kitchen_approved = true
  AND application_status = 'approved'
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.chef_id = chefs.id
      AND o.customer_id = auth.uid()
  )
);
