import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Phone, 
  MapPin, 
  Calendar,
  Eye,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  created_at: string;
  pickup_time: string;
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  pickup_instructions?: string;
  dishes: {
    title: string;
    quantity: number;
    price: number;
  }[];
}

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            dishes (
              name,
              price
            )
          ),
          profiles!inner (
            full_name,
            phone
          )
        `)
        .eq('chef_id', 'current-user-id') // Replace with actual user ID
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match interface
      const transformedOrders = data?.map(order => ({
        id: order.id,
        status: order.status as Order['status'],
        created_at: order.created_at,
        pickup_time: order.delivery_time,
        total_amount: order.total_amount,
        customer_name: 'Demo Kund',
        customer_phone: '08-123 456 78',
        pickup_instructions: order.special_instructions,
        dishes: order.order_items?.map((item: any) => ({
          title: item.dishes?.name || 'Okänd rätt',
          quantity: item.quantity,
          price: item.dishes?.price || 0
        })) || []
      })) || [];

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Fel vid laddning",
        description: "Kunde inte ladda beställningar",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Status uppdaterad",
        description: `Beställning har markerats som ${getStatusText(newStatus)}`
      });

    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Fel uppstod",
        description: "Kunde inte uppdatera beställningsstatus",
        variant: "destructive"
      });
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'Väntande',
      confirmed: 'Bekräftad',
      preparing: 'Förbereds',
      ready: 'Klar för upphämtning',
      completed: 'Slutförd',
      cancelled: 'Avbruten'
    };
    return statusMap[status];
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'preparing': return 'default';
      case 'ready': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const filterOrders = (status: string) => {
    switch (status) {
      case 'active':
        return orders.filter(order => ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status));
      case 'completed':
        return orders.filter(order => order.status === 'completed');
      case 'cancelled':
        return orders.filter(order => order.status === 'cancelled');
      default:
        return orders;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('sv-SE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Laddar beställningar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Beställningshantering
          </CardTitle>
          <CardDescription>
            Hantera alla dina inkommande beställningar
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Aktiva ({filterOrders('active').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Slutförda ({filterOrders('completed').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Avbrutna ({filterOrders('cancelled').length})
          </TabsTrigger>
        </TabsList>

        {['active', 'completed', 'cancelled'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {filterOrders(tabValue).length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Inga {tabValue === 'active' ? 'aktiva' : tabValue === 'completed' ? 'slutförda' : 'avbrutna'} beställningar
                </p>
              </div>
            ) : (
              filterOrders(tabValue).map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Beställning #{order.id.slice(-6)}
                        </CardTitle>
                        <CardDescription>
                          Beställd {formatTime(order.created_at)}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Kundinformation</h4>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Namn:</span>
                            {order.customer_name}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {order.customer_phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Upphämtning: {formatTime(order.pickup_time)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Beställning</h4>
                        <div className="space-y-1 text-sm">
                          {order.dishes.map((dish, index) => (
                            <p key={index}>
                              {dish.quantity}x {dish.title} ({dish.price} kr)
                            </p>
                          ))}
                          <p className="font-medium pt-2 border-t">
                            Totalt: {order.total_amount} kr
                          </p>
                        </div>
                      </div>
                    </div>

                    {order.pickup_instructions && (
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Hämtinstruktioner</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.pickup_instructions}
                        </p>
                      </div>
                    )}

                    {['pending', 'confirmed', 'preparing', 'ready'].includes(order.status) && (
                      <div className="flex gap-2 pt-4 border-t">
                        {order.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="flex-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Bekräfta
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            >
                              Avbryt
                            </Button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="flex-1"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Börja förbereda
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-1"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Markera som klar
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Slutför beställning
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};