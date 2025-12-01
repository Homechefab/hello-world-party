-- Create restaurants table for restaurant applications
CREATE TABLE IF NOT EXISTS public.restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  full_name text,
  contact_email text,
  phone text,
  address text,
  city text,
  postal_code text,
  restaurant_description text,
  cuisine_types text,
  application_status text DEFAULT 'pending',
  approved boolean DEFAULT false,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Restaurants can view their own data
CREATE POLICY "Restaurants can view their own data"
ON public.restaurants
FOR SELECT
USING (auth.uid() = user_id);

-- Restaurants can update their own data
CREATE POLICY "Restaurants can update their own data"
ON public.restaurants
FOR UPDATE
USING (auth.uid() = user_id);

-- Authenticated users can create restaurant application
CREATE POLICY "Authenticated users can create restaurant application"
ON public.restaurants
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Restaurants can delete their own rejected applications
CREATE POLICY "Restaurants can delete their own rejected applications"
ON public.restaurants
FOR DELETE
USING (
  auth.uid() = user_id 
  AND application_status = 'rejected'
);

-- Admins can view all restaurant applications
CREATE POLICY "Admins can view all restaurant applications"
ON public.restaurants
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update restaurant applications
CREATE POLICY "Admins can update restaurant applications"
ON public.restaurants
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create restaurant_dishes table (same as dishes but for restaurants)
CREATE TABLE IF NOT EXISTS public.restaurant_dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text,
  ingredients text[],
  allergens text[],
  available boolean DEFAULT true,
  preparation_time integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurant_dishes ENABLE ROW LEVEL SECURITY;

-- Anyone can view available dishes
CREATE POLICY "Anyone can view available restaurant dishes"
ON public.restaurant_dishes
FOR SELECT
USING (available = true);

-- Restaurants can view their own dishes
CREATE POLICY "Restaurants can view their own dishes"
ON public.restaurant_dishes
FOR SELECT
USING (
  restaurant_id IN (
    SELECT id FROM public.restaurants WHERE user_id = auth.uid()
  )
);

-- Restaurants can create dishes
CREATE POLICY "Restaurants can create dishes"
ON public.restaurant_dishes
FOR INSERT
WITH CHECK (
  restaurant_id IN (
    SELECT id FROM public.restaurants 
    WHERE user_id = auth.uid() 
    AND approved = true
  )
);

-- Restaurants can update their own dishes
CREATE POLICY "Restaurants can update their own dishes"
ON public.restaurant_dishes
FOR UPDATE
USING (
  restaurant_id IN (
    SELECT id FROM public.restaurants WHERE user_id = auth.uid()
  )
);

-- Restaurants can delete their own dishes
CREATE POLICY "Restaurants can delete their own dishes"
ON public.restaurant_dishes
FOR DELETE
USING (
  restaurant_id IN (
    SELECT id FROM public.restaurants WHERE user_id = auth.uid()
  )
);

-- Create trigger for restaurant_dishes updated_at
CREATE TRIGGER update_restaurant_dishes_updated_at
BEFORE UPDATE ON public.restaurant_dishes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();