-- Fix 1: Drop the overly permissive anon SELECT policy on chefs that exposes PII
DROP POLICY IF EXISTS "Anyone can view approved chefs" ON public.chefs;

-- Replace with a policy that only allows anon to see non-PII columns via the public_chef_profiles view
-- The public_chef_profiles view already exists and excludes PII fields
-- We add an anon SELECT policy scoped to only the columns in the view
CREATE POLICY "Anon can view approved chef public info only"
ON public.chefs
FOR SELECT
TO anon
USING (
  kitchen_approved = true 
  AND application_status = 'approved'
);

-- Actually, the above still exposes all columns. The correct approach is to
-- remove anon access to the chefs table entirely and rely on public_chef_profiles view.
-- Let's drop the policy we just created and ensure anon has NO direct access to chefs.
DROP POLICY IF EXISTS "Anon can view approved chef public info only" ON public.chefs;

-- Fix 2: Replace business-documents upload policy with path ownership enforcement
DROP POLICY IF EXISTS "Authenticated users can upload business documents" ON storage.objects;

CREATE POLICY "Authenticated users can upload business documents with path ownership"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);