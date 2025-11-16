import { useState } from "react";
import { Search, MapPin, Filter, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

  // Inga kockar registrerade än
  const mockChefs: never[] = [];

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
              Hitta kockar
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {mockChefs.length === 0 && (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Inga kockar registrerade än
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Vi arbetar på att få fler kockar att registrera sig. Bli den första att registrera dig som kock här!
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
          )}
        </div>
      </section>
    </div>
  );
};

export default ChefSearch;