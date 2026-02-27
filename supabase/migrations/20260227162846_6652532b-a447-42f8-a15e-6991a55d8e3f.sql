-- Temporary test order to verify notifications (will be cleaned up)
INSERT INTO public.orders (customer_id, chef_id, total_amount, delivery_address, status)
VALUES (
  '2abe3900-5f85-46a3-b0ff-1f221d76bc3f',
  'a3a11d85-f8bc-4b68-a6d2-e1a422f86978',
  150,
  'Kiselvägen 15 A',
  'preparing'
);