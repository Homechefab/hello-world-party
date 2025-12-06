import React from 'react';
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

const VideoReel: React.FC<{ video: Video }> = ({ video }) => {
  if (!video.url) return null;

  return (
    <div className="relative group">
      <div className="aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-lg">
        <video
          src={video.url}
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          playsInline
        />
      </div>
      
      <div className="mt-3 px-1">
        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
        {video.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
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
  const displayVideos = showAll ? videos : videos.slice(0, 4);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Play className="h-5 w-5" />
        Matlagningsvideos
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {displayVideos.map((video) => (
          <div 
            key={video.id} 
            className="flex-shrink-0 w-48 sm:w-56 snap-start"
          >
            <VideoReel video={video} />
          </div>
        ))}
      </div>
      
      {!showAll && videos.length > 4 && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Och {videos.length - 4} videos till...
        </p>
      )}
    </div>
  );
};