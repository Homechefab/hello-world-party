SELECT cron.schedule(
  'send-monthly-chef-report',
  '0 8 1 * *',
  $$
  SELECT
    net.http_post(
      url := 'https://rkucenozpmaixfphpiub.supabase.co/functions/v1/send-monthly-chef-report',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdWNlbm96cG1haXhmcGhwaXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NjQxMjQsImV4cCI6MjA3MTU0MDEyNH0.bvHaR43lcKaWXEwsjVj3wCDSQjeSHlUZuN5gGwzVTRQ"}'::jsonb,
      body := concat('{"time": "', now(), '"}')::jsonb
    ) AS request_id;
  $$
);