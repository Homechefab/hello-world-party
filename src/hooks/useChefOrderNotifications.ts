import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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

  // Play notification sound
  const playSound = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const play = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.35, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      // Attention-grabbing descending then ascending pattern
      play(880, 0, 0.12);
      play(660, 0.14, 0.12);
      play(880, 0.28, 0.12);
      play(1100, 0.42, 0.2);
    } catch {
      // AudioContext may not be available
    }
  }, []);

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
        // Only notify if this order is for our chef
        const orderChefId = payload.new?.chef_id as string;
        if (!chefIdRef.current || orderChefId !== chefIdRef.current) return;

        const orderId = (payload.new?.id as string)?.slice(0, 8);
        const amount = payload.new?.total_amount as number;

        // Vibrate
        if ('vibrate' in navigator) {
          navigator.vibrate([300, 100, 300]);
        }

        // Sound
        playSound();

        // Toast
        toast.success(
          `🆕 Ny beställning #${orderId}! ${amount ? amount + ' kr' : ''}`,
          { duration: 10000 }
        );

        // Browser notification
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

        // Also trigger email notification via edge function
        supabase.functions.invoke('notify-chef-new-order', {
          body: { order_id: payload.new?.id },
        }).catch(console.error);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, playSound]);
}
