import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Bekräftad',
  preparing: 'Tillagas nu',
  ready: 'Klar för upphämtning!',
  delivered: 'Levererad',
  cancelled: 'Avbokad',
};

export function useOrderNotifications() {
  const { user } = useAuth();
  const permissionRef = useRef<NotificationPermission>('default');

  useEffect(() => {
    if (!user?.id) return;

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        permissionRef.current = perm;
      });
    } else if ('Notification' in window) {
      permissionRef.current = Notification.permission;
    }

    const channel = supabase
      .channel(`order-notifications-${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `customer_id=eq.${user.id}`,
      }, (payload) => {
        const newStatus = payload.new?.status as string;
        const oldStatus = payload.old?.status as string;

        if (newStatus && newStatus !== oldStatus && STATUS_LABELS[newStatus]) {
          const label = STATUS_LABELS[newStatus];
          const orderId = (payload.new?.id as string)?.slice(0, 8);

          // Sonner toast (always)
          toast.info(`Beställning #${orderId}: ${label}`, {
            duration: 5000,
          });

          // Browser notification (if permitted and tab not focused)
          if (
            'Notification' in window &&
            Notification.permission === 'granted' &&
            document.hidden
          ) {
            new Notification('Homechef - Orderuppdatering', {
              body: `Beställning #${orderId}: ${label}`,
              icon: '/favicon.ico',
            });
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
}
