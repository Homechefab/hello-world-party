import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Edit,
  Trash2,
  Loader2
} from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";

interface SellerStats {
  totalEarnings: number;
  totalOrders: number;
  averageRating: number;
  activeListings: number;
}

interface Order {
  id: string;
  dishName: string;
  buyerName: string;
  quantity: number;
  total: number;
  status: string;
  time: string;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  available: boolean;
  orders: number;
  rating: number;
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": 
    case "Hämtad": return "bg-green-100 text-green-800";
    case "confirmed":
    case "Bekräftad": return "bg-blue-100 text-blue-800";
    case "pending":
    case "Väntar": return "bg-yellow-100 text-yellow-800";
    case "cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const translateStatus = (status: string) => {
  switch (status) {
    case "completed": return "Hämtad";
    case "confirmed": return "Bekräftad";
    case "pending": return "Väntar";
    case "cancelled": return "Avbruten";
    case "preparing": return "Tillagas";
    default: return status;
  }
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SellerStats>({
    totalEarnings: 0,
    totalOrders: 0,
    averageRating: 0,
    activeListings: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [chefData, setChefData] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Hämta kockprofil
      const { data: chef } = await supabase
        .from('chefs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!chef) {
        setLoading(false);
        return;
      }

      setChefData(chef);

      // Hämta profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setProfile(profileData);

      // Hämta rätter
      const { data: dishes } = await supabase
        .from('dishes')
        .select('*')
        .eq('chef_id', chef.id);

      const activeDishes = dishes?.filter(d => d.available) || [];
      
      // Hämta beställningar
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            total_price,
            dish_id,
            dishes (name)
          )
        `)
        .eq('chef_id', chef.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Hämta recensioner för genomsnittligt betyg
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('chef_id', chef.id);

      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Beräkna total intäkt
      const totalEarnings = ordersData?.reduce((sum, order) => {
        if (order.status === 'completed') {
          return sum + Number(order.total_amount);
        }
        return sum;
      }, 0) || 0;

      // Sätt statistik
      setStats({
        totalEarnings,
        totalOrders: ordersData?.length || 0,
        averageRating: Math.round(avgRating * 10) / 10,
        activeListings: activeDishes.length
      });

      // Formatera beställningar
      const formattedOrders: Order[] = (ordersData || []).map(order => {
        const firstItem = order.order_items?.[0];
        const dishName = firstItem?.dishes?.name || 'Okänd rätt';
        const quantity = order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        
        return {
          id: order.id,
          dishName,
          buyerName: 'Kund',
          quantity,
          total: Number(order.total_amount),
          status: order.status,
          time: formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: sv })
        };
      });

      setOrders(formattedOrders);

      // Formatera annonser
      const formattedListings: Listing[] = (dishes || []).map(dish => ({
        id: dish.id,
        title: dish.name,
        price: Number(dish.price),
        available: dish.available || false,
        orders: 0,
        rating: 0,
        status: dish.available ? 'Aktiv' : 'Inaktiv'
      }));

      setListings(formattedListings);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Kunde inte hämta data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async (dishId: string | undefined) => {
    if (!dishId) return;
    
    try {
      const { error } = await supabase
        .from('dishes')
        .update({ available: false })
        .eq('id', dishId);

      if (error) throw error;
      
      toast.success('Rätten har tagits bort');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Kunde inte ta bort rätten');
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: profile.email,
          phone: profile.phone,
          address: profile.address
        })
        .eq('id', user.id);

      if (error) throw error;
      
      if (chefData) {
        await supabase
          .from('chefs')
          .update({ bio: chefData.bio })
          .eq('id', chefData.id);
      }

      toast.success('Profilen har sparats');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Kunde inte spara profilen');
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Säljarpanel</h1>
            <p className="text-muted-foreground">Hantera dina rätter och beställningar</p>
          </div>
          <Link to="/sell">
            <Button variant="food" size="lg">
              Lägg till ny rätt
            </Button>
          </Link>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Totala intäkter</p>
                  <p className="text-2xl font-bold">{stats.totalEarnings} kr</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Beställningar</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Genomsnittligt betyg</p>
                  <p className="text-2xl font-bold">{stats.averageRating || '-'}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktiva annonser</p>
                  <p className="text-2xl font-bold">{stats.activeListings}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Beställningar</TabsTrigger>
            <TabsTrigger value="listings">Mina annonser</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Senaste beställningar</CardTitle>
                <CardDescription>
                  Håll koll på dina senaste beställningar och deras status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Inga beställningar ännu
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{order.dishName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.quantity} portioner
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{order.total} kr</span>
                          <Badge className={getStatusColor(order.status)}>
                            {translateStatus(order.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{order.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mina annonser</CardTitle>
                    <CardDescription>
                      Hantera och redigera dina maträtter
                    </CardDescription>
                  </div>
                  <Input
                    placeholder="Sök bland dina rätter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredListings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Inga rätter ännu. <Link to="/sell" className="text-primary hover:underline">Lägg till din första rätt</Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredListings.map((listing) => (
                      <div key={listing.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-lg">{listing.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{listing.price} kr</span>
                              {listing.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span>{listing.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant={listing.status === "Aktiv" ? "default" : "secondary"}>
                            {listing.status}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Redigera
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteDish(listing.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Ta bort
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profilinställningar</CardTitle>
                <CardDescription>
                  Hantera din säljarprofil och inställningar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.full_name?.substring(0, 2).toUpperCase() || 'XX'}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{profile?.full_name || 'Okänt namn'}</h3>
                    <p className="text-muted-foreground">
                      Medlem sedan {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' }) : '-'}
                    </p>
                    {stats.averageRating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{stats.averageRating} betyg ({stats.totalOrders} recensioner)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">E-post</label>
                    <Input 
                      value={profile?.email || ''} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefon</label>
                    <Input 
                      value={profile?.phone || ''} 
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="mt-1" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Adress</label>
                  <Input 
                    value={profile?.address || ''} 
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="mt-1" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Om mig</label>
                  <textarea 
                    className="w-full mt-1 p-3 border rounded-md resize-none"
                    rows={4}
                    value={chefData?.bio || ''}
                    onChange={(e) => setChefData({ ...chefData, bio: e.target.value })}
                  />
                </div>
                
                <Button variant="food" onClick={handleSaveProfile}>
                  Spara ändringar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
