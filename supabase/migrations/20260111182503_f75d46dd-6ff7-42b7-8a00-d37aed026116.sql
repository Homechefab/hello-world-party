-- Create function to process referral when new user signs up
CREATE OR REPLACE FUNCTION public.process_referral_signup(
  p_new_user_id UUID,
  p_referral_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_record RECORD;
BEGIN
  -- Find the referrer by code
  SELECT user_id INTO referrer_record
  FROM public.user_referral_codes
  WHERE referral_code = UPPER(TRIM(p_referral_code));
  
  IF referrer_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Värvningskoden hittades inte'
    );
  END IF;
  
  -- Make sure user isn't referring themselves
  IF referrer_record.user_id = p_new_user_id THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Du kan inte använda din egen värvningskod'
    );
  END IF;
  
  -- Check if this user was already referred
  IF EXISTS (
    SELECT 1 FROM public.referrals 
    WHERE referred_user_id = p_new_user_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Du har redan använt en värvningskod'
    );
  END IF;
  
  -- Create the referral record
  INSERT INTO public.referrals (
    user_id,
    referral_code,
    referred_user_id,
    status
  ) VALUES (
    referrer_record.user_id,
    UPPER(TRIM(p_referral_code)),
    p_new_user_id,
    'pending'
  );
  
  -- Update referrer's total referrals count
  UPDATE public.user_referral_codes
  SET 
    total_referrals = total_referrals + 1,
    updated_at = now()
  WHERE user_id = referrer_record.user_id;
  
  RETURN json_build_object(
    'success', true,
    'referrer_id', referrer_record.user_id
  );
END;
$$;

-- Create function to complete referral and award points (called after first purchase)
CREATE OR REPLACE FUNCTION public.complete_referral(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_record RECORD;
  points_per_referral INTEGER := 50;
BEGIN
  -- Find pending referral for this user
  SELECT * INTO referral_record
  FROM public.referrals
  WHERE referred_user_id = p_user_id AND status = 'pending'
  LIMIT 1;
  
  IF referral_record IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Ingen väntande värvning hittades');
  END IF;
  
  -- Update referral to completed
  UPDATE public.referrals
  SET 
    status = 'completed',
    points_awarded = points_per_referral,
    completed_at = now()
  WHERE id = referral_record.id;
  
  -- Award points to referrer
  UPDATE public.user_referral_codes
  SET 
    successful_referrals = successful_referrals + 1,
    total_points_earned = total_points_earned + points_per_referral,
    updated_at = now()
  WHERE user_id = referral_record.user_id;
  
  -- Also add to user_points table for referrer
  INSERT INTO public.user_points (user_id, total_points, current_points)
  VALUES (referral_record.user_id, points_per_referral, points_per_referral)
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_points.total_points + points_per_referral,
    current_points = user_points.current_points + points_per_referral,
    updated_at = now();
  
  -- Also add to user_points table for referred user
  INSERT INTO public.user_points (user_id, total_points, current_points)
  VALUES (p_user_id, points_per_referral, points_per_referral)
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_points.total_points + points_per_referral,
    current_points = user_points.current_points + points_per_referral,
    updated_at = now();
  
  -- Record points transactions
  INSERT INTO public.points_transactions (user_id, transaction_type, points_amount, description)
  VALUES 
    (referral_record.user_id, 'referral_bonus', points_per_referral, 'Värvningsbonus - din vän gjorde sitt första köp'),
    (p_user_id, 'welcome_bonus', points_per_referral, 'Välkomstbonus - registrering med värvningskod');
  
  RETURN json_build_object(
    'success', true,
    'points_awarded', points_per_referral
  );
END;
$$;