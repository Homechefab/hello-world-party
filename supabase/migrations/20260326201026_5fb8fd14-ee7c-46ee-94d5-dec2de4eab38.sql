-- Delete Google Review chef and associated user data
DELETE FROM public.chefs WHERE id = '39ed6fcb-982f-4f43-809b-895c9399ddd9';
DELETE FROM public.user_roles WHERE user_id = '98d76473-f4f3-473f-a508-2db48af37010';
DELETE FROM public.profiles WHERE id = '98d76473-f4f3-473f-a508-2db48af37010';