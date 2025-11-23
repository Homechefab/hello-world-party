-- Function to notify admin of new chef application
CREATE OR REPLACE FUNCTION notify_admin_new_chef()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify admin of new kitchen partner application
CREATE OR REPLACE FUNCTION notify_admin_new_kitchen_partner()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new chef applications
DROP TRIGGER IF EXISTS trigger_notify_admin_new_chef ON chefs;
CREATE TRIGGER trigger_notify_admin_new_chef
AFTER INSERT ON chefs
FOR EACH ROW
WHEN (NEW.application_status = 'pending')
EXECUTE FUNCTION notify_admin_new_chef();

-- Trigger for new kitchen partner applications
DROP TRIGGER IF EXISTS trigger_notify_admin_new_kitchen_partner ON kitchen_partners;
CREATE TRIGGER trigger_notify_admin_new_kitchen_partner
AFTER INSERT ON kitchen_partners
FOR EACH ROW
WHEN (NEW.application_status = 'pending')
EXECUTE FUNCTION notify_admin_new_kitchen_partner();