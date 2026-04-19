import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, Minus, Plus, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import ReviewSection from "@/components/ReviewSection";
import PaymentSelector from "@/components/PaymentSelector";
import { OrderConfirmation } from "@/components/order/OrderConfirmation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import ShareButtons from "@/components/ShareButtons";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useChefAvailability } from "@/hooks/useChefAvailability";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DishRecord {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  preparation_time: number | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  category: string | null;
  available: boolean | null;
  chef_id: string;
}

interface ChefRecord {
  id: string;
  business_name: string | null;
  full_name: string | null;
  bio: string | null;
  city: string | null;
  address: string | null;
  postal_code: string | null;
  profile_image_url: string | null;
}

const DishPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [dish, setDish] = useState<DishRecord | null>(null);
  const [chef, setChef] = useState<ChefRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const { isOpen: chefIsOpen, nextOpenInfo } = useChefAvailability(dish?.chef_id);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data: dishData, error: dishErr } = await supabase
        .from("dishes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (dishErr || !dishData) {
        setDish(null);
        setLoading(false);
        return;
      }
      setDish(dishData as DishRecord);

      const { data: chefData } = await supabase
        .from("public_chef_profiles")
        .select("id, business_name, full_name, bio, city, profile_image_url")
        .eq("id", dishData.chef_id)
        .maybeSingle();

      if (chefData) {
        setChef({ ...(chefData as ChefRecord), address: null, postal_code: null });
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const pickupTimes = ["17:30", "18:00", "18:30", "19:00", "19:30"];
  const cookLocation = chef?.city ?? "";
  const cookName = chef?.business_name || chef?.full_name || "Hemkock";

  const handleAddToCart = () => {
    if (!dish) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${dish.id}-${Date.now()}-${i}`,
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        chefId: dish.chef_id,
        chefName: cookName,
        image: dish.image_url || "",
      });
    }
    toast({
      title: "Tillagd i varukorgen",
      description: `${quantity}x ${dish.name} har lagts till i din varukorg`,
    });
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const handleOrder = () => {
    if (!chefIsOpen) {
      toast({
        title: "Kocken är stängd",
        description: nextOpenInfo ? `Öppnar igen: ${nextOpenInfo}` : "Beställningar är inte möjliga just nu.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedTime) {
      toast({
        title: "Välj hämtningstid",
        description: "Du måste välja en tid för att hämta din beställning.",
        variant: "destructive",
      });
      return;
    }
    setShowPayment(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold">Rätten kunde inte hittas</h1>
          <p className="text-muted-foreground">Den här rätten finns inte längre eller är inte tillgänglig.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Tillbaka till startsidan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={dish.name}
        description={dish.description || dish.name}
        keywords={`${dish.name}, hemlagad mat`}
        image={dish.image_url || ""}
        productData={{
          name: dish.name,
          description: dish.description || "",
          price: dish.price,
          currency: "SEK",
          image: dish.image_url || "",
          availability: dish.available ? "InStock" : "OutOfStock",
        }}
      />

      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till startsidan
            </Link>
            <ShareButtons
              title={dish.name}
              description={`${dish.description ?? ""} - ${dish.price} kr`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative rounded-xl overflow-hidden mb-6 bg-muted">
                <img
                  src={dish.image_url || "/placeholder.svg"}
                  alt={dish.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{dish.name}</h1>
                  {dish.description && (
                    <p className="text-lg text-muted-foreground">{dish.description}</p>
                  )}
                </div>

                {dish.category && (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{dish.category}</Badge>
                  </div>
                )}

                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Ingredienser</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {dish.ingredients.map((ingredient) => (
                        <div key={ingredient} className="text-sm text-muted-foreground">
                          • {ingredient}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dish.allergens && dish.allergens.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Allergener</h3>
                    <div className="flex flex-wrap gap-2">
                      {dish.allergens.map((allergen) => (
                        <Badge key={allergen} variant="outline" className="text-orange-600 border-orange-600">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {chef && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {chef.profile_image_url && (
                        <img
                          src={chef.profile_image_url}
                          alt={cookName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">
                          <Link to={`/chef/${chef.id}`} className="hover:underline">
                            {cookName}
                          </Link>
                        </CardTitle>
                        {cookLocation && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{cookLocation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {chef.bio && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{chef.bio}</p>
                    </CardContent>
                  )}
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Gör din beställning</CardTitle>
                  <CardDescription>Välj antal portioner och hämtningstid</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{dish.price} kr</span>
                  </div>

                  {dish.preparation_time && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Klar om {dish.preparation_time} min</span>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="quantity">Antal portioner</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pickup-time">Hämtningstid</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Välj tid" />
                      </SelectTrigger>
                      <SelectContent>
                        {pickupTimes.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="special-requests">Särskilda önskemål (valfritt)</Label>
                    <Textarea
                      id="special-requests"
                      placeholder="T.ex. extra kryddig, utan lök..."
                      className="mt-2"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span>Totalt ({quantity} portioner)</span>
                      <span className="text-xl font-bold">{dish.price * quantity} kr</span>
                    </div>

                    <Button className="w-full" variant="outline" size="lg" onClick={handleAddToCart}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Lägg i varukorg
                    </Button>

                    <Dialog open={showPayment} onOpenChange={setShowPayment}>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="food" size="lg" onClick={handleOrder}>
                          Lägg beställning
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Välj betalningssätt</DialogTitle>
                          <DialogDescription>
                            Slutför din beställning med ditt föredragna betalningssätt
                          </DialogDescription>
                        </DialogHeader>

                        <PaymentSelector
                          priceId=""
                          dishId={dish.id}
                          dishName={dish.name}
                          price={dish.price}
                          quantity={quantity}
                          description={`Hämtning: ${selectedTime}${cookLocation ? ` - ${cookLocation}` : ""}`}
                          onPaymentSuccess={() => {
                            setShowPayment(false);
                            setShowOrderConfirmation(true);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <ReviewSection
              dishId={dish.id}
              averageRating={0}
              totalReviews={0}
              reviews={[]}
            />
          </div>
        </div>
      </div>

      <OrderConfirmation
        open={showOrderConfirmation}
        onOpenChange={setShowOrderConfirmation}
        dishName={dish.name}
        quantity={quantity}
        totalPrice={dish.price * quantity}
        sellerName={cookName}
        deliveryMethod="pickup"
      />
    </>
  );
};

export default DishPage;
