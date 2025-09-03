import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/useAuth";

export const Cart = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    // Proceed to checkout
    console.log("Proceeding to checkout with items:", state.items);
  };

  return (
    <>
      <Sheet>
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
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Varukorg</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {state.items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Din varukorg är tom</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 py-6">
                  <div className="space-y-4">
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
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Totalt:</span>
                    <span className="text-lg font-bold">{state.total} kr</span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                    variant="food"
                  >
                    {user ? "Slutför beställning" : "Logga in för att beställa"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </>
  );
};