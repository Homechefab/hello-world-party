import { useState } from "react";
import { Search, MapPin, Filter, Star, Users, Clock, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SearchFilters {
  query: string;
  location: string;
  service: string;
  rating: string;
  priceRange: string;
}

const ChefSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    service: "",
    rating: "",
    priceRange: ""
  });

  const services = [
    { id: "pickup", label: "Avhämtning", icon: "🥡" },
    { id: "experience", label: "Matupplevelse", icon: "🍽️" },
    { id: "private", label: "Privatkock", icon: "👨‍🍳" }
  ];

  const mockChefs = [
    {
      id: 1,
      name: "Anna Lindberg",
      image: "https://images.unsplash.com/photo-1494790108755-2616b9692e8d?w=150&h=150&fit=crop&crop=face",
      speciality: "Italiensk matlagning",
      rating: 4.9,
      reviews: 127,
      distance: "2.3 km",
      services: ["pickup", "experience"],
      priceRange: "$$",
      description: "Passionerad kock med 15 års erfarenhet av italiensk matlagning"
    },
    {
      id: 2,
      name: "Marcus Johansson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      speciality: "Svensk husmanskost",
      rating: 4.8,
      reviews: 89,
      distance: "1.8 km",
      services: ["pickup", "private"],
      priceRange: "$$$",
      description: "Traditionell svensk matlagning med moderna influenser"
    },
    {
      id: 3,
      name: "Sofia Ahmed",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      speciality: "Mellanöstern & Vegetariskt",
      rating: 4.9,
      reviews: 203,
      distance: "3.1 km",
      services: ["pickup", "experience", "private"],
      priceRange: "$$",
      description: "Specialiserad på mellanösterns mat och vegetariska rätter"
    }
  ];

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
                  <Button size="lg" className="w-full py-4 text-lg font-semibold">
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
              {mockChefs.length} kockar hittades
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockChefs.map((chef) => (
              <Card key={chef.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{chef.name}</h3>
                      <p className="text-primary font-medium">{chef.speciality}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{chef.rating}</span>
                        <span className="text-sm text-muted-foreground">({chef.reviews})</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{chef.priceRange}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">{chef.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {chef.distance}
                    </div>
                    <div className="flex gap-1">
                      {chef.services.map((serviceId) => {
                        const service = services.find(s => s.id === serviceId);
                        return service ? (
                          <span key={serviceId} className="text-lg" title={service.label}>
                            {service.icon}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    Visa profil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChefSearch;