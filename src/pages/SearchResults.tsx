import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChefHat, Clock, UtensilsCrossed, Sparkles, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Chef {
  id: string;
  business_name: string;
  full_name: string;
  address: string;
  dish_count: number;
  distance?: number;
  city?: string;
  profile_image_url?: string;
  specialties?: string;
  avgRating?: number;
  reviewCount?: number;
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
const calculateDistance = (searchLocation: string, chefAddress: string): number | null => {
  const locations: { [key: string]: { lat: number; lon: number } } = {
    // Stockholm areas
    'stockholm': { lat: 59.3293, lon: 18.0686 },
    'södermalm': { lat: 59.3181, lon: 18.0758 },
    'gamla stan': { lat: 59.3251, lon: 18.0711 },
    'östermalm': { lat: 59.3364, lon: 18.0864 },
    'vasastan': { lat: 59.3467, lon: 18.0582 },
    'norrmalm': { lat: 59.3326, lon: 18.0649 },
    'kungsholmen': { lat: 59.3326, lon: 18.0350 },
    'hägersten': { lat: 59.2960, lon: 18.0078 },
    'bromma': { lat: 59.3383, lon: 17.9388 },
    'solna': { lat: 59.3600, lon: 18.0000 },
    'sundbyberg': { lat: 59.3612, lon: 17.9719 },
    'nacka': { lat: 59.3108, lon: 18.1636 },
    'lidingö': { lat: 59.3667, lon: 18.1333 },
    'huddinge': { lat: 59.2372, lon: 17.9817 },
    'täby': { lat: 59.4439, lon: 18.0687 },
    'sollentuna': { lat: 59.4281, lon: 17.9508 },
    
    // Gothenburg areas
    'göteborg': { lat: 57.7089, lon: 11.9746 },
    'gothenburg': { lat: 57.7089, lon: 11.9746 },
    'mölndal': { lat: 57.6554, lon: 12.0134 },
    'partille': { lat: 57.7394, lon: 12.1064 },
    
    // Malmö / Skåne
    'malmö': { lat: 55.6050, lon: 13.0038 },
    'lund': { lat: 55.7047, lon: 13.1910 },
    'helsingborg': { lat: 56.0465, lon: 12.6945 },
    'kristianstad': { lat: 56.0294, lon: 14.1567 },
    'landskrona': { lat: 55.8708, lon: 12.8302 },
    'ängelholm': { lat: 56.2428, lon: 12.8622 },
    'hässleholm': { lat: 56.1591, lon: 13.7664 },
    
    // Halland / Västra Götaland kust
    'båstad': { lat: 56.4267, lon: 12.8514 },
    'bastad': { lat: 56.4267, lon: 12.8514 },
    'laholm': { lat: 56.5117, lon: 13.0433 },
    'halmstad': { lat: 56.6745, lon: 12.8578 },
    'falkenberg': { lat: 56.9053, lon: 12.4914 },
    'varberg': { lat: 57.1058, lon: 12.2508 },
    'kungsbacka': { lat: 57.4872, lon: 12.0761 },
    
    // Nearby Båstad municipalities
    'östra karup': { lat: 56.4100, lon: 12.9200 },
    'torekov': { lat: 56.4228, lon: 12.6264 },
    'förslöv': { lat: 56.3833, lon: 12.9167 },
    
    // Other major cities
    'uppsala': { lat: 59.8586, lon: 17.6389 },
    'linköping': { lat: 58.4108, lon: 15.6214 },
    'örebro': { lat: 59.2753, lon: 15.2134 },
    'västerås': { lat: 59.6099, lon: 16.5448 },
    'norrköping': { lat: 58.5942, lon: 16.1826 },
    'jönköping': { lat: 57.7826, lon: 14.1618 },
    'umeå': { lat: 63.8258, lon: 20.2630 },
    'luleå': { lat: 65.5848, lon: 22.1547 },
    'gävle': { lat: 60.6749, lon: 17.1413 },
    'borås': { lat: 57.7210, lon: 12.9401 },
    'eskilstuna': { lat: 59.3666, lon: 16.5077 },
    'karlstad': { lat: 59.3793, lon: 13.5036 },
    'växjö': { lat: 56.8777, lon: 14.8091 },
    'kalmar': { lat: 56.6634, lon: 16.3566 },
    'sundsvall': { lat: 62.3908, lon: 17.3069 },
    'östersund': { lat: 63.1792, lon: 14.6357 },
    'trollhättan': { lat: 58.2836, lon: 12.2886 },
    'uddevalla': { lat: 58.3489, lon: 11.9383 },
    'skövde': { lat: 58.3906, lon: 13.8453 },
    'karlskrona': { lat: 56.1612, lon: 15.5869 },
    'visby': { lat: 57.6348, lon: 18.2948 },
  };

  const getLocationCoords = (location: string): { lat: number; lon: number } | null => {
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
    
    // Return null if location is not found - don't guess
    return null;
  };

  const searchCoords = getLocationCoords(searchLocation);
  const chefCoords = getLocationCoords(chefAddress);

  // If either location is unknown, we can't calculate distance
  if (!searchCoords || !chefCoords) {
    return null;
  }

  // Calculate distance using Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = (chefCoords.lat - searchCoords.lat) * Math.PI / 180;
  const dLon = (chefCoords.lon - searchCoords.lon) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(searchCoords.lat * Math.PI / 180) * Math.cos(chefCoords.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showingNearby, setShowingNearby] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  useEffect(() => {
    const searchContent = async () => {
      try {
        // Search for chefs with available dishes (using public view to avoid exposing sensitive data)
        const { data: chefsData, error } = await supabase
          .from('public_chef_profiles')
          .select(`
            id,
            business_name,
            full_name,
            city,
            profile_image_url,
            specialties
          `);

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

        // Get dish counts for chefs
        const chefIds = chefsData?.map(c => c.id).filter((id): id is string => id !== null) || [];
        const { data: dishCounts, error: dishCountError } = await supabase
          .from('dishes')
          .select('chef_id')
          .eq('available', true)
          .in('chef_id', chefIds);

        if (dishCountError) throw dishCountError;

        // Get reviews for all chefs
        const { data: allReviews } = await supabase
          .from('reviews')
          .select('chef_id, rating')
          .in('chef_id', chefIds);

        // Build review stats per chef
        const reviewStats: Record<string, { total: number; count: number }> = {};
        (allReviews || []).forEach(r => {
          if (!reviewStats[r.chef_id]) reviewStats[r.chef_id] = { total: 0, count: 0 };
          reviewStats[r.chef_id].total += r.rating;
          reviewStats[r.chef_id].count += 1;
        });

        // Format chef results with distance calculation
        let formattedChefs: Chef[] = [];
        if (chefsData && chefsData.length > 0) {
          formattedChefs = chefsData
            .filter(chef => chef.id !== null)
            .map(chef => {
            const dishCount = dishCounts?.filter(d => d.chef_id === chef.id).length || 0;
            const stats = reviewStats[chef.id!];
            
            const chefData: Chef = {
              id: chef.id!,
              business_name: chef.business_name || '',
              full_name: chef.full_name || '',
              address: chef.city || '',
              dish_count: dishCount,
              city: chef.city || '',
              profile_image_url: chef.profile_image_url || undefined,
              specialties: chef.specialties || undefined,
              avgRating: stats ? Math.round((stats.total / stats.count) * 10) / 10 : undefined,
              reviewCount: stats?.count || 0,
            };

            // Calculate distance if there's a location query
            if (query && (chefData.city || chefData.address)) {
              const dist = calculateDistance(query, chefData.city || chefData.address);
              chefData.distance = dist !== null ? dist : undefined;
            }

            return chefData;
          });
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

            // Skip distance calculation since we don't have chef address data
            // if (query && dishData.chef_address) {
            //   dishData.distance = calculateDistance(query, dishData.chef_address);
            // }

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
            chef.city?.toLowerCase().includes(searchLower) ||
            chef.specialties?.toLowerCase().includes(searchLower)
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
              <div className="space-y-4">
                <p className="text-xl text-white/90">
                  Sök bland {chefs.length} kockar och {dishes.length} rätter
                </p>
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Sök efter mat, kockar eller områden..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-foreground text-lg"
                    />
                  </div>
                </form>
              </div>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/chef/application" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Registrera dig som kock
                  </Button>
                </Link>
                <Link to="/notification-signup" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
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
                              {chef.profile_image_url ? (
                                <img 
                                  src={chef.profile_image_url} 
                                  alt={chef.business_name || chef.full_name}
                                  className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                                  <ChefHat className="w-6 h-6 text-white" />
                                </div>
                              )}
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