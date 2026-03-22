import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Phone, 
  Calendar,
  Timer,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  created_at: string;
  pickup_time: string | null;
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  pickup_instructions?: string | null;
  dishes: {
    title: string;
    quantity: number;
    price: number;
    preparation_time?: number;
  }[];
}

interface OrderManagementProps {
  chefId?: string | null;
}

export const OrderManagement = ({ chefId: overrideChefId }: OrderManagementProps = {}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();

  const loadOrders = useCallback(async () => {
    if (!overrideChefId && !user?.id) {
      setLoading(false);
      return;
    }

    try {
      let chefId: string | null = null;
      
      if (overrideChefId) {
        chefId = overrideChefId;
      } else {
        const { data: chefData, error: chefError } = await supabase
          .from('chefs')
          .select('id')
          .eq('user_id', user!.id)
          .maybeSingle();

        if (chefError || !chefData) {
          console.error('Chef not found:', chefError);
          setLoading(false);
          return;
        }
        chefId = chefData.id;
      }

      // Then fetch orders for this chef
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            unit_price,
            dishes (name, preparation_time)
          )
        `)
        .eq('chef_id', chefId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match interface
      const transformedOrders = data?.map(order => ({
        id: order.id,
        status: order.status as Order['status'],
        created_at: order.created_at,
        pickup_time: order.delivery_time,
        total_amount: order.total_amount,
        customer_name: 'Kund', // Customer name not stored in orders table
        customer_phone: '', // Phone not stored in orders table
        pickup_instructions: order.special_instructions,
        dishes: (order.order_items || []).map((item: any) => ({
          title: item.dishes?.name || 'Okänd rätt',
          quantity: item.quantity,
          price: item.unit_price,
          preparation_time: item.dishes?.preparation_time || 30
        }))
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
  }, [toast, user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const [estimatedMinutes, setEstimatedMinutes] = useState<Record<string, number>>({});
  const [pickupInstructions, setPickupInstructions] = useState<Record<string, string>>({});

  // Calculate default estimated minutes from dish preparation times
  const getDefaultMinutes = (order: Order) => {
    const totalPrepTime = order.dishes.reduce((sum, dish) => sum + (dish.preparation_time || 30), 0);
    return Math.max(totalPrepTime, 15);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updateData: Record<string, unknown> = { status: newStatus };

      // When starting preparation, set estimated_ready_at and preparation_started_at
      if (newStatus === 'preparing') {
        const minutes = estimatedMinutes[orderId] || getDefaultMinutes(orders.find(o => o.id === orderId)!);
        const now = new Date();
        updateData.preparation_started_at = now.toISOString();
        updateData.estimated_ready_at = new Date(now.getTime() + minutes * 60000).toISOString();
      }

      // When confirming, set a rough estimated_ready_at
      if (newStatus === 'confirmed') {
        const minutes = estimatedMinutes[orderId] || getDefaultMinutes(orders.find(o => o.id === orderId)!);
        updateData.estimated_ready_at = new Date(Date.now() + minutes * 60000).toISOString();
      }

      // When marking as ready, include pickup instructions
      if (newStatus === 'ready' && pickupInstructions[orderId]) {
        updateData.pickup_instructions = pickupInstructions[orderId];
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
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
            Se och hantera dina beställningar
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
                          {order.customer_phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {order.customer_phone}
                            </p>
                          )}
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Upphämtning: {order.pickup_time ? formatTime(order.pickup_time) : 'Ej angiven'}
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
                      <div className="space-y-3 pt-4 border-t">
                        {/* Time estimate input for pending/confirmed */}
                        {['pending', 'confirmed'].includes(order.status) && (
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Uppskattad tid:</span>
                            <input
                              type="number"
                              min="5"
                              max="180"
                              value={estimatedMinutes[order.id] || getDefaultMinutes(order)}
                              onChange={(e) => setEstimatedMinutes(prev => ({ ...prev, [order.id]: Number(e.target.value) }))}
                              className="w-20 h-8 px-2 text-sm border rounded-md bg-background"
                            />
                            <span className="text-sm text-muted-foreground">min</span>
                          </div>
                        )}
                        <div className="flex gap-2">
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
                          <div className="w-full space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`pickup-${order.id}`} className="text-sm font-medium flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                Upphämtningsinstruktioner till kunden
                              </Label>
                              <Textarea
                                id={`pickup-${order.id}`}
                                placeholder="T.ex. Hämtas på Storgatan 5, port 3B. Ring på klockan 'Nilsson'. Stå vid porten så kommer jag ut."
                                value={pickupInstructions[order.id] || ''}
                                onChange={(e) => setPickupInstructions(prev => ({ ...prev, [order.id]: e.target.value }))}
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="flex-1 w-full"
                            >
                              <Package className="w-4 h-4 mr-2" />
                              Markera som klar
                            </Button>
                          </div>
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
