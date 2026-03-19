import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2, CheckCircle } from 'lucide-react';

interface ReviewAccountInfo {
  platform: string;
  email: string;
  exists: boolean;
  fullyConfigured: boolean;
  roles: string[];
}

const PLATFORMS = ['Apple', 'Google'];

export function ReviewAccountManager() {
  const [loading, setLoading] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<ReviewAccountInfo[]>([]);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { toast } = useToast();

  const fetchAccountStatus = async () => {
    setCheckingStatus(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-review-account', {
        body: { action: 'status', platforms: PLATFORMS },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAccounts(Array.isArray(data?.accounts) ? data.accounts : []);
    } catch (err: any) {
      toast({
        title: 'Kunde inte läsa kontostatus',
        description: err.message || 'Ett fel uppstod vid hämtning av status',
        variant: 'destructive',
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    void fetchAccountStatus();
  }, []);

  const handleCreate = async (platform: string) => {
    setLoading(platform);
    try {
      const { data, error } = await supabase.functions.invoke('create-review-account', {
        body: { action: 'create', platform },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await fetchAccountStatus();

      toast({
        title: 'Konto klart!',
        description: `${platform}-granskningskonto är nu fullt konfigurerat.`,
      });
    } catch (err: any) {
      toast({
        title: 'Fel',
        description: err.message || 'Kunde inte skapa kontot',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Granskningskonton (App Store / Google Play)
        </CardTitle>
        <CardDescription>
          Skapa testkonton för Apple och Google-granskning. Kontona får alla roller (kund, kock, kökspartner,
          restaurang) med förhandsgodkännande. Inloggningsuppgifter hanteras säkert på serversidan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {checkingStatus && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Kontrollerar kontostatus...
          </div>
        )}

        {PLATFORMS.map((platform) => {
          const account = accounts.find((a) => a.platform === platform);
          const isConfigured = account?.fullyConfigured ?? false;

          return (
            <div key={platform} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border rounded-lg">
              <div className="flex-1 space-y-1">
                <p className="font-medium">{platform}</p>
                {account?.email && (
                  <p className="text-sm text-muted-foreground">{account.email}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Lösenord hanteras säkert på serversidan
                </p>
              </div>
              {isConfigured ? (
                <div className="flex items-center gap-1 text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Skapat</span>
                </div>
              ) : (
                <Button onClick={() => handleCreate(platform)} disabled={loading !== null || checkingStatus} size="sm">
                  {loading === platform ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Skapar...
                    </>
                  ) : (
                    'Skapa konto'
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
