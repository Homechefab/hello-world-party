-- Lägg till RLS policy för admin att se alla chef-ansökningar
CREATE POLICY "Admins can view all chef applications"
ON public.chefs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Lägg till RLS policy för admin att uppdatera chef-ansökningar
CREATE POLICY "Admins can update chef applications"
ON public.chefs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Lägg till RLS policy för admin att se alla dokument
CREATE POLICY "Admins can view all document submissions"
ON public.document_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));