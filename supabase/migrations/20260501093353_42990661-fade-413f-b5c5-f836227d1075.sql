ALTER VIEW public.public_chef_profiles SET (security_invoker = false);
GRANT SELECT ON public.public_chef_profiles TO anon, authenticated;