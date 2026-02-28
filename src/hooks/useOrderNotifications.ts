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
        const pickupInstructions = payload.new?.pickup_instructions as string | null;

        if (newStatus && newStatus !== oldStatus && STATUS_LABELS[newStatus]) {
          const label = STATUS_LABELS[newStatus];
          const orderId = (payload.new?.id as string)?.slice(0, 8);

          const isReady = newStatus === 'ready';

          // Vibration when ready
          if (isReady && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 300]);
          }

          // Sound when ready
          if (isReady) {
            try {
              const ctx = new AudioContext();
              const playTone = (freq: number, start: number, dur: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + dur);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur);
              };
              playTone(523, 0, 0.15);
              playTone(659, 0.18, 0.15);
              playTone(784, 0.36, 0.25);
            } catch (e) {
              // AudioContext may not be available
            }
          }

          // Sonner toast (always)
          const toastMessage = isReady && pickupInstructions
            ? `Beställning #${orderId}: ${label}\n📍 ${pickupInstructions}`
            : `Beställning #${orderId}: ${label}`;
          toast.info(toastMessage, {
            duration: isReady ? 8000 : 5000,
          });

          // Browser notification (if permitted and tab not focused)
          if (
            'Notification' in window &&
            Notification.permission === 'granted' &&
            document.hidden
          ) {
            const notifBody = isReady && pickupInstructions
              ? `Beställning #${orderId}: ${label}\n📍 ${pickupInstructions}`
              : `Beställning #${orderId}: ${label}`;
            new Notification('Homechef - Orderuppdatering', {
              body: notifBody,
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
