
-- Fix 1: Remove anonymous INSERT policy on chefs table
-- The submit-chef-application edge function uses service role key and bypasses RLS,
-- so this policy only opens a direct attack vector for arbitrary DB inserts.
DROP POLICY IF EXISTS "Anyone can submit chef application without account" ON public.chefs;

-- Fix 2: Remove client INSERT policies on orders and order_items
-- All order creation goes through edge functions (stripe-payment, klarna-payment, swish-payment)
-- which use service role key. These policies are unused but allow price manipulation.
DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;
