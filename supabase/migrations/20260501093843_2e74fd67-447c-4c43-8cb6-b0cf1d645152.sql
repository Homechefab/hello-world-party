-- Create a durable public snapshot table for approved chef discovery.
-- This avoids relying on security-definer view settings that can be changed during security reviews.
CREATE TABLE IF NOT EXISTS public.chef_public_profiles (
  id uuid PRIMARY KEY,
  business_name text,
  full_name text,
  bio text,
  profile_image_url text,
  tiktok_url text,
  instagram_url text,
  facebook_url text,
  snapchat_url text,
  specialties text,
  city text,
  created_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chef_public_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved public chef profiles" ON public.chef_public_profiles;
CREATE POLICY "Anyone can view approved public chef profiles"
ON public.chef_public_profiles
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.sync_chef_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.chef_public_profiles WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  IF NEW.kitchen_approved = true AND NEW.application_status = 'approved' THEN
    INSERT INTO public.chef_public_profiles (
      id,
      business_name,
      full_name,
      bio,
      profile_image_url,
      tiktok_url,
      instagram_url,
      facebook_url,
      snapchat_url,
      specialties,
      city,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.business_name,
      NEW.full_name,
      NEW.bio,
      NEW.profile_image_url,
      NEW.tiktok_url,
      NEW.instagram_url,
      NEW.facebook_url,
      NEW.snapchat_url,
      NEW.specialties,
      NEW.city,
      NEW.created_at,
      now()
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
      created_at = EXCLUDED.created_at,
      updated_at = now();
  ELSE
    DELETE FROM public.chef_public_profiles WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_chef_public_profile_trigger ON public.chefs;
CREATE TRIGGER sync_chef_public_profile_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.chefs
FOR EACH ROW
EXECUTE FUNCTION public.sync_chef_public_profile();

INSERT INTO public.chef_public_profiles (
  id,
  business_name,
  full_name,
  bio,
  profile_image_url,
  tiktok_url,
  instagram_url,
  facebook_url,
  snapchat_url,
  specialties,
  city,
  created_at,
  updated_at
)
SELECT
  id,
  business_name,
  full_name,
  bio,
  profile_image_url,
  tiktok_url,
  instagram_url,
  facebook_url,
  snapchat_url,
  specialties,
  city,
  created_at,
  now()
FROM public.chefs
WHERE kitchen_approved = true
  AND application_status = 'approved'
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
  created_at = EXCLUDED.created_at,
  updated_at = now();

GRANT SELECT ON public.chef_public_profiles TO anon, authenticated;

COMMENT ON TABLE public.chef_public_profiles IS 'Public approved chef discovery data only. Do not add private contact, address, approval, payout, or user identity fields.';