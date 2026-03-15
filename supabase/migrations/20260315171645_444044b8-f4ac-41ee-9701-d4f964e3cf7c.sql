
-- 1. Fix: user_referral_codes publicly readable — restrict to authenticated users viewing own + lookup by code
DROP POLICY IF EXISTS "Anyone can lookup referral codes" ON public.user_referral_codes;

CREATE POLICY "Users can view their own referral codes"
  ON public.user_referral_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Fix: chefs phone/email exposed — remove broad policy, keep admin + own data + use public_chef_profiles view for discovery
DROP POLICY IF EXISTS "Authenticated users can view approved chefs" ON public.chefs;

-- 3. Fix: kitchen_partners broad authenticated access — remove the overly permissive policy
DROP POLICY IF EXISTS "Block anonymous access to kitchen partners" ON public.kitchen_partners;
