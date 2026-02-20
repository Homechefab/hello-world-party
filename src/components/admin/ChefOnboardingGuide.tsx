import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

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
      doc.setFontSize(16); doc.setFont('helvetica', 'bold');
      doc.setFillColor(220, 80, 30);
      doc.rect(margin, y - 6, contentWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(text, margin + 4, y + 2);
      doc.setTextColor(0, 0, 0);
      y += 16;
    };

    const h2 = (text: string) => {
      checkPage(10);
      doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 80, 30);
      doc.text(text, margin, y);
      doc.setTextColor(0, 0, 0);
      y += 8;
    };

    const body = (text: string, indent = 0) => {
      checkPage(8);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      lines.forEach((line: string) => {
        checkPage(6);
        doc.text(line, margin + indent, y);
        y += 5.5;
      });
      doc.setTextColor(0, 0, 0);
    };

    const bullet = (text: string) => {
      checkPage(8);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(text, contentWidth - 8);
      lines.forEach((line: string, i: number) => {
        checkPage(6);
        if (i === 0) doc.text('•', margin + 3, y);
        doc.text(line, margin + 8, y);
        y += 5.5;
      });
      doc.setTextColor(0, 0, 0);
    };

    const space = (n = 5) => { y += n; };

    const highlight = (text: string) => {
      checkPage(14);
      doc.setFillColor(255, 248, 240);
      doc.setDrawColor(220, 80, 30);
      const lines = doc.splitTextToSize(text, contentWidth - 10);
      const boxH = lines.length * 5.5 + 8;
      doc.roundedRect(margin, y - 4, contentWidth, boxH, 2, 2, 'FD');
      doc.setFontSize(10); doc.setFont('helvetica', 'italic'); doc.setTextColor(100, 40, 0);
      lines.forEach((line: string) => {
        doc.text(line, margin + 5, y + 2);
        y += 5.5;
      });
      doc.setTextColor(0, 0, 0);
      y += 6;
    };

    // ── COVER PAGE ──
    doc.setFillColor(220, 80, 30);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setFontSize(24); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Välkommen till Homechef', margin, 28);
    doc.setFontSize(13); doc.setFont('helvetica', 'normal');
    doc.text('Din guide till en framgångsrik start som kockpartner', margin, 40);
    doc.setFontSize(10);
    doc.text(`homechef.nu  •  info@homechef.nu  •  0734-23 46 86`, margin, 52);
    doc.setTextColor(0, 0, 0);
    y = 72;

    highlight('"Du är nu en del av Sveriges mest spännande matplattform. Vi kopplar samman passionerade kockar med matälskare – och vi ser till att du får betalt för det du älskar att göra."');

    // ── 1. VÅR VISION ──
    h1('1. Vår Vision – Tillsammans Bygger Vi Något Stort');
    body('Homechef är en exklusiv marknadsplats där noggrant utvalda kockar möter matälskare som söker autentisk, hemlagad mat av högsta kvalitet. Att vara en Homechef-partner innebär att du är en del av ett selektivt nätverk – ett varumärke som kunderna litar på.');
    space();
    body('Vi tar hand om allt det administrativa: marknadsföring, betalningar, kundservice och logistik. Ditt fokus är det du är bäst på – att skapa fantastisk mat.');
    space(8);

    // ── 2. CHECKLISTA ──
    h1('2. Kom Igång – Din Startchecklista');
    const checks = [
      'Byt lösenord vid första inloggning',
      'Ladda upp en proffsig profilbild med bra ljussättning',
      'Skriv en engagerande bio – berätta din mathistoria',
      'Fyll i dina specialiteter och matkategorier',
      'Länka dina sociala medier i dashboarden',
      'Lägg upp minst 3 rätter med foto, beskrivning och pris',
      'Sätt dina tillgängliga leveranstider',
      'Läs igenom och godkänn Homechefs partnervillkor',
    ];
    checks.forEach(c => body(`  ☐  ${c}`, 2));
    space();
    body('Tips: Kockar som startar med minst 5 rätter och ett professionellt profilfoto säljer i genomsnitt 3× mer under sin första månad.');
    space(8);

    // ── 3. DIN PROFIL ──
    h1('3. Din Profil – Ditt Skyltfönster');
    body('Din profil är det första kunderna ser. En välgjord profil bygger förtroende och driver försäljning. Homechef visar det som skapar trygghet för kunden:');
    space(3);
    h2('Vad kunden ser');
    ['Ditt namn och profilbild', 'Din bio och mathistoria', 'Specialiteter och kökstraditioner', 'Dina sociala medier (TikTok, Instagram, Facebook, Snapchat)', 'Kundrecensioner och stjärnbetyg', 'Dina rätter med bilder och priser'].forEach(i => bullet(i));
    space(3);
    h2('Vad som hålls privat – för din säkerhet');
    body('Din personliga kontaktinformation – telefonnummer, e-postadress och hemadress – är aldrig synlig för kunder. Det skyddar din integritet och säkerställer att all kommunikation sker på ett tryggt och dokumenterat sätt via Homechef-plattformen. Om en tvist uppstår finns allt loggat och du är alltid skyddad.');
    space(8);

    // ── 4. FÖRSÄLJNING VIA HOMECHEF ──
    h1('4. Försäljning via Homechef – Din Tryggaste Kanal');
    body('Homechef är din primära försäljningskanal. Det är här du når ut till tusentals kunder som aktivt letar efter det du lagar. Att samla all din försäljning på en plattform ger dig dessutom:');
    space(3);
    bullet('Juridisk trygghet – vid eventuella kundtvister eller reklamationer finns allt dokumenterat och hanterat av oss.');
    bullet('Kvalitetsstämpel – kunder litar på Homechef som varumärke, vilket ökar dina konverteringar.');
    bullet('Betalningsskydd – du behöver aldrig hantera pengar, fakturor eller återbetalningar själv.');
    bullet('Statistik och insikter – se exakt vad som säljer och optimera din meny.');
    space(4);
    body('En gemensam, stark plattform gynnar alla partners. Ju fler nöjda kunder vi har – desto mer exponering och försäljning får du.');
    space(8);

    // ── 5. SOCIALA MEDIER ──
    h1('5. Sociala Medier – Bygg Ditt Varumärke, Öka Din Försäljning');
    body('Dina sociala kanaler är ett kraftfullt verktyg för att locka nya kunder. Vi uppmuntrar dig varmt att vara aktiv och dela ditt kockande med världen.');
    space(3);
    bullet('Posta matbilder, recept och bakom-kulisserna-innehåll – det bygger förtroende och skapar nyfikenhet.');
    bullet('Länka alltid till din Homechef-profil i din bio och i inlägg med texten "Beställ via homechef.nu".');
    bullet('Tagga @homechef i dina inlägg – vi delar och förstärker ditt innehåll till vår publik.');
    bullet('Att hänvisa kunder via Homechef ger dem ett tryggare köpupplevelse med betalningsskydd och support.');
    space(4);
    body('Kom ihåg: bilder och beskrivningar ska representera den faktiska rätten kunden beställer – ärlighet bygger långsiktiga kundrelationer och bra recensioner.');
    space(8);

    // ── 6. MAT & KVALITET ──
    h1('6. Mat, Kvalitet & Allergener');
    bullet('Alla rätter ska uppfylla kommunens livsmedelskrav och tillstånd – vi hjälper dig navigera om du är osäker.');
    bullet('Tydlig allergeninformation är obligatorisk för varje rätt och ett krav enligt lag. Det skyddar dina kunder och dig.');
    bullet('Håll din meny uppdaterad. Rätter som länge stått inaktiva påverkar ditt synlighetsbetyg negativt.');
    bullet('Professionella matfotografier ökar din försäljning markant – vi kan ge tips och råd.');
    space(8);

    // ── 7. BETALNING & UTBETALNING ──
    h1('7. Betalning & Utbetalning');
    body('Du sätter priset på dina rätter själv. Vi ser till att du får betalt smidigt och i tid.');
    space(3);

    // Simple table
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, contentWidth, 30, 'F');
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(220, 80, 30);
    doc.text('81%', margin + 10, y + 10);
    doc.text('19%', margin + 75, y + 10);
    doc.text('6%', margin + 140, y + 10);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
    doc.text('Din andel', margin + 6, y + 18);
    doc.text('Homechefs provision', margin + 62, y + 18);
    doc.text('Kundens serviceavg.', margin + 127, y + 18);
    doc.text('av ditt pris', margin + 8, y + 25);
    doc.text('av ditt pris', margin + 72, y + 25);
    doc.text('betalas av kunden', margin + 127, y + 25);
    doc.setTextColor(0, 0, 0);
    y += 38;

    bullet('Kunder betalar tryggt via Kort, Swish eller Klarna – vi hanterar allt.');
    bullet('Utbetalning sker veckovis direkt till ditt registrerade bankkonto.');
    bullet('Du får en automatisk månadsrapport till din @homechef.se-adress.');
    bullet('Moms och skattehantering är ditt ansvar – vi tillhandahåller komplett underlag.');
    space(8);

    // ── 8. HUR VI MARKNADSFÖR DIG ──
    h1('8. Hur Vi Marknadsför Dig');
    body('Vi investerar aktivt i att driva trafik och nya kunder till plattformen. Det gynnar dig direkt:');
    space(3);
    bullet('Synlighet på startsidan och i kategorisök');
    bullet('Annonsering via Google Ads och organisk SEO');
    bullet('Delning av ditt innehåll på våra sociala kanaler');
    bullet('Nyhetsbrev till tusentals matintresserade kunder');
    bullet('Featured chef-kampanjer för toppsäljare');
    space(4);
    body('Ju fler positiva recensioner och betyg du samlar – desto högre upp i sökresultaten hamnar du. Vi hjälper dig nå toppen.');
    space(8);

    // ── 9. SUPPORT ──
    h1('9. Support & Kundkommunikation');
    body('Du ska aldrig behöva hantera kundklagomål eller tvister på egen hand. Homechef tar hand om all kundservice, reklamationer och återbetalningar – det är en del av vad du betalar provision för.');
    space(3);
    bullet('Vid produktionsproblem eller sjukdom – meddela oss omedelbart via appen så informerar vi väntande kunder.');
    bullet('Negativa recensioner är en naturlig del av verksamheten. Vi hjälper dig svara professionellt och vända dem till något positivt.');
    space(4);
    h2('Kontakta oss');
    body('📞  Telefon: 0734-23 46 86');
    body('📧  E-post: info@homechef.nu');
    body('🕘  Öppettider: Måndag–Fredag, 09:00–18:00');
    space(8);

    // ── AVSLUT ──
    doc.setFillColor(220, 80, 30);
    doc.rect(margin, y, contentWidth, 30, 'F');
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Välkommen ombord – vi är din partner, inte bara din plattform.', margin + 5, y + 12);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text('"Ju mer du engagerar dig, desto mer tjänar du. Lycka till!"', margin + 5, y + 22);
    doc.setTextColor(0, 0, 0);
    y += 38;

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(150, 150, 150);
      doc.text(`homechef.nu  •  Sida ${i} av ${totalPages}`, margin, 290);
      doc.text(`Genererat ${new Date().toLocaleDateString('sv-SE')}`, pageWidth - margin - 40, 290);
    }

    doc.save('Homechef_Kock-Onboarding.pdf');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="pt-10 pb-10 px-8 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Kock-onboarding Guide
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Komplett partnerguide för nya kockar. Ladda ner PDF:en och gå igenom den vid uppstartssamtalet.
            </p>
          </div>
          <Button onClick={generatePDF} size="lg" className="w-full flex items-center gap-2">
            <Download className="h-5 w-5" />
            Ladda ner PDF
          </Button>
          <p className="text-xs text-muted-foreground">
            Innehåller: vision, checklista, regler, betalning & support
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChefOnboardingGuide;
