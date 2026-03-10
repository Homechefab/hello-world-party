-- Update anon delete policy to also allow deleting pending (incomplete) applications
DROP POLICY IF EXISTS "Anon can delete rejected chef applications" ON chefs;
CREATE POLICY "Anon can delete incomplete or rejected chef applications"
  ON chefs FOR DELETE
  TO anon
  USING (application_status IN ('rejected', 'pending'));