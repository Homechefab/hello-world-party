import { Shield, FileCheck, Users, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SecurityInsurance = () => {
  const securityFeatures = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Verifierade kockar",
      description: "Alla kockar som får tillgång till ditt kök genomgår grundlig bakgrundskontroll och kompetensbedömning."
    },
    {
      icon: <FileCheck className="w-8 h-8 text-primary" />,
      title: "Certifierad säkerhet",
      description: "Alla kockar har giltiga livsmedelshygien-certifikat och genomgått vår säkerhetsutbildning."
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Smart köksskydd",
      description: "IoT-baserade låssystem och övervakning som skyddar din utrustning dygnet runt."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Totalförsäkring",
      description: "Komplett försäkringsskydd för ditt kök, utrustning och verksamhet utan extra kostnad."
    }
  ];

  const insuranceCoverage = [
    "Köksutrustning och inventarier täckta upp till 5 miljoner kronor",
    "Ansvarsskydd om kocken orsakar skador på tredje part",
    "Täcker brand, stöld, vattenskador och vandalism",
    "Hygienskador och kontaminering av livsmedel",
    "Inkomstbortfall om köket blir oanvändbart",
    "Juridisk hjälp vid tvister med kockar eller myndigheter",
    "24/7 skadereglering med dedicerad kökspartner-support",
    "Ingen självrisk - du betalar ingenting vid godkända skador"
  ];

  const safetyProtocols = [
    "Kockar genomgår obligatorisk säkerhetsintroduktion för ditt kök",
    "Pre-check av all utrustning innan användning startar",
    "Detaljerad rengöringschecklista som måste följas",
    "Brandskyddsutbildning och kännedom om utrymningsvägar",
    "Tillgång till första hjälpen-kit och säkerhetsutrustning",
    "Real-time övervakning via säkerhetskameror och sensorer",
    "Direkt kontakt med både dig och vårt supportteam",
    "Månatlig säkerhetsuppdatering och kompetenskontroll"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Säkerhet & Försäkring
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Som kökspartner får du komplett trygghet. Vi skyddar ditt kök med avancerad säkerhet och totalförsäkring som inte kostar dig något extra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="text-center border-2 hover:border-primary transition-all duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-warm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Försäkringsskydd</CardTitle>
              </div>
              <CardDescription>
                Totalförsäkring utan extra kostnad som skyddar ditt kök, utrustning och verksamhet under uthyrning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {insuranceCoverage.map((coverage, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{coverage}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Säkerhetsprotokoll</CardTitle>
              </div>
              <CardDescription>
                Säkerhetsrutiner som våra verifierade kockar följer för att skydda ditt kök och utrustning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {safetyProtocols.map((protocol, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{protocol}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-warm rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Är du redo att hyra ut ditt kök säkert?
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Gå med i vårt nätverk av kökspartners och tjäna extra intäkter med fullständig trygghet.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/kitchen-partner/register">
              Registrera ditt kök
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityInsurance;