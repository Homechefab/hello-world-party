import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, CreditCard } from 'lucide-react';

interface OrderLine {
  type: 'physical' | 'digital_goods' | 'shipping_fee' | 'sales_tax' | 'discount';
  name: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total_amount: number;
  total_discount_amount?: number;
  total_tax_amount: number;
}

interface KlarnaPaymentProps {
  dishTitle: string;
  dishPrice: number;
  quantity: number;
  onPaymentSuccess?: () => void;
}

export const KlarnaPayment: React.FC<KlarnaPaymentProps> = ({
  dishTitle,
  dishPrice,
  quantity,
  onPaymentSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [klarnaHtml, setKlarnaHtml] = useState('');
  const { toast } = useToast();

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const unitPrice = dishPrice * 100; // Convert to öre (SEK cents)
  const totalAmount = unitPrice * quantity;
  const taxRate = 2000; // 20% moms i baspunkter (20.00%)
  const totalTaxAmount = Math.round(totalAmount * 0.2);

  const orderLines: OrderLine[] = [
    {
      type: 'physical',
      name: dishTitle,
      quantity: quantity,
      unit_price: unitPrice,
      tax_rate: taxRate,
      total_amount: totalAmount,
      total_tax_amount: totalTaxAmount
    }
  ];

  const handleKlarnaPayment = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('klarna-payment', {
        body: {
          amount: totalAmount,
          currency: 'SEK',
          orderLines: orderLines,
          userEmail: customerEmail
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.html_snippet) {
        setKlarnaHtml(data.html_snippet);
        setShowCheckout(true);
        toast({
          title: "Klarna Checkout laddad",
          description: "Välj ditt betalningssätt nedan"
        });
      } else if (data.checkout_url) {
        // Öppna Klarna checkout i ny flik
        window.open(data.checkout_url, '_blank');
      }

    } catch (error) {
      console.error('Klarna payment error:', error);
      toast({
        title: "Betalningsfel",
        description: error instanceof Error ? error.message : "Något gick fel med betalningen",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showCheckout && klarnaHtml) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Klarna Checkout
          </CardTitle>
          <CardDescription>
            Slutför din beställning med Klarna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            dangerouslySetInnerHTML={{ __html: klarnaHtml }}
            className="klarna-checkout-container"
          />
          <Button 
            variant="outline" 
            onClick={() => setShowCheckout(false)}
            className="mt-4"
          >
            Tillbaka
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Beställningssammanfattning
        </CardTitle>
        <CardDescription>
          Genomför din beställning med Klarna
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{dishTitle}</span>
            <span>{quantity} st</span>
          </div>
          <div className="flex justify-between">
            <span>Pris per portion:</span>
            <span>{dishPrice} kr</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Totalt (inkl. moms):</span>
            <span>{(totalAmount / 100).toLocaleString('sv-SE')} kr</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-postadress (valfritt för gäster)</Label>
          <Input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="din@email.se"
          />
          <p className="text-xs text-muted-foreground">
            Om du inte anger e-post genomförs köpet som gäst
          </p>
        </div>

        <Button 
          onClick={handleKlarnaPayment}
          disabled={isLoading}
          className="w-full bg-[#ff6600] hover:bg-[#e55a00] text-white"
        >
          {isLoading ? "Laddar..." : "Betala med Klarna"}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>Med Klarna kan du:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Betala direkt med kort eller bank</li>
            <li>Köp nu, betala senare</li>
            <li>Dela upp betalningen i 3 delar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};