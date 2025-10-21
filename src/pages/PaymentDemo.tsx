import { StripeCheckout } from '@/components/StripeCheckout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/**
 * Payment Demo Page - Visar exempel på Stripe-betalningar
 */
const PaymentDemo = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Betalningsdemo med Stripe</h1>
          <p className="text-muted-foreground">
            Testa hur betalningsflödet fungerar. Använd testkortet <code className="bg-muted px-2 py-1 rounded">4242 4242 4242 4242</code>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hur provisionen fungerar</CardTitle>
            <CardDescription>
              Homechef tar 20% provision på varje försäljning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Totalpris kunden betalar</div>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">20%</div>
                <div className="text-sm text-muted-foreground">Homechef provision</div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-600">80%</div>
                <div className="text-sm text-muted-foreground">Kockens intäkt</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Testa betalningar</h2>
          <p className="text-muted-foreground">
            Klicka på "Betala med Stripe" för att öppna Stripe Checkout. 
            När checkout-sidan öppnas kan du använda testkortet för att simulera en betalning.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <StripeCheckout
              priceId="price_1SKl5741rPpIJXZ0RGnIxSzt"
              dishName="Köttbullar med potatismos"
              price={89}
              quantity={1}
              description="Klassiska svenska köttbullar med krämigt potatismos"
            />

            <StripeCheckout
              priceId="price_1SKl5O41rPpIJXZ0nSXiiEVh"
              dishName="Hemlagad Lasagne"
              price={149}
              quantity={1}
              description="Hemlagad lasagne med köttfärs och generösa lager av ost"
            />

            <StripeCheckout
              priceId="price_1SKl5j41rPpIJXZ0hISmjkUX"
              dishName="Thai Röd Curry"
              price={129}
              quantity={1}
              description="Kryddig thailändsk röd curry med kokosmjölk"
            />
          </div>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-600">💳 Stripe Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <p className="font-medium">Testkort för lyckad betalning:</p>
              <code className="bg-background px-3 py-2 rounded block">4242 4242 4242 4242</code>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Utgångsdatum:</p>
              <p className="text-sm text-muted-foreground">Valfritt framtida datum (t.ex. 12/25)</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">CVC:</p>
              <p className="text-sm text-muted-foreground">Valfria 3 siffror (t.ex. 123)</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Postnummer:</p>
              <p className="text-sm text-muted-foreground">Valfritt postnummer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDemo;
