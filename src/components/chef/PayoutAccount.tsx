import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Banknote, CheckCircle2, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PayoutStatus {
  connected: boolean;
  payouts_enabled?: boolean;
  details_submitted?: boolean;
  requirements_due?: string | null;
}

interface PayoutAccountProps {
  chefId?: string | null;
}

export const PayoutAccount = ({ chefId }: PayoutAccountProps = {}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<PayoutStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('chef-payouts', {
      body: { action: 'status', ...(chefId ? { chefId } : {}) },
    });
    if (error) {
      console.error('chef-payouts status failed:', error);
      setStatus({ connected: false });
    } else {
      setStatus(data as PayoutStatus);
    }
    setLoading(false);
  }, [chefId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const openStripe = async (action: 'onboard' | 'dashboard') => {
    setWorking(true);
    const { data, error } = await supabase.functions.invoke('chef-payouts', {
      body: { action, returnUrl: window.location.href, ...(chefId ? { chefId } : {}) },
    });
    setWorking(false);

    if (error || !data?.url) {
      toast({
        title: 'Kunde inte öppna Stripe',
        description: data?.error || 'Försök igen om en stund.',
        variant: 'destructive',
      });
      return;
    }
    window.location.assign(data.url as string);
  };

  const ready = status?.connected && status?.payouts_enabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Utbetalningskonto
        </CardTitle>
        <CardDescription>
          Koppla ditt bankkonto via Stripe så betalas din del av varje beställning ut automatiskt när
          beställningen är slutförd. Homechefs provision dras direkt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Hämtar status...
          </div>
        ) : ready ? (
          <>
            <Badge className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Aktivt – utbetalningar sker automatiskt
            </Badge>
            <div>
              <Button variant="outline" onClick={() => openStripe('dashboard')} disabled={working}>
                {working ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}
                Öppna mina utbetalningar
              </Button>
            </div>
          </>
        ) : (
          <>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {status?.connected
                  ? 'Registreringen är påbörjad men inte klar. Slutför den hos Stripe för att få automatiska utbetalningar.'
                  : 'Du har inget utbetalningskonto ännu. Tills du kopplat ett betalar Homechef ut manuellt.'}
                {status?.requirements_due ? (
                  <span className="block mt-1 text-xs text-muted-foreground">
                    Saknas: {status.requirements_due}
                  </span>
                ) : null}
              </AlertDescription>
            </Alert>
            <Button onClick={() => openStripe('onboard')} disabled={working}>
              {working ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {status?.connected ? 'Slutför registrering' : 'Koppla utbetalningskonto'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PayoutAccount;
