import { useState, useEffect, useCallback } from "react";
import { User, Save, Mail, Phone, MapPin, Calendar, Star, TrendingUp, Shield, Bell, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  type Activity = {
    type: 'order' | 'review';
    id: string;
    title: string;
    description: string;
    amount?: string;
    rating?: number;
    date: string;
  };

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  
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
    const loadData = async () => {
      if (user?.id) {
        await fetchProfile();
        await fetchUserStats();
        await fetchRecentActivity();
      } else {
        setLoading(false);
      }
    };

    loadData();
     
  }, [fetchProfile, fetchRecentActivity, fetchUserStats, user?.id]);

  const fetchProfile = useCallback(async () => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
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
  }, [user?.id, user?.email]);

  const fetchUserStats = useCallback(async () => {
    try {
      if (!user?.id) return;

      // Fetch total orders and amount spent
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .eq('customer_id', user.id);

      if (ordersError) throw ordersError;

      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Fetch reviews given
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('customer_id', user.id);

      if (reviewsError) throw reviewsError;

      const reviewsGiven = reviews?.length || 0;
      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Get member since date from profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .maybeSingle();

      setStats({
        totalOrders,
        favoriteChefs: 0, // TODO: Implement when favorites feature is added
        totalSpent: Math.round(totalSpent),
        memberSince: profileData?.created_at || new Date().toISOString(),
        reviewsGiven,
        avgRating: Math.round(avgRating * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values on error
      setStats({
        totalOrders: 0,
        favoriteChefs: 0,
        totalSpent: 0,
        memberSince: new Date().toISOString(),
        reviewsGiven: 0,
        avgRating: 0
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchRecentActivity = useCallback(async () => {
    try {
      if (!user?.id) return;

      // Fetch recent orders
      const { data: recentOrders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          created_at,
          status
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (ordersError) throw ordersError;

      // Fetch recent reviews
      const { data: recentReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          created_at,
          comment,
          chef_id
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (reviewsError) throw reviewsError;

      // Combine and format activity
      const activities = [
        ...(recentOrders || []).map(order => ({
          type: 'order',
          id: order.id,
          title: `Beställning #${order.id.slice(0, 8)}`,
          description: 'Beställning',
          amount: `${order.total_amount} kr`,
          date: order.created_at
        })),
        ...(recentReviews || []).map(review => ({
          type: 'review',
          id: review.id,
          title: 'Recension lämnad',
          description: `${review.rating} stjärnor`,
          rating: review.rating,
          date: review.created_at
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity([]);
    }
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const profileData = {
        id: user?.id as string,
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
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        {activity.type === 'order' && (
                          <>
                            <p className="text-sm font-medium">{activity.amount}</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.floor((new Date().getTime() - new Date(activity.date).getTime()) / (1000 * 60 * 60 * 24))} dagar sedan
                            </p>
                          </>
                        )}
                        {activity.type === 'review' && (
                          <>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < activity.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {Math.floor((new Date().getTime() - new Date(activity.date).getTime()) / (1000 * 60 * 60 * 24))} dagar sedan
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Ingen aktivitet än. Börja beställa mat för att se din historik här!</p>
                </div>
              )}
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
                <p><strong>Konto skapat:</strong> {new Date(stats.memberSince).toLocaleDateString('sv-SE')}</p>
                <p><strong>Senast inloggad:</strong> {new Date().toLocaleDateString('sv-SE')}</p>
                <p><strong>Konto-ID:</strong> {user?.id?.slice(0, 8)}...</p>
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