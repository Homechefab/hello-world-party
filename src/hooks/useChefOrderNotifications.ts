import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useOrderSound } from '@/hooks/useOrderSound';

export function useChefOrderNotifications() {
  const { user } = useAuth();
  const chefIdRef = useRef<string | null>(null);
  const { playOrderSound } = useOrderSound();

  // Request notification permission
  useEffect(() => {
    if (!user?.id) return;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user?.id]);

  // Resolve chef_id for current user
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('chefs')
      .select('id')
      .eq('user_id', user.id)
      .eq('kitchen_approved', true)
      .maybeSingle()
      .then(({ data }) => {
        chefIdRef.current = data?.id ?? null;
      });
  }, [user?.id]);

  // Listen for new orders via Realtime
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`chef-new-orders-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      }, (payload) => {
        const orderChefId = payload.new?.chef_id as string;
        if (!chefIdRef.current || orderChefId !== chefIdRef.current) return;

        const orderId = (payload.new?.id as string)?.slice(0, 8);
        const amount = payload.new?.total_amount as number;

        if ('vibrate' in navigator) {
          navigator.vibrate([300, 100, 300]);
        }

        playOrderSound();

        toast.success(
          `🆕 Ny beställning #${orderId}! ${amount ? amount + ' kr' : ''}`,
          { duration: 10000 }
        );

        if (
          'Notification' in window &&
          Notification.permission === 'granted' &&
          document.hidden
        ) {
          new Notification('Homechef - Ny beställning!', {
            body: `Beställning #${orderId} har inkommit${amount ? ' (' + amount + ' kr)' : ''}`,
            icon: '/favicon.ico',
          });
        }

        supabase.functions.invoke('notify-chef-new-order', {
          body: { order_id: payload.new?.id },
        }).catch(console.error);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, playOrderSound]);
}
