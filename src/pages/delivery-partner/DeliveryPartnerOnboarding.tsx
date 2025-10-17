import { useState } from "react";
import { Bike, Clock, CreditCard, CheckCircle, Star, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  age: string;
  vehicle: string;
  experience: string;
  availability: string[];
  areas: string[];
}

const DeliveryPartnerOnboarding = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<ApplicationForm>({
    name: "",
    email: "",
    phone: "",
    age: "",
    vehicle: "",
    experience: "",
    availability: [],
    areas: []
  });

  const benefits = [
    {
      icon: Clock,
      title: "Flexibla arbetstider",
      description: "Jobba när det passar dig - kvällar, helger eller fulla dagar"
    },
    {
      icon: CreditCard,
      title: "Konkurrenskraftig ersättning",
      description: "20-35 kr per leverans plus tips från nöjda kunder"
    },
    {
      icon: Bike,
      title: "Använd ditt eget fordon",
      description: "Cykel, moped, bil - vi välkomnar alla transportmedel"
    },
    {
      icon: Star,
      title: "Bonussystem",
      description: "Extra ersättning för snabba leveranser och höga betyg"
    }
  ];

  const vehicleOptions = [
    { id: "bike", label: "Cykel", icon: "🚲" },
    { id: "ebike", label: "Elcykel", icon: "⚡" },
    { id: "moped", label: "Moped", icon: "🛵" },
    { id: "car", label: "Bil", icon: "🚗" }
  ];

  const availabilityOptions = [
    "Måndag-Fredag lunch (11-14)",
    "Måndag-Fredag kväll (17-21)",
    "Helger lunch (11-15)",
    "Helger kväll (17-22)"
  ];

  const areaOptions = [
    "Stockholm Centrum",
    "Södermalm",
    "Östermalm",
    "Vasastan",
    "Norrmalm",
    "Gamla Stan"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ansökan mottagen!",
      description: "Vi återkommer inom 2-3 arbetsdagar med information om nästa steg.",
    });
    setCurrentStep(4);
  };

  const toggleAvailability = (option: string) => {
    setForm(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option]
    }));
  };

  const toggleArea = (area: string) => {
    setForm(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area]
    }));
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tack för din ansökan!
            </h2>
            <p className="text-muted-foreground mb-6">
              Vi har mottagit din ansökan om att bli leveranspartner. Du kommer att höra från oss inom 2-3 arbetsdagar.
            </p>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Tillbaka till startsidan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Truck className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bli Homechef delivery-partner
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Tjäna pengar genom att leverera hemlagad mat till hungriga kunder i din stad
            </p>
            <div className="flex items-center justify-center gap-4 text-white/80">
              <span>20-35 kr per leverans</span>
              <span>•</span>
              <span>Flexibla arbetstider</span>
              <span>•</span>
              <span>Använd ditt eget fordon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Varför jobba med oss?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vi erbjuder bästa villkoren för leveranspartners i Sverige
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={benefit.title} className="h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm flex-grow">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ansök nu
              </h2>
              <p className="text-muted-foreground">
                Steg {currentStep} av 3 - Fyll i dina uppgifter
              </p>
              <div className="w-full bg-border rounded-full h-2 mt-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Personliga uppgifter
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Fullständigt namn *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({...form, name: e.target.value})}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Förnamn Efternamn"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            E-post *
                          </label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="din@email.se"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Telefonnummer *
                          </label>
                          <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) => setForm({...form, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="070-123 45 67"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ålder *
                        </label>
                        <select
                          required
                          value={form.age}
                          onChange={(e) => setForm({...form, age: e.target.value})}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Välj åldersgrupp</option>
                          <option value="18-25">18-25 år</option>
                          <option value="26-35">26-35 år</option>
                          <option value="36-45">36-45 år</option>
                          <option value="46+">46+ år</option>
                        </select>
                      </div>

                      <Button 
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-full"
                        disabled={!form.name || !form.email || !form.phone || !form.age}
                      >
                        Nästa steg <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Fordon och erfarenhet
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-4">
                          Vilket fordon använder du? *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {vehicleOptions.map((vehicle) => (
                            <button
                              key={vehicle.id}
                              type="button"
                              onClick={() => setForm({...form, vehicle: vehicle.id})}
                              className={`p-4 rounded-lg border-2 transition-all text-center ${
                                form.vehicle === vehicle.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="text-2xl mb-2">{vehicle.icon}</div>
                              <div className="font-medium">{vehicle.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Tidigare erfarenhet av leveranser
                        </label>
                        <select
                          value={form.experience}
                          onChange={(e) => setForm({...form, experience: e.target.value})}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Välj erfarenhetsnivå</option>
                          <option value="none">Ingen erfarenhet</option>
                          <option value="some">Lite erfarenhet (1-6 månader)</option>
                          <option value="experienced">Erfaren (6+ månader)</option>
                          <option value="professional">Professionell leverantör (2+ år)</option>
                        </select>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1"
                        >
                          Tillbaka
                        </Button>
                        <Button 
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="flex-1"
                          disabled={!form.vehicle}
                        >
                          Nästa steg <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Tillgänglighet och områden
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-4">
                          När kan du jobba? *
                        </label>
                        <div className="space-y-2">
                          {availabilityOptions.map((option) => (
                            <label key={option} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.availability.includes(option)}
                                onChange={() => toggleAvailability(option)}
                                className="w-4 h-4 text-primary"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-4">
                          Vilka områden kan du leverera i? *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {areaOptions.map((area) => (
                            <button
                              key={area}
                              type="button"
                              onClick={() => toggleArea(area)}
                              className={`p-2 rounded-lg border text-sm transition-all ${
                                form.areas.includes(area)
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="flex-1"
                        >
                          Tillbaka
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1"
                          disabled={form.availability.length === 0 || form.areas.length === 0}
                        >
                          Skicka ansökan
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveryPartnerOnboarding;