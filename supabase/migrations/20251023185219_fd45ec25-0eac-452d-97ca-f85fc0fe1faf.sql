-- Create table for payment transactions with commission details
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  customer_email TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL,
  chef_earnings NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SEK',
  payment_status TEXT NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_session 
  ON public.payment_transactions(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_customer_email 
  ON public.payment_transactions(customer_email);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can see all transactions
CREATE POLICY "Admins can view all transactions"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Users can see their own transactions by email
CREATE POLICY "Users can view their own transactions"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    customer_email = (
      SELECT email FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.payment_transactions IS 'Stores payment transaction details including commission breakdown for bookkeeping and chef reports';