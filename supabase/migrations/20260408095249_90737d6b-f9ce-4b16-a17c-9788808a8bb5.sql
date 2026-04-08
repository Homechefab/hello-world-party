
DROP POLICY IF EXISTS "Anyone can view chef videos" ON public.chef_videos;

CREATE POLICY "Anyone can view chef videos"
ON public.chef_videos
FOR SELECT
USING (public.is_chef_approved(chef_id));
