-- Create storage bucket for chef videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('chef-videos', 'chef-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view chef videos
CREATE POLICY "Anyone can view chef videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'chef-videos');

-- Chefs can upload their own videos
CREATE POLICY "Chefs can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chef-videos' 
  AND auth.uid() IN (
    SELECT user_id FROM public.chefs WHERE user_id = auth.uid()
  )
);

-- Chefs can delete their own videos
CREATE POLICY "Chefs can delete their videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chef-videos'
  AND auth.uid() IN (
    SELECT user_id FROM public.chefs WHERE user_id = auth.uid()
  )
);