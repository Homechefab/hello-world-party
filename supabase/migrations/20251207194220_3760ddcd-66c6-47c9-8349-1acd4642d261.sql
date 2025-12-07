-- Create klarna_payments table for tracking Klarna payment requests
CREATE TABLE public.klarna_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  klarna_order_id TEXT UNIQUE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SEK',
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'CREATED',
  payment_method TEXT,
  order_id UUID REFERENCES public.orders(id),
  html_snippet TEXT,
  checkout_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.klarna_payments ENABLE ROW LEVEL SECURITY;

-- Admins can view all klarna payments
CREATE POLICY "Admins can view all klarna payments"
ON public.klarna_payments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own payments via orders
CREATE POLICY "Users can view their own klarna payments"
ON public.klarna_payments
FOR SELECT
USING (
  order_id IN (
    SELECT id FROM public.orders WHERE customer_id = auth.uid()
  )
);

-- Service role can manage klarna payments (for edge functions)
CREATE POLICY "Service can manage klarna payments"
ON public.klarna_payments
FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for faster lookups
CREATE INDEX idx_klarna_payments_klarna_order_id ON public.klarna_payments(klarna_order_id);
CREATE INDEX idx_klarna_payments_order_id ON public.klarna_payments(order_id);
CREATE INDEX idx_klarna_payments_status ON public.klarna_payments(status);

-- Add trigger for updated_at
CREATE TRIGGER update_klarna_payments_updated_at
BEFORE UPDATE ON public.klarna_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();