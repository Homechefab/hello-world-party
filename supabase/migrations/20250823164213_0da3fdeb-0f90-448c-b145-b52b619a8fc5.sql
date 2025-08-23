-- Add RLS policy for the existing Farhan table (with proper case)
CREATE POLICY "Allow all operations on Farhan table" ON public."Farhan"
  FOR ALL USING (true);