import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle,
  Home,
  Users,
  Thermometer,
  Droplets,
  ArrowRight,
  Phone,
  Mail,
  FileText,
  Play,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

import separationZonesImage from "@/assets/kitchen-separation-zones.jpg";
import handHygieneImage from "@/assets/kitchen-hand-hygiene.jpg";
import illnessRoutinesImage from "@/assets/kitchen-illness-routines.jpg";
import cleaningRoutinesImage from "@/assets/kitchen-cleaning-routines.jpg";
import familyPetsRulesImage from "@/assets/kitchen-family-pets-rules.jpg";
import rawFinishedSeparationImage from "@/assets/kitchen-raw-finished-separation.jpg";
import temperatureControlImage from "@/assets/kitchen-temperature-control.jpg";
import haccpAnalysisImage from "@/assets/kitchen-haccp-analysis.jpg";
import animalProductsImage from "@/assets/kitchen-animal-products.jpg";
import workClothesImage from "@/assets/kitchen-work-clothes.jpg";
import waterQualityImage from "@/assets/kitchen-water-quality.jpg";

const KitchenRequirements = () => {
  const downloadChecklist = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(18);
    doc.text("Egenkontroll - Checklista", 20, 20);
    doc.setFontSize(11);
    doc.text("Baserad p\u00e5 Livsmedelsverkets riktlinjer f\u00f6r livsmedelsverksamhet", 20, 28);
    doc.setFontSize(9);
    doc.text("HomeChef.nu | Datum: _______________  Signatur: _______________", 20, 36);
    
    doc.setLineWidth(0.5);
    doc.line(20, 40, pageWidth - 20, 40);

    const sections = [
      {
        title: "1. Registrering och ans\u00f6kan",
        items: [
          "Verksamheten \u00e4r registrerad hos kommunen innan start",
          "Organisationsnummer eller F-skatt finns",
          "Eventuella ytterligare tillst\u00e5nd \u00e4r s\u00f6kta (t.ex. dricksvatten vid egen brunn)",
        ]
      },
      {
        title: "2. Personlig hygien",
        items: [
          "Handtv\u00e4tt utf\u00f6rs f\u00f6re hantering av livsmedel",
          "Handtv\u00e4tt utf\u00f6rs efter toalettbes\u00f6k, bl\u00f6jbyten, hantering av avfall m.m.",
          "M\u00f6jlighet att tv\u00e4tta h\u00e4nderna ordentligt mellan olika moment finns",
          "H\u00e5rn\u00e4t/huvudbonad anv\u00e4nds vid tillagning",
        ]
      },
      {
        title: "3. Arbetskl\u00e4der och st\u00e4dmaterial",
        items: [
          "Rena arbetskl\u00e4der/f\u00f6rkl\u00e4de anv\u00e4nds",
          "Rutiner f\u00f6r hantering och reng\u00f6ring av arbetskl\u00e4der finns",
          "K\u00f6kshanddukar byts och tv\u00e4ttas regelbundet",
          "St\u00e4dmaterial h\u00e5lls rent och byts vid behov",
        ]
      },
      {
        title: "4. Smitta och sjukdom",
        items: [
          "Rutiner finns f\u00f6r vad du g\u00f6r om du eller n\u00e5gon i hemmet \u00e4r sjuk",
          "S\u00e4rskilda rutiner vid kr\u00e4kningar/diarr\u00e9",
          "Rutiner vid infekterade huds\u00e5r, influensa, hosta",
          "Rutiner vid infektioner i mun, hals, \u00f6gon eller \u00f6ron",
        ]
      },
      {
        title: "5. Lokaler och utrustning",
        items: [
          "Ordentlig separation mellan livsmedelsverksamhet och normala hush\u00e5llsaktiviteter",
          "Separering kan ske i tid med goda rutiner d\u00e4r fysisk separering ej \u00e4r m\u00f6jlig",
          "Tillr\u00e4ckligt med ytor och utrymmen f\u00f6r den m\u00e4ngd livsmedel som hanteras",
          "Utrymme f\u00f6r att f\u00f6rvara och separera r\u00e5varor och f\u00e4rdiga produkter fr\u00e5n privata livsmedel",
          "Utrustning \u00e4r l\u00e4mplig f\u00f6r \u00e4ndam\u00e5let (ytor g\u00e5r att h\u00e5lla rena, kyl h\u00e5ller temp)",
          "Handtv\u00e4ttst\u00e4ll med varmt vatten och tv\u00e5l finns i n\u00e4rheten av livsmedelshanteringen",
        ]
      },
      {
        title: "6. Familjemedlemmar och husdjur",
        items: [
          "Rutiner f\u00f6r hur familjemedlemmar f\u00e5r vistas i utrymmen d\u00e4r verksamheten p\u00e5g\u00e5r",
          "Husdjur h\u00e5lls borta fr\u00e5n k\u00f6ket under livsmedelshantering",
        ]
      },
      {
        title: "7. Temperaturkontroll",
        items: [
          "Kylvaror f\u00f6rvaras vid +8\u00b0C eller l\u00e4gre",
          "Frysvaror f\u00f6rvaras vid -18\u00b0C eller l\u00e4gre",
          "Varmh\u00e5llning sker vid minst +60\u00b0C",
          "Tillagningstemperatur kontrolleras (k\u00e4rntemp minst +72\u00b0C)",
          "Termometer finns och anv\u00e4nds regelbundet",
          "Kylsk\u00e5pet kan h\u00e5lla l\u00e4mplig temperatur",
        ]
      },
      {
        title: "8. Reng\u00f6ring och desinfektion",
        items: [
          "Reng\u00f6ringsrutiner f\u00f6r redskap, arbetsytor, utrustning och utrymmen finns",
          "Daglig reng\u00f6ring av arbetsytor och utrustning",
          "Reng\u00f6ringsschema finns och f\u00f6ljs",
          "Reng\u00f6ringsmedel f\u00f6rvaras \u00e5tskilt fr\u00e5n livsmedel",
          "Disktrasor/svampar byts regelbundet",
        ]
      },
      {
        title: "9. R\u00e5a och f\u00e4rdiga livsmedel",
        items: [
          "R\u00e5a och f\u00e4rdiga livsmedel f\u00f6rvaras \u00e5tskilt",
          "Separata sk\u00e4rbr\u00e4dor f\u00f6r r\u00e5tt och tillagat",
          "Korskontaminering f\u00f6rebyggs vid hantering",
        ]
      },
      {
        title: "10. Faroanalys (HACCP-baserat)",
        items: [
          "Verksamheten \u00e4r analyserad utifr\u00e5n HACCP-principerna",
          "Kritiska styrpunkter \u00e4r identifierade",
          "Faror \u00e4r identifierade (biologiska, kemiska, fysiska)",
          "K\u00e4nsliga livsmedel (fisk, skaldjur, k\u00f6ttf\u00e4rs) har extra noggranna rutiner",
          "Rutiner finns f\u00f6r att f\u00f6rebygga faror",
          "Avvikelser dokumenteras och \u00e5tg\u00e4rdas",
        ]
      },
      {
        title: "11. K\u00e4nsliga m\u00e5lgrupper",
        items: [
          "H\u00e4nsyn tas till k\u00e4nsliga konsumenter (allergier, sjukdomar)",
          "Allergener identifieras och kommuniceras tydligt",
          "Rutiner f\u00f6r att hantera specialkost finns vid behov",
        ]
      },
      {
        title: "12. Livsmedelsinformation och m\u00e4rkning",
        items: [
          "Obligatorisk information finns p\u00e5 eller i anslutning till produkten",
          "Ingredienser och allergener anges f\u00f6r varje r\u00e4tt",
          "Korrekt m\u00e4rkning beroende p\u00e5 f\u00f6rpackad/of\u00f6rpackad produkt",
          "B\u00e4st-f\u00f6re/sista f\u00f6rbrukningsdag anges d\u00e4r det kr\u00e4vs",
          "Information kan ges vid f\u00f6rfr\u00e5gan d\u00e4r s\u00e5 kr\u00e4vs",
        ]
      },
      {
        title: "13. Sp\u00e5rbarhet",
        items: [
          "Kan visa fr\u00e5n vem livsmedel/r\u00e5varor \u00e4r ink\u00f6pta",
          "Kan visa till vilka f\u00f6retag livsmedel har s\u00e5lts (ej privatpersoner)",
          "Sp\u00e5rbarhet m\u00f6jligg\u00f6r snabb \u00e5terkallning vid fara",
          "Ink\u00f6pta ingredienser kan tas bort fr\u00e5n lager vid \u00e5terkallning",
        ]
      },
      {
        title: "14. Vatten och avfall",
        items: [
          "Dricksvatten fr\u00e5n godk\u00e4nd k\u00e4lla anv\u00e4nds",
          "Vid egen brunn: extra rutiner f\u00f6r att visa att vattnet \u00e4r l\u00e4mpligt",
          "Vatten finns tillg\u00e4ngligt i n\u00e4rheten av livsmedelshanteringen",
          "Avfall hanteras och sorteras korrekt",
          "Avfall f\u00f6rvaras \u00e5tskilt fr\u00e5n livsmedel",
        ]
      },
      {
        title: "15. Skadedjurskontroll",
        items: [
          "F\u00f6rebyggande \u00e5tg\u00e4rder mot skadedjur vidtas",
          "Livsmedel f\u00f6rvaras i slutna beh\u00e5llare",
          "Eventuella problem dokumenteras och \u00e5tg\u00e4rdas",
        ]
      },
      {
        title: "16. Utbildning och kunskap",
        items: [
          "Grundl\u00e4ggande kunskap om livsmedelshygien finns",
          "Kunskap om vad bristande hygien kan leda till",
          "Rutiner \u00e4r k\u00e4nda och f\u00f6ljs av alla som hanterar mat",
          "R\u00e4ttsligt ansvar f\u00f6r s\u00e4kerhet och korrekt information \u00e4r k\u00e4nt",
        ]
      },
    ];

    let y = 48;
    doc.setFontSize(10);

    sections.forEach((section) => {
      // Check if section fits on page, otherwise add new page
      const sectionHeight = 8 + section.items.length * 7;
      if (y + sectionHeight > 280) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(section.title, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      section.items.forEach((item) => {
        doc.rect(22, y - 3, 3.5, 3.5);
        doc.text(item, 28, y);
        y += 7;
      });

      y += 4;
      doc.setFontSize(10);
    });

    // Footer
    if (y + 20 > 280) {
      doc.addPage();
      y = 20;
    }
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;
    doc.setFontSize(8);
    doc.text("Denna checklista \u00e4r baserad p\u00e5 Livsmedelsverkets riktlinjer f\u00f6r egenkontroll.", 20, y);
    doc.text("Mer info: www.livsmedelsverket.se | Kontakt: info@homechef.nu", 20, y + 5);

    doc.save("egenkontroll-checklista.pdf");
  };

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

    let yH = 48;

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
      if (yH + sectionHeight > 280) {
        doc.addPage();
        yH = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(section.title, 20, yH);
      yH += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      section.items.forEach((item) => {
        if (yH + 8 > 280) {
          doc.addPage();
          yH = 20;
        }
        doc.text(item, 22, yH);
        yH += 8;
      });

      yH += 4;
      doc.setFontSize(10);
    });

    if (yH + 20 > 280) {
      doc.addPage();
      yH = 20;
    }
    doc.setLineWidth(0.5);
    doc.line(20, yH, pageWidth - 20, yH);
    yH += 8;
    doc.setFontSize(8);
    doc.text("Denna mall \u00e4r baserad p\u00e5 Livsmedelsverkets HACCP-principer.", 20, yH);
    doc.text("Uppdatera planen vid meny\u00e4ndringar. | Kontakt: info@homechef.nu", 20, yH + 5);

    doc.save("haccp-analysplan.pdf");
  };

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
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" onClick={downloadHaccpTemplate}>
                <Download className="w-5 h-5 mr-2" />
                HACCP-analysverktyg
              </Button>
              <Button variant="outline" size="lg" onClick={downloadChecklist}>
                <Download className="w-4 h-4 mr-2" />
                Ladda ner egenkontroll
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Visual Guide Section - All Municipal Requirements */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Play className="w-4 h-4 mr-2" />
              Visuell guide
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Alla kommunala krav – visuellt</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Klicka på en bild för att läsa mer om kravet
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* 1. Separering */}
            <Link to="/chef/requirements/separation-zones">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={separationZonesImage} 
                    alt="Separering mellan verksamhet och privat användning"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Separering privat/verksamhet</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 2. Handhygien */}
            <Link to="/chef/requirements/hand-hygiene">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={handHygieneImage} 
                    alt="Handhygien - tvätta händer mellan moment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Handhygien</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 3. Rutiner för sjukdom */}
            <Link to="/chef/requirements/illness-routines">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={illnessRoutinesImage} 
                    alt="Rutiner för sjukdom i hemmet"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Rutiner för sjukdom</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 4. Rengöringsrutiner */}
            <Link to="/chef/requirements/cleaning-routines">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={cleaningRoutinesImage} 
                    alt="Rengöringsrutiner för redskap och ytor"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Rengöringsrutiner</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 5. Familj och husdjur */}
            <Link to="/chef/requirements/family-pets-rules">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={familyPetsRulesImage} 
                    alt="Rutiner för familjemedlemmar och husdjur"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Familj & husdjur</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 6. Separera råvaror och färdiga produkter */}
            <Link to="/chef/requirements/raw-finished-separation">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={rawFinishedSeparationImage} 
                    alt="Separera råvaror och färdiga produkter"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Råvaror vs färdiga produkter</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 7. Temperaturkontroll */}
            <Link to="/chef/requirements/temperature-control">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={temperatureControlImage} 
                    alt="Temperaturkontroll och hygien"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Temperaturkontroll</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 8. HACCP-analys */}
            <Link to="/chef/requirements/haccp-analysis">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={haccpAnalysisImage} 
                    alt="HACCP-analys av risker"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">HACCP-analys</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 9. Animaliska produkter */}
            <Link to="/chef/requirements/animal-products">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={animalProductsImage} 
                    alt="Hantering av fisk, kött och animaliska produkter"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Animaliska produkter</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 10. Arbetskläder */}
            <Link to="/chef/requirements/work-clothes">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={workClothesImage} 
                    alt="Arbetskläder, kökshanddukar och städmaterial"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Arbetskläder & textilier</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 11. Vattenkvalitet */}
            <Link to="/chef/requirements/water-quality">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={waterQualityImage} 
                    alt="Vattenkvalitet vid egen brunn"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-medium text-sm">Vattenkvalitet</p>
                  </div>
                </div>
              </Card>
            </Link>
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
                <a href="https://calendly.com/farhan_javanmiri/30min" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    Boka gratis konsultation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Ring oss: 0734-23 46 86
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@homechef.nu
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