
-- Remove client-side INSERT policy
DROP POLICY IF EXISTS "Users can insert their own login logs" ON public.login_logs;

-- Create a SECURITY DEFINER function to log logins server-side
CREATE OR REPLACE FUNCTION public.log_user_login(p_user_agent text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_email text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get email from auth.users (trusted source)
  SELECT email INTO v_email FROM auth.users WHERE id = v_user_id;

  INSERT INTO public.login_logs (user_id, email, user_agent, login_at)
  VALUES (v_user_id, COALESCE(v_email, ''), p_user_agent, now());
END;
$$;
