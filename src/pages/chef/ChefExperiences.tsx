import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  ChefHat,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Home,
  Utensils
} from "lucide-react";
import { Link } from "react-router-dom";
import experienceImage from "@/assets/experience-dining.jpg";

const ChefExperiences = () => {
  const experienceTypes = [
    {
      icon: Users,
      title: "Matlagningskurser",
      description: "Lär ut dina färdigheter i din hemmiljö",
      duration: "2-4 timmar",
      capacity: "4-8 personer"
    },
    {
      icon: Calendar,
      title: "Temamiddagar",
      description: "Skapa tematiska kulinariska upplevelser",
      duration: "3-5 timmar", 
      capacity: "6-12 personer"
    },
    {
      icon: ChefHat,
      title: "Gourmet-upplevelser",
      description: "Exklusiva flerservande måltider",
      duration: "4-6 timmar",
      capacity: "2-8 personer"
    },
    {
      icon: Utensils,
      title: "Vinprovningar",
      description: "Kombinera mat och vin för en fullständig upplevelse",
      duration: "3-4 timmar",
      capacity: "8-16 personer"
    }
  ];

  const benefits = [
    "Högre intäkter per gäst än vanlig matförsäljning",
    "Personlig interaktion med matälskare",
    "Dela din passion och kunskap",
    "Bygga en lojal kundbas",
    "Flexibla bokningar enligt ditt schema",
    "Marknadsföring till upplevelseintresserade"
  ];

  const requirements = [
    "Godkänt kök med kommunalt tillstånd",
    "Plats för att ta emot gäster hemma",
    "Presentationskunskaper och social kompetens",
    "Hygienbevis och livsmedelssäkerhet",
    "Kreativitet för att skapa unika upplevelser",
    "Grundläggande engelska för internationella gäster"
  ];

  const pricingExamples = [
    {
      type: "Matlagningskurs",
      price: "750-1200 kr/person",
      duration: "3 timmar",
      includes: "Material, recept, middag"
    },
    {
      type: "Temamiddag",
      price: "1200-1800 kr/person", 
      duration: "4 timmar",
      includes: "Välkomstdrink, 4-rätters, vin"
    },
    {
      type: "Gourmet-upplevelse",
      price: "1800-2500 kr/person",
      duration: "5 timmar", 
      includes: "Aperitif, 6-rätters, vinpairing"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Matupplevelser
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Skapa unika matupplevelser
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Förvandla ditt kök till en destination där gäster kan lära sig, smaka och uppleva matlagning på en helt ny nivå.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chef/application">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Starta dina upplevelser
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Olika typer av matupplevelser</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Välj den typ av upplevelse som passar dina färdigheter och intressen bäst
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {experienceTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-primary/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <type.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardDescription>{type.description}</CardDescription>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      {type.duration}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Users className="w-4 h-4" />
                      {type.capacity}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Examples */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Prisexempel</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Se vad andra kockar tar betalt för liknande upplevelser
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {pricingExamples.map((example, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{example.type}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{example.price}</div>
                  <CardDescription>{example.duration}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">Inkluderar: {example.includes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits and Requirements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Benefits */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Fördelar med matupplevelser
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
                  <Home className="w-5 h-5 text-primary" />
                  Vad krävs för att starta
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
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="mb-16 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Så här skapar du din första upplevelse</CardTitle>
              <CardDescription>Steg-för-steg guide för att komma igång</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Planera</h3>
                  <p className="text-muted-foreground text-sm">
                    Bestäm tema, meny och kapacitet
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Fotografera</h3>
                  <p className="text-muted-foreground text-sm">
                    Ta bilder på mat och miljö
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Publicera</h3>
                  <p className="text-muted-foreground text-sm">
                    Lägg upp din upplevelse på plattformen
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Välkomna</h3>
                  <p className="text-muted-foreground text-sm">
                    Ta emot dina första gäster
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
          <h2 className="text-3xl font-bold mb-4">Redo att skapa minnesvärda upplevelser?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Förvandla din passion för matlagning till unika upplevelser som gäster kommer att minnas för alltid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chef/application">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Skapa din första upplevelse
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Ring oss: 08-123 45 67
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              upplevelser@homechef.se
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChefExperiences;