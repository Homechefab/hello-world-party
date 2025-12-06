-- Delete existing test video and add multiple food-related videos
DELETE FROM public.chef_videos WHERE chef_id = '148a04b5-61de-4a9a-8075-f8c19aa4be0c';

INSERT INTO public.chef_videos (chef_id, title, description, video_url)
VALUES 
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Krispig Falafel från grunden',
  'Så gör jag mina hemlagade falafelbullar med kikärtor och färska örter.',
  'https://static.videezy.com/system/resources/previews/000/041/804/original/alr-h0010.mp4'
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Saftig kebab med hemlagad tzatziki',
  'Min signaturrätt - marinerad kyckling med krämig tzatziki.',
  'https://static.videezy.com/system/resources/previews/000/044/172/original/G0010044.mp4'
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Färsk pasta carbonara',
  'Klassisk italiensk pasta med ägg, pecorino och krispig pancetta.',
  'https://static.videezy.com/system/resources/previews/000/042/135/original/Pasta.mp4'
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Grillad lax med citron',
  'Perfekt grillad lax med färska örter och citronsmör.',
  'https://static.videezy.com/system/resources/previews/000/035/691/original/09.mp4'
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Vegetarisk wraps',
  'Fräscha och nyttiga wraps fyllda med grönsaker och hummus.',
  'https://static.videezy.com/system/resources/previews/000/041/551/original/PA220015.mp4'
);