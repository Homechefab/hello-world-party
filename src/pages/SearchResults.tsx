import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChefHat, Clock, UtensilsCrossed, Sparkles, Map } from "lucide-react";
import SearchMap from "@/components/SearchMap";

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
    'örebro': { lat: 59.2753, lon: 15.2134 },
    'laholm': { lat: 56.5125, lon: 13.0405 }
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
  const [searchArea, setSearchArea] = useState<string>('');
  const [showingNearby, setShowingNearby] = useState(false);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);

  // Mock data for demonstration
  const mockChefs: Chef[] = [
    {
      id: 'chef1',
      business_name: 'Annas Hemlagade',
      full_name: 'Anna Kök',
      address: 'Gamla Stan, Stockholm',
      dish_count: 3,
      city: 'Stockholm',
      distance: query ? calculateDistance(query, 'Gamla Stan, Stockholm') : undefined
    },
    {
      id: 'chef2',
      business_name: 'Lars Köksstudio',
      full_name: 'Lars Köksmästare',
      address: 'Södermalm, Stockholm',
      dish_count: 2,
      city: 'Stockholm',
      distance: query ? calculateDistance(query, 'Södermalm, Stockholm') : undefined
    },
    {
      id: 'chef3',
      business_name: 'Maria Pasta Bar',
      full_name: 'Maria Pasta',
      address: 'Östermalm, Stockholm',
      dish_count: 2,
      city: 'Stockholm',
      distance: query ? calculateDistance(query, 'Östermalm, Stockholm') : undefined
    },
    {
      id: 'chef4',
      business_name: 'Eriks Fiskrätter',
      full_name: 'Erik Fiskhandlare',
      address: 'Vasastan, Stockholm',
      dish_count: 1,
      city: 'Stockholm',
      distance: query ? calculateDistance(query, 'Vasastan, Stockholm') : undefined
    },
    {
      id: 'chef5',
      business_name: 'Sofias Vegetariska',
      full_name: 'Sofia Vegetarian',
      address: 'Norrmalm, Stockholm',
      dish_count: 1,
      city: 'Stockholm',
      distance: query ? calculateDistance(query, 'Norrmalm, Stockholm') : undefined
    }
  ];

  const mockDishes: Dish[] = [
    {
      id: 'dish1',
      name: 'Klassiska Köttbullar',
      description: 'Hemlagade köttbullar med gräddsås, lingonsylt och potatismos',
      price: 149,
      chef_id: 'chef1',
      chef_name: 'Anna Kök',
      chef_business_name: 'Annas Hemlagade',
      chef_address: 'Gamla Stan, Stockholm',
      category: 'Kött',
      preparation_time: 30,
      distance: query ? calculateDistance(query, 'Gamla Stan, Stockholm') : undefined
    },
    {
      id: 'dish2',
      name: 'Vegetariska Köttbullar',
      description: 'Veganska köttbullar med cashewsås och potatispuré',
      price: 139,
      chef_id: 'chef1',
      chef_name: 'Anna Kök',
      chef_business_name: 'Annas Hemlagade',
      chef_address: 'Gamla Stan, Stockholm',
      category: 'Vegetariskt',
      preparation_time: 25,
      distance: query ? calculateDistance(query, 'Gamla Stan, Stockholm') : undefined
    },
    {
      id: 'dish3',
      name: 'Pasta Carbonara',
      description: 'Klassisk pasta carbonara med ägg, bacon och parmesan',
      price: 129,
      chef_id: 'chef2',
      chef_name: 'Lars Köksmästare',
      chef_business_name: 'Lars Köksstudio',
      chef_address: 'Södermalm, Stockholm',
      category: 'Pasta',
      preparation_time: 20,
      distance: query ? calculateDistance(query, 'Södermalm, Stockholm') : undefined
    },
    {
      id: 'dish4',
      name: 'Pasta Arrabbiata',
      description: 'Kryddig tomatbaserad pasta med chili och vitlök',
      price: 119,
      chef_id: 'chef3',
      chef_name: 'Maria Pasta',
      chef_business_name: 'Maria Pasta Bar',
      chef_address: 'Östermalm, Stockholm',
      category: 'Pasta',
      preparation_time: 15,
      distance: query ? calculateDistance(query, 'Östermalm, Stockholm') : undefined
    },
    {
      id: 'dish5',
      name: 'Fiskgryta',
      description: 'Krämig fiskgryta med lax, torsk och räkor',
      price: 179,
      chef_id: 'chef4',
      chef_name: 'Erik Fiskhandlare',
      chef_business_name: 'Eriks Fiskrätter',
      chef_address: 'Vasastan, Stockholm',
      category: 'Fisk',
      preparation_time: 35,
      distance: query ? calculateDistance(query, 'Vasastan, Stockholm') : undefined
    },
    {
      id: 'dish6',
      name: 'Vegansk Buddha Bowl',
      description: 'Näringsrik bowl med quinoa, rostade grönsaker och tahini-dressing',
      price: 139,
      chef_id: 'chef5',
      chef_name: 'Sofia Vegetarian',
      chef_business_name: 'Sofias Vegetariska',
      chef_address: 'Norrmalm, Stockholm',
      category: 'Vegetariskt',
      preparation_time: 25,
      distance: query ? calculateDistance(query, 'Norrmalm, Stockholm') : undefined
    },
    {
      id: 'dish7',
      name: 'Kycklinggryta',
      description: 'Saftig kycklinggryta med rosmarin och potatis',
      price: 159,
      chef_id: 'chef2',
      chef_name: 'Lars Köksmästare',
      chef_business_name: 'Lars Köksstudio',
      chef_address: 'Södermalm, Stockholm',
      category: 'Kött',
      preparation_time: 40,
      distance: query ? calculateDistance(query, 'Södermalm, Stockholm') : undefined
    }
  ];

  useEffect(() => {
    const searchContent = async () => {
      try {
        setLoading(true);

        // Use mock data for now
        const mockChefsData = mockChefs;
        const mockDishesData = mockDishes;
        let filteredChefs = mockChefsData;
        let filteredDishes = mockDishesData;

        if (query) {
          const searchLower = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          filteredChefs = mockChefsData.filter(chef => {
            const normalizeText = (text: string) => 
              text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            
            return (chef.business_name && normalizeText(chef.business_name).includes(searchLower)) ||
                   (chef.full_name && normalizeText(chef.full_name).includes(searchLower)) ||
                   (chef.address && normalizeText(chef.address).includes(searchLower)) ||
                   (chef.city && normalizeText(chef.city).includes(searchLower));
          });

          filteredDishes = mockDishesData.filter(dish => {
            const normalizeText = (text: string) => 
              text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            
            return normalizeText(dish.name).includes(searchLower) ||
                   (dish.description && normalizeText(dish.description).includes(searchLower)) ||
                   (dish.category && normalizeText(dish.category).includes(searchLower)) ||
                   normalizeText(dish.chef_name).includes(searchLower) ||
                   normalizeText(dish.chef_business_name).includes(searchLower);
          });

          console.log('Search query:', query, 'Filtered dishes:', filteredDishes.length, 'Filtered chefs:', filteredChefs.length);

          if (filteredChefs.length === 0 && filteredDishes.length === 0) {
            filteredChefs = mockChefsData
              .filter(chef => chef.distance !== undefined && chef.distance <= 50)
              .sort((a, b) => (a.distance || 0) - (b.distance || 0))
              .slice(0, 6);

            filteredDishes = mockDishesData
              .filter(dish => dish.distance !== undefined && dish.distance <= 50)
              .sort((a, b) => (a.distance || 0) - (b.distance || 0))
              .slice(0, 8);

            setShowingNearby(true);
          } else {
            filteredChefs.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            filteredDishes.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            setShowingNearby(false);
          }

          setChefs(filteredChefs.slice(0, 6));
          setDishes(filteredDishes.slice(0, 8));
          setSearchArea(query);
        } else {
          setChefs(filteredChefs.slice(0, 6));
          setDishes(filteredDishes.slice(0, 8));
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <ChefHat className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Kockar i området</h2>
                  {showingNearby && (
                    <Badge variant="secondary" className="ml-2">
                      <Sparkles className="w-3 h-3 mr-1" />
                      I närområdet
                    </Badge>
                  )}
                </div>

                <div className="space-y-4 overflow-y-auto h-[500px] pr-2">
                  {chefs.map((chef) => (
                    <Card key={chef.id} className="hover:shadow-card transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              <ChefHat className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{chef.business_name}</h3>
                              <p className="text-muted-foreground">{chef.full_name}</p>
                            </div>
                          </div>
                          {chef.distance && (
                            <Badge variant="outline">
                              {chef.distance} km
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{chef.city || chef.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                            <span>{chef.dish_count} rätter tillgängliga</span>
                          </div>
                        </div>
                        
                        <Link to={`/chef/${chef.id}`}>
                          <Button className="w-full">
                            Visa kockens profil
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}

                  {chefs.length === 0 && (
                    <div className="text-center py-8">
                      <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Inga kockar hittades i området</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Map className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Karta</h2>
                </div>
                
                <div className="h-[500px]">
                  <SearchMap 
                    chefs={chefs} 
                    searchArea={searchArea}
                    onChefSelect={(chef: Chef) => setSelectedChef(chef)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
