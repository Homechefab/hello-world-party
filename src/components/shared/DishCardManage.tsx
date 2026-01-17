import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface DishCardManageProps {
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  available?: boolean;
  onEdit?: () => void;
  onToggleAvailability?: () => void;
  onDelete?: () => void;
}

const DishCardManage = ({
  name,
  price,
  description,
  imageUrl,
  category,
  available = true,
  onEdit,
  onToggleAvailability,
  onDelete
}: DishCardManageProps) => {
  return (
    <div className={`flex items-stretch gap-3 p-4 bg-card border border-border rounded-lg transition-all ${!available ? 'opacity-60' : 'hover:shadow-md'}`}>
      {/* Left side - Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-base leading-tight">
              {name}
            </h3>
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            )}
          </div>
          <p className="text-primary font-medium text-sm mb-1">
            {price} kr
          </p>
          {description && (
            <p className="text-muted-foreground text-xs line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 px-3"
          >
            <Edit className="w-3.5 h-3.5 mr-1" />
            Redigera
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleAvailability}
            className="h-8 px-2"
          >
            {available ? (
              <>
                <EyeOff className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs">Dölj</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs">Visa</span>
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Right side - Image */}
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
        
        {/* Status indicator */}
        <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${available ? 'bg-green-500' : 'bg-muted-foreground'}`} />
      </div>
    </div>
  );
};

export default DishCardManage;
