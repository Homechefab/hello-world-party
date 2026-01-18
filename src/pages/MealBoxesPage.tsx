import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Star, MapPin, Building2, ChefHat, Calendar, Search, Cake, Heart, Briefcase, UtensilsCrossed, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useProviders } from "@/hooks/useProviders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MealBoxesPage = () => {
  const [locationQuery, setLocationQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyPostalCode, setNotifyPostalCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotifyForm, setShowNotifyForm] = useState(false);

  const { data: providers = [], isLoading } = useProviders({
    location: searchLocation,
  });

  const quickFilters = [
    { label: "Födelsedag", value: "birthday", icon: Cake },
    { label: "Årsdag", value: "anniversary", icon: Heart },
    { label: "Affärsmiddag", value: "business", icon: Briefcase },
    { label: "Middag", value: "dinner", icon: UtensilsCrossed },
  ];

  const handleQuickFilter = (value: string) => {
    if (selectedQuickFilter === value) {
      setSelectedQuickFilter(null);
      setEventType("");
    } else {
      setSelectedQuickFilter(value);
      setEventType(value);
    }
  };

  const handleSearch = () => {
    setSearchLocation(locationQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-[400px] flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white z-10 px-4 w-full max-w-4xl mx-auto py-12">
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
                  className="pl-10 bg-white border-border text-foreground"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                  className="pl-10 bg-white border-border text-foreground"
                />
              </div>

              {/* Event Type Select */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="pl-10 bg-white border-border text-foreground">
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
              <Button variant="food" size="default" className="w-full" onClick={handleSearch}>
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
                    className={`rounded-full ${selectedQuickFilter === filter.value ? "" : "bg-white hover:bg-gray-50 text-foreground border-border"}`}
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
            {isLoading ? "Söker..." : `Visar ${providers.length} leverantör${providers.length !== 1 ? 'er' : ''}`}
            {searchLocation && ` i ${searchLocation}`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Providers Grid */}
        {!isLoading && providers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {providers.map((provider) => (
              <Link key={provider.id} to={`/chef/${provider.id}`}>
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
                          {provider.imageUrl ? (
                            <img 
                              src={provider.imageUrl} 
                              alt={provider.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : provider.type === "chef" ? (
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
                    {provider.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {provider.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm border-t pt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{provider.rating || "-"}</span>
                        <span className="text-muted-foreground">({provider.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Package className="w-4 h-4" />
                        <span>{provider.itemCount} rätter</span>
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
        )}

        {/* Empty State - CTA Buttons */}
        {!isLoading && providers.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              {searchLocation
                ? `Inga leverantörer hittades i "${searchLocation}"`
                : "Inga leverantörer registrerade än"
              }
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Vi arbetar på att få fler kockar och företag som säljer matlådor till ditt område.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button asChild variant="food" size="lg" className="w-full sm:w-auto">
                <Link to="/register-chef">Registrera dig som kock</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-foreground/20"
                onClick={() => setShowNotifyForm(true)}
              >
                Få notifiering när kockar finns
              </Button>
            </div>

            {/* Notification Form - shown when button clicked */}
            {showNotifyForm && (
              <div className="max-w-md mx-auto bg-card rounded-lg shadow-card p-6 mt-8">
                <h4 className="font-semibold text-lg mb-2">Få notifiering när kockar finns</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ange din e-post och postnummer så meddelar vi dig när leverantörer registrerar sig i ditt område.
                </p>
                <form 
                  className="flex flex-col gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!notifyEmail || !notifyPostalCode) {
                      toast.error("Fyll i både e-post och postnummer");
                      return;
                    }
                    
                    setIsSubmitting(true);
                    try {
                      const { error } = await supabase
                        .from("early_access_signups")
                        .insert({
                          email: notifyEmail,
                          postal_code: notifyPostalCode,
                        });
                      
                      if (error) {
                        if (error.code === "23505") {
                          toast.error("Denna e-postadress är redan registrerad");
                        } else {
                          throw error;
                        }
                      } else {
                        toast.success("Tack! Vi meddelar dig när kockar finns i ditt område.");
                        setNotifyEmail("");
                        setNotifyPostalCode("");
                        setShowNotifyForm(false);
                      }
                    } catch (error) {
                      console.error("Error signing up:", error);
                      toast.error("Något gick fel. Försök igen senare.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <Input
                    type="email"
                    placeholder="Din e-postadress"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    required
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="text"
                      placeholder="Ditt postnummer"
                      value={notifyPostalCode}
                      onChange={(e) => setNotifyPostalCode(e.target.value)}
                      className="sm:w-32"
                      required
                    />
                    <Button type="submit" variant="food" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Prenumerera"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!isLoading && providers.length > 0 && (
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