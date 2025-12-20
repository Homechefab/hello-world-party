-- Add admin role for info@homechef.nu
INSERT INTO public.user_roles (user_id, role)
VALUES ('ce80bec2-3b9e-4726-a073-38f3b6486d76', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Also ensure the user has a profile entry
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('ce80bec2-3b9e-4726-a073-38f3b6486d76', 'info@homechef.nu', 'Admin', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = now();