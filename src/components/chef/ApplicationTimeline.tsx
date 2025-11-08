import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Euro, AlertCircle } from "lucide-react";
import { useState } from "react";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  timeframe: string;
  cost: string;
  status: "pending" | "active" | "completed";
  details: string[];
}

const ApplicationTimeline = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps: TimelineStep[] = [
    {
      id: 1,
      title: "Registrera näringsverksamhet",
      description: "Starta med att registrera din verksamhet hos Skatteverket",
      timeframe: "1-2 veckor",
      cost: "Gratis",
      status: "pending",
      details: [
        "Ansök om F-skattsedel hos Skatteverket",
        "Registrera som enskild firma eller aktiebolag",
        "Får tillbaka beslut inom 1-2 veckor",
        "Ingen avgift för registrering"
      ]
    },
    {
      id: 2,
      title: "Ansök om livsmedelstillstånd",
      description: "Kontakta din kommuns miljö- och hälsoskyddsförvaltning",
      timeframe: "2-3 veckor",
      cost: "1 555 kr (varierar mellan kommuner)",
      status: "pending",
      details: [
        "Kontakta miljöförvaltningen i din kommun",
        "Fyll i ansökningsblankett för livsmedelsverksamhet",
        "Bifoga beskrivning av verksamheten och lokalen",
        "Registreringsavgiften faktureras efter godkännande",
        "Avgiften kan variera beroende på kommunens taxa"
      ]
    },
    {
      id: 3,
      title: "Förbered HACCP-dokumentation",
      description: "Upprätta rutiner för livsmedelssäkerhet enligt EU-förordning 852/2004",
      timeframe: "1-2 veckor",
      cost: "Gratis (egen tid)",
      status: "pending",
      details: [
        "Identifiera kritiska kontrollpunkter i din matlagning",
        "Skapa rutiner för temperaturkontroll",
        "Upprätta rengöringsschema",
        "Dokumentera spårbarhet för ingredienser",
        "Förbered journaler för daglig temperaturloggning"
      ]
    },
    {
      id: 4,
      title: "Köksinspektion",
      description: "Miljöinspektör besöker och godkänner din verksamhetslokal",
      timeframe: "2-3 veckor",
      cost: "Ingår i registreringsavgiften",
      status: "pending",
      details: [
        "Miljöinspektören bokar tid för besök",
        "Köket inspekteras enligt EU-krav",
        "Kontroll av utrustning och hygienrutiner",
        "Eventuella brister måste åtgärdas",
        "Uppföljningsinspektion kan krävas vid brister"
      ]
    },
    {
      id: 5,
      title: "Teckna företagsförsäkring",
      description: "Skaffa lämplig ansvarsförsäkring för din verksamhet",
      timeframe: "1 vecka",
      cost: "Från 2 000 kr/år",
      status: "pending",
      details: [
        "Produktansvarsförsäkring (obligatorisk)",
        "Kontakta försäkringsbolag för offert",
        "Anpassa försäkringen efter din verksamhet",
        "Kostnaden varierar beroende på omsättning"
      ]
    },
    {
      id: 6,
      title: "Godkännande och start",
      description: "Ta emot formellt godkännande och börja sälja mat",
      timeframe: "1 vecka",
      cost: "Gratis",
      status: "pending",
      details: [
        "Få skriftligt beslut från miljöförvaltningen",
        "Registrera dig på Homechef-plattformen",
        "Skapa din meny och börja ta emot beställningar",
        "Regelbundna uppföljningsinspektioner kan göras"
      ]
    }
  ];

  const totalTimeframe = "4-8 veckor";
  const totalCost = "Ca 3 500-5 000 kr";

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Tidslinje för ansökningsprocessen
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total tid: <strong className="text-foreground">{totalTimeframe}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Euro className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total kostnad: <strong className="text-foreground">{totalCost}</strong></span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          {/* Timeline steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step indicator */}
                <div className="absolute left-0 w-12 h-12 bg-background flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center text-primary font-semibold">
                    {step.id}
                  </div>
                </div>

                {/* Step content */}
                <div className="ml-20">
                  <button
                    onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    className="w-full text-left p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{step.timeframe}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Euro className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{step.cost}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <AlertCircle className={`w-5 h-5 transition-transform ${expandedStep === step.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded details */}
                    {expandedStep === step.id && (
                      <div className="mt-4 pt-4 border-t">
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="mt-8 p-4 border-primary/20 bg-primary/5 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Tips:</strong> Du kan påbörja flera steg parallellt för att förkorta den totala tiden. Till exempel kan du registrera näringsverksamheten samtidigt som du förbereder HACCP-dokumentation.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTimeline;
