import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, ShoppingBag, MapPin, Truck, AlertCircle, Loader2 } from "lucide-react";
import PaymentSelector from "./PaymentSelector";
import { useToast } from "@/hooks/use-toast";
import { useChefAvailability } from "@/hooks/useChefAvailability";

type DeliveryMethod = "pickup" | "delivery";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish: {
    id?: string;
    title: string;
    description: string;
    price: number;
    image: string;
    seller: string;
    chefId?: string;
  };
  stripePriceId: string;
  offersDelivery?: boolean;
}

const OrderDialog = ({ open, onOpenChange, dish, stripePriceId, offersDelivery = false }: OrderDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { isOpen: chefIsOpen, loading: chefLoading, nextOpenInfo } = useChefAvailability(dish.chefId);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const { toast } = useToast();

  const handleProceedToPayment = () => {
    if (deliveryMethod === "delivery" && !deliveryAddress.trim()) {
      toast({ title: "Vänligen ange en leveransadress", variant: "destructive" });
      return;
    }
    setShowCheckout(true);
  };

  const totalPrice = dish.price * quantity;
  

  if (showCheckout) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Betalning</DialogTitle>
            <DialogDescription>
              Välj betalningsmetod och slutför din beställning
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Leveranssätt:</strong> {deliveryMethod === "delivery" ? "Hemleverans" : "Upphämtning"}</p>
              {deliveryAddress && (
                <p><strong>{deliveryMethod === "delivery" ? "Leveransadress" : "Adress"}:</strong> {deliveryAddress}</p>
              )}
              {specialInstructions && (
                <p><strong>Specialinstruktioner:</strong> {specialInstructions}</p>
              )}
              <p><strong>Totalt:</strong> {totalPrice} kr</p>
            </div>
            <PaymentSelector
              priceId={stripePriceId}
              dishId={dish.id}
              dishName={dish.title}
              price={dish.price}
              quantity={quantity}
              description={`Beställning från ${dish.seller}`}
              onPaymentSuccess={() => onOpenChange(false)}
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

          {/* Delivery Method Selector */}
          <div className="space-y-3">
            <Label>Leveranssätt</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod("pickup")}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                  deliveryMethod === "pickup"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <MapPin className={`w-5 h-5 flex-shrink-0 ${deliveryMethod === "pickup" ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm">Upphämtning</p>
                  <p className="text-xs text-muted-foreground">Hämta hos kocken</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => offersDelivery && setDeliveryMethod("delivery")}
                disabled={!offersDelivery}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                  deliveryMethod === "delivery"
                    ? "border-primary bg-primary/5"
                    : offersDelivery
                      ? "border-border hover:border-muted-foreground/30"
                      : "border-border opacity-50 cursor-not-allowed"
                }`}
              >
                <Truck className={`w-5 h-5 flex-shrink-0 ${deliveryMethod === "delivery" ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm">Hemleverans</p>
                  <p className="text-xs text-muted-foreground">
                    {offersDelivery ? "Leverans till din dörr" : "Ej tillgängligt"}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              {deliveryMethod === "delivery" ? "Leveransadress *" : "Leveransadress (valfritt)"}
            </Label>
            <Input
              id="address"
              placeholder="T.ex. Storgatan 1, 123 45 Stockholm"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required={deliveryMethod === "delivery"}
            />
            {deliveryMethod === "pickup" && (
              <p className="text-xs text-muted-foreground">
                Du får upphämtningsinstruktioner från kocken när maten är klar
              </p>
            )}
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
            <div className="flex justify-between text-sm">
              <span>Leveranssätt:</span>
              <span>{deliveryMethod === "delivery" ? "Hemleverans" : "Upphämtning"}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Totalt:</span>
              <span>{totalPrice} kr</span>
            </div>
          </div>

          {/* Closed Banner */}
          {!chefLoading && !chefIsOpen && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive text-sm">Kocken tar inte emot beställningar just nu</p>
                {nextOpenInfo && (
                  <p className="text-xs text-muted-foreground mt-0.5">Öppnar igen: {nextOpenInfo}</p>
                )}
              </div>
            </div>
          )}

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
              disabled={chefLoading || !chefIsOpen}
            >
              {chefLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ShoppingBag className="w-4 h-4 mr-2" />
              )}
              Gå till betalning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
