-- =============================================================
-- GLOBAL SECURITY HARDENING: Field-Level UPDATE Protection
-- Prevents non-admin users from modifying approval/status/points
-- columns on their own rows across ALL relevant tables.
-- =============================================================

-- 1. CHEFS TABLE: Split update into profile-only (non-admin) and full (admin)
DROP POLICY IF EXISTS "Chefs can update their own data" ON public.chefs;

CREATE POLICY "Chefs can update own profile fields only"
  ON public.chefs
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND kitchen_approved IS NOT DISTINCT FROM (SELECT c.kitchen_approved FROM public.chefs c WHERE c.id = chefs.id)
    AND application_status IS NOT DISTINCT FROM (SELECT c.application_status FROM public.chefs c WHERE c.id = chefs.id)
    AND municipality_approval_date IS NOT DISTINCT FROM (SELECT c.municipality_approval_date FROM public.chefs c WHERE c.id = chefs.id)
    AND rejection_reason IS NOT DISTINCT FROM (SELECT c.rejection_reason FROM public.chefs c WHERE c.id = chefs.id)
  );

-- 2. KITCHEN_PARTNERS TABLE: Prevent self-approval
DROP POLICY IF EXISTS "Kitchen partners can update their own data" ON public.kitchen_partners;

CREATE POLICY "Kitchen partners can update own profile fields only"
  ON public.kitchen_partners
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND approved IS NOT DISTINCT FROM (SELECT kp.approved FROM public.kitchen_partners kp WHERE kp.id = kitchen_partners.id)
    AND application_status IS NOT DISTINCT FROM (SELECT kp.application_status FROM public.kitchen_partners kp WHERE kp.id = kitchen_partners.id)
    AND rejection_reason IS NOT DISTINCT FROM (SELECT kp.rejection_reason FROM public.kitchen_partners kp WHERE kp.id = kitchen_partners.id)
  );

-- 3. RESTAURANTS TABLE: Prevent self-approval
DROP POLICY IF EXISTS "Restaurants can update their own data" ON public.restaurants;

CREATE POLICY "Restaurants can update own profile fields only"
  ON public.restaurants
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND approved IS NOT DISTINCT FROM (SELECT r.approved FROM public.restaurants r WHERE r.id = restaurants.id)
    AND application_status IS NOT DISTINCT FROM (SELECT r.application_status FROM public.restaurants r WHERE r.id = restaurants.id)
    AND rejection_reason IS NOT DISTINCT FROM (SELECT r.rejection_reason FROM public.restaurants r WHERE r.id = restaurants.id)
  );

-- 4. BUSINESS_PARTNERS TABLE: Prevent status manipulation
DROP POLICY IF EXISTS "Users can update their own business application" ON public.business_partners;

CREATE POLICY "Users can update own business profile fields only"
  ON public.business_partners
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND application_status IS NOT DISTINCT FROM (SELECT bp.application_status FROM public.business_partners bp WHERE bp.id = business_partners.id)
    AND rejection_reason IS NOT DISTINCT FROM (SELECT bp.rejection_reason FROM public.business_partners bp WHERE bp.id = business_partners.id)
  );

-- 5. USER_REFERRAL_CODES TABLE: Prevent points manipulation
DROP POLICY IF EXISTS "Users can update their own referral code stats" ON public.user_referral_codes;

CREATE POLICY "Users can update own referral code display name only"
  ON public.user_referral_codes
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND successful_referrals IS NOT DISTINCT FROM (SELECT urc.successful_referrals FROM public.user_referral_codes urc WHERE urc.id = user_referral_codes.id)
    AND total_points_earned IS NOT DISTINCT FROM (SELECT urc.total_points_earned FROM public.user_referral_codes urc WHERE urc.id = user_referral_codes.id)
    AND total_referrals IS NOT DISTINCT FROM (SELECT urc.total_referrals FROM public.user_referral_codes urc WHERE urc.id = user_referral_codes.id)
  );

-- 6. DOCUMENT_SUBMISSIONS TABLE: Prevent status manipulation
DROP POLICY IF EXISTS "Users can update their own document submissions" ON public.document_submissions;

CREATE POLICY "Users can update own document fields only"
  ON public.document_submissions
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status IS NOT DISTINCT FROM (SELECT ds.status FROM public.document_submissions ds WHERE ds.id = document_submissions.id)
    AND ai_analysis IS NOT DISTINCT FROM (SELECT ds.ai_analysis FROM public.document_submissions ds WHERE ds.id = document_submissions.id)
    AND rejection_reason IS NOT DISTINCT FROM (SELECT ds.rejection_reason FROM public.document_submissions ds WHERE ds.id = document_submissions.id)
  );

-- 7. ORDERS TABLE: Harden customer update to prevent amount/chef/customer manipulation
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
    AND status IN ('pending', 'confirmed', 'cancelled')
    AND total_amount IS NOT DISTINCT FROM (SELECT o.total_amount FROM public.orders o WHERE o.id = orders.id)
    AND chef_id IS NOT DISTINCT FROM (SELECT o.chef_id FROM public.orders o WHERE o.id = orders.id)
    AND customer_id IS NOT DISTINCT FROM (SELECT o.customer_id FROM public.orders o WHERE o.id = orders.id)
  );