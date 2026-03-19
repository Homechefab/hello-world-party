-- Fix 1: Remove overly permissive document_submissions INSERT policy
DROP POLICY IF EXISTS "Anyone can create document submissions for applications" ON document_submissions;

-- Fix 2: Make business-documents bucket private
UPDATE storage.buckets SET public = false WHERE id = 'business-documents';

-- Fix 3: Add storage RLS policies for business-documents bucket
CREATE POLICY "Authenticated users can upload business documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-documents');

CREATE POLICY "Users can view own business documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'business-documents' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);

CREATE POLICY "Admins can view all business documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'business-documents' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);