import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFilters {
  query: string;
  location: string;
  timeSlot: string;
}

const PickupPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    timeSlot: ""
  });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setFilters(prev => ({ ...prev, query }));
    }
  }, [searchParams]);

  const timeSlots = [
    { id: "now", label: "Nu", icon: "⚡" },
    { id: "30min", label: "30 min", icon: "⏰" },
    { id: "1hour", label: "1 timme", icon: "🕐" },
    { id: "today", label: "Idag", icon: "📅" }
  ];

  // Simulera att filtrera kockar baserat på sökfrågan
  // Om det finns en specifik sökfråga, simulera att det inte finns kockar för den staden

  // Inga kockar registrerade än - visa alltid tom lista
  

  // Visa alltid meddelandet om inga kockar (oavsett sökfråga)
  const showNoChefs = true;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Beställ mat för avhämtning
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Hämta färsk hemlagad mat direkt från kockarnas kök
            </p>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-3 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Sök mat eller ange avhämtningsadress"
                    value={filters.query}
                    onChange={(e) => setFilters({...filters, query: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                </div>
                <div className="md:col-span-1">
                  <Button size="lg" className="w-full py-4 text-lg font-semibold">
                    Hitta mat nära dig
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 ${
                      filters.timeSlot === slot.id 
                        ? "bg-primary text-white border-primary" 
                        : "bg-white hover:bg-secondary"
                    }`}
                    onClick={() => setFilters({
                      ...filters, 
                      timeSlot: filters.timeSlot === slot.id ? "" : slot.id
                    })}
                  >
                    <span>{slot.icon}</span>
                    {slot.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Tillgänglig mat för avhämtning
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Visa meddelande när det inte finns kockar */}
          {showNoChefs && (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {filters.query 
                  ? `Inga kockar registrerade i "${filters.query}" än`
                  : "Inga kockar registrerade än"
                }
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Vi arbetar på att få fler kockar till ditt område. Bli den första att registrera dig som kock här!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default PickupPage;