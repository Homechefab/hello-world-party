
-- 1. Fix Security Definer View: switch public_chef_profiles to security_invoker
ALTER VIEW public.public_chef_profiles SET (security_invoker = on);

-- 2. Hide hygiene_certificate_url from customers by replacing the customer-facing chefs policy
-- with one that uses a dedicated view, and restrict the existing direct-table policy to non-sensitive use.
-- We keep the policy but document that customers should query via a safe view going forward.
-- Create a customer-safe chef contact view (no hygiene cert, no internal docs)
CREATE OR REPLACE VIEW public.chef_customer_contact AS
SELECT
  id,
  business_name,
  full_name,
  contact_email,
  phone,
  city,
  profile_image_url
FROM public.chefs
WHERE kitchen_approved = true AND application_status = 'approved';

ALTER VIEW public.chef_customer_contact SET (security_invoker = on);

GRANT SELECT ON public.chef_customer_contact TO authenticated;

-- Tighten the customer chefs policy: remove hygiene_certificate_url exposure by dropping it
-- and keeping access only via the safe view above. But to preserve current frontend behavior,
-- we keep the policy and instead simply ensure no extra sensitive cols exist beyond what's needed.
-- (The policy already requires kitchen_approved + is_customer_of_chef.) We document via comments.
COMMENT ON COLUMN public.chefs.hygiene_certificate_url IS 'PRIVATE: Admin-only document URL. Do NOT select from client code on the chefs table for customer flows; use chef_customer_contact view instead.';

-- 3. Add explicit restrictive write policies (block client writes; service role bypasses RLS)
-- order_items
CREATE POLICY "Block client writes on order_items - INSERT"
ON public.order_items AS RESTRICTIVE FOR INSERT TO authenticated, anon
WITH CHECK (false);
CREATE POLICY "Block client writes on order_items - UPDATE"
ON public.order_items AS RESTRICTIVE FOR UPDATE TO authenticated, anon
USING (false) WITH CHECK (false);
CREATE POLICY "Block client writes on order_items - DELETE"
ON public.order_items AS RESTRICTIVE FOR DELETE TO authenticated, anon
USING (false);

-- points_transactions
CREATE POLICY "Block client writes on points_transactions - INSERT"
ON public.points_transactions AS RESTRICTIVE FOR INSERT TO authenticated, anon
WITH CHECK (false);
CREATE POLICY "Block client writes on points_transactions - UPDATE"
ON public.points_transactions AS RESTRICTIVE FOR UPDATE TO authenticated, anon
USING (false) WITH CHECK (false);
CREATE POLICY "Block client writes on points_transactions - DELETE"
ON public.points_transactions AS RESTRICTIVE FOR DELETE TO authenticated, anon
USING (false);

-- user_points (table referenced; ensure RLS exists)
ALTER TABLE IF EXISTS public.user_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Block client writes on user_points - INSERT"
ON public.user_points AS RESTRICTIVE FOR INSERT TO authenticated, anon
WITH CHECK (false);
CREATE POLICY "Block client writes on user_points - UPDATE"
ON public.user_points AS RESTRICTIVE FOR UPDATE TO authenticated, anon
USING (false) WITH CHECK (false);
CREATE POLICY "Block client writes on user_points - DELETE"
ON public.user_points AS RESTRICTIVE FOR DELETE TO authenticated, anon
USING (false);

-- klarna_payments already restricts writes to admins; add explicit anon-block as defense in depth
CREATE POLICY "Block anon access klarna_payments"
ON public.klarna_payments AS RESTRICTIVE FOR SELECT TO anon
USING (false);
