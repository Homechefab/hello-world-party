import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ChefProfileAvatar } from '@/components/chef/ChefProfileAvatar';
import { ChefBioEditor } from '@/components/chef/ChefBioEditor';
import { Badge } from '@/components/ui/badge';
import { HygieneQuestionnaire } from '@/components/HygieneQuestionnaire';
import { VideoUpload } from '@/components/VideoUpload';
import { OrderManagement } from '@/components/chef/OrderManagement';
import MenuManager from '@/components/chef/MenuManager';
import IncomeReports from '@/components/chef/IncomeReports';
import { SocialMediaLinks } from '@/components/chef/SocialMediaLinks';
import { DeliveryToggle } from '@/components/chef/DeliveryToggle';
import { OperatingHoursManager } from '@/components/chef/OperatingHoursManager';
import { AdminChefSelector } from '@/components/admin/AdminChefSelector';
import { useRole } from '@/hooks/useRole';
import { 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  TrendingUp,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChefOrderNotifications } from '@/hooks/useChefOrderNotifications';

// Chef Dashboard Component
export const ChefDashboard = () => {
  const [searchParams] = useSearchParams();
  const { isAdmin } = useRole();
  const [adminSelectedChefId, setAdminSelectedChefId] = useState<string | null>(null);
  
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
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  useChefOrderNotifications();

  const stats = {
    totalSales: 15750,
    ordersThisWeek: 23,
    averageRating: 4.8,
    totalDishes: dishes.length
  };

  const loadChefData = useCallback(async () => {
    try {
      let chefId: string | null = null;

      if (isAdmin && adminSelectedChefId) {
        // Admin mode: use the selected chef ID directly
        chefId = adminSelectedChefId;
      } else {
        // Normal chef mode: find chef by current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setLoading(false);
          return;
        }

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
        chefId = chefData.id;
      }

      if (!chefId) {
        setLoading(false);
        return;
      }

      // Fetch real dishes for this chef
      const { data: dishesData, error: dishesError } = await supabase
        .from('dishes')
        .select('*')
        .eq('chef_id', chefId)
        .order('created_at', { ascending: false });

      if (dishesError) {
        console.error('Error loading dishes:', dishesError);
      } else {
        // Transform to match Dish type with default values for nullable fields
        const transformedDishes = (dishesData || []).map(d => ({
          id: d.id,
          name: d.name,
          description: d.description || '',
          price: d.price,
          available: d.available ?? true,
          category: d.category || '',
          preparation_time: d.preparation_time || 0,
          image_url: d.image_url
        }));
        setDishes(transformedDishes);
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
          customer_name: 'Kund',
          created_at: order.created_at,
          dishes: order.order_items?.[0]?.dishes || { name: 'Okänd rätt', price: 0 }
        }));
        setOrders(transformedOrders);
        
        // Count active/pending orders
        const activeStatuses = ['pending', 'confirmed', 'preparing', 'ready'];
        const activeCount = transformedOrders.filter(o => activeStatuses.includes(o.status)).length;
        setPendingOrderCount(activeCount);
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

  // Realtime subscription to refresh order count
  useEffect(() => {
    const channel = supabase
      .channel('chef-order-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadChefData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadChefData]);



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Hantera din hemlagade mat verksamhet</p>
      </div>

      {/* Chef profile section */}
      <div className="flex items-start gap-6 mb-8 p-4 bg-muted/30 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <ChefProfileAvatar size="lg" />
          <p className="text-xs text-muted-foreground text-center">Klicka för att<br/>ladda upp bild</p>
        </div>
        <ChefBioEditor />
      </div>



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
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="orders" className="relative">
            Beställningar
            {pendingOrderCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1">
                {pendingOrderCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="menu">Meny</TabsTrigger>
          <TabsTrigger value="income">Intäkter</TabsTrigger>
          <TabsTrigger value="sales">Försäljning</TabsTrigger>
          <TabsTrigger value="hygiene">Egenkontroller</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="social">Sociala medier</TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
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
                          <p className="text-sm text-muted-foreground">{Array.isArray(order.dishes) ? order.dishes[0]?.name || 'Okänd rätt' : order.dishes?.name || 'Okänd rätt'}</p>
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

        <TabsContent value="settings" className="space-y-6">
          <OperatingHoursManager />
          <DeliveryToggle />
        </TabsContent>
      </Tabs>
    </div>
  );
};