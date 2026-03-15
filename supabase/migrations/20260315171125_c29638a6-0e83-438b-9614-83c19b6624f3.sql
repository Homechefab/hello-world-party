
-- 1. Remove the overly permissive anon policy on chefs that exposes all personal data
DROP POLICY IF EXISTS "Anon can check existing application by email" ON public.chefs;

-- 2. Remove the overly permissive "Block anonymous access" policy on profiles
-- that lets ANY authenticated user read ALL profiles
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

-- 3. Remove direct INSERT and UPDATE policies on user_points
-- Points should only be managed through server-side functions
DROP POLICY IF EXISTS "Users can insert their own points" ON public.user_points;
DROP POLICY IF EXISTS "Users can update their own points" ON public.user_points;
