-- Add profile_image_url column to chefs table
ALTER TABLE public.chefs
ADD COLUMN profile_image_url text;

-- Create storage bucket for chef profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chef-profiles', 'chef-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own profile images
CREATE POLICY "Chefs can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chef-profiles' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view chef profile images (public bucket)
CREATE POLICY "Anyone can view chef profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'chef-profiles');

-- Allow chefs to update their own profile images
CREATE POLICY "Chefs can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'chef-profiles' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow chefs to delete their own profile images
CREATE POLICY "Chefs can delete their own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chef-profiles' AND
  auth.uid()::text = (storage.foldername(name))[1]
);