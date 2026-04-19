
DO $$
DECLARE
  v_order_id uuid;
BEGIN
  INSERT INTO public.orders (
    customer_id,
    chef_id,
    status,
    total_amount,
    delivery_address,
    customer_phone,
    special_instructions
  ) VALUES (
    'ce80bec2-3b9e-4726-a073-38f3b6486d76', -- admin (info@homechef.nu) som testkund
    '09b7167b-25b4-4160-baed-99a0cbd2e297', -- Ulla Kalms
    'preparing',
    89.00,
    'Testadress 1, 269 41 Östra Karup',
    '0734234686',
    'TESTORDER – tryck "Markera som klar" för att utlösa SMS till 0734234686'
  )
  RETURNING id INTO v_order_id;

  INSERT INTO public.order_items (order_id, dish_id, quantity, unit_price, total_price)
  VALUES (
    v_order_id,
    'bec8b5fc-5c13-492d-a687-f39ff6100037', -- Hemgjord glass
    1,
    89.00,
    89.00
  );
END $$;
