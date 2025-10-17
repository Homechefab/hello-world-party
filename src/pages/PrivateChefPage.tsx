import { useState } from "react";
import { Search, MapPin, Filter, Calendar, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";



interface SearchFilters {
  location: string;
  date: string;
  event: string;
  budget: string;
}

const PrivateChefPage = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    date: "",
    event: "",
    budget: ""
  });

  const eventTypes = [
    { id: "birthday", label: "Födelsedag", icon: "🎂" },
    { id: "anniversary", label: "Årsdag", icon: "💕" },
    { id: "business", label: "Affärsmiddag", icon: "💼" },
    { id: "dinner", label: "Middag", icon: "🍽️" }
  ];

  // Inga privatkockar registrerade än
  const mockChefs: never[] = [];

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Anlita en privatkock
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Få en kock hem till dig för speciella tillfällen, tillställningar, fest, kalas med mera
            </p>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                <div className="md:col-span-3 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Din adress"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <select
                    value={filters.event}
                    onChange={(e) => setFilters({...filters, event: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  >
                    <option value="">Typ av event</option>
                    <option value="birthday">Födelsedag</option>
                    <option value="anniversary">Årsdag</option>
                    <option value="business">Affärsmiddag</option>
                    <option value="dinner">Middag</option>
                    <option value="other">Annat</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <Button size="lg" className="w-full py-4 text-lg font-semibold">
                    Hitta kockar
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {eventTypes.map((event) => (
                  <Button
                    key={event.id}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 ${
                      filters.event === event.id 
                        ? "bg-primary text-white border-primary" 
                        : "bg-white hover:bg-secondary"
                    }`}
                    onClick={() => setFilters({
                      ...filters, 
                      event: filters.event === event.id ? "" : event.id
                    })}
                  >
                    <span>{event.icon}</span>
                    {event.label}
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
              Privatkockar
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
                Inga privatkockar registrerade än
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Vi arbetar på att få fler privatkockar att registrera sig. Bli den första att registrera dig som kock här!
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

export default PrivateChefPage;