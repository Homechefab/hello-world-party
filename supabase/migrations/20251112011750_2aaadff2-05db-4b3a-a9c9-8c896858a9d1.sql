-- Add all roles for admin user (admin@test.homechef.se)
-- User ID: 04d00b3a-f105-4719-b924-c930261b05a5

INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('04d00b3a-f105-4719-b924-c930261b05a5', 'admin'),
  ('04d00b3a-f105-4719-b924-c930261b05a5', 'chef'),
  ('04d00b3a-f105-4719-b924-c930261b05a5', 'kitchen_partner'),
  ('04d00b3a-f105-4719-b924-c930261b05a5', 'restaurant'),
  ('04d00b3a-f105-4719-b924-c930261b05a5', 'customer')
ON CONFLICT (user_id, role) DO NOTHING;

-- Also create a chef profile for this user so chef features work
INSERT INTO public.chefs (user_id, business_name, kitchen_approved)
VALUES ('04d00b3a-f105-4719-b924-c930261b05a5', 'Admin Test Kitchen', true)
ON CONFLICT (user_id) DO UPDATE 
SET kitchen_approved = true;

-- Create kitchen partner profile
INSERT INTO public.kitchen_partners (user_id, business_name, address, approved, application_status)
VALUES ('04d00b3a-f105-4719-b924-c930261b05a5', 'Admin Test Kitchen Space', 'Testgatan 1, Stockholm', true, 'approved')
ON CONFLICT (user_id) DO UPDATE 
SET approved = true, application_status = 'approved';