import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Clock, Truck, Star, Filter, Search, MapPin, Building2, ChefHat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import mealBoxesImage from "@/assets/meal-boxes.jpg";
import chickenRiceImage from "@/assets/chicken-rice-mealbox.jpg";
import pastaImage from "@/assets/pasta-mealbox.jpg";
import meatballsImage from "@/assets/meatballs-mealbox.jpg";

const MealBoxesPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [providerType, setProviderType] = useState("all");

  // Exempel matlådor med kock/företagsinfo
  const mealBoxes = [
    {
      id: 1,
      name: "Grillad kyckling med grönsaker & quinoa",
      chef: "Anna Andersson",
      providerType: "chef",
      location: "Stockholm",
      price: 95,
      prepTime: "30 min",
      rating: 4.8,
      image: chickenRiceImage,
      available: true,
      delivery: true
    },
    {
      id: 2,
      name: "Pasta med färska tomater & basilika",
      chef: "Erik Svensson",
      providerType: "chef",
      location: "Göteborg",
      price: 89,
      prepTime: "25 min",
      rating: 4.9,
      image: pastaImage,
      available: true,
      delivery: false
    },
    {
      id: 3,
      name: "Köttbullar med mos & lingon",
      chef: "Maria Johansson",
      providerType: "chef",
      location: "Malmö",
      price: 125,
      prepTime: "20 min",
      rating: 5.0,
      image: meatballsImage,
      available: true,
      delivery: true
    },
    {
      id: 4,
      name: "Vegansk buddha bowl",
      chef: "Green Kitchen AB",
      providerType: "business",
      location: "Stockholm",
      price: 99,
      prepTime: "15 min",
      rating: 4.7,
      image: chickenRiceImage,
      available: true,
      delivery: true
    },
    {
      id: 5,
      name: "Laxfilé med dillsås",
      chef: "Måltidslådan Sverige",
      providerType: "business",
      location: "Uppsala",
      price: 145,
      prepTime: "20 min",
      rating: 4.6,
      image: pastaImage,
      available: true,
      delivery: true
    }
  ];

  // Filtrera matlådor baserat på sök, plats och leverantörstyp
  const filteredMealBoxes = mealBoxes.filter((box) => {
    const matchesSearch = 
      box.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      box.chef.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = 
      locationQuery === "" || 
      box.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    const matchesProvider = 
      providerType === "all" || 
      box.providerType === providerType;
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "delivery" && box.delivery) ||
      (filter === "pickup" && !box.delivery);

    return matchesSearch && matchesLocation && matchesProvider && matchesFilter;
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
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Färdiglagade matlådor
          </h1>
          <p className="text-xl drop-shadow-lg">
            Sök efter kockar och företag som säljer hemlagade matlådor
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
                placeholder="Sök kock, företag eller maträtt..."
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
                <SelectValue placeholder="Leverantör" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla leverantörer</SelectItem>
                <SelectItem value="chef">
                  <span className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    Kockar
                  </span>
                </SelectItem>
                <SelectItem value="business">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Företag
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Leverans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla alternativ</SelectItem>
                <SelectItem value="delivery">Med hemleverans</SelectItem>
                <SelectItem value="pickup">Endast avhämtning</SelectItem>
              </SelectContent>
            </Select>
            
            {(searchQuery || locationQuery || providerType !== "all" || filter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setLocationQuery("");
                  setProviderType("all");
                  setFilter("all");
                }}
              >
                Rensa filter
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Visar {filteredMealBoxes.length} resultat
            {searchQuery && ` för "${searchQuery}"`}
            {locationQuery && ` i ${locationQuery}`}
          </p>
        </div>

        {/* Meal Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMealBoxes.map((box) => (
            <Card key={box.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-56 bg-muted flex items-center justify-center overflow-hidden">
                <img 
                  src={box.image}
                  alt={`Matlåda ${box.name}`}
                  className="w-full h-full object-contain p-4"
                  loading="lazy"
                  decoding="async"
                />
                {box.delivery && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Leverans
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  {box.providerType === "chef" ? (
                    <>
                      <ChefHat className="w-4 h-4" />
                      Kock
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      Företag
                    </>
                  )}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{box.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>av {box.chef}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {box.location}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{box.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{box.prepTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{box.price} kr</span>
                  <Button size="sm">
                    Beställ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMealBoxes.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Inga resultat hittades</h3>
            <p className="text-muted-foreground mb-4">
              Prova att ändra din sökning eller filter
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setLocationQuery("");
                setProviderType("all");
                setFilter("all");
              }}
            >
              Rensa alla filter
            </Button>
          </div>
        )}

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Package className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Färdiglagat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All mat är färdiglagad av professionella kockar och redo att ätas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Snabb uppvärmning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Värm i mikro eller ugn på 5-10 minuter och njut av hemlagad mat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Leverans eller upphämtning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Välj mellan hemleverans eller hämta upp hos kocken nära dig
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MealBoxesPage;
