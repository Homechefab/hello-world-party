import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye, 
  ChefHat, 
  Building2, 
  UtensilsCrossed,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface OnboardingStep {
  title: string;
  description: string;
  timeframe?: string;
  tips?: string[];
}

interface OnboardingContent {
  role: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  introduction: string;
  steps: OnboardingStep[];
  requirements: string[];
  faq: { question: string; answer: string }[];
  contact: {
    phone: string;
    email: string;
    hours: string;
  };
}

const onboardingData: OnboardingContent[] = [
  {
    role: 'chef',
    title: 'Kock',
    icon: <ChefHat className="h-6 w-6" />,
    color: 'bg-orange-500',
    introduction: 'Välkommen till Homechef! Denna guide hjälper dig genom hela ansökningsprocessen för att bli hemkock på vår plattform.',
    steps: [
      {
        title: '1. Skicka in ansökan',
        description: 'Fyll i dina personuppgifter, erfarenhet och ladda upp ditt kommunbeslut (livsmedelstillstånd).',
        timeframe: 'Ca 15-20 minuter',
        tips: [
          'Ha ditt kommunbeslut redo som PDF eller bild',
          'Beskriv din kulinariska erfarenhet detaljerat',
          'Ange den e-post där du vill få inloggningsuppgifter'
        ]
      },
      {
        title: '2. Granskning av admin',
        description: 'Vårt team granskar din ansökan och dina dokument.',
        timeframe: '2-3 arbetsdagar',
        tips: [
          'Vi kontaktar dig om vi behöver kompletteringar',
          'Du får ett mail när beslut är fattat'
        ]
      },
      {
        title: '3. Godkännande & kontoskapande',
        description: 'När du godkänns skapas ditt kock-konto automatiskt och du får inloggningsuppgifter via e-post.',
        timeframe: 'Omedelbart efter godkännande',
        tips: [
          'Kolla din skräppost om du inte ser mailet',
          'Byt lösenord vid första inloggning'
        ]
      },
      {
        title: '4. Börja sälja!',
        description: 'Logga in på din dashboard, lägg upp dina rätter och börja ta emot beställningar.',
        tips: [
          'Ta proffsiga foton på dina rätter',
          'Sätt konkurrenskraftiga priser',
          'Svara snabbt på förfrågningar för bättre recensioner'
        ]
      }
    ],
    requirements: [
      'Godkänt kommunbeslut (livsmedelstillstånd) - OBLIGATORISKT',
      'Registrerat företag eller F-skattsedel (rekommenderas)',
      'Ansvarsförsäkring (rekommenderas)',
      'Godkänt kök enligt kommunens krav'
    ],
    faq: [
      {
        question: 'Hur lång tid tar godkännandet?',
        answer: 'Vanligtvis 2-3 arbetsdagar. Om komplettering behövs kan det ta längre.'
      },
      {
        question: 'Vad kostar det att vara kock på Homechef?',
        answer: 'Det är gratis att registrera sig. Vi tar 20% provision på försäljningen.'
      },
      {
        question: 'Hur får jag betalt?',
        answer: 'Utbetalningar sker veckovis till ditt angivna bankkonto.'
      }
    ],
    contact: {
      phone: '0734234686',
      email: 'support@homechef.se',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  },
  {
    role: 'restaurant',
    title: 'Restaurang',
    icon: <UtensilsCrossed className="h-6 w-6" />,
    color: 'bg-blue-500',
    introduction: 'Välkommen till Homechef! Denna guide hjälper din restaurang att nå fler kunder genom vår plattform.',
    steps: [
      {
        title: '1. Skicka in ansökan',
        description: 'Fyll i restaurangens uppgifter, beskrivning och ladda upp relevanta tillstånd.',
        timeframe: 'Ca 20-30 minuter',
        tips: [
          'Ha ditt restaurangtillstånd redo',
          'Beskriv er matprofil och specialiteter',
          'Ange kontaktperson för Homechef-ärenden'
        ]
      },
      {
        title: '2. Granskning',
        description: 'Vårt team granskar din ansökan och verifierar att alla krav är uppfyllda.',
        timeframe: '3-5 arbetsdagar',
        tips: [
          'Se till att HACCP-dokumentation är i ordning',
          'Vi kan göra ett kort telefonsamtal för verifiering'
        ]
      },
      {
        title: '3. Kontoskapande',
        description: 'Efter godkännande skapas ert restaurangkonto med full tillgång till plattformen.',
        timeframe: 'Omedelbart efter godkännande'
      },
      {
        title: '4. Lägg upp er meny',
        description: 'Lägg upp era rätter med bilder, priser och beskrivningar. Börja ta emot beställningar!',
        tips: [
          'Professionella foton ökar försäljningen med 40%',
          'Uppdatera menyn regelbundet',
          'Erbjud specialerbjudanden för nya kunder'
        ]
      }
    ],
    requirements: [
      'Restaurangtillstånd från kommunen - OBLIGATORISKT',
      'HACCP-dokumentation (rekommenderas)',
      'Ansvarsförsäkring (rekommenderas)',
      'Organisationsnummer'
    ],
    faq: [
      {
        question: 'Vilken provision tar Homechef?',
        answer: 'Vi tar 18% provision på varje beställning via plattformen.'
      },
      {
        question: 'Kan vi integrera med vårt kassasystem?',
        answer: 'Ja, vi erbjuder integration med flera populära kassasystem. Kontakta oss för mer info.'
      },
      {
        question: 'Hur hanteras leveranser?',
        answer: 'Ni väljer själva om ni vill erbjuda hämtning, egen leverans eller använda våra samarbetspartners.'
      }
    ],
    contact: {
      phone: '0734234686',
      email: 'support@homechef.se',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  },
  {
    role: 'kitchen_partner',
    title: 'Kökspartner',
    icon: <Building2 className="h-6 w-6" />,
    color: 'bg-green-500',
    introduction: 'Välkommen till Homechef! Som kökspartner hyr du ut ditt kök till kockar som behöver en professionell arbetsplats.',
    steps: [
      {
        title: '1. Registrera ditt kök',
        description: 'Beskriv ditt kök, utrustning, tillgängliga tider och pris per timme.',
        timeframe: 'Ca 15-20 minuter',
        tips: [
          'Ta tydliga foton på köket och utrustningen',
          'Lista all tillgänglig utrustning',
          'Var tydlig med regler och förväntningar'
        ]
      },
      {
        title: '2. Verifiering',
        description: 'Vi granskar att köket uppfyller våra krav och eventuellt gör en inspektion.',
        timeframe: '3-7 arbetsdagar',
        tips: [
          'Se till att köket är godkänt av kommunen',
          'Ha brandskyddsutrustning på plats'
        ]
      },
      {
        title: '3. Aktivering',
        description: 'När ditt kök är godkänt blir det synligt för kockar som söker arbetsplats.',
        timeframe: 'Omedelbart efter godkännande'
      },
      {
        title: '4. Ta emot bokningar',
        description: 'Godkänn eller neka bokningsförfrågningar. Vi hanterar betalningen.',
        tips: [
          'Svara snabbt på förfrågningar',
          'Håll kalendern uppdaterad',
          'Goda recensioner ger fler bokningar'
        ]
      }
    ],
    requirements: [
      'Godkänt kök från kommunen - OBLIGATORISKT',
      'Ansvarsförsäkring (rekommenderas)',
      'Grundläggande köksutrustning',
      'Brandsläckare och säkerhetsutrustning'
    ],
    faq: [
      {
        question: 'Vad är en rimlig timpris?',
        answer: 'De flesta kök tar mellan 200-500 kr/timme beroende på storlek och utrustning.'
      },
      {
        question: 'Vilken provision tar Homechef?',
        answer: 'Vi tar 15% provision på varje bokning.'
      },
      {
        question: 'Hur ofta får jag betalt?',
        answer: 'Utbetalningar sker månadsvis till ditt angivna bankkonto.'
      }
    ],
    contact: {
      phone: '0734234686',
      email: 'support@homechef.se',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  }
];

const generatePDF = (content: OnboardingContent) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header
  doc.setFillColor(249, 115, 22); // Orange
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`Onboarding: ${content.title}`, margin, 28);

  yPos = 55;
  doc.setTextColor(51, 51, 51);

  // Introduction
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const introLines = doc.splitTextToSize(content.introduction, pageWidth - 2 * margin);
  doc.text(introLines, margin, yPos);
  yPos += introLines.length * 7 + 10;

  // Steps
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Steg för steg', margin, yPos);
  yPos += 10;

  content.steps.forEach((step) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22);
    doc.text(step.title, margin, yPos);
    yPos += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const descLines = doc.splitTextToSize(step.description, pageWidth - 2 * margin);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 6 + 3;

    if (step.timeframe) {
      doc.setTextColor(100, 100, 100);
      doc.text(`⏱ ${step.timeframe}`, margin, yPos);
      yPos += 6;
    }

    if (step.tips && step.tips.length > 0) {
      step.tips.forEach(tip => {
        const tipLines = doc.splitTextToSize(`• ${tip}`, pageWidth - 2 * margin - 5);
        doc.text(tipLines, margin + 5, yPos);
        yPos += tipLines.length * 5 + 2;
      });
    }
    yPos += 8;
  });

  // Requirements
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 51, 51);
  doc.text('Krav & Dokument', margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  content.requirements.forEach(req => {
    const reqLines = doc.splitTextToSize(`✓ ${req}`, pageWidth - 2 * margin);
    doc.text(reqLines, margin, yPos);
    yPos += reqLines.length * 6 + 3;
  });

  // FAQ
  yPos += 10;
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Vanliga frågor', margin, yPos);
  yPos += 10;

  content.faq.forEach(item => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const qLines = doc.splitTextToSize(`F: ${item.question}`, pageWidth - 2 * margin);
    doc.text(qLines, margin, yPos);
    yPos += qLines.length * 6 + 2;

    doc.setFont('helvetica', 'normal');
    const aLines = doc.splitTextToSize(`S: ${item.answer}`, pageWidth - 2 * margin);
    doc.text(aLines, margin, yPos);
    yPos += aLines.length * 6 + 8;
  });

  // Contact
  yPos += 5;
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(245, 245, 245);
  doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 35, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 51, 51);
  doc.text('Kontakt & Support', margin, yPos + 5);
  yPos += 12;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`📞 ${content.contact.phone}`, margin, yPos);
  doc.text(`📧 ${content.contact.email}`, margin + 60, yPos);
  yPos += 6;
  doc.text(`🕐 ${content.contact.hours}`, margin, yPos);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Homechef - Onboarding ${content.title} | Sida ${i} av ${pageCount}`, margin, 290);
  }

  return doc;
};

const PreviewContent = ({ content }: { content: OnboardingContent }) => (
  <ScrollArea className="h-[70vh]">
    <div className="space-y-6 p-4">
      <div className={`${content.color} text-white p-6 rounded-lg`}>
        <div className="flex items-center gap-3">
          {content.icon}
          <h2 className="text-2xl font-bold">Onboarding: {content.title}</h2>
        </div>
      </div>

      <div className="prose max-w-none">
        <p className="text-muted-foreground">{content.introduction}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Steg för steg
        </h3>
        {content.steps.map((step, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-primary">{step.title}</CardTitle>
              {step.timeframe && (
                <Badge variant="secondary" className="w-fit">
                  <Clock className="h-3 w-3 mr-1" />
                  {step.timeframe}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {step.tips && step.tips.length > 0 && (
                <ul className="text-sm space-y-1">
                  {step.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Krav & Dokument
        </h3>
        <ul className="space-y-2">
          {content.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold">Vanliga frågor</h3>
        {content.faq.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="text-base">Kontakt & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            {content.contact.phone}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            {content.contact.email}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            {content.contact.hours}
          </div>
        </CardContent>
      </Card>
    </div>
  </ScrollArea>
);

export const OnboardingMaterials = () => {
  const [activeTab, setActiveTab] = useState('chef');

  const handleDownload = (content: OnboardingContent) => {
    try {
      const doc = generatePDF(content);
      doc.save(`onboarding-${content.role}.pdf`);
      toast.success(`PDF för ${content.title} nedladdad!`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Kunde inte generera PDF');
    }
  };

  const handleDownloadAll = () => {
    onboardingData.forEach((content, index) => {
      setTimeout(() => {
        handleDownload(content);
      }, index * 500);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Onboarding-material
            </CardTitle>
            <CardDescription>
              PDF-guider som skickas till sökande efter inskickad ansökan
            </CardDescription>
          </div>
          <Button onClick={handleDownloadAll} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Ladda ner alla
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chef" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              <span className="hidden sm:inline">Kock</span>
            </TabsTrigger>
            <TabsTrigger value="restaurant" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Restaurang</span>
            </TabsTrigger>
            <TabsTrigger value="kitchen_partner" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Kökspartner</span>
            </TabsTrigger>
          </TabsList>

          {onboardingData.map((content) => (
            <TabsContent key={content.role} value={content.role} className="mt-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Förhandsgranska
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {content.icon}
                        Onboarding: {content.title}
                      </DialogTitle>
                    </DialogHeader>
                    <PreviewContent content={content} />
                  </DialogContent>
                </Dialog>

                <Button onClick={() => handleDownload(content)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Ladda ner PDF
                </Button>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{content.steps.length}</div>
                      <div className="text-xs text-muted-foreground">Steg</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{content.requirements.length}</div>
                      <div className="text-xs text-muted-foreground">Krav</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{content.faq.length}</div>
                      <div className="text-xs text-muted-foreground">FAQ</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">Aktiv</div>
                      <div className="text-xs text-muted-foreground">Status</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OnboardingMaterials;
