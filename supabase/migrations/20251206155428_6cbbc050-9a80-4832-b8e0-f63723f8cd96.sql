-- Add social media columns to chefs table
ALTER TABLE public.chefs
ADD COLUMN tiktok_url text,
ADD COLUMN facebook_url text,
ADD COLUMN instagram_url text,
ADD COLUMN snapchat_url text;