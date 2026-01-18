import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Loader2 } from 'lucide-react';

interface StripeCheckoutProps {
  priceId: string;
  dishName: string;
  price: number;
  quantity?: number;
  description?: string;
}

/**
 * StripeCheckout Component - Exempel på Stripe integration
 * 
 * @example
 * ```tsx
 * <StripeCheckout 
 *   priceId="price_1SKl5741rPpIJXZ0RGnIxSzt"
 *   dishName="Köttbullar med potatismos"
 *   price={89}
 *   quantity={1}
 * />
 * ```
 */
export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  priceId,
  dishName,
  price,
  quantity = 1,
  description
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          quantity,
          dishName,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        if (data.sessionId) {
          try { 
            sessionStorage.setItem('last_checkout_session_id', data.sessionId); 
            console.log('Saved session ID:', data.sessionId);
          } catch (e) {
            console.error('Failed to save session ID:', e);
          }
        }
        
        console.log('Opening Stripe Checkout:', data.url);
        // Öppna Stripe Checkout i ny flik
        const stripeWindow = window.open(data.url, '_blank');
        
        if (!stripeWindow) {
          toast({
            title: "Popup blockerad",
            description: "Tillåt popup-fönster för att fortsätta till betalning",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Omdirigerar till betalning",
          description: "Stripe Checkout öppnas i en ny flik",
        });
      } else {
        throw new Error('Ingen checkout-URL mottogs');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Betalningsfel",
        description: error instanceof Error ? error.message : "Något gick fel med betalningen",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const basePrice = price * quantity;
  const serviceFee = basePrice * 0.06; // 6% serviceavgift som läggs på kundpriset
  const totalPrice = basePrice + serviceFee;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {dishName}
        </CardTitle>
        <CardDescription>
          {description || "Betala säkert med Stripe"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Antal:</span>
            <span>{quantity} st</span>
          </div>
          <div className="flex justify-between">
            <span>Pris per portion:</span>
            <span>{price} kr</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Pris:</span>
            <span>{basePrice} kr</span>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm space-y-1">
            <div className="font-medium">Prisuppdelning:</div>
            <div className="flex justify-between text-muted-foreground">
              <span>Pris ({quantity} st × {price} kr):</span>
              <span>{basePrice.toFixed(2)} kr</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Serviceavgift (6%):</span>
              <span>{serviceFee.toFixed(2)} kr</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Totalt att betala:</span>
              <span>{totalPrice.toFixed(2)} kr</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Laddar...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Betala med Stripe
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Säker betalning via Stripe. Du kan betala med kort eller andra betalmetoder.
        </p>
      </CardContent>
    </Card>
  );
};
