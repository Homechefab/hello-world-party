-- Switch back to security_invoker view
DROP VIEW IF EXISTS public.public_chef_profiles;

CREATE VIEW public.public_chef_profiles
WITH (security_invoker = true) AS
SELECT 
  id, created_at, business_name, full_name, bio,
  profile_image_url, tiktok_url, instagram_url, facebook_url,
  snapchat_url, specialties, city
FROM public.chefs
WHERE kitchen_approved = true AND application_status = 'approved';

GRANT SELECT ON public.public_chef_profiles TO anon;
GRANT SELECT ON public.public_chef_profiles TO authenticated;

-- Add public SELECT policy on chefs for approved chefs only
-- This allows anonymous users to see approved chef data through the view
CREATE POLICY "Anyone can view approved chefs"
  ON public.chefs FOR SELECT TO anon
  USING (kitchen_approved = true AND application_status = 'approved');