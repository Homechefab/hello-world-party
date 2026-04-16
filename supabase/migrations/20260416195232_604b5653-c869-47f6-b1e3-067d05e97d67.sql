-- Ensure all public views use security_invoker so they respect the querying
-- user's RLS policies, not the view owner's.

ALTER VIEW public.public_chef_profiles SET (security_invoker = true);
ALTER VIEW public.swish_payments_safe SET (security_invoker = true);
ALTER VIEW public.klarna_payments_safe SET (security_invoker = true);