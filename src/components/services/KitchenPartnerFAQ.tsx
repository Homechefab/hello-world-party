import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const KitchenPartnerFAQ = () => {
  const faqs = [
    {
      question: "Hur mycket kan jag tjäna på att hyra ut mitt kök?",
      answer: "Det beror på kökets storlek, läge och utrustning. Mindre kök kan hyras ut för 150-250 kr per timme, standardkök för 300-400 kr/timme, och premiumkök med professionell utrustning för 450-500+ kr per timme. Om du hyr ut ditt kök 15 timmar i veckan till 350 kr/timme blir det cirka 21 000 kr per månad."
    },
    {
      question: "Vilka krav ställs på mitt kök?",
      answer: "Köket måste vara kommersiellt godkänt med gällande livsmedelstillstånd från kommunen. Det ska ha professionell utrustning, tillgång till rengöring och vara i en säker miljö. Vi granskar alla kök innan de godkänns på plattformen för att säkerställa att de uppfyller kraven."
    },
    {
      question: "Vad händer om något går sönder under uthyrningen?",
      answer: "Alla uthyrningar är försäkrade genom Homechef utan extra kostnad för dig. Om något går sönder eller skadas under hyrtiden täcks detta av försäkringen. Kocken ansvarar för att rapportera eventuella skador direkt, och vi hanterar ersättning och reparationer."
    },
    {
      question: "Hur vet jag att kockarna är pålitliga?",
      answer: "Alla kockar som får hyra kök genom Homechef genomgår en noggrann kontroll. De måste ha giltigt livsmedelstillstånd, vara registrerade som näringsidkare, och vi verifierar deras identitet. Vi samlar även in omdömen från tidigare uthyrningar så att du kan se kockens historik."
    },
    {
      question: "Kan jag välja vilka tider jag vill hyra ut?",
      answer: "Ja, du har full kontroll över när ditt kök är tillgängligt. Du kan enkelt ange tillgängliga tider i din kalender och blockera perioder när köket inte kan hyras ut. Många restauranger väljer att hyra ut under icke-öppettider som eftermiddagar eller sent på kvällen."
    },
    {
      question: "Hur får jag betalt?",
      answer: "Betalningen sker automatiskt efter varje uthyrning. Pengarna överförs till ditt konto inom 1-3 bankdagar efter att hyrtiden är avslutad. Du får detaljerade rapporter på alla transaktioner och kan enkelt se din intjäning i dashboarden."
    },
    {
      question: "Vad ingår i Homechefs provision?",
      answer: "Homechef tar en provision på 20% av hyresintäkten. Detta täcker plattformen, betalhantering, försäkring, kundsupport och marknadsföring. Det finns inga månadskostnader eller startavgifter - du betalar bara när du faktiskt hyr ut."
    },
    {
      question: "Måste jag vara på plats under uthyrningen?",
      answer: "Nej, du behöver inte vara på plats. Många kökspartners använder kodlås eller smart låssystem för att ge kockar tillgång. Du kan även välja att vara på plats om du föredrar det. Vi rekommenderar att ha tydliga rutiner för nyckelhantering."
    },
    {
      question: "Vad händer med rengöringen?",
      answer: "Kocken ansvarar för att lämna köket i samma skick som det var när hen kom. Detta inkluderar disk, rengöring av arbetsytor och utrustning. Om köket inte är rent när kocken lämnar kan du rapportera detta och kocken kan få en avgift samt sämre betyg."
    },
    {
      question: "Kan jag säga nej till en bokningsförfrågan?",
      answer: "Ja, du kan alltid granska en bokningsförfrågan innan du accepterar den. Du ser kockens profil, betyg och vad de planerar att laga. Om något inte känns bra kan du avböja förfrågan utan någon förklaring."
    },
    {
      question: "Vad händer om kocken inte dyker upp?",
      answer: "Om en kock inte dyker upp till en bokad tid utan att avboka i förväg får hen en avgift och sämre betyg. Du får full ersättning för den bokade tiden. Vi tar no-shows på största allvar och upprepade överträdelser kan leda till att kocken stängs av från plattformen."
    },
    {
      question: "Hur lång tid tar godkännandeprocessen?",
      answer: "Efter att du registrerat ditt kök granskar vi ansökan inom 2-3 arbetsdagar. Vi kan behöva komma på platsbesök för att verifiera köket och utrustningen. Om allt är i sin ordning kan du börja ta emot bokningar direkt efter godkännandet."
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Vanliga frågor för kökspartners
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Här hittar du svar på de vanligaste frågorna om att hyra ut ditt kök
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default KitchenPartnerFAQ;
