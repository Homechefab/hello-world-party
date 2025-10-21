import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChefHat, Calendar, Shield, CheckCircle, Utensils } from "lucide-react";
import cateringImage from "@/assets/catering-service.jpg";

const services = [
  {
    icon: Users,
    title: "Företagsevent",
    description: "Leverera catering till företagsmöten, konferenser och firmafester"
  },
  {
    icon: Calendar,
    title: "Privata fester",
    description: "Cateringtjänster för bröllop, födelsedagar och andra privata tillställningar"
  },
  {
    icon: Utensils,
    title: "Löpande avtal",
    description: "Regelbundna cateringuppdrag för företag och organisationer"
  },
  {
    icon: ChefHat,
    title: "Buffé & servering",
    description: "Kompletta lösningar med mat, upplägg och eventuell servering"
  }
];

const benefits = [
  "Du sätter själv priser och menyer",
  "Betalt direkt efter leverans",
  "Hjälp med marknadsföring och bokningar",
  "Allt från 10 till 100+ portioner",
  "Bygga återkommande kundrelationer",
  "Försäkring och support ingår"
];

const requirements = [
  "Godkänt kök enligt kommunens krav",
  "Registrerad näringsverksamhet",
  "Hygienkunskaper och livsmedelscertifikat",
  "Kapacitet att hantera större volymer",
  "Transportlösning för leverans"
];

const CateringServices = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src={cateringImage} 
          alt="Catering services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Tjäna pengar på catering
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Ta cateringuppdrag för företag och privatpersoner
              </p>
              <Link to="/chef/application">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Kom igång nu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Olika typer av uppdrag
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Välj vilka typer av catering som passar dig
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.title} className="hover:shadow-card transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Därför ska du sälja catering hos oss
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Detta behöver du
              </h2>
              <p className="text-muted-foreground">
                För att sälja catering krävs följande
              </p>
            </div>
            
            <div className="space-y-4">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground">{requirement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Så fungerar det
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Ansök", desc: "Fyll i ansökan och godkänn ditt kök" },
              { step: 2, title: "Skapa menyer", desc: "Lägg upp dina cateringmenyer och priser" },
              { step: 3, title: "Ta emot bokningar", desc: "Kunder bokar direkt via plattformen" },
              { step: 4, title: "Leverera & tjäna", desc: "Leverera maten och få betalt" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Redo att komma igång med catering?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Ansök idag och börja ta emot beställningar
          </p>
          <Link to="/chef/application">
            <Button size="lg" variant="secondary">
              Ansök nu
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CateringServices;
