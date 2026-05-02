
-- 1. Remove dangerous chef row exposure to customers (hygiene_certificate_url etc.)
DROP POLICY IF EXISTS "Customers with orders can view their chef contact info" ON public.chefs;

-- 2. Block client writes on payment_transactions
CREATE POLICY "Block client writes on payment_transactions - INSERT"
ON public.payment_transactions AS RESTRICTIVE FOR INSERT TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "Block client writes on payment_transactions - UPDATE"
ON public.payment_transactions AS RESTRICTIVE FOR UPDATE TO authenticated, anon
USING (false) WITH CHECK (false);

CREATE POLICY "Block client writes on payment_transactions - DELETE"
ON public.payment_transactions AS RESTRICTIVE FOR DELETE TO authenticated, anon
USING (false);

-- 3. Fix swish_payments write blocks: replace PERMISSIVE false with RESTRICTIVE false
DROP POLICY IF EXISTS "No client inserts on swish_payments" ON public.swish_payments;
DROP POLICY IF EXISTS "No client updates on swish_payments" ON public.swish_payments;
DROP POLICY IF EXISTS "No client deletes on swish_payments" ON public.swish_payments;
DROP POLICY IF EXISTS "No client inserts/updates/deletes on swish_payments" ON public.swish_payments;

CREATE POLICY "Block client writes on swish_payments - INSERT"
ON public.swish_payments AS RESTRICTIVE FOR INSERT TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "Block client writes on swish_payments - UPDATE"
ON public.swish_payments AS RESTRICTIVE FOR UPDATE TO authenticated, anon
USING (false) WITH CHECK (false);

CREATE POLICY "Block client writes on swish_payments - DELETE"
ON public.swish_payments AS RESTRICTIVE FOR DELETE TO authenticated, anon
USING (false);

-- 4. Restrict dish_date_exceptions and dish_weekly_schedule chef management to authenticated role
DROP POLICY IF EXISTS "Chefs can manage their own dish exceptions" ON public.dish_date_exceptions;
CREATE POLICY "Chefs can manage their own dish exceptions"
ON public.dish_date_exceptions FOR ALL TO authenticated
USING (dish_id IN (SELECT d.id FROM dishes d JOIN chefs c ON d.chef_id = c.id WHERE c.user_id = auth.uid()))
WITH CHECK (dish_id IN (SELECT d.id FROM dishes d JOIN chefs c ON d.chef_id = c.id WHERE c.user_id = auth.uid()));

DROP POLICY IF EXISTS "Chefs can manage their own dish schedules" ON public.dish_weekly_schedule;
CREATE POLICY "Chefs can manage their own dish schedules"
ON public.dish_weekly_schedule FOR ALL TO authenticated
USING (dish_id IN (SELECT d.id FROM dishes d JOIN chefs c ON d.chef_id = c.id WHERE c.user_id = auth.uid()))
WITH CHECK (dish_id IN (SELECT d.id FROM dishes d JOIN chefs c ON d.chef_id = c.id WHERE c.user_id = auth.uid()));
