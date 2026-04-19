import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Plus, Minus, Trash2, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { PhonePromptDialog } from "@/components/PhonePromptDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isChefCurrentlyOpen } from "@/hooks/useChefAvailability";

export const Cart = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const { user, isReady } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [existingPhone, setExistingPhone] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const proceedToCheckout = async (customerPhone: string) => {
    setIsProcessing(true);

    try {
      const uniqueChefIds = [...new Set(state.items.map(item => item.chefId))];
      for (const chefId of uniqueChefIds) {
        const { isOpen, nextOpenInfo } = await isChefCurrentlyOpen(chefId);
        if (!isOpen) {
          const chefName = state.items.find(i => i.chefId === chefId)?.chefName || "Kocken";
          toast({
            title: `${chefName} tar inte emot beställningar just nu`,
            description: nextOpenInfo
              ? `Öppnar igen: ${nextOpenInfo}. Ta bort dessa varor och försök igen under öppettiderna.`
              : "Kocken har inga öppettider inställda just nu",
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
          customerPhone,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        if (data.sessionId) {
          try {
            sessionStorage.setItem('last_checkout_session_id', data.sessionId);
          } catch (e) {
            console.error('Failed to save session ID:', e);
          }
        }

        const isMobileViewport = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

        if (isMobileViewport) {
          window.location.assign(data.url);
          return;
        }

        const stripeWindow = window.open(data.url, '_blank', 'noopener,noreferrer');

        if (!stripeWindow) {
          window.location.assign(data.url);
          return;
        }

        toast({
          title: "Omdirigerar till betalning",
          description: "Stripe Checkout öppnas i en ny flik",
        });
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

  const handleCheckout = async () => {
    if (!isReady) {
      toast({
        title: "Laddar konto",
        description: "Vänta ett ögonblick och försök igen.",
      });
      return;
    }

    if (!user) {
      setShowAuth(true);
      return;
    }

    if (state.items.length === 0) {
      toast({
        title: "Tom varukorg",
        description: "Lägg till varor innan du går till betalning",
        variant: "destructive"
      });
      return;
    }

    // Check if customer has phone on profile
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', user.id)
        .maybeSingle();

      const phone = (profile?.phone || "").trim();
      if (!phone) {
        setExistingPhone("");
        setShowPhonePrompt(true);
        return;
      }
      await proceedToCheckout(phone);
    } catch (err) {
      console.error('Error fetching profile phone:', err);
      setExistingPhone("");
      setShowPhonePrompt(true);
    }
  };

  const handlePhoneConfirmed = async (phone: string) => {
    setShowPhonePrompt(false);
    if (!user) return;

    // Persist on profile so we don't have to ask again
    try {
      await supabase
        .from('profiles')
        .update({ phone })
        .eq('id', user.id);
    } catch (err) {
      console.error('Failed to save phone on profile:', err);
    }

    await proceedToCheckout(phone || "");
  };


  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <ShoppingBag className="w-4 h-4" />
            {state.items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {state.items.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Varukorg</SheetTitle>
          </SheetHeader>

          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {state.items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Din varukorg är tom</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-4 px-1">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">av {item.chefName}</p>
                          <p className="text-sm font-medium">{item.price} kr</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 pb-2 flex-shrink-0 bg-background">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Delsumma:</span>
                      <span>{state.total} kr</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Serviceavgift (6%):</span>
                      <span>{Math.round(state.total * 0.06)} kr</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Totalt att betala:</span>
                      <span className="text-lg font-bold">{Math.round(state.total * 1.06)} kr</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isProcessing || state.items.length === 0 || !isReady}
                    variant="food"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Bearbetar...
                      </>
                    ) : !isReady ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Laddar konto...
                      </>
                    ) : user ? (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Betala {Math.round(state.total * 1.06)} kr
                      </>
                    ) : (
                      "Logga in för att beställa"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AuthDialog
        open={showAuth}
        onOpenChange={setShowAuth}
        onForgotPasswordNavigate={() => {
          setShowAuth(false);
          setIsCartOpen(false);
        }}
      />

      <PhonePromptDialog
        open={showPhonePrompt}
        onOpenChange={setShowPhonePrompt}
        defaultValue={existingPhone}
        onConfirm={handlePhoneConfirmed}
      />
    </>
  );
};
