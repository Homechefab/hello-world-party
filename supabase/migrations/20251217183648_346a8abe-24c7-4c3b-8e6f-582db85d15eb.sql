-- Fix the SECURITY DEFINER view warning by dropping and recreating as regular view
DROP VIEW IF EXISTS public.public_chef_profiles;

CREATE VIEW public.public_chef_profiles 
WITH (security_invoker = on)
AS
SELECT 
  id,
  business_name,
  full_name,
  bio,
  profile_image_url,
  tiktok_url,
  instagram_url,
  facebook_url,
  snapchat_url,
  specialties,
  city,
  created_at
FROM public.chefs
WHERE kitchen_approved = true;

-- Grant access to the view for anonymous users
GRANT SELECT ON public.public_chef_profiles TO anon;
GRANT SELECT ON public.public_chef_profiles TO authenticated;