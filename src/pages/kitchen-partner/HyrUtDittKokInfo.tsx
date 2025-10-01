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
  Star,
  Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { HyrUtDittKok } from "./HyrUtDittKok";
import rentKitchenImage from "@/assets/service-rent-kitchen.jpg";

const HyrUtDittKokInfo = () => {
  const { user } = useAuth();
  const { user: roleUser } = useRole();
  const isKitchenPartner = roleUser?.role === 'kitchen_partner';

  // Om användaren är inloggad och är kökspartner, visa dashboarden
  if (user && isKitchenPartner) {
    return <HyrUtDittKok />;
  }

  // Annars visa informationssidan
  const benefits = [
    {
      icon: DollarSign,
      title: "Extra intäkter",
      description: "Tjäna 150-500 kr per timme när du inte använder ditt kök"
    },
    {
      icon: Clock,
      title: "Flexibla tider",
      description: "Du bestämmer helt själv när ditt kök är tillgängligt"
    },
    {
      icon: Shield,
      title: "Fullständig försäkring",
      description: "Alla bokningar täcks av vårt omfattande försäkringsskydd"
    },
    {
      icon: Users,
      title: "Verifierade kockar",
      description: "Alla våra kockar är kvalificerade och bakgrundskontrollerade"
    }
  ];

  const requirements = [
    "Kommersiellt godkänt kök",
    "Gällande livsmedelstillstånd",
    "Professionell utrustning",
    "Tillgång till rengöring",
    "Säker miljö"
  ];

  const steps = [
    {
      title: "1. Registrera ditt kök",
      description: "Fyll i information om ditt kök, ladda upp bilder och ange tillgänglighet"
    },
    {
      title: "2. Verifiering",
      description: "Vi granskar ditt kök och bekräftar att det uppfyller våra krav"
    },
    {
      title: "3. Sätt ditt pris",
      description: "Bestäm vad du vill ta betalt per timme för ditt kök"
    },
    {
      title: "4. Börja tjäna",
      description: "Kockar kan nu boka ditt kök och du får betalt automatiskt"
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
            Maximera intäkterna från ditt kök genom att hyra ut till kvalificerade kockar när du inte använder det
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/kitchen-partner/register">
                Kom igång nu
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black">
              Läs mer nedan
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

      {/* Requirements Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Vad krävs för att hyra ut ditt kök?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                För att säkerställa kvalitet och säkerhet har vi vissa grundkrav för alla kök i vårt nätverk.
              </p>
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Framgångsexempel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Restaurang Svea, Stockholm</h4>
                      <p className="text-sm text-muted-foreground">Hyrer ut sitt kök vardagar 14-18</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">8,500 kr</p>
                        <p className="text-sm text-muted-foreground">Månadsinkomst</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">4.8/5</p>
                        <p className="text-sm text-muted-foreground">Kockbetyg</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Så här fungerar det
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enkelt och säkert - från registrering till utbetalning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={step.title} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Vad kan du tjäna?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">150-250 kr</div>
                <p className="text-muted-foreground">Per timme (mindre kök)</p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary">
              <CardContent className="p-6">
                <Badge className="mb-4">Mest populärt</Badge>
                <div className="text-3xl font-bold text-primary mb-2">300-400 kr</div>
                <p className="text-muted-foreground">Per timme (standardkök)</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">450-500+ kr</div>
                <p className="text-muted-foreground">Per timme (premiumkök)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Redo att börja tjäna på ditt kök?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Registrera dig idag och börja ta emot bokningar redan imorgon
          </p>
          <Button size="lg" variant="secondary">
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