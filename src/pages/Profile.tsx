import { useState, useEffect } from "react";
import { User, Save, Mail, Phone, MapPin, Calendar, Star, TrendingUp, Shield, Bell, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const { user: mockUser, usingMockData } = useRole();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Use either real user or mock user
  const displayUser = user || mockUser;
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    favoriteChefs: 0,
    totalSpent: 0,
    memberSince: '',
    reviewsGiven: 0,
    avgRating: 0
  });

  useEffect(() => {
    if (displayUser) {
      if (usingMockData) {
        // Use mock data directly
        setProfile({
          full_name: mockUser?.full_name || 'Test Användare',
          email: mockUser?.email || 'test@exempel.se',
          phone: '+46 70 123 45 67',
          address: 'Testgatan 123, 123 45 Stockholm'
        });
        setStats({
          totalOrders: 12,
          favoriteChefs: 3,
          totalSpent: 2450,
          memberSince: mockUser?.created_at || new Date().toISOString(),
          reviewsGiven: 8,
          avgRating: 4.7
        });
        setLoading(false);
      } else {
        fetchProfile();
        fetchUserStats();
      }
    } else {
      setLoading(false);
    }
  }, [displayUser, usingMockData]);

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
    }
  };

  const fetchUserStats = async () => {
    try {
      // Simulate fetching user statistics - replace with real queries when orders table is ready
      setStats({
        totalOrders: 12,
        favoriteChefs: 3,
        totalSpent: 2450,
        memberSince: user?.created_at || new Date().toISOString(),
        reviewsGiven: 8,
        avgRating: 4.7
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          {/* Profile Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
                <p className="text-sm text-muted-foreground text-center">Beställningar</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="text-2xl font-bold text-green-600">{stats.totalSpent} kr</div>
                <p className="text-sm text-muted-foreground text-center">Totalt spenderat</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold">{stats.avgRating}</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">Genomsnitt betyg</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.favoriteChefs}</div>
                <p className="text-sm text-muted-foreground text-center">Favorit kockar</p>
              </CardContent>
            </Card>
          </div>

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
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      Medlem sedan {new Date(stats.memberSince).toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' })}
                    </Badge>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Profilkomplettering</h4>
                  <Progress value={75} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-1">
                    75% komplett - Lägg till telefonnummer och adress för att få 100%
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center">
                    <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Aktiv användare</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Verifierad</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Pålitlig kund</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Senaste aktivitet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium">Beställning #1234</p>
                    <p className="text-sm text-muted-foreground">Pasta Carbonara från Chef Maria</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">245 kr</p>
                    <p className="text-xs text-muted-foreground">2 dagar sedan</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium">Recension lämnad</p>
                    <p className="text-sm text-muted-foreground">5 stjärnor till Chef Erik</p>
                  </div>
                  <div className="text-right">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">1 vecka sedan</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium">Ny favorit kock</p>
                    <p className="text-sm text-muted-foreground">Följer nu Chef Anna</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">❤️</p>
                    <p className="text-xs text-muted-foreground">2 veckor sedan</p>
                  </div>
                </div>
              </div>
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
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Kontoinställningar & Säkerhet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Tvåfaktorsautentisering</h4>
                    <Badge variant="outline">Inaktiverad</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Lägg till extra säkerhet till ditt konto
                  </p>
                  <Button variant="outline" size="sm">Aktivera</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">E-postnotifikationer</h4>
                    <Badge variant="default">Aktiverad</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Få meddelanden om beställningar och erbjudanden
                  </p>
                  <Button variant="outline" size="sm">Hantera</Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
                <p><strong>Konto skapat:</strong> {new Date(displayUser?.created_at || '').toLocaleDateString('sv-SE')}</p>
                <p><strong>Senast inloggad:</strong> {new Date().toLocaleDateString('sv-SE')}</p>
                <p><strong>Konto-ID:</strong> {displayUser?.id?.slice(0, 8)}...</p>
                {usingMockData && <p><strong>Status:</strong> Test-läge</p>}
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Datahantering & Support</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifikationsinställningar
                  </Button>
                  <Button variant="outline" size="sm">
                    Ladda ner mina data
                  </Button>
                  <Button variant="outline" size="sm">
                    Kontakta support
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Ta bort konto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Snabblänkar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <a href="/settings/addresses">
                    <MapPin className="w-5 h-5 mb-2" />
                    <span className="text-sm">Adresser</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <a href="/settings/payment-methods">
                    <User className="w-5 h-5 mb-2" />
                    <span className="text-sm">Betalning</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <a href="/settings/preferences">
                    <Star className="w-5 h-5 mb-2" />
                    <span className="text-sm">Preferenser</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <a href="/search">
                    <TrendingUp className="w-5 h-5 mb-2" />
                    <span className="text-sm">Bläddra mat</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;