import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import { StripeCheckout } from "./StripeCheckout";
import SwishPayment from "./SwishPayment";
import { KlarnaPayment } from "./KlarnaPayment";

type PaymentMethod = "stripe" | "swish" | "klarna";

interface PaymentSelectorProps {
  priceId: string;
  dishName: string;
  price: number;
  quantity: number;
  description?: string;
  orderId?: string;
  onPaymentSuccess?: () => void;
}

const PaymentSelector = ({
  priceId,
  dishName,
  price,
  quantity,
  description,
  orderId,
  onPaymentSuccess,
}: PaymentSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("stripe");
  const totalAmount = price * quantity;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-semibold">Välj betalningsmetod</Label>
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <Card
            className={`cursor-pointer transition-all ${
              selectedMethod === "stripe"
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedMethod("stripe")}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <RadioGroupItem value="stripe" id="stripe" />
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="stripe" className="cursor-pointer font-medium">
                  Kort
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedMethod === "swish"
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedMethod("swish")}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <RadioGroupItem value="swish" id="swish" />
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="swish" className="cursor-pointer font-medium">
                  Swish
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedMethod === "klarna"
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedMethod("klarna")}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <RadioGroupItem value="klarna" id="klarna" />
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="klarna" className="cursor-pointer font-medium">
                  Klarna
                </Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>

      <div className="pt-4 border-t">
        {selectedMethod === "stripe" && (
          <StripeCheckout
            priceId={priceId}
            dishName={dishName}
            price={price}
            quantity={quantity}
            description={description}
          />
        )}

        {selectedMethod === "swish" && (
          <SwishPayment
            amount={totalAmount}
            orderId={orderId}
            message={`Beställning: ${dishName}`}
            onSuccess={onPaymentSuccess}
          />
        )}

        {selectedMethod === "klarna" && (
          <KlarnaPayment
            dishTitle={dishName}
            dishPrice={price}
            quantity={quantity}
            onPaymentSuccess={onPaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentSelector;
