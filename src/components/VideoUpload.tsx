import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, Play, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Video {
  id: string;
  title: string;
  description: string;
  url?: string;
  socialUrl?: string;
  platform?: 'tiktok' | 'instagram' | 'youtube';
  dishId?: string;
  createdAt: string;
}

interface VideoUploadProps {
  onVideoAdded?: (video: Video) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoAdded }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Fil för stor",
          description: "Videofilen får max vara 100MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Felaktigt filformat",
          description: "Endast videofiler är tillåtna",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const detectPlatform = (url: string): 'tiktok' | 'instagram' | 'youtube' | undefined => {
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    return undefined;
  };

  const handleUploadVideo = () => {
    if (!title || !selectedFile) {
      toast({
        title: "Saknad information",
        description: "Titel och videofil krävs",
        variant: "destructive"
      });
      return;
    }

    // Simulate upload - in real implementation, upload to Supabase Storage
    const newVideo: Video = {
      id: Date.now().toString(),
      title,
      description,
      url: URL.createObjectURL(selectedFile), // Temporary URL for preview
      createdAt: new Date().toISOString()
    };

    setVideos([...videos, newVideo]);
    onVideoAdded?.(newVideo);
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    
    toast({
      title: "Video uppladdad!",
      description: "Din video har laddats upp framgångsrikt"
    });
  };

  const handleAddSocialVideo = () => {
    if (!title || !socialUrl) {
      toast({
        title: "Saknad information",
        description: "Titel och URL krävs",
        variant: "destructive"
      });
      return;
    }

    const platform = detectPlatform(socialUrl);
    if (!platform) {
      toast({
        title: "Ej stödd plattform",
        description: "Endast TikTok, Instagram och YouTube stöds",
        variant: "destructive"
      });
      return;
    }

    const newVideo: Video = {
      id: Date.now().toString(),
      title,
      description,
      socialUrl,
      platform,
      createdAt: new Date().toISOString()
    };

    setVideos([...videos, newVideo]);
    onVideoAdded?.(newVideo);
    
    // Reset form
    setTitle('');
    setDescription('');
    setSocialUrl('');
    
    toast({
      title: "Video tillagd!",
      description: `${platform.charAt(0).toUpperCase() + platform.slice(1)}-video har lagts till`
    });
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
    toast({
      title: "Video borttagen",
      description: "Videon har tagits bort"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Hantera Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Ladda upp video</TabsTrigger>
              <TabsTrigger value="social">Länka sociala medier</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-title">Titel</Label>
                  <Input
                    id="video-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="T.ex. Gör pasta carbonara"
                  />
                </div>
                
                <div>
                  <Label htmlFor="video-description">Beskrivning (valfritt)</Label>
                  <Textarea
                    id="video-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Beskriv vad som händer i videon..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="video-file">Videofil (max 100MB)</Label>
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Vald fil: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <Button onClick={handleUploadVideo} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Ladda upp video
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="social-title">Titel</Label>
                  <Input
                    id="social-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="T.ex. Min TikTok om pasta"
                  />
                </div>
                
                <div>
                  <Label htmlFor="social-description">Beskrivning (valfritt)</Label>
                  <Textarea
                    id="social-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Beskriv videon..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="social-url">URL till video</Label>
                  <Input
                    id="social-url"
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@username/video/..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Stöder TikTok, Instagram och YouTube
                  </p>
                </div>
                
                <Button onClick={handleAddSocialVideo} className="w-full">
                  <Link className="h-4 w-4 mr-2" />
                  Lägg till video
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dina Videos ({videos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {video.platform && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(video.createdAt).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {video.url && (
                      <video 
                        src={video.url} 
                        className="w-16 h-16 object-cover rounded"
                        controls={false}
                      />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};