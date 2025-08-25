-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create document submissions table
CREATE TABLE public.document_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_url TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'municipal_permit',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing')),
  ai_analysis TEXT,
  rejection_reason TEXT,
  municipality TEXT,
  permit_number TEXT,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view their own document submissions" 
ON public.document_submissions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own submissions
CREATE POLICY "Users can create their own document submissions" 
ON public.document_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update their own document submissions" 
ON public.document_submissions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage policies for documents
CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_document_submissions_updated_at
BEFORE UPDATE ON public.document_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();