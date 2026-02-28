import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const DeliveryToggle = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from('chefs')
        .select('offers_delivery')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setOffersDelivery(data.offers_delivery ?? false);
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const handleToggle = async (checked: boolean) => {
    setOffersDelivery(checked);
    const { error } = await supabase
      .from('chefs')
      .update({ offers_delivery: checked })
      .eq('user_id', user?.id ?? '');

    if (error) {
      setOffersDelivery(!checked);
      toast({ title: 'Kunde inte uppdatera', variant: 'destructive' });
    } else {
      toast({
        title: checked ? 'Hemleverans aktiverad' : 'Hemleverans inaktiverad',
        description: checked
          ? 'Kunder kan nu se att du erbjuder hemleverans'
          : 'Kunder ser att upphämtning gäller',
      });
    }
  };

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="w-5 h-5" />
          Leveransalternativ
        </CardTitle>
        <CardDescription>
          Ange om du erbjuder hemleverans utöver upphämtning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="delivery-toggle" className="flex flex-col gap-1">
            <span className="font-medium">Erbjud hemleverans</span>
            <span className="text-sm text-muted-foreground">
              Kunder kan se att du levererar hem till dem
            </span>
          </Label>
          <Switch
            id="delivery-toggle"
            checked={offersDelivery}
            onCheckedChange={handleToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};
