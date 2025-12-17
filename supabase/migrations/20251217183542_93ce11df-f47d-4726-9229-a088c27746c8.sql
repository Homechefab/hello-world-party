-- Fix security issues: Drop dangerous policies and test table

-- 1. Drop the overly permissive "System can update chef user_id" policy
DROP POLICY IF EXISTS "System can update chef user_id" ON public.chefs;

-- 2. Drop the dangerous "Users can view their own applications by email" policy
DROP POLICY IF EXISTS "Users can view their own applications by email" ON public.chefs;

-- 3. Create a proper policy for users to view their own applications by email
CREATE POLICY "Users can view own applications by email"
ON public.chefs 
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  auth.jwt() ->> 'email' = contact_email
);

-- 4. Drop the test Farhan table
DROP TABLE IF EXISTS public."Farhan" CASCADE;

-- 5. Create a secure public view for chef profiles (without PII)
CREATE OR REPLACE VIEW public.public_chef_profiles AS
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

-- 6. Drop the overly permissive "Anyone can view approved chefs" policy
DROP POLICY IF EXISTS "Anyone can view approved chefs" ON public.chefs;

-- 7. Create a more restricted policy - only approved chefs can be viewed by authenticated users
-- (for internal use like order processing, admin, etc.)
CREATE POLICY "Authenticated users can view approved chefs"
ON public.chefs 
FOR SELECT
TO authenticated
USING (kitchen_approved = true);