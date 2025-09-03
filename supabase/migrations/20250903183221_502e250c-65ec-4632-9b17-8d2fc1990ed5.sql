-- Insert test profiles for chefs
INSERT INTO public.profiles (id, email, full_name, role, address, phone) VALUES
  (gen_random_uuid(), 'anna@homechef.se', 'Anna Lindström', 'chef', 'Södermalm, Stockholm', '+46701234567'),
  (gen_random_uuid(), 'marco@homechef.se', 'Marco Rossi', 'chef', 'Gamla Stan, Stockholm', '+46702345678'),
  (gen_random_uuid(), 'lisa@homechef.se', 'Lisa Karlsson', 'chef', 'Östermalm, Stockholm', '+46703456789')
ON CONFLICT (id) DO NOTHING;

-- Insert test chefs (using the profile IDs)
WITH chef_profiles AS (
  SELECT id, full_name FROM profiles WHERE role = 'chef'
)
INSERT INTO public.chefs (id, user_id, business_name, kitchen_approved, municipality_approval_date) 
SELECT 
  gen_random_uuid(),
  cp.id,
  CASE 
    WHEN cp.full_name = 'Anna Lindström' THEN 'Annas Hembageri'
    WHEN cp.full_name = 'Marco Rossi' THEN 'Marco''s Italienska Kök'
    WHEN cp.full_name = 'Lisa Karlsson' THEN 'Lisas Vegetariska Delikatesser'
  END,
  true,
  now()
FROM chef_profiles cp
ON CONFLICT (user_id) DO UPDATE SET
  kitchen_approved = true,
  municipality_approval_date = now();

-- Insert test dishes for each chef
WITH approved_chefs AS (
  SELECT c.id as chef_id, c.business_name, p.full_name
  FROM chefs c
  JOIN profiles p ON c.user_id = p.id
  WHERE c.kitchen_approved = true
)
INSERT INTO public.dishes (id, chef_id, name, description, price, category, allergens, ingredients, preparation_time, available, image_url) VALUES
-- Anna's dishes
((SELECT chef_id FROM approved_chefs WHERE business_name = 'Annas Hembageri'), gen_random_uuid(), 'Hemgjorda köttbullar', 'Klassiska svenska köttbullar med gräddsås och lingonsylt. Gjorda på kött från lokala gårdar.', 85, 'Svenskt', ARRAY['Gluten', 'Mjölk'], ARRAY['Nötkött', 'Grädde', 'Lingon', 'Potatis'], 30, true, '/src/assets/meatballs.jpg'),
((SELECT chef_id FROM approved_chefs WHERE business_name = 'Annas Hembageri'), gen_random_uuid(), 'Hemgjord äppelpaj', 'Klassisk äppelpaj med kanel och vaniljsås. Gjord på äpplen från egna trädgården.', 75, 'Dessert', ARRAY['Gluten', 'Mjölk', 'Ägg'], ARRAY['Äpplen', 'Kanel', 'Smör', 'Mjöl'], 15, true, '/src/assets/apple-pie.jpg'),

-- Marco's dishes  
((SELECT chef_id FROM approved_chefs WHERE business_name = 'Marco''s Italienska Kök'), gen_random_uuid(), 'Krämig carbonara', 'Autentisk italiensk pasta carbonara med ägg, parmesan och guanciale. Tillagad enligt familjerecept.', 95, 'Italienskt', ARRAY['Gluten', 'Mjölk', 'Ägg'], ARRAY['Pasta', 'Ägg', 'Parmesan', 'Guanciale'], 25, true, '/src/assets/pasta.jpg'),
((SELECT chef_id FROM approved_chefs WHERE business_name = 'Marco''s Italienska Kök'), gen_random_uuid(), 'Margherita Pizza', 'Klassisk italiensk pizza med tomatsås, mozzarella och basilika. Bakad i stenugn.', 120, 'Italienskt', ARRAY['Gluten', 'Mjölk'], ARRAY['Pizzadeg', 'Tomater', 'Mozzarella', 'Basilika'], 20, true, '/src/assets/pasta.jpg'),

-- Lisa's dishes
((SELECT chef_id FROM approved_chefs WHERE business_name = 'Lisas Vegetariska Delikatesser'), gen_random_uuid(), 'Grönsaksoppa', 'Näringsrik soppa gjord på säsongens färska grönsaker. Serveras med hemgjort bröd.', 65, 'Vegetariskt', ARRAY['Gluten'], ARRAY['Morötter', 'Selleri', 'Lök', 'Vegetabilisk buljong'], 20, true, '/src/assets/soup.jpg'),
((SELECT chef_id FROM approved_chefs WHERE business_name = 'Lisas Vegetariska Delikatesser'), gen_random_uuid(), 'Falafel med hummus', 'Krispiga falafels med cremig hummus och färska grönsaker. Helt vegetariskt.', 78, 'Vegetariskt', ARRAY['Sesam'], ARRAY['Kikärtor', 'Tahini', 'Gurka', 'Tomat'], 15, true, '/src/assets/soup.jpg')

ON CONFLICT (id) DO NOTHING;