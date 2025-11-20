import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { StripeCheckout } from "./StripeCheckout";
import { useToast } from "@/hooks/use-toast";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish: {
    title: string;
    description: string;
    price: number;
    image: string;
    seller: string;
  };
  stripePriceId: string;
}

const OrderDialog = ({ open, onOpenChange, dish, stripePriceId }: OrderDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const { toast } = useToast();

  const handleProceedToPayment = () => {
    if (!deliveryAddress.trim()) {
      toast({ title: "Vänligen ange en leveransadress", variant: "destructive" });
      return;
    }
    setShowCheckout(true);
  };

  const totalPrice = dish.price * quantity;

  if (showCheckout) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Betalning</DialogTitle>
            <DialogDescription>
              Slutför din beställning med säker betalning via Stripe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Leveransadress:</strong> {deliveryAddress}</p>
              {specialInstructions && (
                <p><strong>Specialinstruktioner:</strong> {specialInstructions}</p>
              )}
            </div>
            <StripeCheckout
              priceId={stripePriceId}
              dishName={dish.title}
              price={dish.price}
              quantity={quantity}
              description={`Beställning från ${dish.seller}`}
            />
            <Button 
              variant="outline" 
              onClick={() => setShowCheckout(false)}
              className="w-full"
            >
              Tillbaka till beställning
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Beställ {dish.title}</DialogTitle>
          <DialogDescription>
            Från {dish.seller}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Dish Image */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img 
              src={dish.image} 
              alt={dish.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dish Details */}
          <div>
            <h3 className="font-semibold text-lg mb-2">{dish.title}</h3>
            <p className="text-muted-foreground text-sm">{dish.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label>Antal portioner</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Leveransadress *</Label>
            <Input
              id="address"
              placeholder="T.ex. Storgatan 1, 123 45 Stockholm"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Specialinstruktioner (valfritt)</Label>
            <Textarea
              id="instructions"
              placeholder="T.ex. allergier, särskilda önskemål..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>

          {/* Price Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pris per portion:</span>
              <span>{dish.price} kr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Antal:</span>
              <span>{quantity}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Totalt:</span>
              <span>{totalPrice} kr</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              onClick={handleProceedToPayment}
              className="flex-1"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Gå till betalning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
