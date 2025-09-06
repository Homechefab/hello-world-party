import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Users, 
  TrendingUp, 
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const RestaurantPartnership = () => {
  const benefits = [
    {
      icon: Users,
      title: "Utöka din kundkrets",
      description: "Nå nya kunder som söker autentisk restaurangmat hemma"
    },
    {
      icon: TrendingUp,
      title: "Öka försäljningen",
      description: "Generera extra intäkter genom hemkörning"
    },
    {
      icon: Truck,
      title: "Enkel hemkörning",
      description: "Vi sköter leveransen eller du kan använda egna förare"
    },
    {
      icon: CreditCard,
      title: "Säkra betalningar",
      description: "Snabba och säkra betalningar direkt till ditt konto"
    }
  ];

  const services = [
    {
      icon: Truck,
      title: "Hemkörning för restauranger",
      description: "Professionell hemkörning av era rätter till kunder",
      features: ["Snabb leverans", "Temperaturkontroll", "Spårning i realtid"],
      id: "hemkörning"
    },
    {
      icon: Target,
      title: "Marknadsföring",
      description: "Vi marknadsför er restaurang på vår plattform",
      features: ["Synlighet på startsidan", "Riktad marknadsföring", "SEO-optimering"],
      id: "marknadsföring"
    },
    {
      icon: Shield,
      title: "Restaurangsupport",
      description: "Dedikerad support för restaurangpartners",
      features: ["24/7 support", "Teknisk hjälp", "Affärsrådgivning"],
      id: "support"
    },
    {
      icon: CreditCard,
      title: "Betalningslösningar",
      description: "Säkra och enkla betalningslösningar",
      features: ["Direktutbetalning", "Månadsrapporter", "Låga avgifter"],
      id: "betalningar"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6">
            <Store className="w-4 h-4 mr-2" />
            Restaurangpartnerskap
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Bli restaurangpartner
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Anslut din restaurang till Homechef och börja leverera era rätter direkt hem till kunder. 
            Öka er försäljning och nå nya målgrupper.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/restaurant/apply">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Ansök nu
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Läs mer om fördelarna
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fördelar med att bli partner</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upptäck fördelarna med att ansluta er restaurang till Sveriges största plattform för hemkörning.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="hemkörning" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Våra tjänster för restauranger</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vi erbjuder kompletta lösningar för restauranger som vill satsa på hemkörning.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" id={service.id || ""}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Så här fungerar det</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enkla steg för att komma igång som restaurangpartner på Homechef.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-4">Ansök som partner</h3>
              <p className="text-muted-foreground">
                Fyll i vår ansökan med information om er restaurang och era rätter
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-4">Godkännande</h3>
              <p className="text-muted-foreground">
                Vi granskar er ansökan och kontrollerar tillstånd och kvalitet
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-4">Börja leverera</h3>
              <p className="text-muted-foreground">
                Ladda upp er meny och börja ta emot beställningar för hemkörning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Redo att börja?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Anslut er restaurang idag och börja nå nya kunder genom hemkörning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/restaurant/apply">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Ansök som restaurangpartner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Ring oss: 08-123 45 67
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Mejla oss
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantPartnership;