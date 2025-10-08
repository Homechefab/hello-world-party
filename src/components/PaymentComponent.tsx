import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

/**
 * @lovable
 * @description A component for handling payment processing with a clean and simple interface
 * @example
 * ```tsx
 * <PaymentComponent />
 * ```
 */
const PaymentComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      // Payment processing logic will go here
      console.log("Processing payment...");
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