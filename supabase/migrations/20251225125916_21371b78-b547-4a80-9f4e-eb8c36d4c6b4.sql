-- Create storage bucket for business partner documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-documents', 'business-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to business-documents bucket
CREATE POLICY "Users can upload business documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'business-documents');

-- Allow users to read their own uploaded documents
CREATE POLICY "Users can read business documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-documents');

-- Add column for document URL in business_partners table
ALTER TABLE public.business_partners
ADD COLUMN IF NOT EXISTS food_registration_document_url TEXT;