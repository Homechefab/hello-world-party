import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

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

const mockDishes: Dish[] = [
  {
    id: "1",
    title: "Mormors köttbullar",
    description: "Traditionella svenska köttbullar med gräddsås, lingonsylt och pressgurka. Receptet har gått i arv i tre generationer.",
    price: 89,
    image: "/assets/meatballs.jpg",
    rating: 4.8,
    cookName: "Anna Lindström",
    cookLocation: "Södermalm, Stockholm",
    prepTime: "30 min",
    tags: ["Vegetariskt", "Glutenfritt"],
    available: 5
  },
  {
    id: "2", 
    title: "Hemlagad carbonara",
    description: "Klassisk italiensk carbonara med äkta guanciale, pecorino romano och färska ägg. Enkel men perfekt.",
    price: 95,
    image: "/assets/pasta.jpg",
    rating: 4.9,
    cookName: "Marco Rossi",
    cookLocation: "Östermalm, Stockholm",
    prepTime: "20 min",
    tags: ["Italienskt"],
    available: 3
  },
  {
    id: "3",
    title: "Krämig tomatsoppa",
    description: "Hemkokt tomatsoppa med färska basilika och grädde. Serveras med hemgjort surdegsbröd.",
    price: 65,
    image: "/assets/soup.jpg", 
    rating: 4.7,
    cookName: "Lisa Andersson",
    cookLocation: "Vasastan, Stockholm",
    prepTime: "15 min",
    tags: ["Vegetariskt", "Soppa"],
    available: 8
  },
  {
    id: "4",
    title: "Äppelpaj farmors stil",
    description: "Traditionell äppelpaj med kanel och smördeg. Serveras varm med vaniljsås eller glass.",
    price: 75,
    image: "/assets/apple-pie.jpg",
    rating: 4.6,
    cookName: "Margareta Holm", 
    cookLocation: "Gamla Stan, Stockholm",
    prepTime: "10 min",
    tags: ["Dessert", "Vegetariskt"],
    available: 6
  }
];

const DishDetailCard = ({ dish }: { dish: Dish }) => {
  return (
    <Card className="group overflow-hidden hover:shadow-warm transition-all duration-300 hover:scale-105 border-border">
      <div className="relative overflow-hidden">
        <img 
          src={dish.image} 
          alt={dish.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Populära rätter just nu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upptäck vad våra hemkockar lagar idag. Alla rätter är färska och tillagade med kärlek.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockDishes.map((dish) => (
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