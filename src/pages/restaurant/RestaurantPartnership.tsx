import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import RestaurantFAQ from "@/components/services/RestaurantFAQ";

const RestaurantPartnership = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elementId = decodeURIComponent(location.hash.substring(1));
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  const benefits = [
    {
      icon: Users,
      title: "Fler kunder",
      description: "Nå hundratals nya kunder som vill ha er mat hemma"
    },
    {
      icon: TrendingUp,
      title: "Mer försäljning",
      description: "Extra intäkter utan behov av större lokal"
    },
    {
      icon: Truck,
      title: "Smidig leverans",
      description: "Vi ordnar leveransen, eller använd era egna förare"
    },
    {
      icon: CreditCard,
      title: "Snabba utbetalningar",
      description: "Pengarna kommer in direkt på ert konto"
    }
  ];

  const services = [
    {
      icon: Truck,
      title: "Leverans",
      description: "Vi ser till att maten kommer fram snabbt och varm",
      features: ["Snabb leverans", "Rätt temperatur", "Spårning för kunden"],
      id: "hemkörning"
    },
    {
      icon: Target,
      title: "Marknadsföring",
      description: "Er restaurang visas för tusentals hungriga kunder",
      features: ["Synlighet på startsidan", "Marknadsföring i sociala medier", "SEO-optimering"],
      id: "marknadsföring"
    },
    {
      icon: Shield,
      title: "Support",
      description: "Vi finns här för er dygnet runt",
      features: ["Support via chatt", "Teknisk hjälp", "Tips för ökad försäljning"],
      id: "support"
    },
    {
      icon: CreditCard,
      title: "Betalningar",
      description: "Enkla och säkra betalningar varje månad",
      features: ["Direktutbetalning", "Tydliga rapporter", "Låga avgifter"],
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
            Börja leverera er mat hem till kunder i hela stan. 
            Öka omsättningen utan att utöka antalet bord.
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
            <h2 className="text-3xl font-bold mb-4">Därför ska ni bli partner</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vi är Sveriges största plattform för hemlagad mat - och vi vill ha med er.
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
      <section id="våra-tjänster" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vad vi hjälper er med</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Allt ni behöver för att lyckas med hemkörning - vi fixar detaljerna.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow scroll-mt-24" id={service.id || ""}>
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

      {/* Pricing Section */}
      <section id="priser" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">En enkel prismodell</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ingen provision – ni behåller hela intäkten från maten.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-accent p-6 text-center text-white">
                <p className="text-sm font-medium opacity-90 mb-1">Fast månadsavgift</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">3 999</span>
                  <span className="text-xl">kr/mån</span>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground mb-6">
                  Allt ni behöver för att sälja via Homechef
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Tillgång till appen</span>
                      <p className="text-sm text-muted-foreground">Komplett orderhantering och menyhantering</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Betalningslösning</span>
                      <p className="text-sm text-muted-foreground">Kort, Swish och Klarna – säkert via Stripe</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Synlighet & marknadsföring</span>
                      <p className="text-sm text-muted-foreground">Er restaurang visas för tusentals hungriga kunder</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Support dygnet runt</span>
                      <p className="text-sm text-muted-foreground">Vi finns här när ni behöver hjälp</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Statistik & rapporter</span>
                      <p className="text-sm text-muted-foreground">Se försäljning, populära rätter och trender</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="bg-secondary/50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium mb-1">Leverans betalas av kunden</p>
                    <p className="text-xs text-muted-foreground">
                      Fast leveransavgift som går direkt till budet – ingår ej i er månadsavgift
                    </p>
                  </div>
                </div>
                
                <Button asChild size="lg" className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <Link to="/restaurant/apply">
                    Kom igång nu
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Jämför med 20-30% provision på andra plattformar – hos oss blir det billigare ju mer ni säljer!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tre steg till start</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Så enkelt börjar ni sälja er mat via Homechef.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-4">Ansök</h3>
              <p className="text-muted-foreground">
                Berätta om er restaurang och vilka rätter ni vill sälja
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-4">Granskning</h3>
              <p className="text-muted-foreground">
                Vi kollar tillstånd och kvalitet - tar max 2-3 dagar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-4">Igång!</h3>
              <p className="text-muted-foreground">
                Ladda upp menyn och börja ta emot beställningar samma dag
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vill ni med?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ansök idag så hör vi av oss inom kort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Link to="/restaurant/apply">
                Ansök som restaurangpartner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
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

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <RestaurantFAQ />
        </div>
      </section>
    </div>
  );
};

export default RestaurantPartnership;