-- Delete the later duplicate order in each pair created within 1 second
WITH dups AS (
  SELECT id FROM (
    SELECT id, customer_id, chef_id, total_amount, created_at,
      LAG(created_at) OVER (PARTITION BY customer_id, chef_id, total_amount ORDER BY created_at) AS prev_at
    FROM public.orders
  ) t
  WHERE prev_at IS NOT NULL AND created_at - prev_at < interval '2 seconds'
)
DELETE FROM public.order_items WHERE order_id IN (SELECT id FROM dups);

WITH dups AS (
  SELECT id FROM (
    SELECT id, customer_id, chef_id, total_amount, created_at,
      LAG(created_at) OVER (PARTITION BY customer_id, chef_id, total_amount ORDER BY created_at) AS prev_at
    FROM public.orders
  ) t
  WHERE prev_at IS NOT NULL AND created_at - prev_at < interval '2 seconds'
)
DELETE FROM public.orders WHERE id IN (SELECT id FROM dups);