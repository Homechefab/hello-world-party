import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface FoodCardProps {
  id?: string;
  dishId?: string;
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
  onOrderClick?: () => void;
}

const FoodCard = ({ 
  id,
  dishId,
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
  isFavorite = false,
  onOrderClick
}: FoodCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: id || `dish-${title.replace(/\s/g, '-').toLowerCase()}`,
      dishId: dishId || id || `dish-${title.replace(/\s/g, '-').toLowerCase()}`,
      name: title,
      price,
      chefId: seller,
      chefName: seller,
      image
    });
    toast({
      title: "Tillagd i varukorgen",
      description: `${title} har lagts till i din varukorg`,
    });
  };
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
        {/* Overlay tags only on medium+ screens; on small screens show simple text tags below to avoid boxed overlays and horizontal overflow */}
        <div className="absolute bottom-3 left-3 flex gap-2 hidden md:flex">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/80 text-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {/* Mobile: show tags as plain text below the image to avoid boxed overlays */}
        <div className="flex gap-2 mt-2 md:hidden">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-sm text-muted-foreground font-medium truncate">
              {tag}
            </span>
          ))}
        </div>
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Button variant="food" size="sm" onClick={onOrderClick}>
              Beställ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;