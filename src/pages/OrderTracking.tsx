import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Phone, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { OrderTrackingCard } from '@/components/order/OrderTrackingCard';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';

const OrderTracking = () => {
  useOrderNotifications();
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!user?.id || !orderId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          chefs (business_name, full_name, phone),
          order_items (
            quantity,
            unit_price,
            dishes (name, image_url)
          )
        `)
        .eq('id', orderId)
        .eq('customer_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }, [user, orderId]);

  useEffect(() => {
    fetchOrder();

    // Subscribe to realtime updates
    if (orderId) {
      const channel = supabase
        .channel(`order-tracking-${orderId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        }, () => {
          fetchOrder();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [fetchOrder, orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/3" />
          <div className="h-48 bg-secondary rounded" />
          <div className="h-32 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">Beställning hittades inte</h1>
        <Button asChild>
          <Link to="/my-orders">Tillbaka till mina beställningar</Link>
        </Button>
      </div>
    );
  }

  const chefName = order.chefs?.business_name || order.chefs?.full_name || 'Kock';
  const isActive = ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);

  // Cancellation allowed if delivery_time is at least 7 days from now
  const canCancel = (() => {
    if (!isActive || order.status === 'ready') return false;
    if (!order.delivery_time) {
      // If no delivery_time, allow cancel only for pending/confirmed (not preparing)
      return ['pending', 'confirmed'].includes(order.status);
    }
    const deliveryDate = new Date(order.delivery_time).getTime();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return (deliveryDate - now) >= sevenDays;
  })();

  const handleCancel = async () => {
    if (!canCancel || cancelling) return;
    const confirmed = window.confirm('Är du säker på att du vill avboka beställningen?');
    if (!confirmed) return;

    setCancelling(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id)
        .eq('customer_id', user?.id ?? '');

      if (error) throw error;
      toast.success('Beställningen har avbokats');
      fetchOrder();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Kunde inte avboka beställningen');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/my-orders">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-2">
        {isActive ? 'Spåra din beställning' : 'Beställningsdetaljer'}
      </h1>
      <p className="text-muted-foreground mb-6">
        Beställning #{order.id.slice(0, 8)} från {chefName}
      </p>

      {/* Tracking card */}
      {isActive && (
        <div className="mb-6">
          <OrderTrackingCard
            status={order.status}
            estimatedReadyAt={order.estimated_ready_at}
            preparationStartedAt={order.preparation_started_at}
          />
        </div>
      )}

      {/* Order items */}
      <Card className="mb-4">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold">Din beställning</h3>
          {(order.order_items || []).map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.dishes?.name || 'Rätt'}</span>
              <span>{item.unit_price * item.quantity} kr</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Totalt</span>
            <span>{order.total_amount} kr</span>
          </div>
        </CardContent>
      </Card>

      {/* Pickup instructions from chef - shown prominently when ready */}
      {order.pickup_instructions && ['ready', 'completed', 'delivered'].includes(order.status) && (
        <Card className="mb-4 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Upphämtningsinstruktioner</h3>
                <p className="text-sm text-foreground">{order.pickup_instructions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="mb-4">
        <CardContent className="p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{order.delivery_address}</span>
          </div>
          {order.delivery_time && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Upphämtning: {new Date(order.delivery_time).toLocaleString('sv-SE')}</span>
            </div>
          )}
          {order.chefs?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a href={`tel:${order.chefs.phone}`} className="text-primary underline">{order.chefs.phone}</a>
            </div>
          )}
          {order.special_instructions && (
            <div className="p-3 bg-secondary/50 rounded-lg mt-2">
              <p className="text-xs font-medium mb-1">Dina instruktioner</p>
              <p>{order.special_instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel button */}
      {isActive && (
        <Card className={canCancel ? 'border-destructive/20' : 'border-muted'}>
          <CardContent className="p-4">
            {canCancel ? (
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCancel}
                disabled={cancelling}
              >
                <XCircle className="w-4 h-4 mr-2" />
                {cancelling ? 'Avbokar...' : 'Avboka beställning'}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                {order.status === 'ready'
                  ? 'Kan inte avbokas – beställningen är redan klar.'
                  : 'Avbokning är möjlig senast 7 dagar före leveranstiden.'}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {order.status === 'cancelled' && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 text-center text-sm text-destructive font-medium">
            Denna beställning har avbokats.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderTracking;
