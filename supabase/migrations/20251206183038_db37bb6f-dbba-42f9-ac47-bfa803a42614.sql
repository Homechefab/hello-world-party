-- Update with videos that work for web playback
DELETE FROM public.chef_videos WHERE chef_id = '148a04b5-61de-4a9a-8075-f8c19aa4be0c';

INSERT INTO public.chef_videos (chef_id, title, description, video_url)
VALUES 
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Krispig Falafel från grunden',
  'Så gör jag mina hemlagade falafelbullar med kikärtor och färska örter.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Saftig kebab med hemlagad tzatziki',
  'Min signaturrätt - marinerad kyckling med krämig tzatziki.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Färsk pasta carbonara',
  'Klassisk italiensk pasta med ägg, pecorino och krispig pancetta.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Grillad lax med citron',
  'Perfekt grillad lax med färska örter och citronsmör.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Vegetarisk wraps',
  'Fräscha och nyttiga wraps fyllda med grönsaker och hummus.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
);