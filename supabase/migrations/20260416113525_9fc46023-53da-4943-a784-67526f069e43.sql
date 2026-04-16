-- Add chef_id to payment_transactions to link transactions to chefs
ALTER TABLE public.payment_transactions 
ADD COLUMN chef_id uuid REFERENCES public.chefs(id) ON DELETE SET NULL;