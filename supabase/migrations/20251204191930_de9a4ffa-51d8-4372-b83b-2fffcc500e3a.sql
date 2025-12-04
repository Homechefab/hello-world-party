-- Add restaurant_id column to document_submissions table for restaurant documents
ALTER TABLE public.document_submissions
ADD COLUMN restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE;

-- Add index for restaurant_id lookups
CREATE INDEX idx_document_submissions_restaurant_id ON public.document_submissions(restaurant_id);

-- Update RLS policy to allow restaurants to view documents linked to their restaurant
CREATE POLICY "Restaurants can view their own documents"
ON public.document_submissions
FOR SELECT
USING (
  restaurant_id IN (
    SELECT id FROM public.restaurants WHERE user_id = auth.uid()
  )
);

-- Allow authenticated users to insert documents for their restaurant
CREATE POLICY "Users can create documents for their restaurant"
ON public.document_submissions
FOR INSERT
WITH CHECK (
  restaurant_id IN (
    SELECT id FROM public.restaurants WHERE user_id = auth.uid()
  )
  OR restaurant_id IS NULL
);

-- Allow admins to view documents linked to restaurants
CREATE POLICY "Admins can view restaurant documents"
ON public.document_submissions
FOR SELECT
USING (
  restaurant_id IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role)
);