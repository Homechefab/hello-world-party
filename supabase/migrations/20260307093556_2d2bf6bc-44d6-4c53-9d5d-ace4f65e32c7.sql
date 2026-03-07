
-- Create webshop_products table
CREATE TABLE public.webshop_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'övrigt',
  available BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webshop_products ENABLE ROW LEVEL SECURITY;

-- Anyone can view available products
CREATE POLICY "Anyone can view available webshop products"
  ON public.webshop_products
  FOR SELECT
  USING (available = true);

-- Admins can manage all products
CREATE POLICY "Admins can manage webshop products"
  ON public.webshop_products
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_webshop_products_updated_at
  BEFORE UPDATE ON public.webshop_products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
