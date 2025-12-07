-- Create swish_payments table for tracking Swish payment requests
CREATE TABLE public.swish_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instruction_id TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  payer_alias TEXT NOT NULL,
  payee_alias TEXT NOT NULL,
  message TEXT,
  order_id UUID REFERENCES public.orders(id),
  status TEXT NOT NULL DEFAULT 'CREATED',
  payment_reference TEXT,
  payment_request_token TEXT,
  date_paid TIMESTAMP WITH TIME ZONE,
  error_code TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.swish_payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments via orders
CREATE POLICY "Users can view their own swish payments"
ON public.swish_payments
FOR SELECT
USING (
  order_id IN (
    SELECT id FROM public.orders WHERE customer_id = auth.uid()
  )
);

-- Admins can view all payments
CREATE POLICY "Admins can view all swish payments"
ON public.swish_payments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert/update (for edge functions)
CREATE POLICY "Service can manage swish payments"
ON public.swish_payments
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_swish_payments_instruction_id ON public.swish_payments(instruction_id);
CREATE INDEX idx_swish_payments_order_id ON public.swish_payments(order_id);
CREATE INDEX idx_swish_payments_status ON public.swish_payments(status);

-- Add trigger for updated_at
CREATE TRIGGER update_swish_payments_updated_at
BEFORE UPDATE ON public.swish_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();