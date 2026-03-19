-- Fix security definer view by making it security invoker
DROP VIEW IF EXISTS public.public_chef_profiles;

CREATE VIEW public.public_chef_profiles
WITH (security_invoker = true)
AS
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