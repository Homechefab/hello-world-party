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
    }
  ];

  const goodToHave = [
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
      title: "HACCP-rutiner (Hazard Analysis and Critical Control Points)",
      description: "Enligt EU-förordning 852/2004 måste du följa systematiska hygienrutiner för temperaturkontroll, rengöring och dokumentation av alla moment i matlagningen. Detta är ett obligatoriskt krav för alla som hanterar livsmedel.",
      icon: Shield,
      details: [
        "Identifiera kritiska kontrollpunkter i din matlagning",
        "Dokumentera temperaturmätningar för kyl, frys och upphettning",
        "Bevara journaler över alla åtgärder för att kontrollera faror",
        "Upprätta rutiner för rengöring och desinficering"
      ]
    },
    {
      title: "Temperaturkontroll och kylkedjan",
      description: "Du måste upprätthålla kylkedjan för livsmedel som inte kan lagras säkert vid rumstemperatur. Temperaturen måste kunna kontrolleras och registreras.",
      icon: Thermometer,
      details: [
        "Tillräcklig kyl- och fryskapacitet för förvaring",
        "Termometrar för att kontrollera temperatur",
        "Dokumentation av temperaturer dagligen",
        "Frysta livsmedel måste hållas frysta under hela lagringen"
      ]
    },
    {
      title: "Lokalkrav enligt EU-förordningen",
      description: "Köket måste vara utformat så att det möjliggör god livsmedelshygien, skydd mot kontaminering och effektiv rengöring.",
      icon: Building2,
      details: [
        "Separata ytor för rå och tillagad mat",
        "Golv, väggar och tak ska vara lätta att rengöra och desinficera",
        "Adekvat belysning och ventilation",
        "Handtvättställ med varmt och kallt vatten, separat från diskställ",
        "Tillräckligt arbetsutrymme för hygienisk hantering",
        "Skydd mot skadedjur och insekter"
      ]
    },
    {
      title: "Utrustning och ytskydd",
      description: "All utrustning som kommer i kontakt med mat måste vara av lämpligt material och hållas ren.",
      icon: ClipboardCheck,
      details: [
        "Ytor av släta, tvättbara, korrosionsbeständiga och giftfria material",
        "Utrustning ska vara lätt att rengöra och desinficera",
        "Skärbrädor av plast eller annat lämpligt material",
        "Separata verktyg för rå och tillagad mat"
      ]
    },
    {
      title: "Vattenförsörjning och sanitet",
      description: "Adekvat tillgång till dricksvatten och sanitära utrymmen enligt förordningen.",
      icon: Droplets,
      details: [
        "Tillgång till varmt och kallt dricksvatten",
        "Handtvättställ med tvål och engångshanddukar",
        "Toalett får inte vara direkt förbunden med utrymmen där mat hanteras",
        "Adekvata avlopp för att undvika kontaminering"
      ]
    },
    {
      title: "Spårbarhet och dokumentation",
      description: "Du måste kunna spåra alla ingredienser och dokumentera dina rutiner enligt EU-förordningen.",
      icon: FileText,
      details: [
        "Föra journal över ingredienser med leverantör och bäst-före-datum",
        "Dokumentera alla åtgärder för att kontrollera faror",
        "Bevara journaler under lämplig tid",
        "Ha uppgifterna tillgängliga för behörig myndighet vid inspektion"
      ]
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

        {/* Tillstånd och krav */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Tillstånd och krav
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

        {/* Bra att ha */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Bra att ha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goodToHave.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Informationsvideo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Vägledning om livsmedelsverksamhet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Se information om hur du startar livsmedelsverksamhet och ansökningsprocessen från kommunen
            </p>
            <video 
              controls 
              className="w-full rounded-lg"
              preload="metadata"
            >
              <source src="/videos/municipality-guide.mp4" type="video/mp4" />
              Din webbläsare stöder inte videouppspelning.
            </video>
          </CardContent>
        </Card>

        {/* Hygienrutiner och utrustning */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Hygienrutiner och utrustning (enligt EU-förordning 852/2004)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Kraven nedan baseras på EU:s förordning om livsmedelshygien som är direkt tillämplig i Sverige.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {hygieneRequirements.map((req, index) => {
              const IconComponent = req.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{req.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{req.description}</p>
                    {req.details && (
                      <ul className="space-y-1.5 ml-4">
                        {req.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
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
