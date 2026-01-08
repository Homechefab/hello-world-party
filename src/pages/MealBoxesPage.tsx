import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, Package, MapPin, Star, Building2, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import mealBoxesImage from "@/assets/meal-boxes.jpg";

interface SearchFilters {
  query: string;
  location: string;
  providerType: string;
}

interface Chef {
  id: string;
  business_name: string;
  full_name: string | null;
  city: string | null;
  specialties: string | null;
  profile_image_url: string | null;
}

interface BusinessPartner {
  id: string;
  business_name: string;
  contact_name: string;
  city: string;
  business_description: string | null;
}

const MealBoxesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    providerType: ""
  });
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [businesses, setBusinesses] = useState<BusinessPartner[]>([]);
  const [filteredChefs, setFilteredChefs] = useState<Chef[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessPartner[]>([]);
  const [loading, setLoading] = useState(true);

  const providerTypes = [
    { id: "all", label: "Alla", icon: "🍱" },
    { id: "chef", label: "Hemkockar", icon: "👨‍🍳" },
    { id: "business", label: "Företag", icon: "🏢" }
  ];

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setFilters(prev => ({ ...prev, query }));
    }
    loadProviders();
  }, [searchParams]);

  useEffect(() => {
    filterProviders();
  }, [filters, chefs, businesses]);

  const loadProviders = async () => {
    try {
      // Load approved chefs
      const { data: chefsData, error: chefsError } = await supabase
        .from("chefs")
        .select("id, business_name, full_name, city, specialties, profile_image_url")
        .eq("kitchen_approved", true);

      if (chefsError) throw chefsError;
      setChefs(chefsData || []);

      // Load approved business partners (food-related)
      const { data: businessData, error: businessError } = await supabase
        .from("business_partners")
        .select("id, business_name, contact_name, city, business_description")
        .eq("application_status", "approved")
        .eq("business_type", "food_producer");

      if (businessError) throw businessError;
      setBusinesses(businessData || []);
    } catch (error) {
      console.error("Error loading providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let chefResult = [...chefs];
    let businessResult = [...businesses];

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      chefResult = chefResult.filter(chef =>
        chef.business_name?.toLowerCase().includes(query) ||
        chef.full_name?.toLowerCase().includes(query) ||
        chef.specialties?.toLowerCase().includes(query)
      );
      businessResult = businessResult.filter(business =>
        business.business_name?.toLowerCase().includes(query) ||
        business.business_description?.toLowerCase().includes(query)
      );
    }

    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      chefResult = chefResult.filter(chef =>
        chef.city?.toLowerCase().includes(location)
      );
      businessResult = businessResult.filter(business =>
        business.city?.toLowerCase().includes(location)
      );
    }

    // Filter by provider type
    if (filters.providerType === "chef") {
      businessResult = [];
    } else if (filters.providerType === "business") {
      chefResult = [];
    }

    setFilteredChefs(chefResult);
    setFilteredBusinesses(businessResult);
  };

  const totalResults = filteredChefs.length + filteredBusinesses.length;
  const hasNoResults = totalResults === 0 && !loading;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Search Section */}
      <section 
        className="relative py-16"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${mealBoxesImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Färdiglagade matlådor
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Beställ hemlagade matlådor från kockar och företag i ditt område
            </p>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Sök matlådor eller leverantör"
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
                  <Button size="lg" className="w-full py-4 text-lg font-semibold">
                    Sök matlådor
                  </Button>
                </div>
              </div>
              
              {/* Provider Type Filters */}
              <div className="flex flex-wrap gap-3 justify-center">
                {providerTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 ${
                      filters.providerType === type.id || (type.id === "all" && !filters.providerType)
                        ? "bg-primary text-white border-primary" 
                        : "bg-white hover:bg-secondary"
                    }`}
                    onClick={() => setFilters({
                      ...filters, 
                      providerType: type.id === "all" ? "" : (filters.providerType === type.id ? "" : type.id)
                    })}
                  >
                    <span>{type.icon}</span>
                    {type.label}
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
              {totalResults > 0 
                ? `${totalResults} leverantör${totalResults !== 1 ? 'er' : ''} hittade`
                : 'Hitta matlådor'
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
              <p className="text-muted-foreground">Laddar leverantörer...</p>
            </div>
          ) : hasNoResults ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {filters.query || filters.location 
                  ? 'Inga leverantörer matchar din sökning'
                  : 'Inga leverantörer registrerade än'
                }
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {filters.query || filters.location
                  ? 'Försök med en annan sökning eller ta bort filter för att se alla leverantörer.'
                  : 'Vi arbetar på att få fler kockar och företag att erbjuda matlådor. Registrera dig idag!'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {filters.query || filters.location ? (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setFilters({ query: "", location: "", providerType: "" })}
                  >
                    Rensa filter
                  </Button>
                ) : (
                  <>
                    <Link to="/chef/application" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto">
                        Registrera dig som kock
                      </Button>
                    </Link>
                    <Link to="/business/application" className="w-full sm:w-auto">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Registrera ditt företag
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Chefs Section */}
              {filteredChefs.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-primary" />
                    Hemkockar ({filteredChefs.length})
                  </h3>
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
                                <h4 className="font-semibold text-lg text-foreground">
                                  {chef.full_name || chef.business_name}
                                </h4>
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
                </div>
              )}

              {/* Businesses Section */}
              {filteredBusinesses.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Företag ({filteredBusinesses.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusinesses.map((business) => (
                      <Card key={business.id} className="hover:shadow-lg transition-shadow h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border-2 border-primary/20">
                              <AvatarFallback className="bg-primary/10">
                                <Building2 className="w-8 h-8 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-foreground">
                                {business.business_name}
                              </h4>
                              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>{business.city}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-muted-foreground">Nytt företag</span>
                              </div>
                              {business.business_description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {business.business_description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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

export default MealBoxesPage;
