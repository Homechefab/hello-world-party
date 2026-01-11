-- Create referrals table to track referral codes and usage
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create user_referral_codes table to store each user's unique referral code
CREATE TABLE public.user_referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER DEFAULT 0,
  successful_referrals INTEGER DEFAULT 0,
  total_points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referral_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals
CREATE POLICY "Users can view their own referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create referrals"
ON public.referrals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_referral_codes
CREATE POLICY "Users can view their own referral code"
ON public.user_referral_codes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral code"
ON public.user_referral_codes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral code stats"
ON public.user_referral_codes
FOR UPDATE
USING (auth.uid() = user_id);

-- Public policy to lookup referral codes (for registration)
CREATE POLICY "Anyone can lookup referral codes"
ON public.user_referral_codes
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_user_referral_codes_updated_at
BEFORE UPDATE ON public.user_referral_codes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code: HC + first 4 chars of user_id + random 2 chars
    new_code := 'HC' || UPPER(SUBSTRING(p_user_id::TEXT, 1, 4)) || 
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 2));
    
    -- Check if code exists
    SELECT EXISTS(SELECT 1 FROM public.user_referral_codes WHERE referral_code = new_code) 
    INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- Create function to get or create user referral code
CREATE OR REPLACE FUNCTION public.get_or_create_referral_code(p_user_id UUID)
RETURNS TABLE(referral_code TEXT, total_referrals INTEGER, successful_referrals INTEGER, total_points_earned INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_code RECORD;
  new_code TEXT;
BEGIN
  -- Check if user already has a code
  SELECT urc.referral_code, urc.total_referrals, urc.successful_referrals, urc.total_points_earned
  INTO existing_code
  FROM public.user_referral_codes urc
  WHERE urc.user_id = p_user_id;
  
  IF FOUND THEN
    RETURN QUERY SELECT existing_code.referral_code, existing_code.total_referrals, 
                        existing_code.successful_referrals, existing_code.total_points_earned;
  ELSE
    -- Generate new code
    new_code := public.generate_referral_code(p_user_id);
    
    -- Insert new record
    INSERT INTO public.user_referral_codes (user_id, referral_code)
    VALUES (p_user_id, new_code);
    
    RETURN QUERY SELECT new_code, 0, 0, 0;
  END IF;
END;
$$;