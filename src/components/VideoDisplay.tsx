import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  url?: string;
  createdAt: string;
}

interface VideoDisplayProps {
  videos: Video[];
  showAll?: boolean;
  className?: string;
}

const VideoThumbnail: React.FC<{ video: Video }> = ({ video }) => {
  if (!video.url) return null;

  return (
    <div className="relative">
      <video
        src={video.url}
        className="w-full aspect-video object-cover rounded-lg"
        controls
        preload="metadata"
      />
      
      <div className="mt-2">
        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
        {video.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

export const VideoDisplay: React.FC<VideoDisplayProps> = ({ 
  videos, 
  showAll = false, 
  className = "" 
}) => {
  const displayVideos = showAll ? videos : videos.slice(0, 3);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Play className="h-5 w-5" />
        Videos från kocken
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardContent className="p-3">
              <VideoThumbnail video={video} />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!showAll && videos.length > 3 && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Och {videos.length - 3} videos till...
        </p>
      )}
    </div>
  );
};