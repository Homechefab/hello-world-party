import { useState, useEffect } from "react";
import { Search, MapPin, Filter, ChefHat, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface SearchFilters {
  query: string;
  location: string;
  service: string;
  rating: string;
  priceRange: string;
}

interface Chef {
  id: string;
  business_name: string;
  full_name: string | null;
  city: string | null;
  address: string | null;
  specialties: string | null;
  profile_image_url: string | null;
}

const ChefSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    service: "",
    rating: "",
    priceRange: ""
  });
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [filteredChefs, setFilteredChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  const services = [
    { id: "pickup", label: "Avhämtning", icon: "🥡" },
    { id: "experience", label: "Matupplevelse", icon: "🍽️" },
    { id: "private", label: "Privatkock", icon: "👨‍🍳" }
  ];

  useEffect(() => {
    loadChefs();
  }, []);

  useEffect(() => {
    filterChefs();
  }, [filters, chefs]);

  const loadChefs = async () => {
    try {
      const { data, error } = await supabase
        .from("chefs")
        .select("id, business_name, full_name, city, address, specialties, profile_image_url")
        .eq("kitchen_approved", true);

      if (error) throw error;
      setChefs(data || []);
    } catch (error) {
      console.error("Error loading chefs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterChefs = () => {
    let result = [...chefs];

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(chef =>
        chef.business_name?.toLowerCase().includes(query) ||
        chef.full_name?.toLowerCase().includes(query) ||
        chef.specialties?.toLowerCase().includes(query)
      );
    }

    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      result = result.filter(chef =>
        chef.city?.toLowerCase().includes(location) ||
        chef.address?.toLowerCase().includes(location)
      );
    }

    setFilteredChefs(result);
  };

  const handleSearch = () => {
    filterChefs();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Search Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hitta din perfekta kock
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Upptäck talangfulla kockar i ditt närområde för alla dina matbehov
            </p>
            
            {/* Enhanced Search Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Vad vill du äta idag?"
                    value={filters.query}
                    onChange={(e) => setFilters({...filters, query: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                </div>
                <div className="md:col-span-4 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Din stad eller område"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                </div>
                <div className="md:col-span-3">
                  <Button size="lg" className="w-full py-4 text-lg font-semibold" onClick={handleSearch}>
                    Sök kockar
                  </Button>
                </div>
              </div>
              
              {/* Service Type Filters */}
              <div className="flex flex-wrap gap-3 justify-center">
                {services.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 ${
                      filters.service === service.id 
                        ? "bg-primary text-white border-primary" 
                        : "bg-white hover:bg-secondary"
                    }`}
                    onClick={() => setFilters({
                      ...filters, 
                      service: filters.service === service.id ? "" : service.id
                    })}
                  >
                    <span>{service.icon}</span>
                    {service.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredChefs.length > 0 
                ? `${filteredChefs.length} ${filteredChefs.length === 1 ? 'kock' : 'kockar'} hittade`
                : 'Hitta kockar'
              }
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Laddar kockar...</p>
            </div>
          ) : filteredChefs.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {chefs.length === 0 ? 'Inga kockar registrerade än' : 'Inga kockar matchar din sökning'}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {chefs.length === 0 
                  ? 'Vi arbetar på att få fler kockar att registrera sig. Bli den första att registrera dig som kock här!'
                  : 'Försök med en annan sökning eller ta bort filter för att se alla kockar.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {chefs.length === 0 ? (
                  <>
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
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setFilters({ query: "", location: "", service: "", rating: "", priceRange: "" })}
                  >
                    Rensa filter
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChefs.map((chef) => (
                <Link key={chef.id} to={`/chef/${chef.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 border-2 border-primary/20">
                          <AvatarImage src={chef.profile_image_url || undefined} alt={chef.full_name || chef.business_name} />
                          <AvatarFallback className="bg-primary/10">
                            <ChefHat className="w-8 h-8 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground">
                            {chef.full_name || chef.business_name}
                          </h3>
                          {chef.city && (
                            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{chef.city}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">Ny kock</span>
                          </div>
                          {chef.specialties && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {chef.specialties}
                            </p>
                          )}
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

export default ChefSearch;
