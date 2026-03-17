-- Drop overly permissive "Block anonymous access" policies that expose all data to any authenticated user
DROP POLICY IF EXISTS "Block anonymous access to orders" ON orders;
DROP POLICY IF EXISTS "Block anonymous access to order items" ON order_items;
DROP POLICY IF EXISTS "Block anonymous access to documents" ON document_submissions;
DROP POLICY IF EXISTS "Block anonymous access to restaurants" ON restaurants;