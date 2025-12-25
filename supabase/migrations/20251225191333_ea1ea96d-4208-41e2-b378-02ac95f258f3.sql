-- Create table for early access signups
CREATE TABLE public.early_access_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup)
CREATE POLICY "Anyone can sign up for early access" 
ON public.early_access_signups 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view signups
CREATE POLICY "Admins can view all signups" 
ON public.early_access_signups 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index on postal_code for faster queries
CREATE INDEX idx_early_access_postal_code ON public.early_access_signups(postal_code);