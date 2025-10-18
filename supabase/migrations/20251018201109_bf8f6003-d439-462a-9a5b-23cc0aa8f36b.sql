-- Replace admin select policy on profiles to avoid referencing auth.users
DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Optional: align kitchen_partners admin policies with has_role for consistency
DROP POLICY IF EXISTS "Admins can update kitchen partner status" ON public.kitchen_partners;
CREATE POLICY "Admins can update kitchen partner status"
ON public.kitchen_partners
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all kitchen partners" ON public.kitchen_partners;
CREATE POLICY "Admins can view all kitchen partners"
ON public.kitchen_partners
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
