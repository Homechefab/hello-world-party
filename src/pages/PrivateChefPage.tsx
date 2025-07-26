import { useState } from "react";
import { Search, MapPin, Filter, Star, Calendar, Users, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

  const mockChefs = [
    {
      id: 1,
      name: "Anna Lindberg",
      image: "https://images.unsplash.com/photo-1494790108755-2616b9692e8d?w=150&h=150&fit=crop&crop=face",
      speciality: "Italiensk & Fransk matlagning",
      rating: 4.9,
      reviews: 87,
      experience: "15+ år",
      hourlyRate: 850,
      minHours: 4,
      awards: ["Michelin-tränad", "Kockutbildad"],
      description: "Professionell kock med bred erfarenhet från finare restauranger",
      services: ["Middag", "Lunch", "Catering", "Matlagningskurs"]
    },
    {
      id: 2,
      name: "Marcus Johansson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      speciality: "Nordisk & Vegansk matlagning",
      rating: 4.8,
      reviews: 62,
      experience: "12+ år",
      hourlyRate: 750,
      minHours: 3,
      awards: ["Krav-certifierad", "Vegancertifierad"],
      description: "Specialiserad på hållbar och modern nordisk matlagning",
      services: ["Middag", "Brunch", "Vegansk catering"]
    },
    {
      id: 3,
      name: "Sofia Ahmed",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      speciality: "Asiatisk fusion & Fine dining",
      rating: 4.9,
      reviews: 94,
      experience: "10+ år",
      hourlyRate: 950,
      minHours: 4,
      awards: ["James Beard-nominerad", "Stereo-kock"],
      description: "Kreativ kock med fokus på asiatisk fusion och presentationsteknik",
      services: ["Fine dining", "Tasting menu", "Sushi", "Cocktail pairing"]
    }
  ];

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
              Tillgängliga privatkockar
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mockChefs.map((chef) => (
              <Card key={chef.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-xl text-foreground">{chef.name}</h3>
                          <p className="text-primary font-medium">{chef.speciality}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{chef.hourlyRate} kr/h</div>
                          <div className="text-sm text-muted-foreground">Min {chef.minHours}h</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{chef.rating}</span>
                          <span className="text-sm text-muted-foreground">({chef.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Award className="w-4 h-4" />
                          {chef.experience}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">{chef.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {chef.awards.map((award, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {award}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {chef.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          Boka konsultation
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Visa profil
                        </Button>
                      </div>
                    </div>
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

export default PrivateChefPage;