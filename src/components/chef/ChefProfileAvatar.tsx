import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ChefHat, Camera } from "lucide-react";

interface ChefProfileAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ChefProfileAvatar({ size = "md", className = "" }: ChefProfileAvatarProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  useEffect(() => {
    if (user) {
      loadProfileImage();
    }
  }, [user]);

  const loadProfileImage = async () => {
    try {
      const { data, error } = await supabase
        .from("chefs")
        .select("profile_image_url")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setImageUrl(data?.profile_image_url || null);
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Endast bilder är tillåtna");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bilden får inte vara större än 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      await supabase.storage.from("chef-profiles").remove([fileName]);

      const { error: uploadError } = await supabase.storage
        .from("chef-profiles")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("chef-profiles")
        .getPublicUrl(fileName);

      const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("chefs")
        .update({ profile_image_url: urlWithCacheBuster })
        .eq("user_id", user.id);

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

  return (
    <div className={`relative group ${className}`}>
      <Avatar 
        className={`${sizeClasses[size]} bg-gradient-primary cursor-pointer transition-opacity group-hover:opacity-80`}
        onClick={() => fileInputRef.current?.click()}
      >
        <AvatarImage src={imageUrl || undefined} alt="Profilbild" className="object-cover" />
        <AvatarFallback className="bg-gradient-primary">
          <ChefHat className={`${iconSizes[size]} text-white`} />
        </AvatarFallback>
      </Avatar>
      
      {/* Camera overlay on hover */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="w-5 h-5 text-white" />
      </div>

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
