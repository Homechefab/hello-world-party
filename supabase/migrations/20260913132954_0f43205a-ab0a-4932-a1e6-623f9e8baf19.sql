DROP POLICY IF EXISTS "Admins can manage all chef profile images" ON storage.objects;
CREATE POLICY "Admins can manage all chef profile images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'chef-profiles'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'chef-profiles'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);