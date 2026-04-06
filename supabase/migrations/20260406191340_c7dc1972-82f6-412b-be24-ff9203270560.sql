
-- 1. Fix: Only show dishes from approved chefs to the public
DROP POLICY IF EXISTS "Anyone can view available dishes" ON public.dishes;
CREATE POLICY "Anyone can view available dishes" ON public.dishes
  FOR SELECT TO public
  USING (
    available = true
    AND chef_id IN (
      SELECT id FROM public.chefs WHERE kitchen_approved = true
    )
  );

-- 2. Fix: Only show chef videos in storage from approved chefs
DROP POLICY IF EXISTS "Anyone can view chef videos" ON storage.objects;
CREATE POLICY "Anyone can view chef videos" ON storage.objects
  FOR SELECT TO public
  USING (
    bucket_id = 'chef-videos'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.chefs WHERE kitchen_approved = true
    )
  );

-- 3. Fix: Only allow approved chefs to upload videos
DROP POLICY IF EXISTS "Chefs can upload videos" ON storage.objects;
CREATE POLICY "Chefs can upload videos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chef-videos'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.chefs
      WHERE user_id = auth.uid() AND kitchen_approved = true
    )
  );
