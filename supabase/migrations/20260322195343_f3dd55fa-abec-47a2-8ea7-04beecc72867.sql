
-- Admin policies for dishes table
CREATE POLICY "Admins can view all dishes"
ON public.dishes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all dishes"
ON public.dishes
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all dishes"
ON public.dishes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert dishes"
ON public.dishes
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for chef_operating_hours table
CREATE POLICY "Admins can update chef operating hours"
ON public.chef_operating_hours
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert chef operating hours"
ON public.chef_operating_hours
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete chef operating hours"
ON public.chef_operating_hours
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
