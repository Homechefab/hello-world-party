import { CheckCircle2, Clock, MapPin, ChefHat, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface OrderConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dishName: string;
  quantity: number;
  totalPrice: number;
  sellerName: string;
  deliveryMethod?: 'pickup' | 'delivery';
}

export const OrderConfirmation = ({
  open,
  onOpenChange,
  dishName,
  quantity,
  totalPrice,
  sellerName,
  deliveryMethod = 'pickup',
}: OrderConfirmationProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-center">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Beställning bekräftad!</h2>
            <p className="text-sm text-muted-foreground">
              Din beställning har lagts och kocken har fått en notis.
            </p>
          </div>

          <div className="w-full bg-muted rounded-lg p-4 space-y-3 text-left text-sm">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">{sellerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{dishName} × {quantity}</span>
              <span className="font-semibold">{totalPrice} kr</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              {deliveryMethod === 'pickup' ? (
                <>
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Upphämtning hos kocken</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Hemleverans</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Du får besked när maten är klar</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 pt-2">
            <Button asChild className="w-full">
              <Link to="/my-orders">
                Visa mina beställningar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
              Fortsätt handla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
