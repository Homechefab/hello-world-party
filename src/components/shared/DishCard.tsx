import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DishCardProps {
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  pricePrefix?: string; // e.g. "från" for variable pricing
  onAdd?: () => void;
  disabled?: boolean;
}

const DishCard = ({
  name,
  price,
  description,
  imageUrl,
  pricePrefix,
  onAdd,
  disabled = false
}: DishCardProps) => {
  return (
    <div className="flex items-stretch gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
      {/* Left side - Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-base leading-tight mb-1">
            {name}
          </h3>
          <p className="text-primary font-medium text-sm">
            {pricePrefix && <span className="text-muted-foreground">{pricePrefix} </span>}
            {price} kr
          </p>
        </div>
        {description && (
          <p className="text-muted-foreground text-xs line-clamp-2 mt-2">
            {description}
          </p>
        )}
      </div>

      {/* Right side - Image and Add button */}
      <div className="relative flex-shrink-0 w-24 h-24">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
        
        {/* Add button */}
        <Button
          size="icon"
          variant="outline"
          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          onClick={onAdd}
          disabled={disabled}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DishCard;
