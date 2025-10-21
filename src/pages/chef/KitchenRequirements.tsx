import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle,
  AlertCircle,
  Home,
  Users,
  Thermometer,
  Droplets,
  ArrowRight,
  Phone,
  Mail,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import approvedKitchenImage from "@/assets/swedish-villa-kitchen-realistic.jpg";

const KitchenRequirements = () => {
  const basicRequirements = [
    "Separering mellan verksamhet och privat användning - i tid eller rum",
    "Handhygien - möjlighet att tvätta händer mellan olika moment",
    "Rutiner för sjukdom - vad som gäller när någon i hemmet är sjuk", 
    "Rengöringsrutiner för redskap, ytor och utrustning",
    "Rutiner för familjemedlemmar och husdjur under verksamhet",
    "Tillräckligt med ytor för att separera råvaror och färdiga produkter",
    "Lämplig utrustning för temperaturkontroll och hygien",
    "HACCP-analys av risker i din specifika verksamhet",
    "Extra noggrannhet vid hantering av fisk, kött och animaliska produkter",
    "Rutiner för arbetskläder, kökshanddukar och städmaterial",
    "Vattenkvalitet - extra rutiner vid egen brunn"
  ];

  const equipmentNeeds = [
    {
      icon: Thermometer,
      title: "Temperaturkontroll",
      items: ["Termometer för stektermperatur", "Kyl/frys-termometer", "Värmeskåp eller värmelampor"]
    },
    {
      icon: Droplets,
      title: "Hygien & Rengöring", 
      items: ["Handtvättställe med varmt vatten", "Desinfektionsmedel", "Engångshandskar och förkläden"]
    },
    {
      icon: Shield,
      title: "Säkerhetsutrustning",
      items: ["Brandsläckare", "Första hjälpen-kit", "Skyddskläder"]
    },
    {
      icon: Home,
      title: "Köksutrustning",
      items: ["Separata skärbrädor", "Professionella knivar", "Lämpliga köksmaskiner"]
    }
  ];

  const documentationSteps = [
    {
      step: 1,
      title: "Planera ditt kök",
      description: "Rita upp kökets layout och planera arbetsflöden för att undvika korskontaminering"
    },
    {
      step: 2, 
      title: "Skapa rutiner",
      description: "Dokumentera alla hygien- och säkerhetsrutiner i skriftlig form"
    },
    {
      step: 3,
      title: "HACCP-analys",
      description: "Genomför en riskanalys av alla kritiska kontrollpunkter i din verksamhet"
    },
    {
      step: 4,
      title: "Ansök om tillstånd",
      description: "Kontakta din kommun för att ansöka om livsmedelstillstånd"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Kökskrav
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Krav för ditt kök
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              För att sälja mat från ditt kök måste det uppfylla vissa krav. 
              Här hittar du all information du behöver.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chef/kitchen-assessment">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Börja anpassa ditt kök
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Ladda ner checklista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Kitchen Example */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Kitchen Image */}
            <div className="relative">
              <img 
                src={approvedKitchenImage} 
                alt="Exempel på godkänt kök enligt kommunala krav"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Godkänt kök
              </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-semibold">Kommunala krav</h3>
                </div>
                
                <div className="space-y-4">
                  {basicRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{requirement}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-200/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Enligt livsmedelslagstiftningen
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        "Det måste finnas ordentlig separation mellan det som tillhör din livsmedelsverksamhet 
                        och det som hör till dina normala hushållsaktiviteter. I vissa fall kan separering ske i tid, 
                        förutsatt att du har goda rutiner för detta."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Requirements */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vad behöver du ha?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Grundläggande utrustning du behöver i ditt kök
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {equipmentNeeds.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-primary/10">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Så här får du ditt kök godkänt</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Steg för steg till godkänt kök
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {documentationSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Behöver du hjälp?</CardTitle>
              <CardDescription>
                Vi hjälper dig få ditt kök godkänt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Gratis konsultation</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Personlig rådgivning</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Hjälp med ansökan</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chef/application">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    Boka gratis konsultation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Ring oss: 08-123 45 67
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  kok@homechef.se
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default KitchenRequirements;