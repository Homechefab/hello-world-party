DO $$
DECLARE
  v_session text := 'cs_test_verify_' || gen_random_uuid()::text;
  v_chef uuid := '09b7167b-25b4-4160-baed-99a0cbd2e297';
  v_customer uuid := '16a5578a-d2f0-4aab-9954-be4d9093b674';
  v_count int;
  v_blocked boolean := false;
BEGIN
  -- First insert: should succeed
  INSERT INTO public.orders (stripe_session_id, chef_id, customer_id, total_amount, delivery_address, status)
  VALUES (v_session, v_chef, v_customer, 100, 'Test', 'pending');
  RAISE NOTICE '✓ First order inserted';

  -- Second insert with same session+chef: should be blocked
  BEGIN
    INSERT INTO public.orders (stripe_session_id, chef_id, customer_id, total_amount, delivery_address, status)
    VALUES (v_session, v_chef, v_customer, 100, 'Test', 'pending');
    RAISE EXCEPTION 'FAIL: Duplicate was NOT blocked!';
  EXCEPTION WHEN unique_violation THEN
    v_blocked := true;
    RAISE NOTICE '✓ Duplicate blocked by unique_violation';
  END;

  -- Verify exactly 1 row exists
  SELECT COUNT(*) INTO v_count FROM public.orders WHERE stripe_session_id = v_session;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL: Expected 1 row, found %', v_count;
  END IF;
  RAISE NOTICE '✓ Exactly 1 order exists for session (customer sees 1, chef sees 1)';

  -- Cleanup
  DELETE FROM public.orders WHERE stripe_session_id = v_session;
  RAISE NOTICE '✓ Test cleanup complete — ALL CHECKS PASSED';
END $$;