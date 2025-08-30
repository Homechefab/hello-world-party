import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  DollarSign, 
  Clock, 
  Shield, 
  Users, 
  CheckCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import rentKitchenImage from "@/assets/service-rent-kitchen.jpg";

const HyrUtDittKokInfo = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Extra intäkter",
      description: "Tjäna pengar på ditt kök när du inte använder det"
    },
    {
      icon: Clock,
      title: "Flexibla tider",
      description: "Du bestämmer när ditt kök är tillgängligt för uthyrning"
    },
    {
      icon: Shield,
      title: "Försäkringsskydd",
      description: "Alla bokningar täcks av vår försäkring"
    },
    {
      icon: Users,
      title: "Kvalitetskockar",
      description: "Alla kockar är verifierade och godkända av oss"
    }
  ];

  const steps = [
    {
      title: "Registrera ditt kök",
      description: "Fyll i information om ditt kök och ladda upp bilder"
    },
    {
      title: "Sätt ditt pris",
      description: "Bestäm vad du vill ta för att hyra ut ditt kök per timme"
    },
    {
      title: "Börja tjäna",
      description: "Kockar kan boka ditt kök och du får betalt automatiskt"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={rentKitchenImage} 
            alt="Restaurangkök"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Hyr ut ditt restaurangkök
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Maximera intäkterna från ditt restaurangkök genom att hyra ut till kvalificerade kockar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/kitchen-partner/register">
                Kom igång nu
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black">
              Läs mer
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Varför hyra ut ditt kök?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Få ut mer av din investering och hjälp lokala kockar att förverkliga sina drömmar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={benefit.title} className="text-center hover:shadow-card transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Så här fungerar det
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enkelt och säkert - från registrering till utbetalning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <Card key={step.title} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Våra kökspartners tjänar bra
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">150-500 kr</div>
                <p className="text-muted-foreground">Per timme i snitt</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">85%</div>
                <p className="text-muted-foreground">Nöjda kökspartners</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Support och service</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Redo att börja tjäna på ditt kök?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Registrera dig idag och börja ta emot bokningar redan imorgon
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/kitchen-partner/register">
              Registrera ditt kök nu
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HyrUtDittKokInfo;