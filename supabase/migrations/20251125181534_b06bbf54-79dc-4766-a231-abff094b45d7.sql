-- Make documents bucket public so PDFs can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'documents';

-- Update RLS policies for documents bucket to allow authenticated users to read
CREATE POLICY "Authenticated users can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');