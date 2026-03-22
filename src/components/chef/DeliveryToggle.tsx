import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DeliveryToggleProps {
  chefId?: string | null;
}

export const DeliveryToggle = ({ chefId: overrideChefId }: DeliveryToggleProps = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!overrideChefId && !user?.id) return;
      let query = supabase.from('chefs').select('offers_delivery');
      if (overrideChefId) {
        query = query.eq('id', overrideChefId);
      } else {
        query = query.eq('user_id', user!.id!);
      }
      const { data } = await query.maybeSingle();
      if (data) setOffersDelivery(data.offers_delivery ?? false);
      setLoading(false);
    };
    load();
  }, [user?.id, overrideChefId]);

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
