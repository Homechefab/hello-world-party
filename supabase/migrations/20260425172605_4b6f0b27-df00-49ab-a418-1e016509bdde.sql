
-- Fix 1: Restrict public chef data exposure
-- Remove anon access from the chefs table; force anonymous users to use public_chef_profiles view (which excludes phone, address, contact_email, postal_code, etc.)
DROP POLICY IF EXISTS "Public can view approved chefs" ON public.chefs;

CREATE POLICY "Authenticated users can view approved chefs"
ON public.chefs
FOR SELECT
TO authenticated
USING (
  kitchen_approved = true
  AND application_status = 'approved'
  AND ((contact_email IS NULL) OR (contact_email !~~* '%@homechef.nu'::text))
);

-- Fix 2: Restrict Realtime broadcast/presence channel access for orders
-- Enable RLS on realtime.messages and add policies that scope channel access by ownership.
-- Channel topic naming convention: 'order-notifications-<user_id>' or 'chef-new-orders-<user_id>'
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can subscribe to own order channels" ON realtime.messages;
CREATE POLICY "Authenticated users can subscribe to own order channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = ('order-notifications-' || auth.uid()::text)
  OR realtime.topic() = ('chef-new-orders-' || auth.uid()::text)
);

DROP POLICY IF EXISTS "Authenticated users can broadcast to own order channels" ON realtime.messages;
CREATE POLICY "Authenticated users can broadcast to own order channels"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  realtime.topic() = ('order-notifications-' || auth.uid()::text)
  OR realtime.topic() = ('chef-new-orders-' || auth.uid()::text)
);
