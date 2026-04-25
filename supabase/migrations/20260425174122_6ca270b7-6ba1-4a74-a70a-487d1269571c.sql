-- Fix: Remove 'orders' table from Supabase Realtime publication.
-- Rationale: Realtime broadcasts row-level changes based on the publication membership,
-- not the table's RLS SELECT policies. This means subscribed clients could potentially
-- receive change events containing other customers' phone numbers, delivery addresses,
-- and special instructions. Order status updates are instead delivered to chefs/customers
-- via the application's existing notification flows (push, SMS, email, polling),
-- per the project's `realtime-orders-status` security policy.

ALTER PUBLICATION supabase_realtime DROP TABLE public.orders;