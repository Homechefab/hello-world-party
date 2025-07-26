import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Loader2, Receipt, Shield, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SocialAuth from "./SocialAuth";

interface PaymentComponentProps {
  dishTitle: string;
  dishPrice: number;
  quantity: number;
  pickupTime: string;
  pickupAddress: string;
  specialRequests?: string;
}

const PaymentComponent = ({ 
  dishTitle, 
  dishPrice, 
  quantity, 
  pickupTime, 
  pickupAddress, 
  specialRequests 
}: PaymentComponentProps) => {
  const [paymentStep, setPaymentStep] = useState<'auth' | 'payment' | 'processing' | 'success'>('auth');
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { toast } = useToast();

  // Beräkna kostnader
  const subtotal = dishPrice * quantity;
  const adminFee = Math.round(subtotal * 0.12); // 12% administrationsavgift
  const total = subtotal + adminFee;

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    setPaymentStep('payment');
  };

  const handleStripePayment = async () => {
    setPaymentStep('processing');
    
    try {
      // Här skulle vi anropa vår Stripe Edge Function
      // const { data } = await supabase.functions.invoke('create-payment', {
      //   body: {
      //     amount: total * 100, // Stripe använder öre
      //     currency: 'sek',
      //     dishTitle,
      //     quantity,
      //     pickupTime,
      //     pickupAddress
      //   }
      // });
      
      // Simulera API-anrop
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulera framgångsrik betalning
      // window.open(data.url, '_blank');
      
      toast({
        title: "Omdirigerar till betalning...",
        description: "Du öppnas till Stripe Checkout i en ny flik"
      });
      
      // Simulera återkomst från Stripe
      setTimeout(() => {
        setPaymentStep('success');
        toast({
          title: "Betalning genomförd!",
          description: `Beställning av ${dishTitle} är bekräftad`
        });
      }, 3000);
      
    } catch (error) {
      setPaymentStep('payment');
      toast({
        title: "Betalning misslyckades",
        description: "Något gick fel. Försök igen.",
        variant: "destructive"
      });
    }
  };

  const handleStartPayment = (guestMode: boolean = false) => {
    setIsGuest(guestMode);
    if (guestMode) {
      setPaymentStep('auth');
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  if (paymentStep === 'success') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Beställning bekräftad!</h3>
          <p className="text-muted-foreground mb-4">
            Din beställning av {dishTitle} är mottagen och bekräftad.
          </p>
          <div className="bg-secondary p-4 rounded-lg text-sm space-y-1">
            <div className="flex justify-between">
              <span>Hämtning:</span>
              <span className="font-medium">{pickupTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Adress:</span>
              <span className="font-medium">{pickupAddress}</span>
            </div>
            <div className="flex justify-between">
              <span>Order-ID:</span>
              <span className="font-medium">#HC{Math.random().toString().slice(2, 8)}</span>
            </div>
          </div>
          <Button className="w-full mt-4" onClick={() => window.location.href = '/'}>
            Tillbaka till startsidan
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Bearbetar betalning...</h3>
          <p className="text-muted-foreground">
            Vänta medan vi bearbetar din betalning säkert via Stripe.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (paymentStep === 'auth') {
    return <SocialAuth onSuccess={handleAuthSuccess} isGuest={isGuest} />;
  }

  if (paymentStep === 'payment') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Slutför beställning
          </CardTitle>
          <CardDescription>Kontrollera din beställning och betala</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Beställningssammanfattning */}
          <div className="space-y-3">
            <h4 className="font-medium">Beställningsdetaljer</h4>
            <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{dishTitle}</span>
                <span>{quantity}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Hämtningstid:</span>
                <span>{pickupTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Adress:</span>
                <span className="text-right text-xs">{pickupAddress}</span>
              </div>
              {specialRequests && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Önskemål:</span>
                  <p className="mt-1">{specialRequests}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Prisuppdelning */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Maträtt ({quantity}x {dishPrice} kr)</span>
              <span>{subtotal} kr</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Administrationsavgift (12%)</span>
              <span>{adminFee} kr</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Totalt</span>
              <span>{total} kr</span>
            </div>
          </div>

          {/* Betalningsknapp */}
          <div className="space-y-3">
            <Button 
              onClick={handleStripePayment} 
              className="w-full" 
              variant="food"
              size="lg"
            >
              Betala {total} kr med Stripe
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Säker betalning via Stripe</span>
            </div>
          </div>

          {/* Villkor */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>
              Genom att slutföra köpet godkänner du våra{" "}
              <a href="#" className="text-primary hover:underline">villkor</a>
            </p>
            <p>
              Betalningen behandlas säkert av Stripe. Vi sparar inte dina kortuppgifter.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Initial tillstånd - visa betalningsalternativ
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Välj hur du vill fortsätta</CardTitle>
        <CardDescription>
          Logga in för snabbare checkout eller fortsätt som gäst
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-2">{dishTitle}</h4>
          <div className="flex justify-between text-sm">
            <span>{quantity} portioner</span>
            <span className="font-semibold">{total} kr (inkl. avgifter)</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => handleStartPayment(false)} 
            className="w-full" 
            variant="food"
          >
            Logga in och beställ
            <Badge variant="secondary" className="ml-2">Rekommenderat</Badge>
          </Button>
          
          <Button 
            onClick={() => handleStartPayment(true)} 
            variant="outline" 
            className="w-full"
          >
            Fortsätt som gäst
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Medlemmar får snabbare checkout, orderhistorik och exklusiva erbjudanden
          </p>
        </div>
      </CardContent>

      {/* Auth Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="max-w-md">
          <SocialAuth onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PaymentComponent;