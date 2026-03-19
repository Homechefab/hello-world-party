-- Recreate public_chef_profiles as security_definer view (default)
-- so anonymous users can see approved chefs without needing RLS access to base table
DROP VIEW IF EXISTS public.public_chef_profiles;

CREATE VIEW public.public_chef_profiles AS
SELECT 
  id, created_at, business_name, full_name, bio,
  profile_image_url, tiktok_url, instagram_url, facebook_url,
  snapchat_url, specialties, city
FROM public.chefs
WHERE kitchen_approved = true AND application_status = 'approved';

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.public_chef_profiles TO anon;
GRANT SELECT ON public.public_chef_profiles TO authenticated;