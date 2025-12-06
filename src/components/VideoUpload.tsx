import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Play, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChefVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  created_at: string;
}

export const VideoUpload: React.FC = () => {
  const [videos, setVideos] = useState<ChefVideo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chefId, setChefId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchChefAndVideos = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get chef id
      const { data: chefData } = await supabase
        .from('chefs')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (chefData) {
        setChefId(chefData.id);

        // Fetch existing videos
        const { data: videosData, error } = await supabase
          .from('chef_videos')
          .select('*')
          .eq('chef_id', chefData.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(videosData || []);
      }
    } catch (error) {
      console.error('Error fetching chef videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChefAndVideos();
  }, [fetchChefAndVideos]);

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

  const handleUploadVideo = async () => {
    if (!title || !selectedFile || !chefId) {
      toast({
        title: "Saknad information",
        description: "Titel och videofil krävs",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Upload video to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${chefId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chef-videos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chef-videos')
        .getPublicUrl(fileName);

      // Save to database
      const { data: videoData, error: dbError } = await supabase
        .from('chef_videos')
        .insert({
          chef_id: chefId,
          title,
          description: description || null,
          video_url: publicUrl
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setVideos([videoData, ...videos]);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('video-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast({
        title: "Video uppladdad!",
        description: "Din video har laddats upp och är nu synlig för kunder"
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Uppladdning misslyckades",
        description: "Det gick inte att ladda upp videon. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (video: ChefVideo) => {
    try {
      // Extract file path from URL
      const urlParts = video.video_url.split('/chef-videos/');
      const filePath = urlParts[1];

      // Delete from storage
      if (filePath) {
        await supabase.storage.from('chef-videos').remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('chef_videos')
        .delete()
        .eq('id', video.id);

      if (error) throw error;

      setVideos(videos.filter(v => v.id !== video.id));
      
      toast({
        title: "Video borttagen",
        description: "Videon har tagits bort"
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Kunde inte ta bort",
        description: "Det gick inte att ta bort videon",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Ladda upp matlagningsvideo
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Visa kunder hur du lagar maten! Videor visas på din profilsida.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-title">Titel *</Label>
              <Input
                id="video-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="T.ex. Så lagar jag min pasta carbonara"
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
              <Label htmlFor="video-file">Videofil (max 100MB) *</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Vald fil: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleUploadVideo} 
              className="w-full"
              disabled={uploading || !title || !selectedFile}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Laddar upp...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Ladda upp video
                </>
              )}
            </Button>
          </div>
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
                <div key={video.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <video 
                    src={video.video_url} 
                    className="w-32 h-20 object-cover rounded"
                    controls
                    preload="metadata"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(video.created_at).toLocaleDateString('sv-SE')}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVideo(video)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};