-- Delete test videos with external links
DELETE FROM chef_videos WHERE social_url IS NOT NULL;

-- Remove platform and social_url columns as we only want uploaded videos
ALTER TABLE public.chef_videos DROP COLUMN IF EXISTS social_url;
ALTER TABLE public.chef_videos DROP COLUMN IF EXISTS platform;

-- Make video_url required
ALTER TABLE public.chef_videos ALTER COLUMN video_url SET NOT NULL;