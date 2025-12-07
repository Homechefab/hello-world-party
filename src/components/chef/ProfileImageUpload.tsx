import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Upload, Trash2, User } from "lucide-react";

export function ProfileImageUpload() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadProfileImage();
    }
  }, [user]);

  const loadProfileImage = async () => {
    try {
      const { data, error } = await supabase
        .from("chefs")
        .select("profile_image_url, kitchen_approved")
        .eq("user_id", user?.id || '')
        .single();

      if (error) throw error;

      if (data) {
        setIsApproved(data.kitchen_approved || false);
        setImageUrl(data.profile_image_url || null);
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Endast bilder är tillåtna");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bilden får inte vara större än 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      // Delete old image if exists
      await supabase.storage.from("chef-profiles").remove([fileName]);

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from("chef-profiles")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("chef-profiles")
        .getPublicUrl(fileName);

      // Add cache buster to force refresh
      const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

      // Update chef record
      const { error: updateError } = await supabase
        .from("chefs")
        .update({ profile_image_url: urlWithCacheBuster })
        .eq("user_id", user.id || '');

      if (updateError) throw updateError;

      setImageUrl(urlWithCacheBuster);
      toast.success("Profilbild uppladdad!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Kunde inte ladda upp bilden");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.id || !imageUrl) return;

    setUploading(true);

    try {
      // Remove from storage
      const fileName = `${user.id}/profile.${imageUrl.split(".").pop()?.split("?")[0]}`;
      await supabase.storage.from("chef-profiles").remove([fileName]);

      // Update chef record
      const { error } = await supabase
        .from("chefs")
        .update({ profile_image_url: null })
        .eq("user_id", user.id || '');

      if (error) throw error;

      setImageUrl(null);
      toast.success("Profilbild borttagen");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Kunde inte ta bort bilden");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-24 h-24 bg-muted rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-10 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isApproved) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profilbild
          </CardTitle>
          <CardDescription>
            Ladda upp en profilbild som visas på din offentliga profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>Du måste vara godkänd som kock för att kunna ladda upp en profilbild.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Profilbild
        </CardTitle>
        <CardDescription>
          Ladda upp en profilbild som visas på din offentliga profil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-border">
              <AvatarImage src={imageUrl || undefined} alt="Profilbild" />
              <AvatarFallback className="bg-primary/10">
                <User className="w-12 h-12 text-primary" />
              </AvatarFallback>
            </Avatar>
            {imageUrl && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-muted-foreground mb-4">
              Ladda upp en tydlig bild på dig själv. Bilden visas på din offentliga profilsida
              så att kunder kan se vem som lagar deras mat.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Laddar upp..." : imageUrl ? "Byt bild" : "Ladda upp bild"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Max 5MB. JPG, PNG eller WEBP.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
