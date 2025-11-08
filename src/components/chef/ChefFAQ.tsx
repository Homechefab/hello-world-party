import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const ChefFAQ = () => {
  const faqs = [
    {
      question: "Hur lång tid tar det att få alla tillstånd på plats?",
      answer: "Den totala processen tar normalt 4-8 veckor från ansökan till godkännande. Detta inkluderar registrering av näringsverksamhet (1-2 veckor), ansökan om livsmedelstillstånd (2-3 veckor), köksinspektion (2-3 veckor) och övriga förberedelser. Du kan påskynda processen genom att arbeta med flera steg parallellt."
    },
    {
      question: "Vad kostar det att starta som kock på Homechef?",
      answer: "Startkostnaderna är cirka 3 500-5 000 kr totalt. Detta inkluderar registreringsavgift till kommunen (1 555 kr, kan variera mellan kommuner), företagsförsäkring (från 2 000 kr/år), och eventuella mindre investeringar i utrustning. Registrering av näringsverksamhet hos Skatteverket är gratis."
    },
    {
      question: "Kan jag sälja mat från mitt ordinarie hemkök?",
      answer: "Ja, du kan sälja mat från ditt hemkök förutsatt att det uppfyller EU:s krav enligt förordning 852/2004. Köket måste ha tillräcklig kapacitet, separata ytor för rå och tillagad mat, adekvat kyl- och frysutrymme, samt möjlighet till god hygien. En miljöinspektör kommer att bedöma om köket uppfyller kraven."
    },
    {
      question: "Vad är HACCP och måste jag verkligen ha det?",
      answer: "HACCP (Hazard Analysis and Critical Control Points) är ett obligatoriskt system för livsmedelssäkerhet enligt EU-förordning 852/2004. Det innebär att du måste identifiera kritiska kontrollpunkter, dokumentera temperaturer, ha rengöringsrutiner och kunna spåra ingredienser. Det låter komplext men vi hjälper dig att sätta upp enkla rutiner som fungerar för hemköket."
    },
    {
      question: "Vilken typ av försäkring behöver jag?",
      answer: "Du behöver minst en produktansvarsförsäkring som täcker eventuella skador som kan uppstå från den mat du säljer. Kostnaden varierar beroende på din förväntade omsättning, men startar från cirka 2 000 kr/år. Kontakta försäkringsbolag för offert anpassad till din verksamhet."
    },
    {
      question: "Hur ofta kommer kommunen att inspektera mitt kök?",
      answer: "Efter den initiala godkännandeinspektionen görs regelbundna uppföljningsinspektioner. Frekvensen beror på riskbedömning och kan vara allt från en gång per år till vartannat år. Inspektionerna är till för att säkerställa att du fortsätter följa livsmedelssäkerhetsreglerna."
    },
    {
      question: "Kan jag sälja mat innan jag har alla tillstånd?",
      answer: "Nej, du måste ha godkännande från kommunens miljöförvaltning innan du kan börja sälja mat. Att sälja mat utan tillstånd är olagligt och kan leda till böter och förbud mot fortsatt verksamhet. Vi rekommenderar att du startar ansökningsprocessen så snart som möjligt."
    },
    {
      question: "Vad händer om jag får anmärkningar vid köksinspektion?",
      answer: "Om miljöinspektören hittar brister får du en lista på vad som behöver åtgärdas. Du får sedan en rimlig tid att fixa problemen, varefter en uppföljningsinspektion kan genomföras. Mindre brister behöver oftast inte hindra att du får starta, men allvarliga brister måste åtgärdas innan godkännande."
    },
    {
      question: "Måste jag ha F-skattsedel?",
      answer: "Ja, om du driver verksamheten som enskild firma eller aktiebolag behöver du F-skattsedel från Skatteverket. Detta visar att du är godkänd för att betala din egen skatt och är ett krav för att kunna fakturera kunder lagligt. Ansökan är gratis och tar 1-2 veckor."
    },
    {
      question: "Vilka avgifter tar Homechef?",
      answer: "Homechef tar en kommission på försäljningen för att täcka plattform, betalhantering och support. Detaljerad information om våra avgifter får du när du registrerar dig som kock. Det finns inga månadskostnader eller startavgifter för att använda plattformen."
    },
    {
      question: "Kan jag sälja allergenfri eller specialkost?",
      answer: "Ja, du kan specialisera dig på allergenfri mat, vegetarisk, vegansk eller annan specialkost. Du måste dock tydligt märka alla ingredienser och allergener enligt livsmedelslagstiftningen. Vi rekommenderar att du har goda kunskaper om korskontaminering om du hanterar allergiframkallande ämnen."
    },
    {
      question: "Hur hanterar jag moms på matförsäljningen?",
      answer: "Restaurang- och cateringtjänster har 12% moms, medan livsmedel som säljs i butik har 12% eller 25% moms beroende på typ. Om din omsättning är under 80 000 kr/år kan du välja frivillig skattskyldighet. Vi rekommenderar att du konsulterar en revisor för att få rätt från start."
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Vanliga frågor för kockar
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Här hittar du svar på de vanligaste frågorna om att starta som kock på Homechef
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

export default ChefFAQ;
