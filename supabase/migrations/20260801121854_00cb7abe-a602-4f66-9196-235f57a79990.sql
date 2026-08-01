CREATE POLICY "Admins can manage all chef videos"
ON public.chef_videos FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage chef video files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'chef-videos' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'chef-videos' AND public.has_role(auth.uid(), 'admin'));