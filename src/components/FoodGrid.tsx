import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import DishCard from "@/components/shared/DishCard";

interface DishWithChef {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  chef_id: string;
  chef_name: string | null;
}

const FoodGrid = () => {
  const [dishes, setDishes] = useState<DishWithChef[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const { data, error } = await supabase
          .from('dishes')
          .select(`
            id,
            name,
            description,
            price,
            image_url,
            chef_id,
            chefs!inner(business_name)
          `)
          .eq('available', true)
          .limit(8);

        if (error) throw error;

        const formattedDishes = (data || []).map(dish => ({
          id: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          image_url: dish.image_url,
          chef_id: dish.chef_id,
          chef_name: (dish.chefs as any)?.business_name || null
        }));

        setDishes(formattedDishes);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleAddToCart = (dish: DishWithChef) => {
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

  return (
    <section className="py-8 my-4">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Populära rätter nära dig
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm w-full sm:w-auto">
              <option>Sortera efter</option>
              <option>Närmast</option>
              <option>Högst betyg</option>
              <option>Lägst pris</option>
              <option>Senast tillagd</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Laddar rätter...</p>
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
        ) : (
          <div className="text-center mt-8 text-muted-foreground">
            <p>Inga rätter tillgängliga just nu</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FoodGrid;