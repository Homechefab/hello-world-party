import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const popularChefs = [
  { 
    name: "Anna Carlsson", 
    specialty: "Husmanskost", 
    rating: 4.9, 
    reviews: 127,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face",
    distance: "0.8 km"
  },
  { 
    name: "Erik Lindqvist", 
    specialty: "Pasta & Risotto", 
    rating: 4.8, 
    reviews: 89,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face",
    distance: "1.2 km"
  },
  { 
    name: "Maria Andersson", 
    specialty: "Vegetariskt", 
    rating: 4.9, 
    reviews: 156,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=face",
    distance: "0.5 km"
  },
  { 
    name: "Johan Svensson", 
    specialty: "Internationellt", 
    rating: 4.7, 
    reviews: 94,
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=400&fit=crop&crop=face",
    distance: "1.5 km"
  },
  { 
    name: "Lisa Bergström", 
    specialty: "Bakverk", 
    rating: 4.9, 
    reviews: 203,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&crop=face",
    distance: "0.9 km"
  },
  { 
    name: "Peter Johansson", 
    specialty: "Soppor", 
    rating: 4.6, 
    reviews: 67,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face",
    distance: "1.8 km"
  },
  { 
    name: "Sara Nilsson", 
    specialty: "Desserter", 
    rating: 4.8, 
    reviews: 142,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face",
    distance: "0.7 km"
  },
  { 
    name: "Daniel Olsson", 
    specialty: "Frukost", 
    rating: 4.7, 
    reviews: 78,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=face",
    distance: "1.1 km"
  },
];

const PopularChefs = () => {
  return (
    <section id="popular-chefs" className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Populära kockar i närområdet
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {popularChefs.map((chef) => (
            <Button
              key={chef.name}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-3 bg-white hover:bg-gradient-primary hover:text-white hover:border-primary transition-all duration-300 hover:shadow-card hover:scale-105 group"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden group-hover:scale-110 transition-transform">
                <img 
                  src={chef.image} 
                  alt={chef.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xs font-medium leading-tight mb-1">
                  {chef.name}
                </h3>
                <p className="text-xs text-muted-foreground group-hover:text-white/80 mb-1">
                  {chef.specialty}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{chef.rating}</span>
                  <span className="text-muted-foreground group-hover:text-white/80">
                    ({chef.reviews})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-white/80 mt-1">
                  {chef.distance}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularChefs;