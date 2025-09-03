import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, MapPin, ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Chef {
  id: string;
  business_name: string;
  user_id: string;
  full_name: string;
  address: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  allergens: string[];
  ingredients: string[];
  preparation_time: number;
  available: boolean;
}

const ChefProfile = () => {
  const { chefId } = useParams<{ chefId: string }>();
  const [chef, setChef] = useState<Chef | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChefData = async () => {
      if (!chefId) return;
      
      // Mock data for demonstration
      const mockChefData = {
        'chef-1': {
          id: 'chef-1',
          business_name: 'Annas Hembageri',
          user_id: 'user-1',
          full_name: 'Anna Lindström',
          address: 'Södermalm, Stockholm'
        },
        'chef-2': {
          id: 'chef-2', 
          business_name: 'Marco\'s Italienska Kök',
          user_id: 'user-2',
          full_name: 'Marco Rossi',
          address: 'Gamla Stan, Stockholm'  
        },
        'chef-3': {
          id: 'chef-3',
          business_name: 'Lisas Vegetariska Delikatesser', 
          user_id: 'user-3',
          full_name: 'Lisa Karlsson',
          address: 'Östermalm, Stockholm'
        }
      };

      const mockDishesData = {
        'chef-1': [
          {
            id: 'dish-1',
            name: 'Hemgjorda köttbullar',
            description: 'Klassiska svenska köttbullar med gräddsås och lingonsylt. Gjorda på kött från lokala gårdar.',
            price: 85,
            category: 'Svenskt',
            allergens: ['Gluten', 'Mjölk'],
            ingredients: ['Nötkött', 'Grädde', 'Lingon', 'Potatis'],
            preparation_time: 30,
            available: true,
            image_url: '/src/assets/meatballs.jpg'
          },
          {
            id: 'dish-2', 
            name: 'Hemgjord äppelpaj',
            description: 'Klassisk äppelpaj med kanel och vaniljsås. Gjord på äpplen från egna trädgården.',
            price: 75,
            category: 'Dessert',
            allergens: ['Gluten', 'Mjölk', 'Ägg'],
            ingredients: ['Äpplen', 'Kanel', 'Smör', 'Mjöl'],
            preparation_time: 15,
            available: true,
            image_url: '/src/assets/apple-pie.jpg'
          }
        ],
        'chef-2': [
          {
            id: 'dish-3',
            name: 'Krämig carbonara', 
            description: 'Autentisk italiensk pasta carbonara med ägg, parmesan och guanciale. Tillagad enligt familjerecept.',
            price: 95,
            category: 'Italienskt',
            allergens: ['Gluten', 'Mjölk', 'Ägg'],
            ingredients: ['Pasta', 'Ägg', 'Parmesan', 'Guanciale'],
            preparation_time: 25,
            available: true,
            image_url: '/src/assets/pasta.jpg'
          },
          {
            id: 'dish-4',
            name: 'Margherita Pizza',
            description: 'Klassisk italiensk pizza med tomatsås, mozzarella och basilika. Bakad i stenugn.',
            price: 120,
            category: 'Italienskt', 
            allergens: ['Gluten', 'Mjölk'],
            ingredients: ['Pizzadeg', 'Tomater', 'Mozzarella', 'Basilika'],
            preparation_time: 20,
            available: true,
            image_url: '/src/assets/pasta.jpg'
          }
        ],
        'chef-3': [
          {
            id: 'dish-5',
            name: 'Grönsaksoppa',
            description: 'Näringsrik soppa gjord på säsongens färska grönsaker. Serveras med hemgjort bröd.',
            price: 65,
            category: 'Vegetariskt',
            allergens: ['Gluten'],
            ingredients: ['Morötter', 'Selleri', 'Lök', 'Vegetabilisk buljong'], 
            preparation_time: 20,
            available: true,
            image_url: '/src/assets/soup.jpg'
          },
          {
            id: 'dish-6',
            name: 'Falafel med hummus',
            description: 'Krispiga falafels med cremig hummus och färska grönsaker. Helt vegetariskt.',
            price: 78,
            category: 'Vegetariskt',
            allergens: ['Sesam'],
            ingredients: ['Kikärtor', 'Tahini', 'Gurka', 'Tomat'],
            preparation_time: 15, 
            available: true,
            image_url: '/src/assets/soup.jpg'
          }
        ]
      };

      const chefData = mockChefData[chefId as keyof typeof mockChefData];
      const dishesData = mockDishesData[chefId as keyof typeof mockDishesData] || [];

      if (chefData) {
        setChef(chefData);
        setDishes(dishesData);
      }
      
      setLoading(false);
    };

    fetchChefData();
  }, [chefId]);

  const handleAddToCart = (dish: Dish) => {
    if (!chef) return;

    addItem({
      id: `${dish.id}-${Date.now()}`,
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      chefId: chef.id,
      chefName: chef.business_name || chef.full_name,
      image: dish.image_url
    });

    toast({
      title: "Tillagd i varukorg",
      description: `${dish.name} har lagts till i din varukorg.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Laddar kockens profil...</p>
        </div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Kocken hittades inte</h1>
          <p className="text-muted-foreground">Denna kock finns inte eller är inte godkänd än.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Chef Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ChefHat className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {chef.business_name || chef.full_name}
            </h1>
            {chef.address && (
              <div className="flex items-center justify-center text-white/90 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{chef.address}</span>
              </div>
            )}
            <div className="flex items-center justify-center gap-4 text-white/90">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span>4.8 (42 recensioner)</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-1" />
                <span>30-45 min tillagning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dishes Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Maträtter från {chef.business_name || chef.full_name}</h2>
          
          {dishes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Denna kock har inga tillgängliga rätter just nu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <Card key={dish.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {dish.image_url ? (
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-secondary rounded-t-lg flex items-center justify-center">
                        <ChefHat className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    {dish.category && (
                      <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                        {dish.category}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{dish.name}</h3>
                      <span className="font-bold text-primary text-xl">{dish.price} kr</span>
                    </div>
                    
                    {dish.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      {dish.preparation_time && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{dish.preparation_time} min</span>
                        </div>
                      )}
                    </div>
                    
                    {dish.allergens && dish.allergens.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-1">Allergener:</p>
                        <div className="flex flex-wrap gap-1">
                          {dish.allergens.slice(0, 3).map((allergen) => (
                            <Badge key={allergen} variant="outline" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="food" 
                      className="w-full"
                      onClick={() => handleAddToCart(dish)}
                    >
                      Lägg till i varukorg
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChefProfile;