ALTER TABLE public.chef_public_profiles
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS postal_code text;

CREATE OR REPLACE FUNCTION public.sync_chef_public_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.chef_public_profiles WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  IF NEW.kitchen_approved = true AND NEW.application_status = 'approved' THEN
    INSERT INTO public.chef_public_profiles (
      id, business_name, full_name, bio, profile_image_url,
      tiktok_url, instagram_url, facebook_url, snapchat_url,
      specialties, city, address, postal_code, created_at, updated_at
    ) VALUES (
      NEW.id, NEW.business_name, NEW.full_name, NEW.bio, NEW.profile_image_url,
      NEW.tiktok_url, NEW.instagram_url, NEW.facebook_url, NEW.snapchat_url,
      NEW.specialties, NEW.city, NEW.address, NEW.postal_code, NEW.created_at, now()
    )
    ON CONFLICT (id) DO UPDATE SET
      business_name = EXCLUDED.business_name,
      full_name = EXCLUDED.full_name,
      bio = EXCLUDED.bio,
      profile_image_url = EXCLUDED.profile_image_url,
      tiktok_url = EXCLUDED.tiktok_url,
      instagram_url = EXCLUDED.instagram_url,
      facebook_url = EXCLUDED.facebook_url,
      snapchat_url = EXCLUDED.snapchat_url,
      specialties = EXCLUDED.specialties,
      city = EXCLUDED.city,
      address = EXCLUDED.address,
      postal_code = EXCLUDED.postal_code,
      updated_at = now();
  ELSE
    DELETE FROM public.chef_public_profiles WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$function$;

-- Backfill existing approved chef public profiles
UPDATE public.chef_public_profiles cpp
SET address = c.address, postal_code = c.postal_code, updated_at = now()
FROM public.chefs c
WHERE cpp.id = c.id;