import { useState } from "react";
import { MapPin, Filter, Calendar, Users, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SearchFilters {
  location: string;
  date: string;
  guests: string;
}

const ExperiencePage = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    date: "",
    guests: ""
  });

  const guestOptions = [
    { id: "2", label: "2 personer", icon: "👫" },
    { id: "4", label: "4 personer", icon: "👨‍👩‍👧‍👦" },
    { id: "6", label: "6+ personer", icon: "👥" },
    { id: "10", label: "Större grupp", icon: "🎉" }
  ];

  // Inga upplevelser registrerade än
  const mockExperiences: never[] = [];

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Upplevelsepaket - Mat hos kocken
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Unika matupplevelser hemma hos passionerade kockar
            </p>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                <div className="md:col-span-4 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Var vill du äta?"
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
                <div className="md:col-span-2 relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <select
                    value={filters.guests}
                    onChange={(e) => setFilters({...filters, guests: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  >
                    <option value="">Gäster</option>
                    <option value="2">2 personer</option>
                    <option value="4">4 personer</option>
                    <option value="6">6 personer</option>
                    <option value="8">8+ personer</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <Button size="lg" className="w-full py-4 text-lg font-semibold">
                    Sök upplevelser
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {guestOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 ${
                      filters.guests === option.id 
                        ? "bg-primary text-white border-primary" 
                        : "bg-white hover:bg-secondary"
                    }`}
                    onClick={() => setFilters({
                      ...filters, 
                      guests: filters.guests === option.id ? "" : option.id
                    })}
                  >
                    <span>{option.icon}</span>
                    {option.label}
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
              Matupplevelser
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {mockExperiences.length === 0 && (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Inga matupplevelser registrerade än
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Vi arbetar på att få fler kockar att skapa matupplevelser. Bli den första att registrera dig som kock här!
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

export default ExperiencePage;