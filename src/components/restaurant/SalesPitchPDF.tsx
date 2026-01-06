import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

const SalesPitchPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 25;

      // Helper functions
      const addTitle = (text: string, size: number = 24) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(41, 128, 185);
        doc.text(text, pageWidth / 2, y, { align: "center" });
        y += size * 0.5;
      };

      const addSubtitle = (text: string) => {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(44, 62, 80);
        doc.text(text, margin, y);
        y += 10;
      };

      const addParagraph = (text: string) => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(52, 73, 94);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 6 + 5;
      };

      const addBullet = (text: string) => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(52, 73, 94);
        doc.text("•", margin, y);
        const lines = doc.splitTextToSize(text, contentWidth - 10);
        doc.text(lines, margin + 8, y);
        y += lines.length * 6 + 2;
      };

      const addHighlight = (text: string, color: [number, number, number] = [39, 174, 96]) => {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...color);
        doc.text(text, pageWidth / 2, y, { align: "center" });
        y += 10;
      };

      // === PAGE 1: Cover ===
      y = 60;
      addTitle("Homechef", 32);
      y += 10;
      addTitle("Restaurangpartnerskap", 20);
      y += 20;
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(127, 140, 141);
      doc.text("Öka er lönsamhet med Sveriges smartaste", pageWidth / 2, y, { align: "center" });
      y += 8;
      doc.text("leveransplattform för restauranger", pageWidth / 2, y, { align: "center" });
      
      y += 40;
      
      // Key stat box
      doc.setFillColor(39, 174, 96);
      doc.roundedRect(margin, y, contentWidth, 35, 5, 5, "F");
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("70% BILLIGARE", pageWidth / 2, y + 15, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("än provisionsbaserade plattformar", pageWidth / 2, y + 27, { align: "center" });
      
      y += 55;
      
      addParagraph("Denna presentation visar hur Homechef kan hjälpa er restaurang att öka lönsamheten genom vår unika prismodell med fast månadsavgift istället för provision per order.");

      // === PAGE 2: Problem ===
      doc.addPage();
      y = 25;
      
      addTitle("Problemet med provisionsmodeller", 18);
      y += 15;
      
      addParagraph("Stora leveransplattformar som Foodora, Uber Eats och Wolt tar typiskt 20-30% i provision per order. Detta innebär:");
      y += 5;
      
      addBullet("Ju mer ni säljer, desto mer betalar ni i avgifter");
      addBullet("Oförutsägbara kostnader varje månad");
      addBullet("Minskad marginal på varje rätt");
      addBullet("Svårt att planera och budgetera");
      
      y += 10;
      
      // Example calculation box
      doc.setFillColor(231, 76, 60);
      doc.setDrawColor(231, 76, 60);
      doc.roundedRect(margin, y, contentWidth, 50, 3, 3, "S");
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(231, 76, 60);
      doc.text("Exempel: Provisionsmodell (30%)", margin + 5, y + 12);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(52, 73, 94);
      doc.text("10 ordrar/dag × 200 kr = 60 000 kr omsättning/månad", margin + 5, y + 24);
      doc.text("30% provision = 18 000 kr/månad i avgifter", margin + 5, y + 34);
      doc.setFont("helvetica", "bold");
      doc.text("Årskostnad: 216 000 kr", margin + 5, y + 44);
      
      y += 70;
      
      addSubtitle("Branschstatistik");
      addParagraph("Enligt branschuppgifter tar stora leveransplattformar upp till 30% provision per order, och den effektiva avgiften kan bli ännu högre när alla tillägg räknas med. Detta är ofta restaurangernas största kostnad för att använda tjänsten.");

      // === PAGE 3: Solution ===
      doc.addPage();
      y = 25;
      
      addTitle("Homechef-lösningen", 18);
      y += 15;
      
      addParagraph("Med Homechef betalar ni en fast månadsavgift – ingen provision på era försäljningar. Ni behåller hela marginalen på varje order.");
      y += 5;
      
      // Solution box
      doc.setFillColor(39, 174, 96);
      doc.setDrawColor(39, 174, 96);
      doc.roundedRect(margin, y, contentWidth, 50, 3, 3, "S");
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(39, 174, 96);
      doc.text("Exempel: Homechef (fast avgift)", margin + 5, y + 12);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(52, 73, 94);
      doc.text("Samma omsättning: 60 000 kr/månad", margin + 5, y + 24);
      doc.text("Fast avgift: 5 399 kr/månad (Liten restaurang)", margin + 5, y + 34);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(39, 174, 96);
      doc.text("Besparing: 12 601 kr/månad = 151 212 kr/år", margin + 5, y + 44);
      
      y += 70;
      
      addSubtitle("Fördelar med fast månadsavgift");
      addBullet("Förutsägbar kostnad – inga överraskningar");
      addBullet("Högre lönsamhet – behåll hela marginalen");
      addBullet("Incitament att växa – mer försäljning = mer vinst för ER");
      addBullet("70% billigare i genomsnitt jämfört med provisionsmodeller");

      // === PAGE 4: Pricing ===
      doc.addPage();
      y = 25;
      
      addTitle("Våra prisplaner", 18);
      y += 15;
      
      // Plan boxes
      const plans = [
        { name: "Liten restaurang", price: "5 399", desc: "Upp till ~10 ordrar/dag", features: ["Upp till 50 rätter", "Grundläggande statistik", "E-postsupport"] },
        { name: "Medelstor restaurang", price: "13 499", desc: "~15-30 ordrar/dag", features: ["Obegränsat antal rätter", "Avancerad statistik", "Prioriterad support"] },
        { name: "Stor restaurang", price: "26 999", desc: "50+ ordrar/dag", features: ["Dedikerad kontoansvarig", "API-integration", "Premium marknadsföring"] }
      ];

      plans.forEach((plan, index) => {
        const boxY = y + index * 55;
        const isMiddle = index === 1;
        
        if (isMiddle) {
          doc.setFillColor(41, 128, 185);
          doc.roundedRect(margin, boxY, contentWidth, 50, 3, 3, "F");
          doc.setTextColor(255, 255, 255);
        } else {
          doc.setDrawColor(189, 195, 199);
          doc.roundedRect(margin, boxY, contentWidth, 50, 3, 3, "S");
          doc.setTextColor(44, 62, 80);
        }
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(plan.name, margin + 5, boxY + 12);
        
        doc.setFontSize(18);
        doc.text(`${plan.price} kr/mån`, margin + 5, boxY + 28);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(plan.desc, margin + 5, boxY + 40);
        
        doc.setFontSize(9);
        const featuresText = plan.features.join(" • ");
        doc.text(featuresText, margin + 80, boxY + 40);
      });
      
      y += 180;
      
      addHighlight("Ingen bindningstid – avsluta när ni vill!");

      // === PAGE 5: Comparison ===
      doc.addPage();
      y = 25;
      
      addTitle("Jämförelse: Homechef vs Foodora", 18);
      y += 15;
      
      // Table header
      doc.setFillColor(44, 62, 80);
      doc.rect(margin, y, contentWidth, 12, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Restaurangstorlek", margin + 5, y + 8);
      doc.text("Foodora (~30%)", margin + 55, y + 8);
      doc.text("Homechef", margin + 105, y + 8);
      doc.text("Besparing/år", margin + 145, y + 8);
      y += 12;
      
      // Table rows
      const comparisons = [
        { size: "Liten (10 ordrar/dag)", foodora: "18 000 kr/mån", homechef: "5 399 kr/mån", savings: "151 212 kr" },
        { size: "Medelstor (25 ordrar/dag)", foodora: "45 000 kr/mån", homechef: "13 499 kr/mån", savings: "378 012 kr" },
        { size: "Stor (50 ordrar/dag)", foodora: "90 000 kr/mån", homechef: "26 999 kr/mån", savings: "756 012 kr" }
      ];
      
      comparisons.forEach((row, index) => {
        const rowY = y + index * 15;
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, rowY, contentWidth, 15, "F");
        }
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(52, 73, 94);
        doc.text(row.size, margin + 5, rowY + 10);
        
        doc.setTextColor(231, 76, 60);
        doc.text(row.foodora, margin + 55, rowY + 10);
        
        doc.setTextColor(39, 174, 96);
        doc.text(row.homechef, margin + 105, rowY + 10);
        
        doc.setFont("helvetica", "bold");
        doc.text(row.savings, margin + 145, rowY + 10);
      });
      
      y += 60;
      
      addParagraph("* Beräknat på genomsnittligt ordervärde 200 kr, 30 dagar/månad");
      
      y += 10;
      
      // Key insight box
      doc.setFillColor(241, 196, 15);
      doc.roundedRect(margin, y, contentWidth, 25, 3, 3, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("Viktigt: Ju mer ni säljer via Foodora, desto mer straffas ni.", margin + 5, y + 10);
      doc.setFont("helvetica", "normal");
      doc.text("Med Homechef tjänar NI mer ju mer ni säljer – inte plattformen.", margin + 5, y + 20);

      // === PAGE 6: Contact ===
      doc.addPage();
      y = 60;
      
      addTitle("Kom igång idag!", 24);
      y += 20;
      
      addParagraph("Vi hjälper er att öka lönsamheten och nå fler kunder. Kontakta oss för att diskutera hur Homechef kan hjälpa just er restaurang.");
      
      y += 20;
      
      // Contact info
      doc.setFillColor(41, 128, 185);
      doc.roundedRect(margin, y, contentWidth, 60, 5, 5, "F");
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Kontakta oss", pageWidth / 2, y + 15, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("E-post: info@homechef.nu", pageWidth / 2, y + 32, { align: "center" });
      doc.text("Telefon: 0734234686", pageWidth / 2, y + 47, { align: "center" });
      
      y += 80;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(127, 140, 141);
      doc.text("Besök vår hemsida: homechef.nu", pageWidth / 2, y, { align: "center" });
      
      y += 30;
      
      addHighlight("Ansök idag – vi återkommer inom 24 timmar!");

      // Save
      doc.save("Homechef-Restaurangpartnerskap.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generatePDF} 
      disabled={isGenerating}
      variant="outline"
      size="lg"
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Genererar PDF...
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          Ladda ner säljpitch (PDF)
        </>
      )}
    </Button>
  );
};

export default SalesPitchPDF;
