import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Star, Search, MapPin, Building2, ChefHat, UtensilsCrossed } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import mealBoxesImage from "@/assets/meal-boxes.jpg";

const MealBoxesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [providerType, setProviderType] = useState("all");

  // Exempel på leverantörer (kockar och företag) som säljer matlådor
  const providers = [
    {
      id: "1",
      name: "Anna Andersson",
      type: "chef",
      location: "Stockholm",
      rating: 4.8,
      reviewCount: 45,
      description: "Hemlagade matlådor med fokus på hälsosam mat och fräscha råvaror",
      mealBoxCount: 8,
      hasDelivery: true,
      specialties: ["Kyckling", "Vegetariskt", "Fisk"]
    },
    {
      id: "2",
      name: "Green Kitchen AB",
      type: "business",
      location: "Stockholm",
      rating: 4.7,
      reviewCount: 128,
      description: "Veganska och vegetariska matlådor för den medvetna konsumenten",
      mealBoxCount: 15,
      hasDelivery: true,
      specialties: ["Veganskt", "Ekologiskt", "Glutenfritt"]
    },
    {
      id: "3",
      name: "Erik Svensson",
      type: "chef",
      location: "Göteborg",
      rating: 4.9,
      reviewCount: 32,
      description: "Klassisk husmanskost med moderna inslag. Perfekt för hela familjen",
      mealBoxCount: 6,
      hasDelivery: false,
      specialties: ["Husmanskost", "Köttbullar", "Pytt i panna"]
    },
    {
      id: "4",
      name: "Måltidslådan Sverige",
      type: "business",
      location: "Uppsala",
      rating: 4.6,
      reviewCount: 89,
      description: "Färska matlådor med fokus på svenska råvaror och säsongens grönsaker",
      mealBoxCount: 20,
      hasDelivery: true,
      specialties: ["Svenskt kött", "Säsongsmat", "Fisk"]
    },
    {
      id: "5",
      name: "Maria Johansson",
      type: "chef",
      location: "Malmö",
      rating: 5.0,
      reviewCount: 18,
      description: "Italienskinspirerade matlådor med färsk pasta och hemgjorda såser",
      mealBoxCount: 5,
      hasDelivery: true,
      specialties: ["Italienskt", "Pasta", "Pizza"]
    },
    {
      id: "6",
      name: "Nordic Meal Prep",
      type: "business",
      location: "Stockholm",
      rating: 4.5,
      reviewCount: 156,
      description: "Proteinrika matlådor för aktiva. Perfekt för träning och återhämtning",
      mealBoxCount: 12,
      hasDelivery: true,
      specialties: ["Protein", "Fitness", "Keto"]
    }
  ];

  // Filtrera leverantörer baserat på sök, plats och typ
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = 
      locationQuery === "" || 
      provider.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    const matchesType = 
      providerType === "all" || 
      provider.type === providerType;

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mealBoxesImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Färdiglagade matlådor
          </h1>
          <p className="text-xl drop-shadow-lg max-w-2xl mx-auto">
            Sök efter kockar och företag som säljer hemlagade matlådor i ditt område
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="bg-card rounded-lg shadow-card p-6 mb-8 -mt-20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Sök kock, företag eller typ av mat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ort eller stad"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Provider Type Select */}
            <Select value={providerType} onValueChange={setProviderType}>
              <SelectTrigger>
                <SelectValue placeholder="Leverantörstyp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla leverantörer</SelectItem>
                <SelectItem value="chef">Kockar</SelectItem>
                <SelectItem value="business">Företag</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear filters */}
          {(searchQuery || locationQuery || providerType !== "all") && (
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setLocationQuery("");
                  setProviderType("all");
                }}
              >
                Rensa filter
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Visar {filteredProviders.length} leverantör{filteredProviders.length !== 1 ? 'er' : ''}
            {searchQuery && ` för "${searchQuery}"`}
            {locationQuery && ` i ${locationQuery}`}
          </p>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProviders.map((provider) => (
            <Link key={provider.id} to={`/provider/${provider.id}`}>
              <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-6">
                  {/* Header with type badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        provider.type === "chef" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-accent/10 text-accent-foreground"
                      }`}>
                        {provider.type === "chef" ? (
                          <ChefHat className="w-6 h-6" />
                        ) : (
                          <Building2 className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{provider.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {provider.location}
                        </div>
                      </div>
                    </div>
                    <Badge variant={provider.type === "chef" ? "default" : "secondary"}>
                      {provider.type === "chef" ? "Kock" : "Företag"}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {provider.description}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm border-t pt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-muted-foreground">({provider.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>{provider.mealBoxCount} matlådor</span>
                    </div>
                    {provider.hasDelivery && (
                      <div className="flex items-center gap-1 text-primary">
                        <Truck className="w-4 h-4" />
                        <span className="text-xs">Leverans</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-16">
            <UtensilsCrossed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Inga leverantörer hittades</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Vi hittade inga kockar eller företag som matchar din sökning. Prova att ändra dina filter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setLocationQuery("");
                  setProviderType("all");
                }}
              >
                Rensa alla filter
              </Button>
              <Link to="/chef/application">
                <Button>Registrera dig som kock</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Info Section */}
        {filteredProviders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <Package className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Färdiglagat</h4>
                <p className="text-sm text-muted-foreground">
                  All mat är färdiglagad och redo att ätas eller värmas snabbt
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <ChefHat className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Lokala kockar</h4>
                <p className="text-sm text-muted-foreground">
                  Stöd lokala kockar och företag som lagar mat med passion
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Truck className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Leverans eller hämtning</h4>
                <p className="text-sm text-muted-foreground">
                  Välj mellan hemleverans eller hämta upp hos leverantören
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealBoxesPage;
