import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const RestaurantFAQ = () => {
  const faqs = [
    {
      question: "Vilka prisplaner finns för restauranger?",
      answer: "Vi erbjuder tre prisplaner: Liten (3 999 kr/mån, upp till 30 beställningar/dag), Medelstor (5 999 kr/mån, 30–60 beställningar/dag med premiumprofil och prioriterad support) och Stor/Företag (anpassat pris för kedjor med obegränsat antal beställningar och API-integration). Alla planer har 0% provision – ni behåller hela matintäkten."
    },
    {
      question: "Kan jag byta prisplan?",
      answer: "Ja, ni kan byta plan när som helst. Uppgradering sker direkt och ni får tillgång till alla funktioner i den nya planen omedelbart. Vid nedgradering gäller den nya planen från och med nästa faktureringsperiod. Kontakta vår support om ni vill byta plan."
    },
    {
      question: "Finns det bindningstid?",
      answer: "Nej, vi har ingen bindningstid. Alla planer löper månadsvis och kan avslutas med en månads uppsägningstid. Vi erbjuder även årsavtal med rabatterat pris om ni vill planera längre fram. Inga uppsägningsavgifter tillkommer oavsett plan."
    },
    {
      question: "Vad händer om jag överskrider ordergränsen?",
      answer: "Om ni på planen Liten (30 order/dag) eller Medelstor (30–60 order/dag) regelbundet överstiger er gräns kontaktar vi er och rekommenderar en uppgradering. Vi stänger aldrig av beställningar mitt i en dag – er verksamhet påverkas inte. En enstaka toppdag är inget problem, det är det genomsnittliga flödet som avgör vilken plan som passar er bäst."
    },
    {
      question: "Hur snabbt kan vi komma igång?",
      answer: "Efter att ni skickat in er ansökan granskar vi den inom 2-3 arbetsdagar. Vi kontrollerar livsmedelstillstånd, F-skattsedel och övrig dokumentation. När ni är godkända kan ni direkt ladda upp er meny och börja ta emot beställningar. Den totala processen tar vanligtvis 3-5 arbetsdagar."
    },
    {
      question: "Måste vi använda Homechefs leveranstjänst?",
      answer: "Nej, ni kan välja att använda era egna förare om ni vill. Många restauranger föredrar detta då det ger bättre kontroll över kundupplevelsen. Om ni inte har egna förare fixar vi leveransen åt er mot en mindre avgift. Ni kan också blanda - använda egna förare för närområdet och vår tjänst för längre sträckor."
    },
    {
      question: "Hur fungerar betalningarna?",
      answer: "Alla betalningar hanteras genom vår säkra plattform. Kunder betalar när de beställer, och vi överför pengarna till ert konto två gånger per vecka. Ni får detaljerade rapporter över alla transaktioner och kan enkelt följa er försäljning i realtid via dashboarden."
    },
    {
      question: "Kan vi sätta våra egna priser?",
      answer: "Ja, ni bestämmer helt själva vilka priser ni vill ha på er mat. Vi rekommenderar att ni justerar för plattformsavgiften, men slutpriset är alltid ert beslut. Ni kan också enkelt skapa erbjudanden, paketpriser eller kampanjer när ni vill öka försäljningen."
    },
    {
      question: "Vad händer om en kund klagar på maten?",
      answer: "Vi hanterar alla kundklagomål genom vår kundsupport. Om klagomålet är berättigat kontaktar vi er för att höra er version. I de flesta fall kan vi lösa situationen med en rabatt eller återbetalning utan att det påverkar er. Vi skyddar våra restaurangpartners mot oskäliga klagomål."
    },
    {
      question: "Kan vi använda egna matlådor och förpackningar?",
      answer: "Ja, ni kan använda era egna förpackningar om de är lämpliga för leverans. Vi rekommenderar miljövänliga alternativ och kan även hjälpa er att beställa bra förpackningar till bra priser. Det viktigaste är att maten kommer fram i gott skick till kunden."
    },
    {
      question: "Hur marknadsför ni vår restaurang?",
      answer: "Vi marknadsför alla våra restaurangpartners genom vår hemsida, app, sociala medier och annonsering. Nya partners får extra exponering på startsidan. Vi använder SEO för att synas i sökmotorer och skickar ut nyhetsbrev till våra kunder. Ni får även verktyg för att marknadsföra er profil själva."
    },
    {
      question: "Måste vi justera vår befintliga meny?",
      answer: "Ni kan använda er befintliga meny som den är, men vissa rätter passar bättre för hemleverans än andra. Vi rekommenderar att fokusera på rätter som håller sig bra under transport. Ni kan också skapa en separat meny bara för Homechef med rätter optimerade för leverans."
    },
    {
      question: "Vad krävs för att bli godkänd som restaurangpartner?",
      answer: "Ni måste ha giltigt livsmedelstillstånd från kommunen, vara registrerade hos Skatteverket med F-skattsedel, och ha företagsförsäkring. Vi granskar också er restaurang och meny för att säkerställa kvalitet. Alla våra partners måste uppfylla samma höga standard."
    },
    {
      question: "Hur hanterar vi många beställningar samtidigt?",
      answer: "Vår plattform hjälper er att hantera beställningsflödet effektivt. Ni kan sätta gränser för hur många beställningar ni tar per timme och justera tillgängligheten i realtid. Vi har även ett system som fördelar beställningar jämnt över tiden för att undvika rusningar."
    },
    {
      question: "Kan vi pausa vårt samarbete tillfälligt?",
      answer: "Ja, ni kan när som helst pausa ert konto om ni behöver det. Detta kan vara bra under renoveringar, semesterstängningar eller om ni är fullbokade. Ni kan enkelt aktivera kontot igen när ni är redo att ta emot beställningar. Det finns inga avgifter för att pausa."
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Vanliga frågor för restauranger
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Här hittar du svar på de vanligaste frågorna om att bli restaurangpartner
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

export default RestaurantFAQ;
