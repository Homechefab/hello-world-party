-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('verification-documents', 'verification-documents', FALSE),
('identity-documents', 'identity-documents', FALSE),
('business-documents', 'business-documents', FALSE);

-- Set policies for verification documents
CREATE POLICY "Users can upload their own verification documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'verification-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'verification-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Set policies for identity documents
CREATE POLICY "Users can upload their own identity documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'identity-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own identity documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'identity-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Set policies for business documents
CREATE POLICY "Users can upload their own business documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'business-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own business documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'business-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Add admin policies for document review
CREATE POLICY "Admins can view all verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id IN ('verification-documents', 'identity-documents', 'business-documents')
    AND EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Set max file size limits
UPDATE storage.buckets
SET file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/heic', 'application/pdf']
WHERE id IN ('verification-documents', 'identity-documents', 'business-documents');