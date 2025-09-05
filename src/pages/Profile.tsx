import { useState, useEffect } from "react";
import { User, Save, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } else {
        setProfile(prev => ({
          ...prev,
          email: user?.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Kunde inte hämta profilinformation');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const profileData = {
        id: user?.id,
        ...profile
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);
      
      if (error) throw error;

      toast.success('Profil uppdaterad');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Kunde inte spara profil');
    } finally {
      setSaving(false);
    }
  };

  const userInitials = (profile.full_name || profile.email)
    ?.split(' ')
    .map(name => name[0])
    .join('')
    ?.toUpperCase()
    ?.slice(0, 2) || 'US';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="h-32 bg-secondary rounded"></div>
            <div className="h-48 bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Min Profil</h1>
            <p className="text-muted-foreground">Hantera din profilinformation</p>
          </div>
          
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Sparar...' : 'Spara ändringar'}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile.full_name || 'Användare'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Din profilbild genereras automatiskt från dina initialer.
              </p>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personlig information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Fullständigt namn</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Ditt fullständiga namn"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-postadress</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="din@email.com"
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    E-postadressen kan inte ändras här. Kontakta support för att ändra.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+46 70 123 45 67"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Adress</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Din adress"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Kontoinställningar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Konto skapat: {new Date(user?.created_at || '').toLocaleDateString('sv-SE')}</p>
                <p>Senast inloggad: {new Date().toLocaleDateString('sv-SE')}</p>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Datahantering</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Du kan begära att få dina data eller att ta bort ditt konto.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ladda ner mina data
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Ta bort konto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;