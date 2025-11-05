import Footer from "@/components/Footer";
import { Header } from "@/components/Header";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Användarvillkor</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Allmänna villkor</h2>
            <p>
              Välkommen till Homechef! Genom att använda vår tjänst accepterar du dessa användarvillkor. 
              Läs igenom dem noggrant innan du använder tjänsten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Tjänstebeskrivning</h2>
            <p className="mb-3">
              Homechef är en plattform som kopplar samman hemkockar med kunder som vill beställa hemlagad mat. 
              Vi tillhandahåller:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>En marknadsplats för hemlagad mat</li>
              <li>Betalningshantering via säkra leverantörer</li>
              <li>Leveranskoordinering (där tillämpligt)</li>
              <li>Kundsupport</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Användarkonto</h2>
            <p className="mb-3">För att använda tjänsten måste du:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Vara minst 18 år gammal</li>
              <li>Registrera ett konto med korrekta uppgifter</li>
              <li>Hålla ditt lösenord säkert och konfidentiellt</li>
              <li>Omedelbart meddela oss vid misstänkt obehörig åtkomst</li>
              <li>Ta ansvar för all aktivitet på ditt konto</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Beställningar och betalning</h2>
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">4.1 Priser</h3>
            <p>
              Alla priser anges i svenska kronor (SEK) och inkluderar moms där tillämpligt. 
              Priserna kan ändras utan föregående meddelande.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">4.2 Beställningsprocess</h3>
            <p>
              När du lägger en beställning skickas en bekräftelse till din e-post. Kocken har rätt att 
              acceptera eller avvisa beställningen inom rimlig tid.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">4.3 Betalning</h3>
            <p>
              Betalning sker via Stripe eller Klarna. Vi sparar inte dina kortuppgifter. 
              Betalning dras när kocken accepterar beställningen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Avbokning och återbetalning</h2>
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">5.1 Kundens rätt att avboka</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Mer än 24 timmar före leverans: Full återbetalning</li>
              <li>12-24 timmar före leverans: 50% återbetalning</li>
              <li>Mindre än 12 timmar före leverans: Ingen återbetalning</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">5.2 Kockens rätt att avboka</h3>
            <p>
              Om kocken måste avboka får kunden full återbetalning inom 5-7 arbetsdagar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Leverans och upphämtning</h2>
            <p className="mb-3">Leveransvillkor:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Uppskattad leveranstid är vägledande, inte garanterad</li>
              <li>Kunden ansvarar för att vara tillgänglig vid leverans</li>
              <li>Vid upphämtning gäller angivna tider</li>
              <li>Maten ska konsumeras inom rekommenderad tid</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Matallergier och specialkost</h2>
            <p className="mb-3">
              <strong>VIKTIGT:</strong> Det är ditt ansvar att:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Informera kocken om allergier och matpreferenser</li>
              <li>Kontrollera ingredienser innan konsumtion</li>
              <li>Vara medveten om risken för korskontaminering</li>
            </ul>
            <p className="mt-3">
              Vi tar inget ansvar för allergiska reaktioner om du inte tydligt kommunicerat dina behov.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Livsmedelssäkerhet</h2>
            <p>
              Alla kockar på Homechef måste:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ha godkänt kök enligt kommunens krav</li>
              <li>Följa livsmedelssäkerhetsregler</li>
              <li>Ha giltiga försäkringar</li>
              <li>Registrera sin verksamhet hos Skatteverket</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Ansvarsbegränsning</h2>
            <p className="mb-3">Homechef är en plattform som förmedlar kontakt mellan kockar och kunder. Vi ansvarar inte för:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Matens kvalitet, smak eller utseende</li>
              <li>Försenade leveranser (utom vid vårt direkta fel)</li>
              <li>Matförgiftning eller allergiska reaktioner</li>
              <li>Kockens beteende eller hantering</li>
              <li>Skador på egendom vid leverans</li>
            </ul>
            <p className="mt-3">
              Kocken är en oberoende näringsidkare och ansvarar själv för sin verksamhet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. För kockar</h2>
            <p className="mb-3">Som kock på Homechef måste du:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ha registrerat F-skatt och driva enskild firma eller företag</li>
              <li>Ha godkänt kök enligt livsmedelsverkets regler</li>
              <li>Ha ansvarsförsäkring och livsmedelsförsäkring</li>
              <li>Följa alla tillämpliga lagar och regler</li>
              <li>Betala provision till Homechef (15% av ordervärdet)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Immateriella rättigheter</h2>
            <p>
              Allt innehåll på plattformen (logotyper, design, texter) ägs av Homechef AB. 
              Du får inte kopiera, reproducera eller använda detta utan skriftligt tillstånd.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Användaruppförande</h2>
            <p className="mb-3">Du får inte:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Använda tjänsten för olagliga ändamål</li>
              <li>Trakassera, hota eller diskriminera andra användare</li>
              <li>Dela falsk eller vilseledande information</li>
              <li>Försöka hacka eller skada plattformen</li>
              <li>Kringgå betalningssystemet</li>
            </ul>
            <p className="mt-3">
              Vid brott mot dessa regler kan ditt konto stängas av omedelbart.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Klagomål och tvister</h2>
            <p>
              Vid problem, kontakta först kocken direkt. Om det inte löser sig, kontakta vår kundsupport på 
              support@homechef.se. Vi strävar efter att lösa alla klagomål inom 14 dagar.
            </p>
            <p className="mt-3">
              Tvister ska i första hand lösas genom förhandling. Vid oenighet gäller svensk lag och 
              svensk domstol.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Ändringar av villkoren</h2>
            <p>
              Vi förbehåller oss rätten att när som helst ändra dessa villkor. Väsentliga ändringar 
              meddelas via e-post minst 30 dagar innan de träder i kraft.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">15. Kontaktinformation</h2>
            <ul className="list-none space-y-2">
              <li><strong>Företag:</strong> Homechef AB</li>
              <li><strong>Organisationsnummer:</strong> 559123-4567</li>
              <li><strong>E-post:</strong> info@homechef.se</li>
              <li><strong>Telefon:</strong> 08-123 456 78</li>
              <li><strong>Adress:</strong> Storgatan 1, 111 22 Stockholm</li>
            </ul>
          </section>

          <section className="mt-8 pt-8 border-t">
            <p className="text-sm">
              <strong>Senast uppdaterad:</strong> {new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;