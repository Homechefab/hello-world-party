-- Update get_user_role to include ekonomi in priority
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'ekonomi' THEN 2
      WHEN 'chef' THEN 3
      WHEN 'kitchen_partner' THEN 4
      WHEN 'restaurant' THEN 5
      WHEN 'customer' THEN 6
    END
  LIMIT 1
$$;

-- Update prevent_admin_role_assignment to also protect ekonomi role
CREATE OR REPLACE FUNCTION public.prevent_admin_role_assignment()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.role IN ('admin', 'ekonomi') THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only existing admins can assign the admin or ekonomi role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;