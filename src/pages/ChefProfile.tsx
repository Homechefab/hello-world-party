import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChefHeader } from "@/components/chef/ChefHeader";
import { DishCard } from "@/components/shared/DishCard";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ChefProfile() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: chef, isLoading: isChefLoading } = useQuery({
    queryKey: ["chef", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chefs")
        .select("*, dishes(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = (dish: any) => {
    addItem({
      id: `${dish.id}-${Date.now()}`,
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      chefId: chef?.id || "",
      chefName: chef?.name || "Kocken",
      image: dish.image_url || undefined,
    });
    
    toast({
      title: "Tillagd i varukorgen",
      description: `${dish.name} har lagts till i din beställning.`,
    });
  };

  if (isChefLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chef) {
    return <div className="p-8 text-center">Kocken hittades inte.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <ChefHeader chef={chef} />
      
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Meny</h2>
        <div className="grid gap-4">
          {chef.dishes?.map((dish: any) => (
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
      </div>
    </div>
  );
}
