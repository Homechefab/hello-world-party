import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  ChefHat,
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";


const PrivateChefServices = () => {
  const services = [
    {
      icon: Users,
      title: "Privata middagar",
      description: "Laga mat för personliga middagar i kundens hem"
    },
    {
      icon: Calendar,
      title: "Speciella evenemang",
      description: "Laga mat för bröllop, födelsedagar och företagsevent"
    },
    {
      icon: ChefHat,
      title: "Matlagningskurser",
      description: "Håll matlagningskurser hemma hos kunder"
    },
    {
      icon: Star,
      title: "Exklusiva menyer",
      description: "Anpassa menyer efter kundens önskemål"
    },
    {
      icon: BookOpen,
      title: "Recept",
      description: "Sälj recept och guider till dina följare"
    }
  ];

  const benefits = [
    "Du sätter själv priser och arbetstider",
    "Betalt direkt via plattformen",
    "Vi marknadsför dig mot våra kunder",
    "Personlig support när du behöver",
    "Bygg din egen kundbas"
  ];

  const requirements = [
    "Godkänt kök enligt kommunens krav",
    "Kunskap om egenkontroll och HACCP",
    "Eget företag (enskild firma eller aktiebolag)"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-4 h-4 mr-2" />
              Privatkock-tjänster
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Jobba som privatkock
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Laga mat hemma hos kunder för speciella tillfällen och personliga middagar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chef/application">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Kom igång som privatkock
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vad kan du erbjuda?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Olika sätt att jobba som privatkock
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-primary/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits and Requirements */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Benefits */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Fördelar med privatkocktjänster
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Krav för privatkockar
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
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="mb-16 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Så här fungerar det</CardTitle>
              <CardDescription>Enkla steg för att komma igång som privatkock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Skapa din profil</h3>
                  <p className="text-muted-foreground text-sm">
                    Ladda upp bilder, beskrivningar och prissättning för dina tjänster
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Ta emot bokningar</h3>
                  <p className="text-muted-foreground text-sm">
                    Kunder bokar dina tjänster direkt genom plattformen
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Leverera upplevelser</h3>
                  <p className="text-muted-foreground text-sm">
                    Skapa minnesvärda kulinariska upplevelser för dina kunder
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Redo att börja?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ansök idag och börja ta emot uppdrag som privatkock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chef/application">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Kom igång nu
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Ring oss: 08-123 45 67
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              privatkockar@homechef.se
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivateChefServices;