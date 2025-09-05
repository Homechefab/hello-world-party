-- Create user points system
CREATE TABLE public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_points INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0, -- Points available to use
  points_used INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  next_discount_at INTEGER DEFAULT 5, -- Next purchase number for discount
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create points transactions table
CREATE TABLE public.points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  order_id UUID,
  transaction_type TEXT NOT NULL, -- 'earned', 'used', 'discount_applied'
  points_amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_points
CREATE POLICY "Users can view their own points" 
ON public.user_points 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points" 
ON public.user_points 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points" 
ON public.user_points 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for points_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.points_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.points_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at on user_points
CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to award points for purchases
CREATE OR REPLACE FUNCTION public.award_points_for_purchase(
  p_user_id UUID,
  p_order_id UUID,
  p_order_amount NUMERIC
)
RETURNS JSON AS $$
DECLARE
  points_earned INTEGER;
  current_purchases INTEGER;
  discount_eligible BOOLEAN := false;
  discount_percentage NUMERIC := 0;
  user_points_record RECORD;
BEGIN
  -- Calculate points (1 point per 10 kr spent)
  points_earned := FLOOR(p_order_amount / 10);
  
  -- Get or create user points record
  SELECT * INTO user_points_record 
  FROM public.user_points 
  WHERE user_id = p_user_id;
  
  IF user_points_record IS NULL THEN
    INSERT INTO public.user_points (user_id, total_points, current_points, total_purchases)
    VALUES (p_user_id, points_earned, points_earned, 1)
    RETURNING * INTO user_points_record;
    
    current_purchases := 1;
  ELSE
    current_purchases := user_points_record.total_purchases + 1;
    
    -- Check if eligible for discount (every 5th purchase)
    IF current_purchases % 5 = 0 THEN
      discount_eligible := true;
      discount_percentage := 10;
    END IF;
    
    -- Update points
    UPDATE public.user_points 
    SET 
      total_points = total_points + points_earned,
      current_points = current_points + points_earned,
      total_purchases = current_purchases,
      next_discount_at = CASE 
        WHEN current_purchases % 5 = 0 THEN current_purchases + 5
        ELSE next_discount_at
      END,
      updated_at = now()
    WHERE user_id = p_user_id
    RETURNING * INTO user_points_record;
  END IF;
  
  -- Record points transaction
  INSERT INTO public.points_transactions (
    user_id, 
    order_id, 
    transaction_type, 
    points_amount, 
    description
  )
  VALUES (
    p_user_id,
    p_order_id,
    'earned',
    points_earned,
    'Poäng från köp: ' || p_order_amount || ' kr'
  );
  
  -- Return result
  RETURN json_build_object(
    'points_earned', points_earned,
    'total_points', user_points_record.total_points,
    'current_points', user_points_record.current_points,
    'total_purchases', current_purchases,
    'discount_eligible', discount_eligible,
    'discount_percentage', discount_percentage,
    'next_discount_at', user_points_record.next_discount_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to apply discount and deduct points
CREATE OR REPLACE FUNCTION public.apply_loyalty_discount(
  p_user_id UUID,
  p_order_id UUID,
  p_original_amount NUMERIC
)
RETURNS JSON AS $$
DECLARE
  user_points_record RECORD;
  discount_amount NUMERIC;
  final_amount NUMERIC;
  current_purchases INTEGER;
BEGIN
  -- Get user points record
  SELECT * INTO user_points_record 
  FROM public.user_points 
  WHERE user_id = p_user_id;
  
  IF user_points_record IS NULL THEN
    RAISE EXCEPTION 'User points record not found';
  END IF;
  
  current_purchases := user_points_record.total_purchases + 1;
  
  -- Check if eligible for discount (every 5th purchase)
  IF current_purchases % 5 = 0 THEN
    discount_amount := p_original_amount * 0.10; -- 10% discount
    final_amount := p_original_amount - discount_amount;
    
    -- Record discount transaction
    INSERT INTO public.points_transactions (
      user_id, 
      order_id, 
      transaction_type, 
      points_amount, 
      description
    )
    VALUES (
      p_user_id,
      p_order_id,
      'discount_applied',
      0,
      '10% lojalitetsrabatt tillämpad: -' || discount_amount || ' kr'
    );
    
    RETURN json_build_object(
      'discount_applied', true,
      'discount_amount', discount_amount,
      'original_amount', p_original_amount,
      'final_amount', final_amount,
      'discount_percentage', 10
    );
  ELSE
    RETURN json_build_object(
      'discount_applied', false,
      'discount_amount', 0,
      'original_amount', p_original_amount,
      'final_amount', p_original_amount,
      'discount_percentage', 0
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;