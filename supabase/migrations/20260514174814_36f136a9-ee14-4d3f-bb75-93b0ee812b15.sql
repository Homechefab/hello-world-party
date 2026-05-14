UPDATE public.orders
SET status = 'completed', updated_at = now()
WHERE id IN (
  'fa353164-1686-49dd-891c-e6ce43559be0',
  'a4d313fb-7c83-4f02-bd43-a017aa67814e'
) AND status = 'ready';