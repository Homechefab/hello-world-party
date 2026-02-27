import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, ChefHat, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { OrderTrackingCard } from '@/components/order/OrderTrackingCard';

interface ActiveOrder {
  id: string;
  status: string;
  total_amount: number;
  estimated_ready_at: string | null;
  preparation_started_at: string | null;
  chef_name: string;
  item_count: number;
}

export const ActiveOrdersBanner = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ActiveOrder[]>([]);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchActive = async () => {
      const { data } = await supabase
        .from('orders')
        .select(`
          id, status, total_amount, estimated_ready_at, preparation_started_at,
          chefs (business_name, full_name),
          order_items (id)
        `)
        .eq('customer_id', userId)
        .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data.map((o: any) => ({
          id: o.id,
          status: o.status,
          total_amount: o.total_amount,
          estimated_ready_at: o.estimated_ready_at,
          preparation_started_at: o.preparation_started_at,
          chef_name: o.chefs?.business_name || o.chefs?.full_name || 'Kock',
          item_count: o.order_items?.length || 0,
        })));
      }
    };

    fetchActive();

    const channel = supabase
      .channel(`active-orders-banner-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `customer_id=eq.${user.id}`,
      }, () => fetchActive())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  if (orders.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">
          {orders.length === 1 ? 'Din aktiva beställning' : `Dina aktiva beställningar (${orders.length})`}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {orders.map((order) => (
          <Card key={order.id} className="border-primary/20 bg-primary/5 hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{order.chef_name}</span>
                </div>
                <span className="text-sm font-semibold">{order.total_amount} kr</span>
              </div>

              <OrderTrackingCard
                status={order.status}
                estimatedReadyAt={order.estimated_ready_at}
                preparationStartedAt={order.preparation_started_at}
                compact
              />

              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to={`/order-tracking/${order.id}`}>
                  Spåra beställning
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
