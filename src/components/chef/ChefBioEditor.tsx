import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Save, Pencil, MapPin } from "lucide-react";
import { ChefRatingDisplay } from "./ChefRatingDisplay";

interface ChefBioEditorProps {
  chefId?: string | null;
}

interface ChefProfileFields {
  bio: string;
  address: string;
  postal_code: string;
  city: string;
}

const empty: ChefProfileFields = { bio: "", address: "", postal_code: "", city: "" };

export function ChefBioEditor({ chefId: overrideChefId }: ChefBioEditorProps = {}) {
  const { user } = useAuth();
  const [fields, setFields] = useState<ChefProfileFields>(empty);
  const [original, setOriginal] = useState<ChefProfileFields>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (overrideChefId || user) {
      void loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, overrideChefId]);

  const loadProfile = async () => {
    try {
      let query = supabase.from("chefs").select("bio, address, postal_code, city");
      if (overrideChefId) {
        query = query.eq("id", overrideChefId);
      } else {
        query = query.eq("user_id", user?.id || '');
      }
      const { data, error } = await query.single();
      if (error) throw error;
      const next: ChefProfileFields = {
        bio: data?.bio || "",
        address: data?.address || "",
        postal_code: data?.postal_code || "",
        city: data?.city || "",
      };
      setFields(next);
      setOriginal(next);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!overrideChefId && !user?.id) return;

    setSaving(true);
    try {
      let query = supabase.from("chefs").update({
        bio: fields.bio,
        address: fields.address,
        postal_code: fields.postal_code,
        city: fields.city,
      });
      if (overrideChefId) {
        query = query.eq("id", overrideChefId);
      } else {
        query = query.eq("user_id", user!.id!);
      }
      const { error } = await query;
      if (error) throw error;

      setOriginal(fields);
      setIsEditing(false);
      toast.success("Profilen har sparats!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Kunde inte spara profilen");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFields(original);
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
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Om mig & upphämtningsadress</p>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-7 px-2">
            <Pencil className="h-3 w-3 mr-1" />
            Redigera
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={fields.bio}
            onChange={(e) => setFields(f => ({ ...f, bio: e.target.value }))}
            placeholder="Beskriv dig själv, din matlagningsstil och vad som gör din mat speciell..."
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <span className="text-xs text-muted-foreground">{fields.bio.length}/500 tecken</span>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Label htmlFor="chef-address" className="text-xs">Upphämtningsadress (visas för kunder efter köp)</Label>
              <Input
                id="chef-address"
                value={fields.address}
                onChange={(e) => setFields(f => ({ ...f, address: e.target.value }))}
                placeholder="Storgatan 5"
              />
            </div>
            <div>
              <Label htmlFor="chef-postal" className="text-xs">Postnummer</Label>
              <Input
                id="chef-postal"
                value={fields.postal_code}
                onChange={(e) => setFields(f => ({ ...f, postal_code: e.target.value }))}
                placeholder="123 45"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="chef-city" className="text-xs">Ort</Label>
              <Input
                id="chef-city"
                value={fields.city}
                onChange={(e) => setFields(f => ({ ...f, city: e.target.value }))}
                placeholder="Stockholm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>Avbryt</Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
              <Save className="h-3 w-3" />
              {saving ? "Sparar..." : "Spara"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm">
            {fields.bio || (
              <span className="text-muted-foreground italic">
                Klicka på redigera för att lägga till en beskrivning om dig själv...
              </span>
            )}
          </p>
          {(fields.address || fields.city) ? (
            <p className="text-sm text-muted-foreground flex items-start gap-1">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                {fields.address}{(fields.postal_code || fields.city) ? `, ${fields.postal_code} ${fields.city}`.trim() : ''}
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Ingen upphämtningsadress angiven – lägg till en så att kunder vet var de ska hämta maten.</p>
          )}
        </div>
      )}

      <ChefRatingDisplay />
    </div>
  );
}
