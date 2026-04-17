-- Allow public read access to approved chefs' public profile fields.
-- The public_chef_profiles view uses security_invoker, so it now relies on
-- this policy to expose approved chefs to anonymous visitors.
-- We exclude internal review accounts (e.g. Apple Review / Google review) by
-- filtering out @homechef.nu contact emails.

CREATE POLICY "Public can view approved chefs"
ON public.chefs
FOR SELECT
TO anon, authenticated
USING (
  kitchen_approved = true
  AND application_status = 'approved'
  AND (contact_email IS NULL OR contact_email NOT ILIKE '%@homechef.nu')
);