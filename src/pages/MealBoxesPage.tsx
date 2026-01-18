import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Star, MapPin, Building2, ChefHat, Calendar, Search, Cake, Heart, Briefcase, UtensilsCrossed } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import mealBoxesImage from "@/assets/meal-boxes.jpg";

const MealBoxesPage = () => {
  const [locationQuery, setLocationQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);

  const quickFilters = [
    { label: "Födelsedag", value: "birthday", icon: Cake },
    { label: "Årsdag", value: "anniversary", icon: Heart },
    { label: "Affärsmiddag", value: "business", icon: Briefcase },
    { label: "Middag", value: "dinner", icon: UtensilsCrossed },
  ];

  // Inga leverantörer registrerade än - tom lista
  const providers: {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: number;
    reviewCount: number;
    description: string;
    mealBoxCount: number;
    hasDelivery: boolean;
    specialties: string[];
  }[] = [];

  // Filtrera leverantörer baserat på plats och event-typ
  const filteredProviders = providers.filter((provider) => {
    const matchesLocation = 
      locationQuery === "" || 
      provider.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    const matchesEventType = 
      eventType === "" || 
      selectedQuickFilter === null ||
      provider.specialties.some(s => s.toLowerCase().includes(eventType.toLowerCase()));

    return matchesLocation && matchesEventType;
  });

  const handleQuickFilter = (value: string) => {
    if (selectedQuickFilter === value) {
      setSelectedQuickFilter(null);
      setEventType("");
    } else {
      setSelectedQuickFilter(value);
      setEventType(value);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] flex items-center justify-center z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mealBoxesImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center text-white z-10 px-4 w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Färdiglagade matlådor
          </h1>
          <p className="text-xl drop-shadow-lg max-w-2xl mx-auto mb-8">
            Sök efter kockar och företag som säljer hemlagade matlådor i ditt område
          </p>

          {/* Search Section - inside hero */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              {/* Location Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Din adress"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="pl-10 bg-white border-border"
                />
              </div>
              
              {/* Date Input */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="åååå-mm-dd"
                  value={dateQuery}
                  onChange={(e) => setDateQuery(e.target.value)}
                  className="pl-10 bg-white border-border"
                />
              </div>

              {/* Event Type Select */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="pl-10 bg-white border-border">
                    <SelectValue placeholder="Typ av event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Födelsedag</SelectItem>
                    <SelectItem value="anniversary">Årsdag</SelectItem>
                    <SelectItem value="business">Affärsmiddag</SelectItem>
                    <SelectItem value="dinner">Middag</SelectItem>
                    <SelectItem value="party">Fest</SelectItem>
                    <SelectItem value="other">Annat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button variant="food" size="default" className="w-full">
                Hitta matlådor
              </Button>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <Button
                    key={filter.value}
                    variant={selectedQuickFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickFilter(filter.value)}
                    className={`rounded-full ${selectedQuickFilter === filter.value ? "" : "bg-white hover:bg-gray-50"}`}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Visar {filteredProviders.length} leverantör{filteredProviders.length !== 1 ? 'er' : ''}
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

        {/* Empty State - Inga leverantörer registrerade */}
        {providers.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              {locationQuery
                ? `Inga leverantörer registrerade i "${locationQuery}" än`
                : "Inga leverantörer registrerade än"
              }
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Vi arbetar på att få fler kockar och företag som säljer matlådor till ditt område. Bli den första att registrera dig!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/chef/application">
                <Button size="lg">
                  Registrera dig som kock
                </Button>
              </Link>
              <Link to="/business/application">
                <Button variant="outline" size="lg">
                  Registrera företag
                </Button>
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