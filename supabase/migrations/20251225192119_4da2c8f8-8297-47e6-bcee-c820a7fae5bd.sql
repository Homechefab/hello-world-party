-- Create a function that calls the edge function when a chef is approved
CREATE OR REPLACE FUNCTION public.notify_early_access_on_chef_approval()
RETURNS TRIGGER AS $$
DECLARE
  chef_postal TEXT;
  chef_city TEXT;
  chef_name TEXT;
BEGIN
  -- Only trigger when kitchen_approved changes from false/null to true
  IF (OLD.kitchen_approved IS DISTINCT FROM true) AND (NEW.kitchen_approved = true) THEN
    chef_postal := COALESCE(NEW.postal_code, '');
    chef_city := NEW.city;
    chef_name := COALESCE(NEW.full_name, NEW.business_name);
    
    -- Only notify if chef has a postal code
    IF chef_postal != '' THEN
      -- Use pg_net to call the edge function asynchronously
      PERFORM net.http_post(
        url := 'https://rkucenozpmaixfphpiub.supabase.co/functions/v1/notify-early-access',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
        ),
        body := jsonb_build_object(
          'chef_id', NEW.id::text,
          'chef_name', chef_name,
          'chef_postal_code', chef_postal,
          'chef_city', chef_city
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_notify_early_access_on_chef_approval ON public.chefs;
CREATE TRIGGER trigger_notify_early_access_on_chef_approval
  AFTER UPDATE ON public.chefs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_early_access_on_chef_approval();