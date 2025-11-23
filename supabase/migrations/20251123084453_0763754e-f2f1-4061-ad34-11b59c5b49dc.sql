-- Fix security warning: Add search_path to functions

-- Function to notify admin of new chef application
CREATE OR REPLACE FUNCTION notify_admin_new_chef()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  applicant_profile RECORD;
BEGIN
  -- Get applicant details from profiles
  SELECT full_name, email INTO applicant_profile
  FROM profiles
  WHERE id = NEW.user_id;

  -- Call the edge function to send email
  PERFORM net.http_post(
    url := 'https://rkucenozpmaixfphpiub.supabase.co/functions/v1/notify-admin-application',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.headers')::json->>'authorization'
    ),
    body := jsonb_build_object(
      'type', 'chef',
      'application_id', NEW.id::text,
      'applicant_name', applicant_profile.full_name,
      'applicant_email', applicant_profile.email,
      'business_name', NEW.business_name
    )
  );

  RETURN NEW;
END;
$$;

-- Function to notify admin of new kitchen partner application
CREATE OR REPLACE FUNCTION notify_admin_new_kitchen_partner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  applicant_profile RECORD;
BEGIN
  -- Get applicant details from profiles
  SELECT full_name, email INTO applicant_profile
  FROM profiles
  WHERE id = NEW.user_id;

  -- Call the edge function to send email
  PERFORM net.http_post(
    url := 'https://rkucenozpmaixfphpiub.supabase.co/functions/v1/notify-admin-application',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.headers')::json->>'authorization'
    ),
    body := jsonb_build_object(
      'type', 'kitchen_partner',
      'application_id', NEW.id::text,
      'applicant_name', applicant_profile.full_name,
      'applicant_email', applicant_profile.email,
      'business_name', NEW.business_name
    )
  );

  RETURN NEW;
END;
$$;