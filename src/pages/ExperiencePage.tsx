import { useState } from "react";
import { Search, MapPin, Filter, Star, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

  const mockExperiences = [
    {
      id: 1,
      name: "Italiensk matlagningskurs & middag",
      chef: "Anna Lindberg",
      image: "https://images.unsplash.com/photo-1556909086-f3cae4bbf3a3?w=400&h=300&fit=crop",
      price: 850,
      rating: 4.9,
      reviews: 34,
      duration: "3.5 timmar",
      maxGuests: 8,
      location: "Södermalm, Stockholm",
      description: "Lär dig laga autentisk pasta från scratch och njut av en 4-rätters middag"
    },
    {
      id: 2,
      name: "Vegansk gourmetmiddag",
      chef: "Sofia Ahmed",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      price: 695,
      rating: 4.8,
      reviews: 27,
      duration: "2.5 timmar",
      maxGuests: 6,
      location: "Vasastan, Stockholm",
      description: "Exklusiv 5-rätters vegansk meny med vin- och ciderpairing"
    },
    {
      id: 3,
      name: "Sushi & sake-upplevelse",
      chef: "Marcus Johansson",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      price: 1200,
      rating: 4.9,
      reviews: 18,
      duration: "4 timmar",
      maxGuests: 4,
      location: "Östermalm, Stockholm",
      description: "Lär dig sushi-konsten och smaka premium sake i intim miljö"
    }
  ];

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
              Tillgängliga matupplevelser
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockExperiences.map((experience) => (
              <Card key={experience.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <img
                    src={experience.image}
                    alt={experience.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2">{experience.name}</h3>
                      <Badge variant="secondary" className="text-lg font-bold whitespace-nowrap ml-2">
                        {experience.price} kr
                      </Badge>
                    </div>
                    
                    <p className="text-primary text-sm mb-2">med {experience.chef}</p>
                    
                    <p className="text-muted-foreground text-sm mb-4">{experience.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{experience.rating}</span>
                        <span className="text-sm text-muted-foreground">({experience.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {experience.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Max {experience.maxGuests} pers
                      </div>
                      <div className="flex items-center gap-1 col-span-2">
                        <MapPin className="w-4 h-4" />
                        {experience.location}
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Boka upplevelse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExperiencePage;