import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Hur fungerar Homechef?",
    answer: "Homechef är en marknadsplats som kopplar ihop dig med lokala hemkockar. Du söker efter mat i ditt område, beställer direkt från kocken och hämtar maten eller får den levererad. Alla kockar är godkända och följer livsmedelssäkerhetskrav."
  },
  {
    question: "Är maten säker att äta?",
    answer: "Ja! Alla våra kockar genomgår en noggrann godkännandeprocess och måste följa kommunens livsmedelskrav. De har godkända kök och följer strikta hygienrutiner för att säkerställa att all mat är säker."
  },
  {
    question: "Hur betalar jag för min beställning?",
    answer: "Vi erbjuder flera säkra betalningsalternativ: kortbetalning via Stripe, Swish och Klarna. Alla betalningar är krypterade och säkra."
  },
  {
    question: "Kan jag bli kock på Homechef?",
    answer: "Absolut! Om du älskar att laga mat och vill tjäna pengar på din passion kan du ansöka om att bli hemkock. Du behöver ett godkänt kök, registrerat företag och följa våra säkerhetsriktlinjer."
  },
  {
    question: "Hur hämtar jag min beställning?",
    answer: "När din beställning är klar får du ett meddelande med upphämtningsinstruktioner. Du hämtar maten direkt hos kocken på den överenskomna tiden. Vissa kockar erbjuder även hemleverans."
  },
  {
    question: "Vad kostar det att använda Homechef?",
    answer: "Det är helt gratis att registrera sig och bläddra bland maträtter. Du betalar endast för maten du beställer. Priserna sätts av varje kock individuellt."
  },
  {
    question: "Kan jag beställa mat för speciella kostbehov?",
    answer: "Ja! Många av våra kockar erbjuder alternativ för vegetarianer, veganer, glutenfria och andra kostbehov. Du kan filtrera efter allergener och kontakta kocken direkt för specialönskemål."
  },
  {
    question: "Hur kontaktar jag en kock?",
    answer: "Du kan kontakta kockar direkt via vår plattform. På varje kocks profilsida finns möjlighet att skicka meddelanden om frågor om menyn, allergier eller specialbeställningar."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Vanliga frågor
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Här hittar du svar på de vanligaste frågorna om Homechef
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-xl border border-border/50 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
