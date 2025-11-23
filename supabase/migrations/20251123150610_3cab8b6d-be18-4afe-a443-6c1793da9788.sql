-- Drop the problematic triggers and functions that cause the operator error
DROP TRIGGER IF EXISTS trigger_notify_admin_new_chef ON public.chefs;
DROP FUNCTION IF EXISTS public.notify_admin_new_chef() CASCADE;

DROP TRIGGER IF EXISTS trigger_notify_admin_new_kitchen_partner ON public.kitchen_partners;
DROP FUNCTION IF EXISTS public.notify_admin_new_kitchen_partner() CASCADE;