import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ClipboardList,
  ShieldAlert,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const HaccpAnalysisTool = () => {
  const haccpSteps = [
    {
      step: 1,
      title: "Lista alla steg i din verksamhet",
      description: "Skriv ner alla steg från inköp av råvaror till servering/leverans av färdig mat.",
      examples: [
        "Inköp av råvaror",
        "Transport hem",
        "Förvaring i kyl/frys",
        "Förberedelse (tvätta, skära, marinera)",
        "Tillagning (steka, koka, baka)",
        "Nedkylning",
        "Varmhållning",
        "Förpackning",
        "Servering/leverans",
      ]
    },
    {
      step: 2,
      title: "Identifiera faror i varje steg",
      description: "För varje steg, tänk igenom vilka faror som kan uppstå. Det finns tre typer av faror:",
      categories: [
        {
          name: "Biologiska faror",
          icon: ShieldAlert,
          examples: ["Bakterier (Salmonella, Listeria, E. coli)", "Virus (Norovirus)", "Parasiter", "Mögelbildning"]
        },
        {
          name: "Kemiska faror",
          icon: AlertTriangle,
          examples: ["Rengöringsmedel i kontakt med mat", "Allergener som inte deklarerats", "Tungmetaller i vatten (egen brunn)"]
        },
        {
          name: "Fysiska faror",
          icon: Info,
          examples: ["Glas- eller metallbitar", "Ben i kött/fisk", "Smuts, hår, insekter"]
        }
      ]
    },
    {
      step: 3,
      title: "Bestäm kritiska styrpunkter (CCP)",
      description: "En kritisk styrpunkt är ett steg där du MÅSTE ha kontroll för att förhindra en fara. Fråga dig: 'Om jag missar detta, kan konsumenten bli sjuk?'",
      examples: [
        "Tillagningstemperatur – kärntemperatur minst +72°C",
        "Kylförvaring – max +8°C",
        "Frysförvaring – -18°C eller lägre",
        "Varmhållning – minst +60°C",
        "Nedkylning – från +60°C till +8°C inom 4 timmar",
        "Mottagningskontroll – kontrollera temp och kvalitet vid leverans",
      ]
    },
    {
      step: 4,
      title: "Sätt gränsvärden",
      description: "För varje kritisk styrpunkt, bestäm ett gränsvärde som skiljer säkert från osäkert.",
      examples: [
        "Kärntemperatur vid tillagning: minst +72°C",
        "Kylskåpstemperatur: max +8°C (helst +4°C)",
        "Varmhållning: minst +60°C",
        "Tid i rumstemperatur: max 2 timmar",
      ]
    },
    {
      step: 5,
      title: "Bestäm övervakningsmetoder",
      description: "Hur kontrollerar du att gränsvärdena hålls? Bestäm vad, hur ofta och av vem.",
      examples: [
        "Mät kärntemperatur med termometer vid varje tillagning",
        "Kontrollera kylskåpstemperaturen dagligen",
        "Visuell kontroll av råvaror vid inköp/mottagning",
        "Luktkontroll av livsmedel före användning",
      ]
    },
    {
      step: 6,
      title: "Planera korrigerande åtgärder",
      description: "Vad gör du om ett gränsvärde överskrids? Ha en plan redo.",
      examples: [
        "Kött inte uppnått +72°C → Fortsätt tillaga tills rätt temp nås",
        "Kylskåp visar +10°C → Kontrollera och justera, flytta känsliga varor",
        "Tveksam råvara → Kassera, använd inte",
        "Rengöringsmedel nära mat → Kassera berörda livsmedel",
      ]
    },
    {
      step: 7,
      title: "Dokumentera allt",
      description: "Skriv ner din HACCP-plan och för löpande logg över kontroller och avvikelser.",
      examples: [
        "HACCP-plan med alla steg, faror och styrpunkter",
        "Daglig temperaturlogg för kyl och frys",
        "Avvikelselogg – vad hände, åtgärd, datum",
        "Uppdatera planen vid menyändringar eller nya processer",
      ]
    },
  ];

  const sensitiveProducts = [
    { name: "Kött och köttfärs", risk: "Hög", detail: "Salmonella, E. coli – kräver noggrann tillagning och temperaturkontroll" },
    { name: "Fisk och skaldjur", risk: "Hög", detail: "Listeria, parasiter, histamin – kräver korrekt förvaring och snabb hantering" },
    { name: "Ägg och äggprodukter", risk: "Medel", detail: "Salmonella – undvik rå ägg, tillaga ordentligt" },
    { name: "Mejeriprodukter", risk: "Medel", detail: "Listeria – förvara kallt, kontrollera bäst-före-datum" },
    { name: "Ris och pasta", risk: "Medel", detail: "Bacillus cereus – kyl ner snabbt efter tillagning, varmhåll korrekt" },
    { name: "Färska grönsaker/frukt", risk: "Låg-Medel", detail: "Bakterier från jord – tvätta noggrant före användning" },
  ];

  const downloadHaccpTemplate = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(18);
    doc.text("HACCP-analysplan", 20, 20);
    doc.setFontSize(11);
    doc.text("Hazard Analysis and Critical Control Points", 20, 28);
    doc.setFontSize(9);
    doc.text("HomeChef.nu | Verksamhet: _________________  Datum: _______________", 20, 36);
    
    doc.setLineWidth(0.5);
    doc.line(20, 40, pageWidth - 20, 40);

    let y = 48;

    const templateSections = [
      {
        title: "1. Verksamhetsbeskrivning",
        items: [
          "Typ av livsmedel som hanteras: ___________________________________",
          "M\u00e5lgrupp/kunder: _______________________________________________",
          "Antal portioner/produkter per dag: _________________________________",
          "F\u00f6rs\u00e4ljningss\u00e4tt (direkt, n\u00e4t, butik): ______________________________",
        ]
      },
      {
        title: "2. Processteg i min verksamhet",
        items: [
          "Steg 1: ________________________________________________________",
          "Steg 2: ________________________________________________________",
          "Steg 3: ________________________________________________________",
          "Steg 4: ________________________________________________________",
          "Steg 5: ________________________________________________________",
          "Steg 6: ________________________________________________________",
        ]
      },
      {
        title: "3. Identifierade faror",
        items: [
          "Biologiska: _____________________________________________________",
          "Kemiska: _______________________________________________________",
          "Fysiska: ________________________________________________________",
        ]
      },
      {
        title: "4. Kritiska styrpunkter (CCP)",
        items: [
          "CCP 1: _________________ Gr\u00e4nsv\u00e4rde: _________ \u00d6vervakning: _________",
          "CCP 2: _________________ Gr\u00e4nsv\u00e4rde: _________ \u00d6vervakning: _________",
          "CCP 3: _________________ Gr\u00e4nsv\u00e4rde: _________ \u00d6vervakning: _________",
          "CCP 4: _________________ Gr\u00e4nsv\u00e4rde: _________ \u00d6vervakning: _________",
        ]
      },
      {
        title: "5. Korrigerande \u00e5tg\u00e4rder",
        items: [
          "Om CCP 1 \u00f6verskrids: ___________________________________________",
          "Om CCP 2 \u00f6verskrids: ___________________________________________",
          "Om CCP 3 \u00f6verskrids: ___________________________________________",
          "Om CCP 4 \u00f6verskrids: ___________________________________________",
        ]
      },
      {
        title: "6. Temperaturlogg (daglig)",
        items: [
          "Kylsk\u00e5p: Morgon ____\u00b0C  Kv\u00e4ll ____\u00b0C  OK/Avvikelse: _____________",
          "Frys: Morgon ____\u00b0C  Kv\u00e4ll ____\u00b0C  OK/Avvikelse: _________________",
          "Tillagning r\u00e4tt 1: K\u00e4rntemp ____\u00b0C  OK/Avvikelse: _________________",
          "Tillagning r\u00e4tt 2: K\u00e4rntemp ____\u00b0C  OK/Avvikelse: _________________",
          "Varmh\u00e5llning: Temp ____\u00b0C  Tid: ______  OK/Avvikelse: _____________",
        ]
      },
      {
        title: "7. Avvikelselogg",
        items: [
          "Datum: ______ Avvikelse: _________________ \u00c5tg\u00e4rd: ________________",
          "Datum: ______ Avvikelse: _________________ \u00c5tg\u00e4rd: ________________",
          "Datum: ______ Avvikelse: _________________ \u00c5tg\u00e4rd: ________________",
        ]
      },
    ];

    doc.setFontSize(10);

    templateSections.forEach((section) => {
      const sectionHeight = 10 + section.items.length * 8;
      if (y + sectionHeight > 280) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(section.title, 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      section.items.forEach((item) => {
        if (y + 8 > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(item, 22, y);
        y += 8;
      });

      y += 4;
      doc.setFontSize(10);
    });

    if (y + 20 > 280) {
      doc.addPage();
      y = 20;
    }
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;
    doc.setFontSize(8);
    doc.text("Denna mall \u00e4r baserad p\u00e5 Livsmedelsverkets HACCP-principer.", 20, y);
    doc.text("Uppdatera planen vid meny\u00e4ndringar. | Kontakt: info@homechef.nu", 20, y + 5);

    doc.save("haccp-analysplan.pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/chef/kitchen-requirements">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till kökskrav
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <ClipboardList className="w-4 h-4 mr-2" />
            HACCP-verktyg
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            HACCP-analysverktyg
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Steg-för-steg guide för att skapa din HACCP-plan enligt Livsmedelsverkets principer. 
            Analysera din verksamhet, identifiera faror och sätt upp kontrollrutiner.
          </p>

          <div className="mb-8">
            <Button size="lg" onClick={downloadHaccpTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Ladda ner HACCP-mall (PDF)
            </Button>
          </div>

          {/* 7 Steps */}
          <div className="grid gap-6 mb-12">
            {haccpSteps.map((step) => (
              <Card key={step.step}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {step.step}
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{step.description}</p>

                  {step.categories && (
                    <div className="grid md:grid-cols-3 gap-4">
                      {step.categories.map((cat) => (
                        <Card key={cat.name} className="border-border">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <cat.icon className="w-4 h-4 text-destructive" />
                              {cat.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {cat.examples.map((ex, i) => (
                                <li key={i} className="text-sm text-muted-foreground">• {ex}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {step.examples && (
                    <ul className="space-y-2">
                      {step.examples.map((ex, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{ex}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sensitive Products */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Känsliga livsmedel – extra noggranna rutiner krävs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Vissa livsmedel kan vara mer känsliga och medföra högre risker att hantera. 
                Dessa kräver extra noggranna rutiner i din HACCP-plan.
              </p>
              <div className="grid gap-3">
                {sensitiveProducts.map((product) => (
                  <div key={product.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge 
                      variant={product.risk === "Hög" ? "destructive" : "secondary"}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {product.risk}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Info className="w-5 h-5" />
                Tänk på detta
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-800 dark:text-amber-200">
              <ul className="space-y-2">
                <li>• Din HACCP-plan ska vara anpassad till just din verksamhet – kopiera inte en generisk plan</li>
                <li>• Uppdatera planen när du ändrar meny, processer eller utrustning</li>
                <li>• Dokumentera alla kontroller och avvikelser löpande</li>
                <li>• Tänk på vem som ska konsumera maten – extra hänsyn vid känsliga målgrupper</li>
                <li>• Du har ett rättsligt ansvar för att det du säljer är säkert</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chef/kitchen-requirements">
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tillbaka till alla krav
              </Button>
            </Link>
            <Button size="lg" onClick={downloadHaccpTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Ladda ner HACCP-mall (PDF)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaccpAnalysisTool;
