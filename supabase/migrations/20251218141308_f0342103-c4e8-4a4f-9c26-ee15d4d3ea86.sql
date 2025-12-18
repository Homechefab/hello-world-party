-- Fix 1: Make documents bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'documents';

-- Fix 2: Drop overly permissive policies
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view documents" ON storage.objects;

-- Fix 3: Create proper RLS policies for documents bucket

-- Allow users to view their own chef application documents
CREATE POLICY "Users can view own chef documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = 'chef-applications' AND
  (storage.foldername(name))[2] IN (
    SELECT id::text FROM public.chefs WHERE user_id = auth.uid()
  )
);

-- Allow users to view their own restaurant application documents
CREATE POLICY "Users can view own restaurant documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = 'restaurant-applications' AND
  (storage.foldername(name))[2] IN (
    SELECT id::text FROM public.restaurants WHERE user_id = auth.uid()
  )
);

-- Allow admins to view all documents
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Keep existing upload policies but ensure they're properly scoped
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;

CREATE POLICY "Users can upload to chef applications"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = 'chef-applications'
);

CREATE POLICY "Users can upload to restaurant applications"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = 'restaurant-applications'
);