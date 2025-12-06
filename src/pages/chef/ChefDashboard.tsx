import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChefProfileAvatar } from '@/components/chef/ChefProfileAvatar';
import { Badge } from '@/components/ui/badge';
import { HygieneQuestionnaire } from '@/components/HygieneQuestionnaire';
import { VideoUpload } from '@/components/VideoUpload';
import { OrderManagement } from '@/components/chef/OrderManagement';
import MenuManager from '@/components/chef/MenuManager';
import IncomeReports from '@/components/chef/IncomeReports';
import BusinessSetup from '@/components/chef/BusinessSetup';
import { SocialMediaLinks } from '@/components/chef/SocialMediaLinks';
import { ProfileImageUpload } from '@/components/chef/ProfileImageUpload';
import { 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  ChefHat,
  TrendingUp,
  Package,
  Edit,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Chef Dashboard Component
export const ChefDashboard = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'overview');
  type Dish = {
    id: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
    category: string;
    preparation_time: number;
    image_url: string | null;
  };

  type Order = {
    id: string;
    status: string;
    total_amount: number;
    customer_name: string;
    created_at: string;
    dishes?: { name: string; price: number } | Array<{ name: string; price: number }>;
  };

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const stats = {
    totalSales: 15750,
    ordersThisWeek: 23,
    averageRating: 4.8,
    totalDishes: dishes.length
  };

  const loadChefData = useCallback(async () => {
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Get chef_id for current user
      const { data: chefData, error: chefError } = await supabase
        .from('chefs')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (chefError || !chefData) {
        console.log('No chef profile found for user');
        setLoading(false);
        return;
      }

      // Fetch real dishes for this chef
      const { data: dishesData, error: dishesError } = await supabase
        .from('dishes')
        .select('*')
        .eq('chef_id', chefData.id)
        .order('created_at', { ascending: false });

      if (dishesError) {
        console.error('Error loading dishes:', dishesError);
      } else {
        setDishes(dishesData || []);
      }

      // Fetch real orders for this chef
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(dish_id, quantity, dishes(name, price))')
        .eq('chef_id', chefData.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) {
        console.error('Error loading orders:', ordersError);
      } else {
        // Transform orders to match expected format
        const transformedOrders = (ordersData || []).map(order => ({
          id: order.id,
          status: order.status,
          total_amount: order.total_amount,
          customer_name: 'Kund', // We don't have customer name in orders table
          created_at: order.created_at,
          dishes: order.order_items?.[0]?.dishes || { name: 'Okänd rätt', price: 0 }
        }));
        setOrders(transformedOrders);
      }

    } catch (error) {
      console.error('Error loading chef data:', error);
      toast({
        title: "Fel vid laddning",
        description: "Kunde inte ladda dina data. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadChefData();
  }, [loadChefData]);

  const toggleDishStatus = async (dishId: string, isActive: boolean) => {
    try {
      // For mock data, just update the local state
      setDishes(dishes.map(dish => 
        dish.id === dishId ? { ...dish, available: !isActive } : dish
      ));

      toast({
        title: isActive ? "Rätt pausad" : "Rätt aktiverad",
        description: isActive ? "Rätten är nu inaktiv och syns inte för kunder" : "Rätten är nu aktiv och synlig för kunder"
      });

    } catch (error) {
      console.error('Error toggling dish status:', error);
      toast({
        title: "Fel uppstod",
        description: "Kunde inte uppdatera rätten",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Kock Dashboard</h1>
        <p className="text-muted-foreground">Hantera din hemlagade mat verksamhet</p>
      </div>

      {/* Chef profile section */}
      <div className="flex items-center gap-4 mb-8">
        <ChefProfileAvatar size="lg" />
        <div>
          <p className="text-sm text-muted-foreground">Klicka på bilden för att ladda upp din profilbild</p>
        </div>
      </div>

      {/* Welcome banner for new chefs */}
      {stats.totalDishes === 0 && (
        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ChefProfileAvatar size="md" className="flex-shrink-0" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Välkommen som ny kock! 🎉</h3>
                <p className="text-muted-foreground mb-4">
                  Grattis till att du blivit godkänd! Låt oss hjälpa dig komma igång med en steg-för-steg guide.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button 
                    onClick={() => window.location.href = '/chef/welcome'}
                    className="gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Visa guide för nybörjare
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('menu')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg upp första rätten
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Försäljning</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales.toLocaleString('sv-SE')} kr</div>
            <p className="text-xs text-muted-foreground">+12% från förra månaden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beställningar</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersThisWeek}</div>
            <p className="text-xs text-muted-foreground">Denna vecka</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Betyg</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">Genomsnittligt betyg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rätter</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDishes}</div>
            <p className="text-xs text-muted-foreground">Aktiva rätter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="orders">Beställningar</TabsTrigger>
          <TabsTrigger value="menu">Meny</TabsTrigger>
          <TabsTrigger value="income">Intäkter</TabsTrigger>
          <TabsTrigger value="sales">Försäljning</TabsTrigger>
          <TabsTrigger value="hygiene">Egenkontroller</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="social">Sociala</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Senaste Beställningar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Laddar beställningar...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">Beställning #{order.id?.slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">{order.dishes?.name || 'Okänd rätt'}</p>
                        </div>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status === 'completed' ? 'Klar' : 'Pågående'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Inga beställningar än</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Kommunens godkännande</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Hygienbevis</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span>Kök väntar på godkännande</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="hygiene" className="space-y-6">
          <HygieneQuestionnaire />
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <VideoUpload />
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <MenuManager />
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <IncomeReports />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SocialMediaLinks />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Försäljningsstatistik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">23</div>
                    <p className="text-sm text-muted-foreground">Beställningar denna vecka</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">3,450 kr</div>
                    <p className="text-sm text-muted-foreground">Intäkter denna vecka</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">150 kr</div>
                    <p className="text-sm text-muted-foreground">Genomsnittlig beställning</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};