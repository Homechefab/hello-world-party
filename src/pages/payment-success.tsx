import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Order } from '@/types/order';
import type { Database } from '@/types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type DbOrder = Database['public']['Tables']['orders']['Row'];

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<DbOrder | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function verifyPayment() {
      try {
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id');
        
        if (!orderId) {
          throw new Error('Inget order-ID hittades');
        }

        const response = await supabase
          .from('orders')
          .select()
          .eq('id', orderId)
          .limit(1)
          .maybeSingle();
        
        const { data, error } = response;

        if (error) throw error;
        
        if (data) {
          setOrderDetails(data);
          toast({
            title: 'Betalning bekräftad!',
            description: 'Din beställning har mottagits'
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: 'Något gick fel',
          description: 'Kunde inte verifiera betalningen',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [location.search]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Verifierar betalning...</h3>
            <p className="text-muted-foreground">
              Vänta medan vi bekräftar din betalning
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-center">Betalning genomförd!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderDetails && (
            <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Order-ID:</span>
                <span className="font-medium">#{orderDetails.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Belopp:</span>
                <span className="font-medium">
                  {orderDetails.total_amount.toLocaleString('sv-SE')} kr
                </span>
              </div>
            </div>
          )}
          
          <Button 
            onClick={() => navigate('/')} 
            className="w-full"
          >
            Tillbaka till startsidan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}