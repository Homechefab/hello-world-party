-- Fix infinite recursion in profiles RLS policy by removing the problematic admin policy
-- and replacing it with a simpler approach

-- Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new admin policy that doesn't create circular dependency
-- Admins will be identified by having 'admin' role, but we'll check this differently
CREATE POLICY "Admin users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow users to see their own profile
  auth.uid() = id
  OR
  -- Allow if the current user has admin role (direct check without subquery)
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);