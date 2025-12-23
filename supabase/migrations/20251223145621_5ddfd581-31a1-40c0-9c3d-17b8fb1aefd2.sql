-- Create business_partners table for business applications
CREATE TABLE public.business_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  organization_number TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  business_type TEXT NOT NULL,
  business_description TEXT,
  food_safety_approved BOOLEAN DEFAULT false,
  has_insurance BOOLEAN DEFAULT false,
  website_url TEXT,
  application_status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_partners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own business application"
ON public.business_partners
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business application"
ON public.business_partners
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business application"
ON public.business_partners
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all business applications"
ON public.business_partners
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all business applications"
ON public.business_partners
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_partners_updated_at
BEFORE UPDATE ON public.business_partners
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();