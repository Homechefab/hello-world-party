-- Fix Farhan's account: add chef role to user_roles table
INSERT INTO public.user_roles (user_id, role)
VALUES ('5e2125de-5c1e-4f57-8cd2-b347689a9afe', 'chef')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update profile role
UPDATE public.profiles
SET role = 'chef'
WHERE id = '5e2125de-5c1e-4f57-8cd2-b347689a9afe';