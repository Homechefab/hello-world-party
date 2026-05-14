DO $$
DECLARE
  v_chef uuid := '09b7167b-25b4-4160-baed-99a0cbd2e297';
  v_customer uuid := '16a5578a-d2f0-4aab-9954-be4d9093b674';
  v_session text := 'cs_test_realtime_' || gen_random_uuid()::text;
  v_order_id uuid;
  v_active_before int;
  v_active_after int;
BEGIN
  SELECT COUNT(*) INTO v_active_before FROM public.orders
    WHERE chef_id = v_chef AND status IN ('pending','confirmed','preparing','ready');
  RAISE NOTICE 'Active orders before: %', v_active_before;

  INSERT INTO public.orders (stripe_session_id, chef_id, customer_id, total_amount, delivery_address, status)
  VALUES (v_session, v_chef, v_customer, 250, 'Realtime Test', 'pending')
  RETURNING id INTO v_order_id;

  SELECT COUNT(*) INTO v_active_after FROM public.orders
    WHERE chef_id = v_chef AND status IN ('pending','confirmed','preparing','ready');
  RAISE NOTICE 'Active orders after insert: % (expected %)', v_active_after, v_active_before + 1;

  IF v_active_after <> v_active_before + 1 THEN
    RAISE EXCEPTION 'FAIL: count did not increment';
  END IF;

  -- Verify it appears in latest 10
  IF NOT EXISTS (
    SELECT 1 FROM (
      SELECT id FROM public.orders WHERE chef_id = v_chef ORDER BY created_at DESC LIMIT 10
    ) latest WHERE latest.id = v_order_id
  ) THEN
    RAISE EXCEPTION 'FAIL: new order not in latest 10';
  END IF;
  RAISE NOTICE '✓ New order appears in "Senaste Beställningar" (latest 10)';

  -- Cleanup
  DELETE FROM public.orders WHERE id = v_order_id;
  RAISE NOTICE '✓ Cleanup done — ALL CHECKS PASSED';
END $$;