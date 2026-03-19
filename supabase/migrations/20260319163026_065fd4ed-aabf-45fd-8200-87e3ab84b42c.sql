-- Fix 1: Remove email-based SELECT policy on chefs table
DROP POLICY IF EXISTS "Users can view own chef application by user_id or email" ON public.chefs;

-- Fix 2: Remove email-based DELETE policy on chefs table
DROP POLICY IF EXISTS "Authenticated users can delete own rejected application" ON public.chefs;

-- Recreate DELETE policy using only auth.uid()
CREATE POLICY "Authenticated users can delete own rejected application"
  ON public.chefs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND application_status IN ('rejected', 'pending'));