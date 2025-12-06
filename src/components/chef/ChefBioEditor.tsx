import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Save, Pencil } from "lucide-react";

export function ChefBioEditor() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [originalBio, setOriginalBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      loadBio();
    }
  }, [user]);

  const loadBio = async () => {
    try {
      const { data, error } = await supabase
        .from("chefs")
        .select("bio")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      const bioText = data?.bio || "";
      setBio(bioText);
      setOriginalBio(bioText);
    } catch (error) {
      console.error("Error loading bio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("chefs")
        .update({ bio })
        .eq("user_id", user.id);

      if (error) throw error;

      setOriginalBio(bio);
      setIsEditing(false);
      toast.success("Din beskrivning har sparats!");
    } catch (error) {
      console.error("Error saving bio:", error);
      toast.error("Kunde inte spara beskrivningen");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBio(originalBio);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-20 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">Om mig</p>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 px-2"
          >
            <Pencil className="h-3 w-3 mr-1" />
            Redigera
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Beskriv dig själv, din matlagningsstil och vad som gör din mat speciell..."
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {bio.length}/500 tecken
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
              >
                Avbryt
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-1"
              >
                <Save className="h-3 w-3" />
                {saving ? "Sparar..." : "Spara"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm">
          {bio || (
            <span className="text-muted-foreground italic">
              Klicka på redigera för att lägga till en beskrivning om dig själv...
            </span>
          )}
        </p>
      )}
    </div>
  );
}
