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
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const RestaurantServices = () => {
  const benefits = [
    {
      icon: Users,
      title: "Fler kunder",
      description: "Nå hundratals nya kunder som vill ha er mat hemma"
    },
    {
      icon: TrendingUp,
      title: "Mer försäljning",
      description: "Extra intäkter utan behov av fler bord"
    },
    {
      icon: Clock,
      title: "Full flexibilitet",
      description: "Ni styr själva när och hur mycket ni vill sälja"
    },
    {
      icon: Shield,
      title: "Trygg betalning",
      description: "Pengarna betalas direkt till ert konto"
    }
  ];

  const features = [
    "Egen restaurangprofil med menyer",
    "Beställningshantering i realtid",
    "Integrerat betalningssystem",
    "Kundrecensioner och betyg",
    "Marknadsföring på plattformen",
    "Dedikerad restaurangsupport"
  ];

  const requirements = [
    "Giltigt restaurangtillstånd",
    "HACCP-certifiering",
    "Försäkring för livsmedelsverksamhet",
    "Kapacitet för hemkörning",
    "Kvalitetssäkrade recept"
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        {/* Hero Section for Restaurants */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Store className="w-4 h-4 mr-2" />
            För Restauranger
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Anslut din restaurang till Homechef
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Utöka er verksamhet med hemkörning och nå nya kunder. 
            Behåll er kvalitet - vi hjälper er med resten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Link to="/restaurant/apply">
                Ansök som restaurangpartner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/restaurant/partnership">
                Läs mer om fördelarna
              </Link>
            </Button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-primary/10">
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

        {/* Features and Requirements */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* What's Included */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Vad ingår i partnerskapet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Krav för att bli partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Så här fungerar det</CardTitle>
            <CardDescription>Enkla steg för att komma igång som restaurangpartner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Ansök</h3>
                <p className="text-muted-foreground text-sm">
                  Fyll i ansökan med information om din restaurang och menyer
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Godkännande</h3>
                <p className="text-muted-foreground text-sm">
                  Vi granskar din ansökan och kontrollerar tillstånd och certifieringar
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Börja sälja</h3>
                <p className="text-muted-foreground text-sm">
                  Skapa din profil, ladda upp menyer och börja ta emot beställningar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Har du frågor?</CardTitle>
            <CardDescription>
              Kontakta oss om ni har frågor om partnerskapet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Ring oss: 08-123 45 67
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                restaurants@homechef.se
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RestaurantServices;