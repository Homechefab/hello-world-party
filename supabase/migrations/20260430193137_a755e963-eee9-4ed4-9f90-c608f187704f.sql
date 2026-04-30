-- Recreate public_chef_profiles WITHOUT security_invoker so it bypasses RLS on chefs.
-- The view itself only exposes non-sensitive columns and only approved chefs.
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

GRANT SELECT ON public.public_chef_profiles TO anon, authenticated;