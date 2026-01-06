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
  
  CreditCard,
  Target,
  Building,
  Building2,
  Landmark
} from "lucide-react";
import { Link } from "react-router-dom";
import RestaurantFAQ from "@/components/services/RestaurantFAQ";
import SavingsCalculator from "@/components/restaurant/SavingsCalculator";

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
      icon: Shield,
      title: "Trygg plattform",
      description: "Säker beställningshantering och support"
    },
    {
      icon: CreditCard,
      title: "Snabba utbetalningar",
      description: "Pengarna kommer in direkt på ert konto"
    }
  ];

  const pricingPlans = [
    {
      name: "Liten restaurang",
      price: "5 399",
      icon: Building,
      description: "Perfekt för mindre restauranger och kaféer",
      features: [
        "Upp till 50 rätter i menyn",
        "Grundläggande statistik",
        "E-postsupport",
        "Restaurangprofil",
        "Beställningshantering"
      ],
      popular: false
    },
    {
      name: "Medelstor restaurang",
      price: "13 499",
      icon: Building2,
      description: "För etablerade restauranger med hög omsättning",
      features: [
        "Obegränsat antal rätter",
        "Avancerad statistik & rapporter",
        "Prioriterad support dygnet runt",
        "Marknadsföringsverktyg",
        "Flera användarkonton",
        "Kampanjhantering"
      ],
      popular: true
    },
    {
      name: "Stor restaurang",
      price: "26 999",
      icon: Landmark,
      description: "För restaurangkedjor och stora verksamheter",
      features: [
        "Allt i Medelstor",
        "Dedikerad kontoansvarig",
        "API-integration",
        "Anpassade lösningar",
        "Multi-location support",
        "Premium marknadsföring",
        "Prioriterad placering"
      ],
      popular: false
    }
  ];

  const services = [
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
            <Button variant="outline" size="lg" onClick={() => document.getElementById('fördelar')?.scrollIntoView({ behavior: 'smooth' })}>
              Läs mer om fördelarna
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="fördelar" className="py-16 bg-gradient-to-r from-green-500/5 to-emerald-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 bg-green-500/10 text-green-600 border-green-500/30">
              Spara upp till 70% jämfört med konkurrenterna
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Varför välja Homechef?</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Stora leveransplattformar som Foodora tar ofta 20–30% i provision per order. 
              Det innebär att ju mer ni säljer, desto mer betalar ni. Med vår fasta månadsavgift 
              behåller ni hela marginalen – oavsett hur många beställningar ni får.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
            {/* Competitors example */}
            <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <TrendingUp className="w-5 h-5" />
                  Provisionsmodell (konkurrenterna)
                </CardTitle>
                <CardDescription>30% provision per order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Exempel: 10 ordrar/dag à 200 kr</p>
                  <ul className="space-y-1">
                    <li>• 300 ordrar/månad × 200 kr = 60 000 kr omsättning</li>
                    <li>• 30% provision = <span className="font-bold text-red-600 dark:text-red-400">18 000 kr/månad</span></li>
                    <li>• Årskostnad: <span className="font-bold text-red-600 dark:text-red-400">216 000 kr</span></li>
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Ju mer ni säljer, desto mer betalar ni i avgifter.
                </p>
              </CardContent>
            </Card>

            {/* Homechef example */}
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Shield className="w-5 h-5" />
                  Fast månadsavgift (Homechef)
                </CardTitle>
                <CardDescription>Ingen provision – behåll hela marginalen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Samma exempel: 10 ordrar/dag</p>
                  <ul className="space-y-1">
                    <li>• Fast pris från <span className="font-bold text-green-600 dark:text-green-400">5 399 kr/månad</span></li>
                    <li>• Årskostnad: <span className="font-bold text-green-600 dark:text-green-400">64 788 kr</span></li>
                    <li>• <span className="font-bold text-green-600 dark:text-green-400">Besparing: ~151 000 kr/år</span></li>
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Ju mer ni säljer, desto mer tjänar NI – inte plattformen.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-card border rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="font-semibold text-lg mb-4 text-center">Fördelar med fast månadsavgift</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Förutsägbar kostnad</p>
                  <p className="text-sm text-muted-foreground">Inga överraskningar – samma pris varje månad</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Högre lönsamhet</p>
                  <p className="text-sm text-muted-foreground">Behåll hela marginalen på varje order</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Incitament att växa</p>
                  <p className="text-sm text-muted-foreground">Mer försäljning = mer vinst för er</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">70% billigare</p>
                  <p className="text-sm text-muted-foreground">I genomsnitt jämfört med provisionsmodeller</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="mt-12 max-w-2xl mx-auto">
            <SavingsCalculator />
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

      {/* Pricing Plans */}
      <section id="prisplaner" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 bg-green-500/10 text-green-600 border-green-500/30">
              I genomsnitt 70% billigare än konkurrenterna
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Våra prisplaner</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fast månadskostnad - ingen provision på era försäljningar. 
              Ni behåller hela marginalen på varje order.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105 z-10' 
                    : 'border-border/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Mest populär
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    plan.popular 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary/10'
                  }`}>
                    <plan.icon className={`w-7 h-7 ${plan.popular ? '' : 'text-primary'}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> kr/mån</span>
                  </div>
                  <ul className="space-y-3 text-left mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-primary' : 'text-green-500'
                        }`} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link to="/restaurant/apply">
                      Kom igång
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="våra-tjänster" className="py-16">
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

      {/* How It Works */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tre steg till start</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Så enkelt börjar ni sälja er mat via Homechef.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-4">Ansök</h3>
              <p className="text-muted-foreground">
                Berätta om er restaurang och vilka rätter ni vill sälja
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-4">Granskning</h3>
              <p className="text-muted-foreground">
                Vi kollar tillstånd och kvalitet - tar max 2-3 dagar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
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
              Ring oss: 0734234686
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              info@homechef.nu
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