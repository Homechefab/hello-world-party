-- Harden storage policies for public buckets (chef-profiles, chef-videos)
-- Files remain publicly readable via direct CDN URLs, but listing/enumeration
-- is restricted to file owners and admins.

-- chef-profiles bucket
DROP POLICY IF EXISTS "Anyone can view chef profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for chef profiles" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Chef profiles are publicly accessible" ON storage.objects;

-- Allow direct file access by URL (needed for <img src>) but block listing
-- Supabase serves public bucket files via the public CDN endpoint which does
-- not require a SELECT policy match; restricting SELECT only blocks the list API.

CREATE POLICY "Chefs can list their own profile images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chef-profiles'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can list all chef profile images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chef-profiles'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- chef-videos bucket
DROP POLICY IF EXISTS "Anyone can view chef videos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for chef videos" ON storage.objects;
DROP POLICY IF EXISTS "Chef videos are publicly accessible" ON storage.objects;

CREATE POLICY "Chefs can list their own videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chef-videos'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can list all chef videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chef-videos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);