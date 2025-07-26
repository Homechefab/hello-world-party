import { useState } from "react";
import { Search, MapPin, Filter, Star, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SearchFilters {
  query: string;
  location: string;
  timeSlot: string;
}

const PickupPage = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    timeSlot: ""
  });

  const timeSlots = [
    { id: "now", label: "Nu", icon: "⚡" },
    { id: "30min", label: "30 min", icon: "⏰" },
    { id: "1hour", label: "1 timme", icon: "🕐" },
    { id: "today", label: "Idag", icon: "📅" }
  ];

  const mockDishes = [
    {
      id: 1,
      name: "Köttbullar med potatismos",
      chef: "Anna Lindberg",
      image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400&h=300&fit=crop",
      price: 125,
      rating: 4.9,
      reviews: 89,
      readyIn: "25 min",
      distance: "1.2 km",
      description: "Klassiska svenska köttbullar med krämigt potatismos och lingonsylt"
    },
    {
      id: 2,
      name: "Vegetarisk lasagne",
      chef: "Sofia Ahmed",
      image: "https://images.unsplash.com/photo-1621510456681-2330135e5871?w=400&h=300&fit=crop",
      price: 110,
      rating: 4.8,
      reviews: 67,
      readyIn: "15 min",
      distance: "2.1 km",
      description: "Hemlagad vegetarisk lasagne med ricotta och färska grönsaker"
    },
    {
      id: 3,
      name: "Thai Pad Thai",
      chef: "Marcus Johansson",
      image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop",
      price: 95,
      rating: 4.7,
      reviews: 43,
      readyIn: "20 min",
      distance: "0.8 km",
      description: "Autentisk Pad Thai med räkor och färska böngroddar"
    }
  ];

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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Vad har du lust på?"
                    value={filters.query}
                    onChange={(e) => setFilters({...filters, query: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                </div>
                <div className="md:col-span-4 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Avhämtningsadress"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                </div>
                <div className="md:col-span-3">
                  <Button size="lg" className="w-full py-4 text-lg font-semibold">
                    Hitta mat
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDishes.map((dish) => (
              <Card key={dish.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-foreground">{dish.name}</h3>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {dish.price} kr
                      </Badge>
                    </div>
                    
                    <p className="text-primary text-sm mb-2">av {dish.chef}</p>
                    
                    <p className="text-muted-foreground text-sm mb-4">{dish.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{dish.rating}</span>
                        <span className="text-sm text-muted-foreground">({dish.reviews})</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {dish.readyIn}
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          {dish.distance}
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Beställ för avhämtning
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

export default PickupPage;