import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChefHat, Clock } from "lucide-react";

interface Chef {
  id: string;
  business_name: string;
  full_name: string;
  address: string;
  dish_count: number;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock chefs for demonstration
  const mockChefs = [
    {
      id: 'chef-1',
      business_name: 'Annas Hembageri', 
      full_name: 'Anna Lindström',
      address: 'Södermalm, Stockholm',
      dish_count: 2
    },
    {
      id: 'chef-2',
      business_name: 'Marco\'s Italienska Kök',
      full_name: 'Marco Rossi', 
      address: 'Gamla Stan, Stockholm',
      dish_count: 2
    },
    {
      id: 'chef-3',
      business_name: 'Lisas Vegetariska Delikatesser',
      full_name: 'Lisa Karlsson',
      address: 'Östermalm, Stockholm', 
      dish_count: 2
    }
  ];

  useEffect(() => {
    const searchChefs = async () => {
      try {
        // For demo purposes, show mock data
        // Filter based on search query if provided
        let filteredChefs = mockChefs;
        
        if (query) {
          const searchLower = query.toLowerCase();
          filteredChefs = mockChefs.filter(chef => 
            chef.business_name?.toLowerCase().includes(searchLower) ||
            chef.full_name?.toLowerCase().includes(searchLower) ||
            chef.address?.toLowerCase().includes(searchLower)
          );
        }
        
        setChefs(filteredChefs);
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
              Sökresultat
            </h1>
            {query && (
              <p className="text-xl text-white/90">
                Hittade {chefs.length} kockar för "{query}"
              </p>
            )}
            {!query && (
              <p className="text-xl text-white/90">
                {chefs.length} kockar tillgängliga i ditt område
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
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>30-45 min tillagning</span>
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