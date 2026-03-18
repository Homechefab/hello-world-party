-- Fix business_partners: drop permissive INSERT policy and add authenticated-only policy
DROP POLICY IF EXISTS "Anyone can submit business application" ON public.business_partners;

CREATE POLICY "Authenticated users can submit business application"
  ON public.business_partners
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also fix chefs table: same issue with anonymous INSERT
DROP POLICY IF EXISTS "Anyone can create chef application" ON public.chefs;

CREATE POLICY "Authenticated users can create chef application"
  ON public.chefs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);