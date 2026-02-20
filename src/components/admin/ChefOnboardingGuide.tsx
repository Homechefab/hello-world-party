import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  ChefHat,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Share2,
  CreditCard,
  Shield,
  Star,
  TrendingUp,
  MessageCircle,
  Camera,
  BookOpen,
  Phone,
  Mail,
  Clock,
  Download
} from 'lucide-react';
import jsPDF from 'jspdf';

const Section = ({ icon: Icon, title, children, accent = false }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <Card className={accent ? 'border-primary/40 bg-primary/5' : ''}>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const Rule = ({ type, text }: { type: 'do' | 'dont' | 'warn'; text: string }) => {
  const config = {
    do: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    dont: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    warn: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  };
  const { icon: Icon, color, bg } = config[type];
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${bg}`}>
      <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${color}`} />
      <span className="text-sm">{text}</span>
    </div>
  );
};


export const ChefOnboardingGuide = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const addPage = () => { doc.addPage(); y = 20; };
    const checkPage = (needed = 20) => { if (y + needed > 275) addPage(); };

    const h1 = (text: string) => {
      checkPage(14);
      doc.setFontSize(18); doc.setFont('helvetica', 'bold');
      doc.setFillColor(220, 80, 30);
      doc.rect(margin, y - 6, contentWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(text, margin + 3, y + 2);
      doc.setTextColor(0, 0, 0);
      y += 16;
    };

    const h2 = (text: string) => {
      checkPage(10);
      doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 80, 30);
      doc.text(text, margin, y);
      doc.setTextColor(0, 0, 0);
      y += 8;
    };

    const body = (text: string, indent = 0) => {
      checkPage(8);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      lines.forEach((line: string) => {
        checkPage(6);
        doc.text(line, margin + indent, y);
        y += 5;
      });
    };

    const rule = (type: 'do' | 'dont' | 'warn', text: string) => {
      checkPage(8);
      const prefix = type === 'do' ? '✓' : type === 'dont' ? '✗' : '⚠';
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(`${prefix}  ${text}`, contentWidth - 8);
      lines.forEach((line: string) => {
        checkPage(6);
        doc.text(line, margin + 4, y);
        y += 5;
      });
    };

    const space = (n = 4) => { y += n; };

    // Cover
    doc.setFillColor(220, 80, 30);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setFontSize(22); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Homechef – Kock-onboarding', margin, 22);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text('Komplett guide för nya partners', margin, 33);
    doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`, margin, 42);
    doc.setTextColor(0, 0, 0);
    y = 60;

    // 1. Vision
    h1('1. Välkommen & Vår Vision');
    body('Öppning: "Du är nu en del av Sveriges mest spännande matplattform. Vi kopplar samman passionerade kockar med matälskare – och vi ser till att du får betalt för det du älskar att göra."');
    space();
    body('Homechef är en exklusiv marknadsplats – vi selekterar noggrant vilka kockar vi godkänner, vilket gör varumärket starkare för alla.');
    body('Vi gör jobbet: marknadsföring, betalningar, kundservice, logistik. Kocken fokuserar på det hen är bäst på – maten.');
    space(6);

    // 2. Checklista
    h1('2. Första stegen – Checklista');
    const checks = [
      'Byt lösenord vid första inloggning (Obligatoriskt)',
      'Ladda upp profilbild – proffsig och välbelyst (Viktigt)',
      'Skriv en säljande bio – berätta din historia (Viktigt)',
      'Fyll i specialiteter och matkategorier',
      'Länka sociala medier i dashboarden',
      'Ladda upp minst 3 rätter med foto, beskrivning & pris (Obligatoriskt)',
      'Sätt tillgängliga leveranstider',
      'Läs och godkänn Homechefs villkor (Obligatoriskt)',
    ];
    checks.forEach(c => body(`☐  ${c}`, 2));
    space(6);

    // 3. Regler
    h1('3. Partnerregler – Icke Förhandlingsbara');
    h2('Ingen parallell försäljningskanal');
    rule('dont', 'Ingen egen hemsida eller webshop för matförsäljning – all försäljning sker uteslutande via homechef.nu.');
    rule('dont', 'Inga betalningar utanför plattformen – varken Swish-nummer i sociala medier eller privata överenskommelser med kunder.');
    rule('do', 'Du kan ha en blogg eller inspirationssida om matlagning – men beställningar ska alltid gå via Homechef.');
    space();
    h2('Privat telefonnummer är dolt');
    rule('dont', 'Dela aldrig ditt privata mobilnummer med kunder – varken i chatten, i förpackningar eller på sociala medier.');
    rule('dont', 'Kontakta inte kunder direkt utanför plattformen angående beställningar.');
    rule('do', 'All kundkommunikation sker via Homechef-appen – vi hanterar support, tvister och återbetalningar åt dig.');
    space();
    h2('Sociala medier – hänvisa alltid till Homechef');
    rule('do', 'Posta gärna matbilder, recept och matlagningsvideor – det bygger ditt varumärke.');
    rule('do', 'Länka alltid till din Homechef-profil: "Beställ via homechef.nu".');
    rule('do', 'Tagga @homechef i relevanta inlägg – vi delar och boostrar ditt innehåll.');
    rule('dont', 'Uppge betalningsinformation eller ta beställningar via DM, kommentarer eller Stories.');
    space(6);

    // 4. Profil
    h1('4. Din Profil – Säljande Närvaro');
    h2('Visas för kunder');
    ['Namn / smeknamn (du väljer)', 'Profilbild', 'Bio och mathistoria', 'Specialiteter & kökstraditioner', 'Sociala medier-ikoner', 'Kundrecensioner och betyg', 'Tillgängliga rätter med bilder & priser'].forEach(i => body(`• ${i}`, 4));
    space();
    h2('Dolt från kunder');
    ['Privat telefonnummer', 'Personlig e-postadress', 'Hemadress / leveransadress', 'Bankuppgifter'].forEach(i => body(`• ${i}`, 4));
    space();
    body('Tips: Kockar med professionellt profilfoto och minst 5 rätter säljer i genomsnitt 3× mer.');
    space(6);

    // 5. Mat & Kvalitet
    h1('5. Mat, Kvalitet & Allergener');
    rule('do', 'Alla rätter måste uppfylla kommunens livsmedelskrav och tillstånd.');
    rule('do', 'Tydlig allergeninformation är obligatorisk för varje rätt – detta är ett lagkrav.');
    rule('do', 'Uppdatera menyn regelbundet. Rätter som inte är aktiva tas bort efter 30 dagar.');
    rule('warn', 'Pris sätter kocken själv. Homechef tar 19% provision + kunden betalar 6% serviceavgift.');
    space(6);

    // 6. Betalning
    h1('6. Betalning & Utbetalning');
    body('Kockens andel: 81% av angivet pris');
    body('Homechefs provision: 19% av angivet pris');
    body('Kundens serviceavgift: 6% (läggs på av kunden)');
    space();
    body('• Kunder betalar via Kort, Swish eller Klarna – vi hanterar allt.');
    body('• Utbetalning sker veckovis direkt till kockens registrerade bankkonto.');
    body('• Månadsrapport skickas automatiskt till kockens @homechef.se-adress.');
    body('• Moms och skattehantering är kockens ansvar – vi tillhandahåller underlag.');
    space(6);

    // 7. Marknadsföring
    h1('7. Hur Vi Marknadsför Dig');
    ['Synlighet på startsidan och i kategorisök', 'Marknadsföring via Google Ads & SEO', 'Delning av ditt innehåll på våra sociala kanaler', 'Nyhetsbrev till tusentals matintresserade kunder', 'Featured chef-kampanjer för toppsäljare'].forEach(i => rule('do', i));
    space();
    body('Ju fler betyg och recensioner kocken samlar – desto högre upp i sökresultaten hamnar hen.');
    space(6);

    // 8. Support
    h1('8. Kommunikation & Support');
    rule('do', 'Alla kundärenden hanteras av Homechef – kocken kontaktar aldrig kunder direkt angående klagomål.');
    rule('do', 'Vid produktionsproblem eller sjukdom – meddela Homechef omedelbart via appen.');
    rule('warn', 'Negativa recensioner är en del av verksamheten. Vi hjälper dig hantera dem professionellt.');
    space();
    body('Telefon: 0734-23 46 86  |  E-post: info@homechef.nu  |  Öppettider: Mån–Fre 09–18');
    space(6);

    // 9. Konsekvenser
    h1('9. Varningar & Konsekvenser');
    body('Nivå 1 – Varning: Skriftlig påminnelse – registreras i kontot.');
    body('Nivå 2 – Tillfällig avstängning: Profilen inaktiveras i 14–30 dagar.');
    body('Nivå 3 – Permanent utestängning: Kontot avslutas utan möjlighet till återaktivering.');
    space();
    body('Brott mot reglerna om parallell försäljning eller delning av kontaktuppgifter leder direkt till nivå 2 eller 3.');
    space(6);

    // Avslut
    h1('Avslutning');
    body('"Vi är glada att ha dig ombord. Ju mer du engagerar dig – bilder, sociala medier, bra recensioner – desto mer tjänar du. Vi är din partner, inte bara din plattform. Lycka till!"');

    doc.save('Homechef_Kock-onboarding.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="h-7 w-7" />
            <h2 className="text-2xl font-bold">Kock-onboarding – Komplett guide</h2>
          </div>
          <Button onClick={generatePDF} variant="secondary" className="flex items-center gap-2 flex-shrink-0">
            <Download className="h-4 w-4" />
            Ladda ner PDF
          </Button>
        </div>
        <p className="opacity-90 text-sm max-w-2xl">
          Allt du behöver gå igenom med en ny kock vid uppstartssamtalet. Presentera detta som en partnership – vi hjälper dem lyckas, de hjälper oss växa.
        </p>
      </div>

      {/* Välkommen & vision */}
      <Section icon={Star} title="1. Välkommen & Vår Vision" accent>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Öppning till kocken:</strong> <em>"Du är nu en del av Sveriges mest spännande matplattform. Vi kopplar samman passionerade kockar med matälskare – och vi ser till att du får betalt för det du älskar att göra."</em>
          </p>
          <p>
            Förklara att Homechef är en <strong className="text-foreground">exklusiv marknadsplats</strong> – vi selekterar noggrant vilka kockar vi godkänner, vilket gör varumärket starkare för alla.
          </p>
          <p>
            Betona att <strong className="text-foreground">vi gör jobbet</strong>: marknadsföring, betalningar, kundservice, logistik. Kocken fokuserar på det hen är bäst på – maten.
          </p>
        </div>
      </Section>

      {/* Kom igång-checklista */}
      <Section icon={BookOpen} title="2. Första stegen – Checklista">
        <div className="space-y-1">
          {[
            { label: 'Byt lösenord vid första inloggning', note: 'Obligatoriskt' },
            { label: 'Ladda upp profilbild (proffsig, välbelyst)', note: 'Viktigt' },
            { label: 'Skriv en säljande bio – berätta din historia', note: 'Viktigt' },
            { label: 'Fyll i specialiteter och matkategorier', note: '' },
            { label: 'Länka sociala medier i dashboarden', note: '' },
            { label: 'Ladda upp minst 3 rätter med foto, beskrivning & pris', note: 'Obligatoriskt' },
            { label: 'Sätt tillgängliga leveranstider', note: '' },
            { label: 'Läs och godkänn Homechefs villkor', note: 'Obligatoriskt' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded border border-border flex-shrink-0" />
                {item.label}
              </div>
              {item.note && (
                <Badge variant={item.note === 'Obligatoriskt' ? 'destructive' : 'secondary'} className="text-xs flex-shrink-0 ml-2">
                  {item.note}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Regler */}
      <Section icon={Shield} title="3. Partnerregler – Icke Förhandlingsbara">
        <div className="space-y-4">

          {/* Ingen egen hemsida */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Ingen parallell försäljningskanal</span>
            </div>
            <div className="space-y-2">
              <Rule type="dont" text="Ingen egen hemsida eller webshop för matförsäljning – all försäljning sker uteslutande via homechef.nu." />
              <Rule type="dont" text="Inga betalningar utanför plattformen – varken Swish-nummer i sociala medier eller privata överenskommelser med kunder." />
              <Rule type="do" text="Du kan ha en blogg eller inspirationssida om matlagning – men beställningar ska alltid gå via Homechef." />
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Varför? Vi investerar i din marknadsföring och synlighet. Parallell försäljning skadar plattformens integritet och ditt eget skydd vid tvister.
            </p>
          </div>

          <Separator />

          {/* Telefonnummer */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Privat telefonnummer är dolt</span>
            </div>
            <div className="space-y-2">
              <Rule type="dont" text="Dela aldrig ditt privata mobilnummer med kunder – varken i chatten, i förpackningar eller på sociala medier." />
              <Rule type="dont" text="Kontakta inte kunder direkt utanför plattformen angående beställningar." />
              <Rule type="do" text="All kundkommunikation sker via Homechef-appen – vi hanterar support, tvister och återbetalningar åt dig." />
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Varför? Det skyddar dig juridiskt. Om en kund hävdar matförgiftning och du kommunicerat privat kan det användas mot dig. Via oss finns allt dokumenterat.
            </p>
          </div>

          <Separator />

          {/* Sociala medier */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Sociala medier – hänvisa alltid till Homechef</span>
            </div>
            <div className="space-y-2">
              <Rule type="do" text='Posta gärna matbilder, recept och matlagningsvideor – det bygger ditt varumärke och ökar din försäljning.' />
              <Rule type="do" text='Länka alltid till din Homechef-profil i bio och i inlägg: "Beställ via homechef.nu".' />
              <Rule type="do" text='Tagga @homechef i relevanta inlägg – vi delar och boostrar ditt innehåll.' />
              <Rule type="dont" text='Uppge betalningsinformation eller ta beställningar via DM:s, kommentarer eller Stories.' />
              <Rule type="warn" text='Bilder på maten ska representera den faktiska rätten kunden beställer – vilseledande marknadsföring är förbjuden.' />
            </div>
          </div>
        </div>
      </Section>

      {/* Din profil */}
      <Section icon={Camera} title="4. Din Profil – Säljande Närvaro">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold mb-2 text-green-700">✅ Visas för kunder</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Namn / smeknamn (du väljer)</li>
              <li>• Profilbild</li>
              <li>• Bio och mathistoria</li>
              <li>• Specialiteter & kökstraditioner</li>
              <li>• Sociala medier-ikoner (TikTok, Instagram, Facebook, Snapchat)</li>
              <li>• Kundrecensioner och betyg</li>
              <li>• Tillgängliga rätter med bilder & priser</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-red-700">🚫 Dolt från kunder</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Privat telefonnummer</li>
              <li>• Personlig e-postadress</li>
              <li>• Hemadress / leveransadress</li>
              <li>• Bankuppgifter</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <strong>Tips:</strong> Kockar med professionellt profilfoto och minst 5 rätter säljer i genomsnitt <strong>3× mer</strong> än de utan. Hjälp dem komma igång rätt från start.
        </div>
      </Section>

      {/* Mat & Kvalitet */}
      <Section icon={ChefHat} title="5. Mat, Kvalitet & Allergener">
        <div className="space-y-2">
          <Rule type="do" text="Alla rätter måste uppfylla kommunens livsmedelskrav och tillstånd." />
          <Rule type="do" text="Tydlig allergeninformation är obligatorisk för varje rätt – detta är ett lagkrav." />
          <Rule type="do" text="Uppdatera menyn regelbundet. Rätter som inte är aktiva tas bort efter 30 dagar." />
          <Rule type="do" text="Professionella maträttsfotografier – erbjud gärna hjälp eller tips för bättre bilder." />
          <Rule type="warn" text="Pris sätter kocken själv. Homechef tar 19% provision + kunden betalar 6% serviceavgift." />
        </div>
      </Section>

      {/* Betalning */}
      <Section icon={CreditCard} title="6. Betalning & Utbetalning">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Kockens andel', value: '81%', desc: 'av angivet pris' },
            { label: 'Homechefs provision', value: '19%', desc: 'av angivet pris' },
            { label: 'Kundens serviceavgift', value: '6%', desc: 'läggs på av kunden' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-primary">{item.value}</div>
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Kunder betalar via Kort, Swish eller Klarna – vi hanterar allt.</p>
          <p>• Utbetalning sker <strong className="text-foreground">veckovis</strong> direkt till kockens registrerade bankkonto.</p>
          <p>• Månadsrapport skickas automatiskt till kockens @homechef.se-adress.</p>
          <p>• Moms och skattehantering är kockens ansvar – vi tillhandahåller underlag.</p>
        </div>
      </Section>

      {/* Marknadsföring */}
      <Section icon={TrendingUp} title="7. Hur Vi Marknadsför Dig">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Vi investerar aktivt i att driva trafik till plattformen – det gynnar alla partners:</p>
          <ul className="space-y-2">
            {[
              'Synlighet på startsidan och i kategorisök',
              'Marknadsföring via Google Ads & SEO',
              'Delning av ditt innehåll på våra sociala kanaler',
              'Nyhetsbrev till tusentals matintresserade kunder',
              'Featured chef-kampanjer för toppsäljare',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-foreground font-medium">
            Ju fler betyg och recensioner kocken samlar – desto högre upp i sökresultaten hamnar hen.
          </p>
        </div>
      </Section>

      {/* Kommunikation & Support */}
      <Section icon={MessageCircle} title="8. Kommunikation & Support">
        <div className="space-y-3 text-sm text-muted-foreground">
          <Rule type="do" text="Alla kundärenden hanteras av Homechef – kocken kontaktar aldrig kunder direkt angående klagomål eller reklamationer." />
          <Rule type="do" text="Vid produktionsproblem eller sjukdom – meddela Homechef omedelbart via appen så vi kan informera väntande kunder." />
          <Rule type="warn" text="Negativa recensioner är en del av verksamheten. Vi hjälper dig hantera dem professionellt." />
        </div>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">Telefon</div>
              <div className="text-muted-foreground">0734-23 46 86</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-sm">
            <Mail className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">E-post</div>
              <div className="text-muted-foreground">info@homechef.nu</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">Öppettider</div>
              <div className="text-muted-foreground">Mån–Fre 09–18</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Konsekvenser */}
      <Section icon={AlertTriangle} title="9. Varningar & Konsekvenser">
        <div className="space-y-3">
          {[
            { level: '1', color: 'bg-amber-100 border-amber-300 text-amber-900', label: 'Varning', desc: 'Skriftlig påminnelse – registreras i kontot.' },
            { level: '2', color: 'bg-orange-100 border-orange-300 text-orange-900', label: 'Tillfällig avstängning', desc: 'Profilen inaktiveras i 14–30 dagar.' },
            { level: '3', color: 'bg-red-100 border-red-300 text-red-900', label: 'Permanent utestängning', desc: 'Kontot avslutas utan möjlighet till återaktivering.' },
          ].map((item) => (
            <div key={item.level} className={`flex items-start gap-3 p-3 rounded-lg border ${item.color}`}>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {item.level}
              </div>
              <div>
                <span className="font-semibold">{item.label} – </span>
                <span className="text-sm">{item.desc}</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Brott mot reglerna om parallell försäljning eller delning av kontaktuppgifter leder direkt till nivå 2 eller 3.
          </p>
        </div>
      </Section>

      {/* Avslut */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Avslutning till kocken</p>
              <p className="text-sm text-muted-foreground">
                <em>"Vi är glada att ha dig ombord. Ju mer du engagerar dig – bilder, sociala medier, bra recensioner – desto mer tjänar du. Vi är din partner, inte bara din plattform. Lycka till!"</em>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChefOnboardingGuide;
