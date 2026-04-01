CREATE OR REPLACE VIEW public.public_chef_profiles AS
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

ALTER VIEW public.public_chef_profiles SET (security_invoker = false);
GRANT SELECT ON public.public_chef_profiles TO anon, authenticated;