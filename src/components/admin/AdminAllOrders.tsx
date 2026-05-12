import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw, Package, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface AdminOrder {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  customer_id: string;
  chef_id: string;
  delivery_address: string | null;
  customer_phone: string | null;
  special_instructions: string | null;
  customer_name?: string;
  customer_email?: string;
  customer_phone_resolved?: string;
  chef_name?: string;
  chef_business?: string;
  items?: Array<{ name: string; quantity: number; unit_price: number }>;
}

const statusVariant = (s: string) => {
  switch (s) {
    case 'pending': return 'secondary';
    case 'confirmed':
    case 'preparing':
    case 'ready': return 'default';
    case 'completed': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'secondary';
  }
};

const statusLabel = (s: string) => {
  const m: Record<string, string> = {
    pending: 'Väntande',
    confirmed: 'Bekräftad',
    preparing: 'Förbereds',
    ready: 'Klar',
    completed: 'Slutförd',
    cancelled: 'Avbruten',
  };
  return m[s] || s;
};

export const AdminAllOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at, customer_id, chef_id, delivery_address, customer_phone, special_instructions, order_items(quantity, unit_price, dishes(name))')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;

      const customerIds = Array.from(new Set((ordersData || []).map(o => o.customer_id).filter(Boolean)));
      const chefIds = Array.from(new Set((ordersData || []).map(o => o.chef_id).filter(Boolean)));

      const [{ data: profiles }, { data: chefs }] = await Promise.all([
        customerIds.length
          ? supabase.from('profiles').select('id, full_name, email, phone').in('id', customerIds)
          : Promise.resolve({ data: [] as any[] }),
        chefIds.length
          ? supabase.from('chefs').select('id, business_name, full_name').in('id', chefIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      const chefMap = new Map((chefs || []).map((c: any) => [c.id, c]));

      const enriched: AdminOrder[] = (ordersData || []).map((o: any) => {
        const p = profileMap.get(o.customer_id);
        const c = chefMap.get(o.chef_id);
        return {
          ...o,
          customer_name: p?.full_name || p?.email || 'Okänd',
          customer_email: p?.email,
          customer_phone_resolved: o.customer_phone || p?.phone,
          chef_name: c?.full_name,
          chef_business: c?.business_name,
          items: (o.order_items || []).map((it: any) => ({
            name: it.dishes?.name || 'Okänd rätt',
            quantity: it.quantity,
            unit_price: it.unit_price,
          })),
        };
      });

      setOrders(enriched);
    } catch (err) {
      console.error('Failed to load admin orders', err);
      toast.error('Kunde inte ladda beställningar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime: refresh on any insert/update to orders
  useEffect(() => {
    const channel = supabase
      .channel('admin-all-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        load();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Alla beställningar</CardTitle>
          <CardDescription>Realtidsöversikt av alla beställningar på plattformen ({orders.length})</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Laddar…</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Inga beställningar ännu.</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-medium">#{o.id.slice(-8)} · {o.total_amount} kr</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString('sv-SE')}</div>
                </div>
                <Badge variant={statusVariant(o.status) as any}>{statusLabel(o.status)}</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-medium">Kund</div>
                  <div>{o.customer_name}</div>
                  {o.customer_email && <div className="text-muted-foreground text-xs">{o.customer_email}</div>}
                  {o.customer_phone_resolved && (
                    <div className="text-muted-foreground text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> {o.customer_phone_resolved}</div>
                  )}
                </div>
                <div>
                  <div className="font-medium">Kock</div>
                  <div>{o.chef_business || o.chef_name || '—'}</div>
                  {o.chef_business && o.chef_name && <div className="text-muted-foreground text-xs">{o.chef_name}</div>}
                </div>
              </div>
              {o.items && o.items.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium mb-1">Rätter</div>
                  <ul className="text-muted-foreground text-xs space-y-0.5">
                    {o.items.map((it, i) => (
                      <li key={i}>{it.quantity}× {it.name} ({it.unit_price} kr)</li>
                    ))}
                  </ul>
                </div>
              )}
              {o.special_instructions && (
                <div className="text-xs text-muted-foreground italic">"{o.special_instructions}"</div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
