import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const CustomerFAQ = () => {
  const faqs = [
    {
      question: "Hur fungerar beställning på Homechef?",
      answer: "Det är enkelt! Bläddra bland kockar och rätter, lägg till i kundvagnen och välj leveranstid. Betala säkert med kort, Swish eller Klarna. Du kan följa din beställning i realtid och får meddelande när maten är på väg."
    },
    {
      question: "Är maten säker att äta?",
      answer: "Ja, absolut! Alla kockar på Homechef måste ha godkänt livsmedelstillstånd från kommunen och följa alla hygienregler. Kockarna kontrolleras regelbundet och vi tar livsmedelssäkerhet på största allvar. Dessutom kan du läsa omdömen från andra kunder innan du beställer."
    },
    {
      question: "Vad kostar leveransen?",
      answer: "Leveranskostnaden varierar beroende på avstånd och beställningsvärde. Vanligtvis ligger den på 29-59 kr. Många kockar erbjuder fri leverans vid köp över en viss summa. Du ser alltid den exakta leveranskostnaden innan du slutför köpet."
    },
    {
      question: "Hur lång tid tar leveransen?",
      answer: "De flesta leveranser tar 30-60 minuter från att du beställt. När du beställer ser du en uppskattad leveranstid baserad på kockens tillgänglighet och ditt läge. Du kan också förbeställa mat för senare på dagen eller till och med nästa dag."
    },
    {
      question: "Kan jag avbeställa min order?",
      answer: "Ja, du kan avbeställa kostnadsfritt upp till 2 timmar innan leveranstiden. Om kocken redan börjat laga din mat kan en avbokningsavgift tillkomma. Vid akuta problem kontakta vår kundservice så hjälper vi dig."
    },
    {
      question: "Vad händer om jag inte är nöjd med maten?",
      answer: "Din nöjdhet är viktig för oss! Om något inte är som det ska kontakta vår kundservice direkt. Vi kan erbjuda återbetalning, rabatt eller en ny beställning beroende på situationen. Vi tar alla klagomål på största allvar."
    },
    {
      question: "Kan jag se allergener och näringsinnehåll?",
      answer: "Ja, alla kockar måste ange allergener och ingredienser för sina rätter. Du kan filtrera efter allergier och matpreferenser som vegetarisk, vegansk, glutenfri etc. Om du har specifika frågor kan du kontakta kocken direkt via chatten."
    },
    {
      question: "Hur vet jag att kocken är bra?",
      answer: "Varje kock har en profil med omdömen från tidigare kunder. Du kan se betyg, läsa recensioner och se hur många beställningar kocken genomfört. Vi verifierar också alla kockar innan de får sälja på plattformen."
    },
    {
      question: "Kan jag beställa till någon annan?",
      answer: "Ja, du kan enkelt skicka mat som present till vänner eller familj. Ange bara en annan leveransadress när du beställer och lägg gärna till ett personligt meddelande. Kvittot skickas bara till dig som beställare."
    },
    {
      question: "Finns det några minimumbelopp för beställning?",
      answer: "Vissa kockar har ett minimibeställningsvärde, vanligtvis 100-150 kr. Detta ser du tydligt på varje kocks profil innan du beställer. Många kockar erbjuder också paketpriser för större beställningar."
    },
    {
      question: "Hur fungerar poängsystemet?",
      answer: "Du samlar poäng på varje beställning som du kan använda för rabatt på framtida köp. 1 poäng = 1 krona. Du får poäng baserat på din beställningssumma och extra poäng vid särskilda kampanjer. Kolla ditt saldo i din profil."
    },
    {
      question: "Kan jag spara favoritkockar och rätter?",
      answer: "Ja! Du kan lägga till dina favoritkockar och rätter för att snabbt hitta dem igen. Du får också meddelanden när dina favoritkockar lägger upp nya rätter eller har specialerbjudanden."
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Vanliga frågor för kunder
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Här hittar du svar på de vanligaste frågorna om att beställa mat via Homechef
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

export default CustomerFAQ;
