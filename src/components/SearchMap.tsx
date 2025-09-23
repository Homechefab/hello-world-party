import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, MapPin, Star, UtensilsCrossed } from 'lucide-react';

interface Chef {
  id: string;
  business_name: string;
  full_name: string;
  address: string;
  distance?: number;
  city?: string;
  dish_count: number;
}

interface SearchMapProps {
  chefs: Chef[];
  searchArea?: string;
  onChefSelect?: (chef: Chef) => void;
}

const SearchMap: React.FC<SearchMapProps> = ({ chefs, searchArea, onChefSelect }) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-orange-light to-yellow-cream rounded-lg border-2 border-dashed border-primary/30">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-6">
          <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Kartvy kommer snart
          </h3>
          <p className="text-muted-foreground">
            {searchArea ? `Kockar i ${searchArea}` : 'Kockar i området'}
          </p>
        </div>

        {/* Chef Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl max-h-80 overflow-y-auto">
          {chefs.map((chef) => (
            <Card key={chef.id} className="cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{chef.business_name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{chef.full_name}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate">{chef.city || chef.address}</span>
                  </div>
                  
                  {chef.distance && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">📏</span>
                      <span>{chef.distance} km bort</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-3 h-3 text-muted-foreground" />
                    <span>{chef.dish_count} rätter</span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => onChefSelect?.(chef)}
                >
                  Visa profil
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {chefs.length === 0 && (
          <div className="text-center">
            <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Inga kockar att visa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMap;