-- Add dishes for Farhan
INSERT INTO public.dishes (chef_id, name, description, price, category, preparation_time, available, allergens, ingredients)
VALUES 
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Hemlagad Falafel med Hummus',
  'Krispiga falafelbullar serverade med krämig hummus, picklade grönsaker och varmt pitabröd.',
  129,
  'Huvudrätt',
  25,
  true,
  ARRAY['gluten', 'sesam'],
  ARRAY['kikärtor', 'vitlök', 'persilja', 'koriander', 'tahini', 'citron']
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Kycklingkebab med Tzatziki',
  'Saftig marinerad kyckling med hemlagad tzatziki, färsk sallad och pommes frites.',
  145,
  'Huvudrätt',
  30,
  true,
  ARRAY['gluten', 'laktos'],
  ARRAY['kyckling', 'yoghurt', 'gurka', 'vitlök', 'dill', 'potatis']
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Pasta Carbonara',
  'Klassisk italiensk pasta med krämig äggsås, krispig pancetta och pecorinoost.',
  135,
  'Huvudrätt',
  20,
  true,
  ARRAY['gluten', 'ägg', 'laktos'],
  ARRAY['pasta', 'ägg', 'pancetta', 'pecorino', 'svartpeppar']
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Grillad Lax med Citronsmör',
  'Perfekt grillad laxfilé med smält citronsmör, dillpotatis och säsongens grönsaker.',
  169,
  'Huvudrätt',
  35,
  true,
  ARRAY['fisk', 'laktos'],
  ARRAY['lax', 'smör', 'citron', 'dill', 'potatis', 'sparris']
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Vegetarisk Buddha Bowl',
  'Färgglad skål med quinoa, rostade grönsaker, avokado, hummus och tahindressing.',
  119,
  'Huvudrätt',
  25,
  true,
  ARRAY['sesam'],
  ARRAY['quinoa', 'sötpotatis', 'kikärtor', 'avokado', 'grönkål', 'tahini']
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Svenska Köttbullar',
  'Traditionella svenska köttbullar med gräddsås, lingonsylt och potatismos.',
  139,
  'Huvudrätt',
  30,
  true,
  ARRAY['gluten', 'laktos', 'ägg'],
  ARRAY['nötfärs', 'fläskfärs', 'lök', 'grädde', 'lingon', 'potatis']
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Thai Röd Curry',
  'Krämig thailändsk curry med kyckling, bambu, paprika och jasminris.',
  145,
  'Huvudrätt',
  30,
  true,
  ARRAY['skaldjur', 'jordnötter'],
  ARRAY['kyckling', 'kokosmjölk', 'röd currypasta', 'bambu', 'paprika', 'jasminris']
),
(
  '148a04b5-61de-4a9a-8075-f8c19aa4be0c',
  'Hemlagad Soppa',
  'Dagens hemlagade soppa serverad med nybakat bröd och smör.',
  89,
  'Förrätt',
  15,
  true,
  ARRAY['gluten', 'laktos'],
  ARRAY['säsongens grönsaker', 'buljong', 'grädde', 'bröd']
);
