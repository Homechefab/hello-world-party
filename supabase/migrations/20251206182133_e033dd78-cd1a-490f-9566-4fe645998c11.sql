-- Update with a working sample video URL (short cooking reel style)
UPDATE public.chef_videos 
SET video_url = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
WHERE chef_id = '148a04b5-61de-4a9a-8075-f8c19aa4be0c';