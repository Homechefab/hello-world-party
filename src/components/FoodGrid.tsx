import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { isChefCurrentlyOpen } from "@/hooks/useChefAvailability";
import DishCard from "@/components/shared/DishCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, MapPin } from "lucide-react";

interface DishWithChef {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  chef_id: string;
  chef_name: string | null;
}

interface ChefProfile {
  id: string;
  business_name: string | null;
  full_name: string | null;
  city: string | null;
  profile_image_url: string | null;
  specialties: string | null;
}

const FoodGrid = () => {
  const [dishes, setDishes] = useState<DishWithChef[]>([]);
  const [chefs, setChefs] = useState<ChefProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: dishData, error: dishError } = await supabase
          .from('dishes')
          .select(`
            id, name, description, price, image_url, chef_id,
            public_chef_profiles!inner(business_name)
          `)
          .eq('available', true)
          .limit(8);

        if (dishError) throw dishError;

        const formattedDishes = (dishData || []).map(dish => ({
          id: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          image_url: dish.image_url,
          chef_id: dish.chef_id,
          chef_name: (dish.public_chef_profiles as { business_name: string } | null)?.business_name || null
        }));

        setDishes(formattedDishes);

        if (formattedDishes.length === 0) {
          const { data: chefData, error: chefError } = await supabase
            .from('public_chef_profiles')
            .select('id, business_name, full_name, city, profile_image_url, specialties')
            .limit(8);

          if (chefError) throw chefError;

          const realChefs = (chefData || []).filter(
            (c) => c.id !== null && !c.business_name?.toLowerCase().includes('review')
          ) as ChefProfile[];

          setChefs(realChefs);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleAddToCart = async (dish: DishWithChef) => {
    // Check if chef is currently open
    const { isOpen, nextOpenInfo } = await isChefCurrentlyOpen(dish.chef_id);
    if (!isOpen) {
      toast({
        title: "Kocken tar inte emot beställningar just nu",
        description: nextOpenInfo
          ? `Öppnar igen: ${nextOpenInfo}`
          : "Kocken har inga öppettider inställda just nu",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: dish.id,
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      chefId: dish.chef_id,
      chefName: dish.chef_name || 'Okänd kock',
      image: dish.image_url || undefined
    });
    toast({
      title: "Tillagd i varukorgen",
      description: `${dish.name} har lagts till`,
    });
  };

  const getSpecialtiesList = (specialties: string | null): string[] => {
    if (!specialties) return [];
    return specialties.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
  };

  return (
    <section className="py-8 my-4">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {dishes.length > 0 ? 'Populära rätter nära dig' : 'Kockar nära dig'}
          </h2>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        ) : dishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                name={dish.name}
                price={dish.price}
                description={dish.description}
                imageUrl={dish.image_url}
                onAdd={() => handleAddToCart(dish)}
              />
            ))}
          </div>
        ) : chefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chefs.map((chef) => (
              <Link key={chef.id} to={`/chef/${chef.id}`}>
                <Card className="group hover:shadow-warm transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full overflow-hidden">
                  <CardContent className="p-0 flex items-stretch h-full">
                    <div className="w-28 min-h-[120px] bg-muted flex-shrink-0 overflow-hidden">
                      {chef.profile_image_url ? (
                        <img
                          src={chef.profile_image_url}
                          alt={chef.business_name || chef.full_name || 'Kock'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <ChefHat className="w-10 h-10 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-center gap-1.5">
                      <h3 className="font-semibold text-foreground text-base leading-tight">
                        {chef.business_name || chef.full_name || 'Hemkock'}
                      </h3>
                      {chef.city && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{chef.city}</span>
                        </div>
                      )}
                      {chef.specialties && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getSpecialtiesList(chef.specialties).map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs font-normal">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center mt-8 text-muted-foreground">
            <p>Inga kockar eller rätter tillgängliga just nu</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FoodGrid;
