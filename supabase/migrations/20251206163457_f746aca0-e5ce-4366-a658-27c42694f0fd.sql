-- Delete all chef applications for Farhan so he can submit fresh
DELETE FROM public.chefs 
WHERE contact_email = 'farhan_javanmiri@hotmail.com' 
   OR full_name ILIKE '%Farhan%';