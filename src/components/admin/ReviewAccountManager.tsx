import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2, CheckCircle, Copy } from 'lucide-react';

interface ReviewAccount {
  platform: string;
  email: string;
  password: string;
  fullName: string;
}

const defaultAccounts: ReviewAccount[] = [
  {
    platform: 'Apple',
    email: 'applereview@homechef.nu',
    password: 'AppleReview2026!',
    fullName: 'Apple Review',
  },
  {
    platform: 'Google',
    email: 'googlereview@homechef.nu',
    password: 'GoogleReview2026!',
    fullName: 'Google Review',
  },
];

export function ReviewAccountManager() {
  const [loading, setLoading] = useState<string | null>(null);
  const [created, setCreated] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCreate = async (account: ReviewAccount) => {
    setLoading(account.platform);
    try {
      const { data, error } = await supabase.functions.invoke('create-review-account', {
        body: {
          email: account.email,
          password: account.password,
          fullName: account.fullName,
          platform: account.platform,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setCreated((prev) => [...prev, account.platform]);
      toast({
        title: 'Konto skapat!',
        description: `${account.platform}-granskningskonto (${account.email}) har skapats med alla roller.`,
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Kopierat!', description: text });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Granskningskonton (App Store / Google Play)
        </CardTitle>
        <CardDescription>
          Skapa testkonton för Apple och Google-granskning. Kontona får alla roller (kund, kock, kökspartner, restaurang) med förhandsgodkännande.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {defaultAccounts.map((account) => (
          <div key={account.platform} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border rounded-lg">
            <div className="flex-1 space-y-1">
              <p className="font-medium">{account.platform}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{account.email}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(account.email)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{account.password}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(account.password)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {created.includes(account.platform) ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Skapat</span>
              </div>
            ) : (
              <Button
                onClick={() => handleCreate(account)}
                disabled={loading !== null}
                size="sm"
              >
                {loading === account.platform ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Skapar...</>
                ) : (
                  'Skapa konto'
                )}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
