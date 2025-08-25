-- Create predefined dishes table for templates
CREATE TABLE public.dish_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  ingredients TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  preparation_time INTEGER,
  suggested_price NUMERIC(10,2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dish_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing templates (everyone can see them)
CREATE POLICY "Everyone can view dish templates" 
ON public.dish_templates 
FOR SELECT 
USING (true);

-- Insert popular Swedish dishes
INSERT INTO public.dish_templates (name, description, category, ingredients, allergens, preparation_time, suggested_price, image_url) VALUES
-- Huvudrätter
('Köttbullar med potatismos', 'Klassiska svenska köttbullar serverade med krämigt potatismos och lingonsylt', 'Huvudrätter', '{"nötfärs", "ägg", "ströbröd", "lök", "potatis", "mjölk", "smör", "lingonsylt"}', '{"gluten", "ägg", "mjölk"}', 45, 149.00, null),
('Pasta Carbonara', 'Krämig pasta med bacon, ägg och parmesan', 'Huvudrätter', '{"pasta", "bacon", "ägg", "parmesan", "grädde", "vitlök"}', '{"gluten", "ägg", "mjölk"}', 25, 129.00, null),
('Lax med dillsås', 'Grillad lax med krämig dillsås och kokt potatis', 'Huvudrätter', '{"laxfilé", "dill", "grädde", "potatis", "citron", "smör"}', '{"fisk", "mjölk"}', 30, 189.00, null),
('Kyckling Tikka Masala', 'Kryddstark indisk kycklinggryta med basmatiris', 'Huvudrätter', '{"kycklingfilé", "kokosmjölk", "tomater", "lök", "ingefära", "garam masala", "basmatiris"}', '{}', 40, 159.00, null),
('Vegetarisk Lasagne', 'Lasagne med grönsaker, spenat och ricotta', 'Huvudrätter', '{"lasagneplattor", "zucchini", "aubergine", "spenat", "ricotta", "mozzarella", "tomatsås"}', '{"gluten", "mjölk"}', 60, 139.00, null),

-- Förrätter
('Caesarsallad', 'Klassisk caesarsallad med krutonger och parmesan', 'Förrätter', '{"isbergssallad", "krutonger", "parmesan", "caesardressing", "sardeller"}', '{"gluten", "ägg", "mjölk", "fisk"}', 15, 89.00, null),
('Räksmörgås', 'Öppet smörgås med skalade räkor och dillmajonnäs', 'Förrätter', '{"skalade räkor", "bröd", "majonnäs", "dill", "ägg", "gurka"}', '{"skaldjur", "ägg", "gluten"}', 10, 119.00, null),
('Hummus med grönsaker', 'Hemlagad hummus serverad med färska grönsaker', 'Förrätter', '{"kikärter", "tahini", "citron", "vitlök", "olivolja", "morötter", "gurka", "paprika"}', '{"sesam"}', 15, 79.00, null),
('Bruschetta', 'Rostade brödsköivor toppade med tomater och basilika', 'Förrätter', '{"ciabattabröd", "tomater", "basilika", "vitlök", "olivolja", "mozzarella"}', '{"gluten", "mjölk"}', 15, 69.00, null),

-- Efterrätter
('Kladdkaka', 'Kladdig chokladkaka serverad med vispad grädde', 'Efterrätter', '{"ägg", "socker", "smör", "mjöl", "kakao", "vispgrädde"}', '{"gluten", "ägg", "mjölk"}', 45, 79.00, null),
('Pannacotta med bär', 'Krämig pannacotta toppat med säsongens bär', 'Efterrätter', '{"grädde", "socker", "gelatin", "vanilj", "blåbär", "hallon"}', '{"mjölk"}', 20, 89.00, null),
('Apple Pie', 'Hemlagad äppelpaj med vaniljsås', 'Efterrätter', '{"äpplen", "smör", "mjöl", "socker", "kanel", "ägg", "vaniljsås"}', '{"gluten", "ägg", "mjölk"}', 60, 95.00, null),
('Tiramisu', 'Klassisk italiensk dessert med mascarpone och kaffe', 'Efterrätter', '{"ladyfingers", "mascarpone", "ägg", "socker", "kaffe", "kakao", "marsala"}', '{"gluten", "ägg", "mjölk"}', 30, 99.00, null),

-- Vegetariskt/Veganskt
('Falafel med tzatziki', 'Krispiga falafel serverade med tzatziki och sallad', 'Vegetariskt', '{"kikärter", "persilja", "koriander", "vitlök", "yoghurt", "gurka", "sallad"}', '{"mjölk", "sesam"}', 25, 119.00, null),
('Quinoasallad', 'Näringsrik sallad med quinoa, avokado och grönsaker', 'Vegetariskt', '{"quinoa", "avokado", "cherrytomater", "gurka", "fetaost", "olivolja", "citron", "rucola"}', '{"mjölk"}', 20, 129.00, null),
('Vegansk Buddha Bowl', 'Färgglad skål med quinoa, rostade grönsaker och tahini', 'Veganskt', '{"quinoa", "sötpotatis", "broccoli", "rödkål", "avokado", "tahini", "lime"}', '{"sesam"}', 30, 139.00, null),
('Halloumi-burgare', 'Vegetarisk burgare med grillad halloumi', 'Vegetariskt', '{"hamburgerbröd", "halloumi", "sallad", "tomat", "rödlök", "avokado", "pommes frites"}', '{"gluten", "mjölk"}', 25, 149.00, null);

-- Create trigger for updating timestamps
CREATE TRIGGER update_dish_templates_updated_at
  BEFORE UPDATE ON public.dish_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();