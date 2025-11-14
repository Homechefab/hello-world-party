-- Create test accounts for all roles
-- NOTE: These are test accounts with known passwords. DO NOT use in production!

-- The passwords will be: Test123! for all accounts
-- You'll need to create these accounts through the Supabase Dashboard or using the Supabase CLI
-- because SQL migrations cannot directly create auth.users with passwords

-- This migration will be used to set up the profiles and roles after manual account creation
-- Manual steps required:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create the following users manually:

-- Test Customer Account
-- Email: customer@test.homechef.se
-- Password: Test123!

-- Test Chef Account  
-- Email: chef@test.homechef.se
-- Password: Test123!

-- Test Kitchen Partner Account
-- Email: kitchen@test.homechef.se
-- Password: Test123!

-- Test Restaurant Account
-- Email: restaurant@test.homechef.se
-- Password: Test123!

-- Test Admin Account
-- Email: admin@test.homechef.se
-- Password: Test123!

-- After creating these users in the Supabase Dashboard, run this migration to set up their profiles and roles

-- Note: This is a placeholder migration since we cannot create auth users via SQL
-- You need to use the Supabase Dashboard or CLI to create the actual accounts
