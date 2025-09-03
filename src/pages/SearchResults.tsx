import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChefHat, Clock } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [searchArea, setSearchArea] = useState<string>('');
  const [showingNearby, setShowingNearby] = useState(false);

  useEffect(() => {
    const searchChefs = async () => {
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

        if (!chefsData || chefsData.length === 0) {
          setChefs([]);
          return;
        }

        // Get profiles for all chefs
        const chefUserIds = chefsData.map(chef => chef.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, address')
          .in('id', chefUserIds);

        if (profilesError) throw profilesError;

        // Get dish counts for chefs
        const { data: dishCounts, error: dishError } = await supabase
          .from('dishes')
          .select('chef_id')
          .eq('available', true)
          .in('chef_id', chefsData.map(c => c.id));

        if (dishError) throw dishError;

        // Format the results with distance calculation
        let formattedChefs = chefsData.map(chef => {
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

        if (query) {
          const searchLower = query.toLowerCase();
          
          // First, try to find exact matches in the searched area
          const exactMatches = formattedChefs.filter(chef => 
            chef.business_name?.toLowerCase().includes(searchLower) ||
            chef.full_name?.toLowerCase().includes(searchLower) ||
            chef.address?.toLowerCase().includes(searchLower) ||
            chef.city?.toLowerCase().includes(searchLower)
          );

          if (exactMatches.length > 0) {
            // Sort by distance if we have location data
            if (exactMatches.some(chef => chef.distance !== undefined)) {
              exactMatches.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            }
            setChefs(exactMatches);
            setSearchArea(query);
            setShowingNearby(false);
          } else {
            // No exact matches, show nearby chefs (within 50km)
            const nearbyChefs = formattedChefs
              .filter(chef => chef.distance !== undefined && chef.distance <= 50)
              .sort((a, b) => (a.distance || 0) - (b.distance || 0));

            if (nearbyChefs.length > 0) {
              setChefs(nearbyChefs);
              setSearchArea(query);
              setShowingNearby(true);
            } else {
              // Show all chefs if no nearby ones found
              setChefs(formattedChefs.slice(0, 10)); // Limit to 10 for performance
              setSearchArea(query);
              setShowingNearby(true);
            }
          }
        } else {
          // No search query, show all available chefs
          setChefs(formattedChefs);
          setShowingNearby(false);
        }
      } catch (error) {
        console.error('Error searching chefs:', error);
      } finally {
        setLoading(false);
      }
    };

    searchChefs();
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
              {showingNearby ? 'Kockar i närområdet' : 'Sökresultat'}
            </h1>
            {query && (
              <div className="text-center">
                <p className="text-xl text-white/90 mb-2">
                  {chefs.length > 0 
                    ? `Hittade ${chefs.length} kockar ${showingNearby ? 'i närområdet av' : 'för'} "${query}"`
                    : `Inga kockar hittades för "${query}"`
                  }
                </p>
                {showingNearby && chefs.length > 0 && (
                  <p className="text-lg text-yellow-cream">
                    Inga kockar hittades i exakt det området, visar istället kockar inom rimligt avstånd
                  </p>
                )}
              </div>
            )}
            {!query && (
              <p className="text-xl text-white/90">
                {chefs.length} kockar tillgängliga
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {chefs.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">
                {query ? `Inga kockar hittades för "${query}"` : "Inga kockar registrerade än"}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {query 
                  ? "Prova att söka på något annat eller kontrollera stavningen."
                  : "Vi arbetar på att få fler kockar att registrera sig."
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
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResults;