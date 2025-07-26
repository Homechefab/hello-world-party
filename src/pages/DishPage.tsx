import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Clock, MapPin, User, Minus, Plus, ArrowLeft } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

// Mock data för en specifik rätt
const dishData = {
  id: "1",
  title: "Mormors köttbullar",
  description: "Traditionella svenska köttbullar med gräddsås, lingonsylt och pressgurka. Receptet har gått i arv i tre generationer och tillagas med kärlek och omsorg.",
  price: 89,
  image: "/assets/meatballs.jpg",
  rating: 4.8,
  reviews: 127,
  cookName: "Anna Lindström",
  cookLocation: "Södermalm, Stockholm",
  cookAddress: "Hornsgatan 45, 118 49 Stockholm",
  prepTime: "30 min",
  tags: ["Traditionellt", "Glutenfritt"],
  available: 5,
  ingredients: ["Köttfärs (nöt & fläsk)", "Grädde", "Ägg", "Ströbröd", "Lök", "Lingonsylt", "Pressgurka"],
  allergens: ["Gluten", "Mjölk", "Ägg"],
  pickupTimes: ["17:30", "18:00", "18:30", "19:00", "19:30"],
  cookImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  cookRating: 4.9,
  cookDescription: "Passionerad hemkock med 15 års erfarenhet. Specialiserad på traditionell svensk husmanskost."
};

const DishPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= dishData.available) {
      setQuantity(newQuantity);
    }
  };

  const handleOrder = () => {
    if (!selectedTime) {
      toast({
        title: "Välj hämtningstid",
        description: "Du måste välja en tid för att hämta din beställning.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Beställning genomförd!",
      description: `Du har beställt ${quantity}x ${dishData.title}. Hämta kl ${selectedTime} på ${dishData.cookAddress}.`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till startsidan
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vänster kolumn - Bild och beskrivning */}
          <div>
            <div className="relative rounded-xl overflow-hidden mb-6">
              <img 
                src={dishData.image} 
                alt={dishData.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{dishData.rating}</span>
                  <span className="text-sm text-muted-foreground">({dishData.reviews})</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{dishData.title}</h1>
                <p className="text-lg text-muted-foreground">{dishData.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {dishData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Ingredienser</h3>
                <div className="grid grid-cols-2 gap-2">
                  {dishData.ingredients.map((ingredient) => (
                    <div key={ingredient} className="text-sm text-muted-foreground">
                      • {ingredient}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Allergener</h3>
                <div className="flex flex-wrap gap-2">
                  {dishData.allergens.map((allergen) => (
                    <Badge key={allergen} variant="outline" className="text-orange-600 border-orange-600">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Höger kolumn - Beställning och kock-info */}
          <div className="space-y-6">
            {/* Kock-information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img 
                    src={dishData.cookImage} 
                    alt={dishData.cookName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{dishData.cookName}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{dishData.cookRating} betyg</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{dishData.cookDescription}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{dishData.cookLocation}</span>
                </div>
              </CardContent>
            </Card>

            {/* Beställningsformulär */}
            <Card>
              <CardHeader>
                <CardTitle>Gör din beställning</CardTitle>
                <CardDescription>
                  Välj antal portioner och hämtningstid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{dishData.price} kr</span>
                  <Badge variant="outline">{dishData.available} kvar</Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Klar om {dishData.prepTime}</span>
                </div>

                <div>
                  <Label htmlFor="quantity">Antal portioner</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= dishData.available}
                    >
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
                      {dishData.pickupTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
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
                    <span className="text-xl font-bold">{dishData.price * quantity} kr</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="food" 
                    size="lg"
                    onClick={handleOrder}
                  >
                    Lägg beställning
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Hämtadress: {dishData.cookAddress}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishPage;