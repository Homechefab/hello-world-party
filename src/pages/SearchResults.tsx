import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChefHat, Clock, UtensilsCrossed, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Chef {
  id: string;
  business_name: string;
  full_name: string;
  address: string;
  dish_count: number;
  distance?: number;
  city?: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  chef_id: string;
  chef_name: string;
  chef_business_name: string;
  chef_address: string;
  distance?: number;
  image_url?: string;
  category?: string;
  preparation_time?: number;
}

// Simple distance calculation for Swedish cities/areas
const calculateDistance = (searchLocation: string, chefAddress: string): number => {
  const locations: { [key: string]: { lat: number; lon: number } } = {
    // Stockholm areas
    'stockholm': { lat: 59.3293, lon: 18.0686 },
    'södermalm': { lat: 59.3181, lon: 18.0758 },
    'gamla stan': { lat: 59.3251, lon: 18.0711 },
    'östermalm': { lat: 59.3364, lon: 18.0864 },
    'vasastan': { lat: 59.3467, lon: 18.0582 },
    'norrmalm': { lat: 59.3326, lon: 18.0649 },
    
    // Other major cities
    'göteborg': { lat: 57.7089, lon: 11.9746 },
    'malmö': { lat: 55.6050, lon: 13.0038 },
    'uppsala': { lat: 59.8586, lon: 17.6389 },
    'linköping': { lat: 58.4108, lon: 15.6214 },
    'örebro': { lat: 59.2753, lon: 15.2134 }
  };

  const getLocationCoords = (location: string) => {
    const normalized = location.toLowerCase().trim();
    
    // Try exact match first
    if (locations[normalized]) {
      return locations[normalized];
    }
    
    // Try partial match
    for (const [key, coords] of Object.entries(locations)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return coords;
      }
    }
    
    // Default to Stockholm if not found
    return locations['stockholm'];
  };

  const searchCoords = getLocationCoords(searchLocation);
  const chefCoords = getLocationCoords(chefAddress);

  // Calculate distance using Haversine formula (simplified)
  const R = 6371; // Earth's radius in km
  const dLat = (chefCoords.lat - searchCoords.lat) * Math.PI / 180;
  const dLon = (chefCoords.lon - searchCoords.lon) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(searchCoords.lat * Math.PI / 180) * Math.cos(chefCoords.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showingNearby, setShowingNearby] = useState(false);

  useEffect(() => {
    const searchContent = async () => {
      try {
        // Search for chefs with available dishes
        const { data: chefsData, error } = await supabase
          .from('chefs')
          .select(`
            id,
            business_name,
            user_id
          `)
          .eq('kitchen_approved', true);

        if (error) throw error;

        // Search for dishes simultaneously
        const { data: dishesData, error: dishError } = await supabase
          .from('dishes')
          .select(`
            id,
            name,
            description,
            price,
            chef_id,
            image_url,
            category,
            preparation_time
          `)
          .eq('available', true);

        if (dishError) throw dishError;

        // Get profiles for all users (chefs and dish chefs)
        const allUserIds = [
          ...(chefsData?.map(chef => chef.user_id) || [])
        ];
        const uniqueUserIds = [...new Set(allUserIds)];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, address')
          .in('id', uniqueUserIds);

        if (profilesError) throw profilesError;

        // Get dish counts for chefs
        const { data: dishCounts, error: dishCountError } = await supabase
          .from('dishes')
          .select('chef_id')
          .eq('available', true)
          .in('chef_id', chefsData?.map(c => c.id) || []);

        if (dishCountError) throw dishCountError;

        // Format chef results with distance calculation
        let formattedChefs: Chef[] = [];
        if (chefsData && chefsData.length > 0) {
          formattedChefs = chefsData.map(chef => {
            const profile = profilesData?.find(p => p.id === chef.user_id);
            const dishCount = dishCounts?.filter(d => d.chef_id === chef.id).length || 0;
            
            const chefData: Chef = {
              id: chef.id,
              business_name: chef.business_name,
              full_name: profile?.full_name || '',
              address: profile?.address || '',
              dish_count: dishCount,
              city: profile?.address?.split(',')[1]?.trim() || profile?.address || ''
            };

            // Calculate distance if there's a location query
            if (query && chefData.address) {
              chefData.distance = calculateDistance(query, chefData.address);
            }

            return chefData;
          }).filter(chef => chef.dish_count > 0);
        }

        // Format dish results - simplified without nested data
        let formattedDishes: Dish[] = [];
        if (dishesData && dishesData.length > 0) {
          formattedDishes = dishesData.map(dish => {
            const dishData: Dish = {
              id: dish.id,
              name: dish.name,
              description: dish.description || '',
              price: dish.price,
              chef_id: dish.chef_id,
              chef_name: 'Okänd kock',
              chef_business_name: 'Okänt företag',
              chef_address: '',
              image_url: dish.image_url || undefined,
              category: dish.category || undefined,
              preparation_time: dish.preparation_time || undefined
            };

            // Calculate distance if there's a location query
            if (query && dishData.chef_address) {
              dishData.distance = calculateDistance(query, dishData.chef_address);
            }

            return dishData;
          });
        }

        // Search and filter logic
        if (query) {
          const searchLower = query.toLowerCase();
          
          // Filter chefs by search query
          let filteredChefs = formattedChefs.filter(chef => 
            chef.business_name?.toLowerCase().includes(searchLower) ||
            chef.full_name?.toLowerCase().includes(searchLower) ||
            chef.address?.toLowerCase().includes(searchLower) ||
            chef.city?.toLowerCase().includes(searchLower)
          );

          // Filter dishes by search query
          let filteredDishes = formattedDishes.filter(dish =>
            dish.name.toLowerCase().includes(searchLower) ||
            dish.description?.toLowerCase().includes(searchLower) ||
            dish.category?.toLowerCase().includes(searchLower) ||
            dish.chef_name.toLowerCase().includes(searchLower) ||
            dish.chef_business_name.toLowerCase().includes(searchLower)
          );

          // If no exact matches, show nearby recommendations (within 50km)
          if (filteredChefs.length === 0 && filteredDishes.length === 0) {
            filteredChefs = formattedChefs
              .filter(chef => chef.distance !== undefined && chef.distance <= 50)
              .sort((a, b) => (a.distance || 0) - (b.distance || 0))
              .slice(0, 6);
            
            filteredDishes = formattedDishes
              .filter(dish => dish.distance !== undefined && dish.distance <= 50)
              .sort((a, b) => (a.distance || 0) - (b.distance || 0))
              .slice(0, 8);
            
            setShowingNearby(true);
          } else {
            // Sort results by relevance and distance
            filteredChefs.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            filteredDishes.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            setShowingNearby(false);
          }

          setChefs(filteredChefs.slice(0, 6));
          setDishes(filteredDishes.slice(0, 8));
          
        } else {
          // No search query, show featured content
          setChefs(formattedChefs.slice(0, 6));
          setDishes(formattedDishes.slice(0, 8));
          setShowingNearby(false);
        }
      } catch (error) {
        console.error('Error searching chefs:', error);
      } finally {
        setLoading(false);
      }
    };

    searchContent();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Söker efter kockar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {showingNearby ? 'Rekommendationer i närområdet' : query ? 'Sökresultat' : 'Utforska'}
            </h1>
            {query && (
              <div className="text-center">
                <p className="text-xl text-white/90 mb-2">
                  {chefs.length > 0 || dishes.length > 0
                    ? `Hittade ${chefs.length} kockar och ${dishes.length} rätter ${showingNearby ? 'i närområdet av' : 'för'} "${query}"`
                    : `Inga resultat hittades för "${query}"`
                  }
                </p>
                {showingNearby && (chefs.length > 0 || dishes.length > 0) && (
                  <p className="text-lg text-yellow-cream">
                    <Sparkles className="inline w-5 h-5 mr-1" />
                    Visar rekommendationer i närområdet baserat på din sökning
                  </p>
                )}
              </div>
            )}
            {!query && (
              <p className="text-xl text-white/90">
                Upptäck {chefs.length} kockar och {dishes.length} rätter
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {chefs.length === 0 && dishes.length === 0 ? (
            <div className="text-center py-16">
              <UtensilsCrossed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">
                {query ? `Inga resultat hittades för "${query}"` : "Inget innehåll tillgängligt än"}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {query 
                  ? "Prova att söka på något annat eller kontrollera stavningen."
                  : "Vi arbetar på att få fler kockar och rätter registrerade."
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/chef/application">
                  <Button size="lg">
                    Registrera dig som kock
                  </Button>
                </Link>
                <Link to="/notification-signup">
                  <Button variant="outline" size="lg">
                    Få notifiering när kockar finns
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Dish Recommendations */}
              {dishes.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <UtensilsCrossed className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">
                      {query ? 'Rekommenderade rätter' : 'Populära rätter'}
                    </h2>
                    {showingNearby && (
                      <Badge variant="secondary" className="ml-2">
                        <Sparkles className="w-3 h-3 mr-1" />
                        I närområdet
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dishes.map((dish) => (
                      <Link key={dish.id} to={`/dish/${dish.id}`}>
                        <Card className="group hover:shadow-warm transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                          <CardContent className="p-4">
                            {dish.image_url && (
                              <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                                <img 
                                  src={dish.image_url} 
                                  alt={dish.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg leading-tight">{dish.name}</h3>
                                <Badge variant="outline" className="text-primary font-semibold">
                                  {dish.price} kr
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {dish.description}
                              </p>
                              
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ChefHat className="w-3 h-3" />
                                <span>{dish.chef_business_name || dish.chef_name}</span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                {dish.preparation_time && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{dish.preparation_time} min</span>
                                  </div>
                                )}
                                {dish.distance && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{dish.distance} km</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="pt-2">
                                <Button variant="food" size="sm" className="w-full group-hover:shadow-lg transition-shadow">
                                  Beställ nu
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Chef Recommendations */}
              {chefs.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <ChefHat className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">
                      {query ? 'Rekommenderade kockar' : 'Populära kockar'}
                    </h2>
                    {showingNearby && (
                      <Badge variant="secondary" className="ml-2">
                        <Sparkles className="w-3 h-3 mr-1" />
                        I närområdet
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chefs.map((chef) => (
                      <Link key={chef.id} to={`/chef/${chef.id}`}>
                        <Card className="group hover:shadow-warm transition-all duration-300 hover:scale-105 cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                                <ChefHat className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {chef.business_name || chef.full_name}
                                </h3>
                                {chef.address && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    <span>{chef.address}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span>4.8 (12 recensioner)</span>
                                </div>
                                <Badge variant="secondary">
                                  {chef.dish_count} rätter
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>30-45 min tillagning</span>
                                </div>
                                {chef.distance && (
                                  <div className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    <span>{chef.distance} km bort</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="pt-2">
                                <Button variant="food" className="w-full group-hover:shadow-lg transition-shadow">
                                  Se maträtter
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResults;