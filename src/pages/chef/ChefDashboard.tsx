import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HygieneQuestionnaire } from '@/components/HygieneQuestionnaire';
import { VideoUpload } from '@/components/VideoUpload';
import { OrderManagement } from '@/components/chef/OrderManagement';
import { 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  FileText, 
  ChefHat,
  TrendingUp,
  Package,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Settings,
  ClipboardList
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

// Chef Dashboard Component
export const ChefDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dishes, setDishes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const stats = {
    totalSales: 15750,
    ordersThisWeek: 23,
    averageRating: 4.8,
    totalDishes: dishes.length
  };

  useEffect(() => {
    loadChefData();
  }, []);

  const loadChefData = async () => {
    try {
      // Load dishes
      const { data: dishesData, error: dishesError } = await supabase
        .from('dishes')
        .select('*')
        .eq('chef_id', 'current-user-id') // Replace with actual user ID
        .order('created_at', { ascending: false });

      if (dishesError) throw dishesError;
      setDishes(dishesData || []);

      // Load orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          dishes (
            title,
            price
          )
        `)
        .eq('chef_id', 'current-user-id')
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

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
  };

  const toggleDishStatus = async (dishId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('dishes')
        .update({ is_active: !isActive })
        .eq('id', dishId);

      if (error) throw error;

      setDishes(dishes.map(dish => 
        dish.id === dishId ? { ...dish, is_active: !isActive } : dish
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="orders">Beställningar</TabsTrigger>
          <TabsTrigger value="menu">Meny</TabsTrigger>
          <TabsTrigger value="hygiene">Hygienplan</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="kitchen">Kök</TabsTrigger>
          <TabsTrigger value="sales">Försäljning</TabsTrigger>
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
                          <p className="text-sm text-muted-foreground">{order.dishes?.title}</p>
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

        <TabsContent value="kitchen" className="space-y-6">
          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Köksstatus
            </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Kök väntar på godkännande</p>
                  <p className="text-sm text-yellow-600">Din köksinspektion är inbokad för nästa vecka</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Behöver du boka ett kök?</h3>
                <p className="text-muted-foreground">
                  Om ditt eget kök inte är godkänt än kan du hyra ett certifierat kök från våra partners.
                </p>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Boka kök hos partner
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hantera Meny</CardTitle>
                  <CardDescription>Lägg till och redigera dina rätter</CardDescription>
                </div>
                <Link to="/sell">
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Lägg till ny rätt
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Laddar rätter...</p>
                  </div>
                ) : dishes.length > 0 ? (
                  dishes.map((dish) => (
                    <div key={dish.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        {dish.images && dish.images[0] && (
                          <img 
                            src={dish.images[0]} 
                            alt={dish.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{dish.title}</p>
                            <Badge variant={dish.is_active ? "default" : "secondary"}>
                              {dish.is_active ? "Aktiv" : "Pausad"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{dish.price} kr • {dish.portions} portioner</p>
                          <p className="text-xs text-muted-foreground">{dish.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleDishStatus(dish.id, dish.is_active)}
                        >
                          {dish.is_active ? "Pausa" : "Aktivera"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Du har inga rätter än</p>
                    <Link to="/sell">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Lägg till din första rätt
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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