DO $$
DECLARE
  v_session text := 'cs_test_dup_' || gen_random_uuid();
  v_chef uuid := '09b7167b-25b4-4160-baed-99a0cbd2e297';
  v_cust uuid := '16a5578a-d2f0-4aab-9954-be4d9093b674';
  v_err text;
  v_count int;
BEGIN
  -- First insert should succeed
  INSERT INTO public.orders (customer_id, chef_id, total_amount, delivery_address, status, stripe_session_id)
  VALUES (v_cust, v_chef, 1, 'TEST', 'pending', v_session);

  -- Second insert with same (stripe_session_id, chef_id) MUST fail
  BEGIN
    INSERT INTO public.orders (customer_id, chef_id, total_amount, delivery_address, status, stripe_session_id)
    VALUES (v_cust, v_chef, 1, 'TEST', 'pending', v_session);
    RAISE EXCEPTION 'TEST FAILED: duplicate insert was allowed';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'TEST PASSED: unique_violation correctly raised on duplicate';
  END;

  -- Verify exactly 1 row exists
  SELECT count(*) INTO v_count FROM public.orders WHERE stripe_session_id = v_session;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: expected 1 row, found %', v_count;
  END IF;
  RAISE NOTICE 'TEST PASSED: exactly 1 order exists for session';

  -- Cleanup
  DELETE FROM public.orders WHERE stripe_session_id = v_session;
END $$;