import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Heart } from "lucide-react";

interface FoodCardProps {
  title: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  cookTime: string;
  distance: string;
  seller: string;
  image: string;
  tags: string[];
  isFavorite?: boolean;
}

const FoodCard = ({ 
  title, 
  description, 
  price, 
  rating, 
  reviews, 
  cookTime, 
  distance, 
  seller, 
  image, 
  tags,
  isFavorite = false 
}: FoodCardProps) => {
  return (
    <div className="bg-card rounded-xl shadow-card hover:shadow-warm transition-all duration-300 hover:scale-105 overflow-hidden group">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isFavorite ? 'bg-red-accent text-white' : 'bg-white/80 text-muted-foreground hover:bg-red-accent hover:text-white'
        }`}>
          <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-2">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/90 text-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">{title}</h3>
          <span className="font-bold text-primary text-xl">{price} kr</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span>({reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">av {seller}</span>
          <Button variant="food" size="sm">
            Beställ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;