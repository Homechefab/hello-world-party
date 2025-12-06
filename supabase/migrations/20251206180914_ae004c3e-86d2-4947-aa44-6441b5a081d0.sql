-- Create chef_videos table for storing chef cooking videos
CREATE TABLE public.chef_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chef_id UUID NOT NULL REFERENCES public.chefs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  social_url TEXT,
  platform TEXT CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chef_videos ENABLE ROW LEVEL SECURITY;

-- Anyone can view videos from approved chefs
CREATE POLICY "Anyone can view chef videos"
ON public.chef_videos
FOR SELECT
USING (
  chef_id IN (
    SELECT id FROM public.chefs WHERE kitchen_approved = true
  )
);

-- Chefs can manage their own videos
CREATE POLICY "Chefs can create their own videos"
ON public.chef_videos
FOR INSERT
WITH CHECK (
  chef_id IN (
    SELECT id FROM public.chefs WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Chefs can update their own videos"
ON public.chef_videos
FOR UPDATE
USING (
  chef_id IN (
    SELECT id FROM public.chefs WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Chefs can delete their own videos"
ON public.chef_videos
FOR DELETE
USING (
  chef_id IN (
    SELECT id FROM public.chefs WHERE user_id = auth.uid()
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_chef_videos_updated_at
BEFORE UPDATE ON public.chef_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();