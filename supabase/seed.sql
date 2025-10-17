-- Test accounts for different roles
-- Note: Passwords are 'TestPassword123!' for all accounts

-- Admin account
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@homechef.test')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, role, phone, address, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@homechef.test', 'Admin User', 'admin', '+46701234567', 'Admin Street 1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Chef account
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000002', 'chef@homechef.test')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, role, phone, address, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'chef@homechef.test', 'Chef User', 'chef', '+46702345678', 'Chef Street 1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chefs (user_id, kitchen_approved, business_name, hygiene_certificate_url)
VALUES 
  ('00000000-0000-0000-0000-000000000002', true, 'Chef''s Kitchen', 'https://example.com/certificate')
ON CONFLICT (user_id) DO NOTHING;

-- Kitchen Partner account
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000003', 'partner@homechef.test')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, role, phone, address, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'partner@homechef.test', 'Kitchen Partner', 'kitchen_partner', '+46703456789', 'Partner Street 1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Restaurant account
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000004', 'restaurant@homechef.test')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, role, phone, address, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000004', 'restaurant@homechef.test', 'Restaurant Owner', 'restaurant', '+46704567890', 'Restaurant Street 1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Customer account
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000005', 'customer@homechef.test')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, role, phone, address, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000005', 'customer@homechef.test', 'Customer User', 'customer', '+46705678901', 'Customer Street 1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Set up row level security policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Chef table security
ALTER TABLE public.chefs ENABLE ROW LEVEL SECURITY;

-- Chefs can view own data
CREATE POLICY "Chefs can view own data"
  ON public.chefs FOR SELECT
  USING (auth.uid() = user_id);

-- Chefs can update own data
CREATE POLICY "Chefs can update own data"
  ON public.chefs FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can view all chef data
CREATE POLICY "Admins can view all chef data"
  ON public.chefs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );