// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, ClipboardCheck, Building2, Shield, Thermometer, Droplets } from "lucide-react";
import MunicipalitySearch from "@/components/MunicipalitySearch";

const MunicipalityRequirements = () => {
  const requirements = [
    {
      title: "Tillstånd från kommunen",
      description: "Du måste ansöka om tillstånd hos din lokala kommun för att bedriva livsmedelsverksamhet från hemmet. Kontakta miljö- och hälsoskyddsförvaltningen.",
      icon: Building2
    },
    {
      title: "Registrerad näringsverksamhet",
      description: "Registrera din verksamhet hos Skatteverket och Bolagsverket för att kunna fakturera kunder lagligt.",
      icon: FileText
    },
    {
      title: "Spårbarhetssystem",
      description: "Dokumentera alla ingredienser med leverantör och bäst-före-datum för att kunna spåra eventuella problem.",
      icon: ClipboardCheck
    }
  ];

  const hygieneRequirements = [
    {
      title: "HACCP-rutiner",
      description: "Du måste följa systematiska hygienrutiner för temperaturkontroll, rengöring och dokumentation av alla moment i matlagningen.",
      icon: Shield
    },
    {
      title: "Godkänt kök",
      description: "Köket måste inspekteras och godkännas av kommunen. Det ska ha separata ytor för rå och tillagad mat, samt tillräcklig kyl- och fryskapacitet.",
      icon: Thermometer
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Krav för att bli kock
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            För att sälja mat via Homechef måste du uppfylla följande krav enligt svensk livsmedelslagstiftning
          </p>
        </div>

        {/* Tillstånd och registrering */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Tillstånd och registrering
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirements.map((req, index) => {
              const IconComponent = req.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{req.title}</h3>
                    <p className="text-sm text-muted-foreground">{req.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Hygienrutiner och utrustning */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Hygienrutiner och utrustning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hygieneRequirements.map((req, index) => {
              const IconComponent = req.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{req.title}</h3>
                    <p className="text-sm text-muted-foreground">{req.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Viktigt att veta */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Viktigt att veta</h3>
                <p className="text-sm text-muted-foreground">
                  Processen för att få alla tillstånd kan ta <strong>4-8 veckor</strong>. Vi hjälper dig genom hela processen och du kan börja din ansökan redan nu. Kontakta oss för vägledning!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Municipality Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              Intresserad av att sälja med hemifrån men saknar tillstånd från kommunen?
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sök på din adress för att få direktlänkar till ansökningsblanketter och e-tjänster för livsmedelsregistrering från din kommun.
            </p>
          </CardHeader>
          <CardContent>
            <MunicipalitySearch />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MunicipalityRequirements;
