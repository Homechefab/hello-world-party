import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface PaymentComponentProps {
  dishTitle: string;
  dishPrice: number;
  quantity: number;
  pickupTime: string;
  pickupAddress: string;
  specialRequests: string;
}

/**
 * @lovable
 * @description A component for handling payment processing with a clean and simple interface
 * @example
 * ```tsx
 * <PaymentComponent 
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
  dishTitle, 
  dishPrice, 
  quantity, 
  pickupTime, 
  pickupAddress, 
  specialRequests 
}: PaymentComponentProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      // Payment processing logic will go here
      console.log("Processing payment...", {
        dishTitle,
        dishPrice,
        quantity,
        pickupTime,
        pickupAddress,
        specialRequests,
        totalAmount: dishPrice * quantity
      });
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>Securely process your payment</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handlePayment}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Processing..." : "Pay Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentComponent;