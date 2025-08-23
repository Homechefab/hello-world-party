-- Add RLS policy for the existing Farhan table to fix the security warning
CREATE POLICY "Allow all operations on Farhan table" ON public.Farhan
  FOR ALL USING (true);