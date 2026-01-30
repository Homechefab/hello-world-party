-- Create visitors table to track website visits
CREATE TABLE public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at timestamp with time zone NOT NULL DEFAULT now(),
  page_path text NOT NULL,
  user_agent text,
  referrer text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  device_type text,
  browser text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Only admins can view visitors
CREATE POLICY "Admins can view all visitors"
ON public.visitors
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert visitor records (for tracking)
CREATE POLICY "Anyone can log visits"
ON public.visitors
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_visitors_visited_at ON public.visitors(visited_at DESC);
CREATE INDEX idx_visitors_page_path ON public.visitors(page_path);