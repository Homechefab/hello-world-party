-- Fix security issues detected in Lovable security scan
-- 1. Login logs: remove the overly permissive SELECT policy that lets ANY
--    authenticated user read ALL login records (IPs, emails).
--    Keep only the policy that restricts reads to one's own records
--    and the existing admin-only policy.
DROP POLICY IF EXISTS "Block anonymous access to login logs" ON public.login_logs;

-- Ensure users can only read their own login logs
DROP POLICY IF EXISTS "Users can view their own login logs" ON public.login_logs;
CREATE POLICY "Users can view their own login logs"
ON public.login_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins retain full visibility (policy already exists from initial migration,
-- but recreate it safely just in case it was dropped by earlier scripts).
DROP POLICY IF EXISTS "Admins can view all login logs" ON public.login_logs;
CREATE POLICY "Admins can view all login logs"
ON public.login_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. RLS policy always true: tighten the "System can update chef user_id" policy.
--    The old USING(true) WITH CHECK(true) allowed anyone (even anon) to update
--    any chef row.  Restrict to service-role callers (service role bypasses RLS)
--    or admins only.  Regular users have no legitimate reason to update this field.
DROP POLICY IF EXISTS "System can update chef user_id" ON public.chefs;
CREATE POLICY "Admins can update chef records"
ON public.chefs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Remove the anon SELECT policy on chefs that exposed all chef data without
--    authentication.  The proper check-by-email flow should go through a
--    server-side function, not an open RLS policy.
DROP POLICY IF EXISTS "Anon can check existing application by email" ON public.chefs;
