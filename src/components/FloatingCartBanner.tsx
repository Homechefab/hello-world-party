import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, CreditCard, Loader2 } from "lucide-react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isChefCurrentlyOpen } from "@/hooks/useChefAvailability";

export const FloatingCartBanner = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const { user, isReady } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems === 0) return null;

  const handleCheckout = async () => {
    if (!isReady) {
      toast({ title: "Laddar konto", description: "Vänta ett ögonblick och försök igen." });
      return;
    }

    if (!user) {
      setShowAuth(true);
      return;
    }

    if (state.items.length === 0) {
      toast({ title: "Tom varukorg", description: "Lägg till varor innan du går till betalning", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const uniqueChefIds = [...new Set(state.items.map(item => item.chefId))];
      for (const chefId of uniqueChefIds) {
        const { isOpen: chefOpen, nextOpenInfo } = await isChefCurrentlyOpen(chefId);
        if (!chefOpen) {
          const chefName = state.items.find(i => i.chefId === chefId)?.chefName || "Kocken";
          toast({
            title: `${chefName} tar inte emot beställningar just nu`,
            description: nextOpenInfo ? `Öppnar igen: ${nextOpenInfo}.` : "Kocken har inga öppettider inställda just nu",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
      }

      const lineItems = state.items.map(item => ({
        dishId: item.dishId,
        name: item.name,
        price: item.price * 100,
        quantity: item.quantity
      }));

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: lineItems,
          totalAmount: state.total,
          deliveryAddress: 'Upphämtning',
          specialInstructions: '',
        }
      });

      if (error) throw new Error(error.message);

      if (data?.url) {
        if (data.sessionId) {
          try { sessionStorage.setItem('last_checkout_session_id', data.sessionId); } catch (e) { /* ignore */ }
        }
        window.location.assign(data.url);
      } else {
        throw new Error('Ingen checkout-URL mottogs');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Betalningsfel",
        description: error instanceof Error ? error.message : "Något gick fel med betalningen",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-primary text-primary-foreground shadow-lg border-t border-primary/20 cursor-pointer active:opacity-90 transition-opacity safe-area-bottom">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-background text-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <span className="font-semibold text-sm">
                  Visa varukorg
                </span>
              </div>
              <span className="font-bold text-lg">
                {Math.round(state.total * 1.06)} kr
              </span>
            </div>
          </div>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-2xl">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Varukorg ({totalItems} varor)</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-3">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-border pb-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">av {item.chefName}</p>
                    <p className="text-sm font-medium text-primary">{item.price} kr</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-7 h-7 text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 pb-2 flex-shrink-0 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delsumma</span>
              <span>{state.total} kr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Serviceavgift (6%)</span>
              <span>{Math.round(state.total * 0.06)} kr</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="font-semibold">Totalt</span>
              <span className="font-bold text-lg">{Math.round(state.total * 1.06)} kr</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={isProcessing || state.items.length === 0 || !isReady}
              variant="food"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Bearbetar...</>
              ) : !isReady ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Laddar konto...</>
              ) : user ? (
                <><CreditCard className="w-4 h-4 mr-2" />Betala {Math.round(state.total * 1.06)} kr</>
              ) : (
                "Logga in för att beställa"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </>
  );
};
