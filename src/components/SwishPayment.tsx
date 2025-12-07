import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Smartphone } from "lucide-react";

interface SwishPaymentProps {
  amount: number;
  orderId?: string;
  message?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SwishPayment = ({ amount, orderId, message, onSuccess, onError }: SwishPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Convert Swedish formats to international
    if (digits.startsWith("0")) {
      return "46" + digits.slice(1);
    }
    if (digits.startsWith("46")) {
      return digits;
    }
    return digits;
  };

  const handlePayment = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Validate phone number
    if (!/^46\d{9}$/.test(formattedPhone)) {
      toast.error("Ange ett giltigt svenskt mobilnummer");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("swish-payment", {
        body: {
          amount,
          payerAlias: formattedPhone,
          message: message || `Beställning ${orderId || ""}`,
          orderId,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setPaymentSent(true);
        toast.success("Betalningsförfrågan skickad! Öppna Swish-appen för att slutföra betalningen.");
        onSuccess?.();
      } else {
        throw new Error(data.error || "Något gick fel");
      }
    } catch (error: any) {
      console.error("Swish payment error:", error);
      toast.error(error.message || "Kunde inte skicka betalningsförfrågan");
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentSent) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Betalningsförfrågan skickad!</h3>
              <p className="text-muted-foreground mt-1">
                Öppna din Swish-app för att godkänna betalningen på {amount.toFixed(2)} kr
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setPaymentSent(false);
                setPhoneNumber("");
              }}
            >
              Skicka igen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <img
            src="https://www.swish.nu/favicon.ico"
            alt="Swish"
            className="h-6 w-6"
          />
          Betala med Swish
        </CardTitle>
        <CardDescription>
          Ange ditt mobilnummer kopplat till Swish
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Mobilnummer</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="07X XXX XX XX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Svenskt format: 07X XXX XX XX
          </p>
        </div>

        <div className="flex items-center justify-between py-2 border-t">
          <span className="text-muted-foreground">Att betala:</span>
          <span className="text-xl font-bold">{amount.toFixed(2)} kr</span>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isLoading || !phoneNumber}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Skickar förfrågan...
            </>
          ) : (
            <>
              <Smartphone className="mr-2 h-4 w-4" />
              Betala {amount.toFixed(2)} kr med Swish
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SwishPayment;
