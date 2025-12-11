-- Add policy for anonymous document uploads using chef_id or restaurant_id folder naming
CREATE POLICY "Anyone can upload application documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND 
  (
    (storage.foldername(name))[1] = 'chef-applications' OR
    (storage.foldername(name))[1] = 'restaurant-applications'
  )
);

-- Allow anyone to view application documents (admin will review them)
CREATE POLICY "Admins can view all documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents'
);

-- Add policy for anonymous document submissions linked to chef applications
CREATE POLICY "Anyone can create document submissions for applications"
ON public.document_submissions
FOR INSERT
WITH CHECK (
  (chef_id IS NOT NULL OR restaurant_id IS NOT NULL) AND
  user_id IS NOT NULL
);