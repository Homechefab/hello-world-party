-- Fix 1: payment_transactions — replace email-based RLS with identity-based
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.payment_transactions;

CREATE POLICY "Users can view their own transactions via orders"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

-- Fix 2: public_chef_profiles view — recreate with approved-only filter
DROP VIEW IF EXISTS public.public_chef_profiles;

CREATE VIEW public.public_chef_profiles AS
SELECT 
  id,
  created_at,
  business_name,
  full_name,
  bio,
  profile_image_url,
  tiktok_url,
  instagram_url,
  facebook_url,
  snapchat_url,
  specialties,
  city
FROM public.chefs
WHERE kitchen_approved = true
  AND application_status = 'approved';