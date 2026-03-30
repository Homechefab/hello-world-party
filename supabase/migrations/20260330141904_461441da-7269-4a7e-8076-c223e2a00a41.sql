
-- Fix 1: Remove overly permissive public policies on business-documents bucket
DROP POLICY IF EXISTS "Users can read business documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload business documents" ON storage.objects;

-- Fix 2: Drop weak chef video storage policies and recreate with path ownership
DROP POLICY IF EXISTS "Chefs can delete their videos" ON storage.objects;
DROP POLICY IF EXISTS "Chefs can upload videos" ON storage.objects;

-- Recreate chef video upload policy with path ownership check
CREATE POLICY "Chefs can upload videos" ON storage.objects
FOR INSERT TO public
WITH CHECK (
  bucket_id = 'chef-videos'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM chefs c WHERE c.user_id = auth.uid()
  )
);

-- Recreate chef video delete policy with path ownership check
CREATE POLICY "Chefs can delete their videos" ON storage.objects
FOR DELETE TO public
USING (
  bucket_id = 'chef-videos'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM chefs c WHERE c.user_id = auth.uid()
  )
);
