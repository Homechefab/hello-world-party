-- Add chef_id to document_submissions to link documents to chef applications
ALTER TABLE public.document_submissions
ADD COLUMN chef_id UUID REFERENCES public.chefs(id) ON DELETE CASCADE;

-- Add application status to chefs table for tracking approval workflow
ALTER TABLE public.chefs
ADD COLUMN application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'under_review', 'approved', 'rejected'));

-- Add rejection reason to chefs table
ALTER TABLE public.chefs
ADD COLUMN rejection_reason TEXT;

-- Create index for better query performance
CREATE INDEX idx_document_submissions_chef_id ON public.document_submissions(chef_id);
CREATE INDEX idx_chefs_application_status ON public.chefs(application_status);