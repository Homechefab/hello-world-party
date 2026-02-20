import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

export const ChefOnboardingGuide = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const ORANGE = [220, 80, 30] as const;
    const LIGHT_ORANGE = [255, 240, 230] as const;
    const DARK = [40, 40, 40] as const;
    const GRAY = [120, 120, 120] as const;
    const WHITE = [255, 255, 255] as const;
    const GREEN_BG = [235, 250, 240] as const;
    const GREEN = [30, 140, 70] as const;

    const addPage = () => { doc.addPage(); y = 22; };
    const checkPage = (needed = 20) => { if (y + needed > 275) addPage(); };
    const space = (n = 5) => { y += n; };

    const sectionTitle = (text: string, num: string) => {
      checkPage(18);
      doc.setFillColor(...ORANGE);
      doc.roundedRect(margin, y - 5, contentWidth, 14, 3, 3, 'F');
      doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WHITE);
      doc.text(`${num}  ${text}`, margin + 5, y + 4);
      doc.setTextColor(...DARK);
      y += 18;
    };

    const pill = (text: string, x: number, py: number, w: number, filled = true) => {
      if (filled) {
        doc.setFillColor(...ORANGE);
        doc.roundedRect(x, py - 5, w, 9, 2, 2, 'F');
        doc.setTextColor(...WHITE);
      } else {
        doc.setDrawColor(...ORANGE);
        doc.roundedRect(x, py - 5, w, 9, 2, 2, 'D');
        doc.setTextColor(...ORANGE);
      }
      doc.setFontSize(8); doc.setFont('helvetica', 'bold');
      doc.text(text, x + w / 2, py + 0.5, { align: 'center' });
      doc.setTextColor(...DARK);
    };

    const body = (text: string, indent = 0) => {
      checkPage(8);
      doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
      doc.setTextColor(...DARK);
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      lines.forEach((line: string) => {
        checkPage(6);
        doc.text(line, margin + indent, y);
        y += 5.2;
      });
    };

    const checkItem = (text: string) => {
      checkPage(10);
      doc.setFillColor(...LIGHT_ORANGE);
      doc.roundedRect(margin, y - 5, contentWidth, 10, 2, 2, 'F');
      doc.setFillColor(...ORANGE);
      doc.roundedRect(margin + 3, y - 2.5, 5, 5, 1, 1, 'F');
      doc.setTextColor(...WHITE);
      doc.setFontSize(8); doc.setFont('helvetica', 'bold');
      doc.text('ok', margin + 4, y + 1, { align: 'center' });
      doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...DARK);
      doc.text(text, margin + 12, y + 1);
      y += 13;
    };

    const statBox = (value: string, label: string, sub: string, x: number, w: number) => {
      doc.setFillColor(...LIGHT_ORANGE);
      doc.roundedRect(x, y, w, 28, 3, 3, 'F');
      doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...ORANGE);
      doc.text(value, x + w / 2, y + 12, { align: 'center' });
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...DARK);
      doc.text(label, x + w / 2, y + 20, { align: 'center' });
      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(...GRAY);
      doc.text(sub, x + w / 2, y + 25.5, { align: 'center' });
      doc.setTextColor(...DARK);
    };

    const infoBox = (text: string) => {
      checkPage(18);
      doc.setFillColor(...GREEN_BG);
      doc.setDrawColor(...GREEN);
      const lines = doc.splitTextToSize(text, contentWidth - 12);
      const h = lines.length * 5.5 + 10;
      doc.roundedRect(margin, y - 3, contentWidth, h, 3, 3, 'FD');
      doc.setFontSize(9); doc.setFont('helvetica', 'italic'); doc.setTextColor(...GREEN);
      lines.forEach((line: string) => {
        doc.text(line, margin + 6, y + 3);
        y += 5.5;
      });
      y += 8;
      doc.setTextColor(...DARK);
    };

    // ── COVER ──
    doc.setFillColor(...ORANGE);
    doc.rect(0, 0, pageWidth, 55, 'F');

    // Decorative circles
    doc.setFillColor(255, 100, 50);
    doc.circle(pageWidth - 20, 10, 25, 'F');
    doc.setFillColor(180, 60, 20);
    doc.circle(pageWidth - 5, 50, 15, 'F');

    doc.setFontSize(26); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
    doc.text('Homechef', margin, 22);
    doc.setFontSize(14); doc.setFont('helvetica', 'normal');
    doc.text('Välkommen som kockpartner!', margin, 33);
    doc.setFontSize(9);
    doc.text('Din guide till en lyckad start', margin, 42);
    doc.text('homechef.nu', margin, 51);
    doc.setTextColor(...DARK);
    y = 66;

    infoBox('"Du är nu en del av Sveriges mest spännande matplattform. Vi kopplar samman passionerade kockar med matälskare – och vi ser till att du får betalt för det du älskar."');

    // ── 1. VISION ──
    sectionTitle('Vad vi gör för dig', '01');
    body('Homechef hanterar marknadsföring, betalningar, kundservice och logistik. Du fokuserar på det du ar bast pa – maten.');
    space(3);
    const perks = ['Gratis marknadsföring', 'Betalningsskydd', 'Kundservice', 'Veckovis utbetalning'];
    const pw = (contentWidth - 9) / 4;
    perks.forEach((p, i) => pill(p, margin + i * (pw + 3), y + 5, pw));
    y += 16;
    space(8);

    // ── 2. CHECKLISTA ──
    sectionTitle('Din startchecklista', '02');
    [
      'Byt lösenord vid första inloggning',
      'Ladda upp en proffsig profilbild',
      'Skriv en kort och engagerande bio',
      'Lagg till dina specialiteter',
      'Länka dina sociala medier i dashboarden',
      'Lägg upp minst 3 rätter med foto och pris',
      'Las igenom och godkänn partnervillkoren',
    ].forEach(checkItem);
    space(3);
    infoBox('Kockar med minst 5 rätter och ett profilfoto säljer i genomsnitt 3x mer under sin första manad.');
    space(3);

    // ── 3. PROFIL ──
    sectionTitle('Din profil – ditt skyltfönster', '03');
    body('Kunderna ser: ditt namn, profilbild, bio, specialiteter, sociala medier, recensioner och dina rätter.');
    space(4);
    doc.setFillColor(...LIGHT_ORANGE);
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...ORANGE);
    doc.text('Din integritet skyddas', margin + 5, y + 8);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...DARK);
    doc.text('Privat telefon, e-post och adress ar aldrig synligt for kunder. All kommunikation', margin + 5, y + 14);
    y += 14;
    doc.text('sker via Homechef – du ar alltid trygg och skyddad vid eventuella tvister.', margin + 5, y + 3);
    y += 12;
    space(8);

    // ── 4. FÖRSÄLJNING ──
    sectionTitle('Försäljning via Homechef', '04');
    body('Homechef ar din primara försäljningskanal – har nar du tusentals kunder som aktivt letar efter det du lagar. Det ger dig:');
    space(4);
    const benefits = [
      ['Juridisk trygghet', 'Tvister hanteras av oss'],
      ['Kvalitetsstämpel', 'Kunderna litar pa Homechef'],
      ['Statistik', 'Se vad som säljer bäst'],
    ];
    const bw = (contentWidth - 6) / 3;
    benefits.forEach(([title, sub], i) => {
      const bx = margin + i * (bw + 3);
      doc.setFillColor(...ORANGE);
      doc.roundedRect(bx, y, bw, 22, 3, 3, 'F');
      doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
      doc.text(title, bx + bw / 2, y + 9, { align: 'center' });
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.text(sub, bx + bw / 2, y + 16, { align: 'center' });
    });
    doc.setTextColor(...DARK);
    y += 30;
    space(6);

    // ── 5. SOCIALA MEDIER ──
    sectionTitle('Sociala medier – mer synlighet, mer försäljning', '05');
    body('Dina kanaler ar ett kraftfullt verktyg. Vi uppmuntrar dig att vara aktiv och dela ditt kockande!');
    space(4);
    [
      'Posta matbilder, recept och bakom kulisserna – det bygger förtroende.',
      'Länka alltid till din Homechef-profil med texten "Bestall via homechef.nu".',
      'Tagga @homechef i inlägg – vi delar och boostrar ditt innehall till var publik.',
    ].forEach(t => {
      checkPage(10);
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...DARK);
      doc.setFillColor(...ORANGE);
      doc.circle(margin + 3, y - 1, 1.5, 'F');
      const lines = doc.splitTextToSize(t, contentWidth - 10);
      lines.forEach((line: string) => { doc.text(line, margin + 8, y); y += 5.2; });
      y += 1;
    });
    space(6);

    // ── 6. MAT & KVALITET ──
    sectionTitle('Mat, kvalitet & allergener', '06');
    [
      'Alla rätter ska uppfylla kommunens livsmedelskrav.',
      'Allergeninformation ar obligatorisk – det är ett lagkrav som skyddar dina kunder.',
      'Hall menyn uppdaterad för bättre synlighet i sök.',
    ].forEach(t => {
      checkPage(10);
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...DARK);
      doc.setFillColor(...ORANGE);
      doc.circle(margin + 3, y - 1, 1.5, 'F');
      doc.text(t, margin + 8, y);
      y += 7;
    });
    space(6);

    // ── 7. BETALNING ──
    sectionTitle('Betalning & utbetalning', '07');
    statBox('81%', 'Din andel', 'av ditt pris', margin, 55);
    statBox('19%', 'Homechefs provision', 'av ditt pris', margin + 58, 55);
    statBox('6%', 'Serviceavgift', 'betalas av kunden', margin + 116, 55);
    y += 36;
    body('Utbetalning sker varje vecka direkt till ditt konto. Vi hanterar Kort, Swish och Klarna.');
    space(8);

    // ── 8. MARKNADSFÖRING ──
    sectionTitle('Hur vi marknadsför dig', '08');
    const mkt = ['Google Ads & SEO', 'Sociala medier', 'Nyhetsbrev', 'Featured-kampanjer'];
    const mw = (contentWidth - 9) / 4;
    mkt.forEach((m, i) => pill(m, margin + i * (mw + 3), y + 5, mw, i % 2 === 0));
    y += 16;
    space(3);
    body('Ju fler bra recensioner du far – desto högre upp i sök hamnar du. Vi hjälper dig nå toppen.');
    space(8);

    // ── 9. SUPPORT ──
    sectionTitle('Support & kontakt', '09');
    body('Vi hanterar all kundservice, reklamationer och aterbetalninar at dig. Du behöver aldrig hantera tvister pa egen hand.');
    space(5);
    doc.setFillColor(...LIGHT_ORANGE);
    doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...ORANGE);
    doc.text('Telefon: 0734-23 46 86', margin + 8, y + 9);
    doc.text('E-post: info@homechef.nu', margin + 8, y + 18);
    doc.setTextColor(...GRAY);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.text('Man-Fre 09:00-18:00', margin + contentWidth - 45, y + 9);
    doc.setTextColor(...DARK);
    y += 32;
    space(8);

    // ── AVSLUT ──
    checkPage(30);
    doc.setFillColor(...ORANGE);
    doc.roundedRect(margin, y, contentWidth, 28, 4, 4, 'F');
    doc.setFillColor(255, 100, 50);
    doc.circle(margin + contentWidth - 10, y + 14, 18, 'F');
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
    doc.text('Vi ar din partner – inte bara din plattform.', margin + 6, y + 11);
    doc.setFontSize(9); doc.setFont('helvetica', 'italic');
    doc.text('"Ju mer du engagerar dig, desto mer tjänar du. Lycka till!"', margin + 6, y + 21);
    doc.setTextColor(...DARK);
    y += 36;

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(...ORANGE);
      doc.rect(0, 287, pageWidth, 10, 'F');
      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(...WHITE);
      doc.text('homechef.nu', margin, 293);
      doc.text(`Sida ${i} av ${totalPages}`, pageWidth / 2, 293, { align: 'center' });
      doc.text(new Date().toLocaleDateString('sv-SE'), pageWidth - margin, 293, { align: 'right' });
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
            Vision, checklista, regler, betalning & support
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChefOnboardingGuide;
