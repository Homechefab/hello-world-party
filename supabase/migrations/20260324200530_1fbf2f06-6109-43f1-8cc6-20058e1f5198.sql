INSERT INTO public.chef_operating_hours (chef_id, day_of_week, is_open, open_time, close_time)
VALUES
  ('09b7167b-25b4-4160-baed-99a0cbd2e297', 0, false, '08:00', '20:00'),
  ('09b7167b-25b4-4160-baed-99a0cbd2e297', 1, true, '08:00', '20:00'),
  ('09b7167b-25b4-4160-baed-99a0cbd2e297', 2, false, '08:00', '20:00'),
  ('09b7167b-25b4-4160-baed-99a0cbd2e297', 3, true, '08:00', '20:00'),
  ('09b7167b-25b4-4160-baed-99a0cbd2e297', 4, false, '08:00', '20:00'),
  ('09b7167b-25b4-4160-baed-99a0cbd2e297', 5, true, '08:00', '20:00'),
  ('09b7167b-25b4-4160-baed-99a0cbd2e297', 6, false, '08:00', '20:00')
ON CONFLICT DO NOTHING;