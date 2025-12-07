import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Instagram, Facebook } from "lucide-react";

// Custom TikTok icon since lucide doesn't have one
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Custom Snapchat icon
const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.12-.063-.18-.016-.24.164-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
  </svg>
);

interface SocialLinks {
  tiktok_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  snapchat_url: string | null;
}

export function SocialMediaLinks() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [links, setLinks] = useState<SocialLinks>({
    tiktok_url: "",
    facebook_url: "",
    instagram_url: "",
    snapchat_url: ""
  });

  useEffect(() => {
    if (user) {
      loadSocialLinks();
    }
  }, [user]);

  const loadSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("chefs")
        .select("tiktok_url, facebook_url, instagram_url, snapchat_url, kitchen_approved")
        .eq("user_id", user?.id || '')
        .single();

      if (error) throw error;

      if (data) {
        setIsApproved(data.kitchen_approved || false);
        setLinks({
          tiktok_url: data.tiktok_url || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
          snapchat_url: data.snapchat_url || ""
        });
      }
    } catch (error) {
      console.error("Error loading social links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("chefs")
        .update({
          tiktok_url: links.tiktok_url || null,
          facebook_url: links.facebook_url || null,
          instagram_url: links.instagram_url || null,
          snapchat_url: links.snapchat_url || null
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Sociala medier-länkar sparade!");
    } catch (error) {
      console.error("Error saving social links:", error);
      toast.error("Kunde inte spara länkarna");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
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
            <Instagram className="h-5 w-5" />
            Sociala medier
          </CardTitle>
          <CardDescription>
            Länka till dina sociala kanaler så att kunder kan följa dig
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>Du måste vara godkänd som kock för att kunna lägga till sociala medier-länkar.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5" />
          Sociala medier
        </CardTitle>
        <CardDescription>
          Länka till dina sociala kanaler så att kunder kan följa dig
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </Label>
          <Input
            id="instagram"
            placeholder="https://instagram.com/dittanvändarnamn"
            value={links.instagram_url || ""}
            onChange={(e) => setLinks({ ...links, instagram_url: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </Label>
          <Input
            id="facebook"
            placeholder="https://facebook.com/dinsida"
            value={links.facebook_url || ""}
            onChange={(e) => setLinks({ ...links, facebook_url: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tiktok" className="flex items-center gap-2">
            <TikTokIcon className="h-4 w-4" />
            TikTok
          </Label>
          <Input
            id="tiktok"
            placeholder="https://tiktok.com/@dittanvändarnamn"
            value={links.tiktok_url || ""}
            onChange={(e) => setLinks({ ...links, tiktok_url: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="snapchat" className="flex items-center gap-2">
            <SnapchatIcon className="h-4 w-4" />
            Snapchat
          </Label>
          <Input
            id="snapchat"
            placeholder="https://snapchat.com/add/dittanvändarnamn"
            value={links.snapchat_url || ""}
            onChange={(e) => setLinks({ ...links, snapchat_url: e.target.value })}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Sparar..." : "Spara länkar"}
        </Button>
      </CardContent>
    </Card>
  );
}
