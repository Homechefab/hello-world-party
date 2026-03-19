-- 1. early_access_signups: Replace INSERT 'true' with basic validation
DROP POLICY IF EXISTS "Anyone can sign up for early access" ON public.early_access_signups;
CREATE POLICY "Anyone can sign up for early access"
  ON public.early_access_signups
  FOR INSERT
  TO public
  WITH CHECK (
    length(email) >= 5
    AND email LIKE '%_@_%.__%'
    AND length(postal_code) >= 4
    AND length(postal_code) <= 10
  );

-- 2. dish_templates: Restrict SELECT to authenticated users
DROP POLICY IF EXISTS "Everyone can view dish templates" ON public.dish_templates;
CREATE POLICY "Authenticated users can view dish templates"
  ON public.dish_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. dish_weekly_schedule: Restrict public SELECT to authenticated
DROP POLICY IF EXISTS "Anyone can view dish schedules" ON public.dish_weekly_schedule;
CREATE POLICY "Authenticated users can view dish schedules"
  ON public.dish_weekly_schedule
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. dish_date_exceptions: Restrict public SELECT to authenticated
DROP POLICY IF EXISTS "Anyone can view dish exceptions" ON public.dish_date_exceptions;
CREATE POLICY "Authenticated users can view dish exceptions"
  ON public.dish_date_exceptions
  FOR SELECT
  TO authenticated
  USING (true);