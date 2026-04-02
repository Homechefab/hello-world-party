
-- 1. Fix referrals INSERT: force status='pending' and points_awarded=0
DROP POLICY IF EXISTS "Users can create referrals" ON public.referrals;
CREATE POLICY "Users can create referrals"
ON public.referrals
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND (points_awarded IS NULL OR points_awarded = 0)
);

-- 2. Fix document_submissions INSERT: validate chef_id ownership
DROP POLICY IF EXISTS "Users can create their own document submissions" ON public.document_submissions;
CREATE POLICY "Users can create their own document submissions"
ON public.document_submissions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    chef_id IS NULL
    OR chef_id IN (SELECT id FROM chefs WHERE user_id = auth.uid())
  )
);

-- 3. Fix documents bucket storage: restrict uploads to own chef/restaurant paths
-- Drop the overly permissive upload policy
DROP POLICY IF EXISTS "Authenticated users can upload application documents" ON storage.objects;

-- Create ownership-verified upload policy for documents bucket
CREATE POLICY "Authenticated users can upload own application documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND (
    -- Chef applications: path must match user's chef ID
    (
      (storage.foldername(name))[1] = 'chef-applications'
      AND (storage.foldername(name))[2] IN (
        SELECT id::text FROM chefs WHERE user_id = auth.uid()
      )
    )
    OR
    -- Restaurant applications: path must match user's restaurant ID
    (
      (storage.foldername(name))[1] = 'restaurant-applications'
      AND (storage.foldername(name))[2] IN (
        SELECT id::text FROM restaurants WHERE user_id = auth.uid()
      )
    )
    OR
    -- General user documents: path starts with user's own ID
    (
      (storage.foldername(name))[1] = auth.uid()::text
    )
  )
);
