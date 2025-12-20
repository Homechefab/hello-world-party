import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Dish {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  cookName: string;
  cookLocation: string;
  prepTime: string;
  tags: string[];
  available: number;
}

const DishDetailCard = ({ dish }: { dish: Dish }) => {
  return (
    <Card className="group overflow-hidden hover:shadow-warm transition-all duration-300 hover:scale-105 border-border">
      <div className="relative overflow-hidden">
        <img 
          src={dish.image || '/placeholder.svg'} 
          alt={dish.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{dish.rating}</span>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {dish.available} kvar
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{dish.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {dish.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <User className="w-4 h-4" />
          <span>{dish.cookName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span>{dish.cookLocation}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>Klar om {dish.prepTime}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {dish.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {dish.price} kr
          </div>
          <Link to={`/dish/${dish.id}`}>
            <Button variant="food" size="sm">
              Beställ
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const DishDetails = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

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
            category,
            preparation_time,
            available,
            chefs (
              business_name,
              full_name,
              city
            )
          `)
          .eq('available', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        const transformedDishes: Dish[] = (data || []).map(dish => ({
          id: dish.id,
          title: dish.name,
          description: dish.description || '',
          price: dish.price,
          image: dish.image_url || '/placeholder.svg',
          rating: 4.5, // Default rating until reviews are aggregated
          cookName: dish.chefs?.business_name || dish.chefs?.full_name || 'Okänd kock',
          cookLocation: dish.chefs?.city || 'Stockholm',
          prepTime: `${dish.preparation_time || 30} min`,
          tags: dish.category ? [dish.category] : [],
          available: dish.available ? 1 : 0
        }));

        setDishes(transformedDishes);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Populära rätter just nu
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upptäck vad våra hemmakockar lagar idag. Alla rätter är färska och tillagade med kärlek.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-secondary rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-secondary rounded mb-2"></div>
                  <div className="h-4 bg-secondary rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (dishes.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Populära rätter just nu
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upptäck vad våra hemmakockar lagar idag. Alla rätter är färska och tillagade med kärlek.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Inga rätter tillgängliga just nu. Kom tillbaka snart!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Populära rätter just nu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upptäck vad våra hemmakockar lagar idag. Alla rätter är färska och tillagade med kärlek.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <DishDetailCard key={dish.id} dish={dish} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            Se alla rätter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DishDetails;
