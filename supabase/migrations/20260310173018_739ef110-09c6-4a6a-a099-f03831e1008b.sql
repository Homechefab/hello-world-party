
-- Fix 1: Documents bucket - drop overly permissive SELECT policy and create proper admin-only one
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Fix 2: Remove anonymous DELETE on chefs table and replace with authenticated-only policy
DROP POLICY IF EXISTS "Anon can delete incomplete or rejected chef applications" ON public.chefs;
CREATE POLICY "Authenticated users can delete own rejected application"
  ON public.chefs FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = contact_email 
    AND application_status IN ('rejected', 'pending')
  );
