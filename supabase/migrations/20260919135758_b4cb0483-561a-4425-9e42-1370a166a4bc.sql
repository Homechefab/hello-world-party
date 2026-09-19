CREATE TABLE public.chef_payout_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chef_id uuid NOT NULL UNIQUE REFERENCES public.chefs(id) ON DELETE CASCADE,
  stripe_account_id text NOT NULL UNIQUE,
  charges_enabled boolean NOT NULL DEFAULT false,
  payouts_enabled boolean NOT NULL DEFAULT false,
  details_submitted boolean NOT NULL DEFAULT false,
  requirements_due text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.chef_payout_accounts TO authenticated;
GRANT ALL ON public.chef_payout_accounts TO service_role;

ALTER TABLE public.chef_payout_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chefs can view their own payout account"
ON public.chef_payout_accounts FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.chefs c WHERE c.id = chef_payout_accounts.chef_id AND c.user_id = auth.uid()));

CREATE POLICY "Admins can view all payout accounts"
ON public.chef_payout_accounts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER chef_payout_accounts_updated_at
BEFORE UPDATE ON public.chef_payout_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS chef_earnings numeric,
  ADD COLUMN IF NOT EXISTS payout_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS stripe_transfer_id text,
  ADD COLUMN IF NOT EXISTS paid_out_at timestamptz,
  ADD COLUMN IF NOT EXISTS payout_error text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_transfer_id_key ON public.orders (stripe_transfer_id) WHERE stripe_transfer_id IS NOT NULL;