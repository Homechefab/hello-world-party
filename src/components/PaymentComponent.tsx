import PaymentSelector from "./PaymentSelector";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface PaymentComponentProps {
  dishId?: string;
  dishTitle: string;
  dishPrice: number;
  quantity: number;
  pickupTime: string;
  pickupAddress: string;
  specialRequests: string;
  priceId?: string;
  orderId?: string;
  onPaymentSuccess?: () => void;
}

/**
 * @lovable
 * @description A component for handling payment processing with multiple payment methods
 * @example
 * ```tsx
 * <PaymentComponent 
 *   dishId="uuid-here"
 *   dishTitle="Köttbullar"
 *   dishPrice={89}
 *   quantity={2}
 *   pickupTime="18:00"
 *   pickupAddress="Hornsgatan 45"
 *   specialRequests=""
 * />
 * ```
 */
const PaymentComponent = ({ 
  dishId,
  dishTitle, 
  dishPrice, 
  quantity, 
  pickupTime, 
  pickupAddress, 
  specialRequests,
  priceId = "",
  orderId,
  onPaymentSuccess
}: PaymentComponentProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Betalning</CardTitle>
        <CardDescription>Välj betalningsmetod och slutför din beställning</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Maträtt:</span>
            <span className="font-medium">{dishTitle}</span>
          </div>
          <div className="flex justify-between">
            <span>Antal:</span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span>Hämtningstid:</span>
            <span className="font-medium">{pickupTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Adress:</span>
            <span className="font-medium">{pickupAddress}</span>
          </div>
          {specialRequests && (
            <div className="flex justify-between">
              <span>Önskemål:</span>
              <span className="font-medium">{specialRequests}</span>
            </div>
          )}
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between text-sm">
            <span>Delsumma:</span>
            <span>{dishPrice * quantity} kr</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Serviceavgift (6%):</span>
            <span>{Math.round(dishPrice * quantity * 0.06)} kr</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between font-semibold text-base">
            <span>Totalt att betala:</span>
            <span>{Math.round(dishPrice * quantity * 1.06)} kr</span>
          </div>
        </div>
        
        <PaymentSelector
          priceId={priceId}
          dishId={dishId}
          dishName={dishTitle}
          price={dishPrice}
          quantity={quantity}
          description={`Hämtning: ${pickupTime} - ${pickupAddress}`}
          orderId={orderId}
          onPaymentSuccess={onPaymentSuccess}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentComponent;
