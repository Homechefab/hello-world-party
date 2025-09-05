-- Create user preferences table for personal settings
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  allergies TEXT[] DEFAULT '{}',
  favorite_dishes TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'sv',
  dietary_restrictions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create delivery addresses table
CREATE TABLE public.delivery_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL, -- e.g., "Hem", "Jobb"
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'Sweden',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL, -- e.g., "Mitt Visa-kort"
  type TEXT NOT NULL, -- e.g., "card", "swish", "paypal"
  last_four TEXT, -- last 4 digits for cards
  is_default BOOLEAN DEFAULT false,
  stripe_payment_method_id TEXT, -- for Stripe integration
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for delivery_addresses
CREATE POLICY "Users can view their own addresses" 
ON public.delivery_addresses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" 
ON public.delivery_addresses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" 
ON public.delivery_addresses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" 
ON public.delivery_addresses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for payment_methods
CREATE POLICY "Users can view their own payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" 
ON public.payment_methods 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" 
ON public.payment_methods 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" 
ON public.payment_methods 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_delivery_addresses_updated_at
  BEFORE UPDATE ON public.delivery_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Ensure only one default address per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.delivery_addresses 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_address_trigger
  BEFORE INSERT OR UPDATE ON public.delivery_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_default_address();

-- Ensure only one default payment method per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.payment_methods 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_payment_trigger
  BEFORE INSERT OR UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_default_payment();