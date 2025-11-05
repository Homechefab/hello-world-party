import Footer from "@/components/Footer";
import Header from "@/components/Header";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Sekretesspolicy</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduktion</h2>
            <p>
              Välkommen till Homechef. Vi värnar om din integritet och är engagerade i att skydda dina personuppgifter. 
              Denna sekretesspolicy förklarar hur vi samlar in, använder, lagrar och skyddar din information när du använder vår tjänst.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Insamling av information</h2>
            <p className="mb-3">Vi samlar in följande typer av information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Kontouppgifter:</strong> Namn, e-postadress, telefonnummer</li>
              <li><strong>Leveransinformation:</strong> Adress och leveransinstruktioner</li>
              <li><strong>Betalningsinformation:</strong> Behandlas säkert via tredjepartsleverantörer (Stripe/Klarna)</li>
              <li><strong>Orderhistorik:</strong> Information om dina beställningar och preferenser</li>
              <li><strong>Teknisk information:</strong> IP-adress, enhetstyp, webbläsare</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Användning av information</h2>
            <p className="mb-3">Vi använder din information för att:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Behandla och leverera dina beställningar</li>
              <li>Kommunicera med dig om din beställning</li>
              <li>Förbättra vår tjänst och användarupplevelse</li>
              <li>Skicka marknadsföring (endast med ditt samtycke)</li>
              <li>Följa lagkrav och skydda mot bedrägerier</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Delning av information</h2>
            <p className="mb-3">Vi delar aldrig din information till tredje part för marknadsföring. Vi kan dela information med:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Kockar:</strong> Nödvändig information för att genomföra din beställning</li>
              <li><strong>Betalningsleverantörer:</strong> För säker betalningshantering</li>
              <li><strong>Leveranspartners:</strong> För leverans av din mat</li>
              <li><strong>Myndighetspersoner:</strong> Vid lagkrav</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Datasäkerhet</h2>
            <p>
              Vi använder branschstandard säkerhetsåtgärder för att skydda din information, inklusive kryptering, 
              säkra servrar och regelbundna säkerhetsgranskningar. All betalningsinformation hanteras enligt PCI DSS-standarder.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
            <p>
              Vi använder cookies för att förbättra din användarupplevelse. Du kan inaktivera cookies i din webbläsare, 
              men vissa funktioner kan då sluta fungera.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Dina rättigheter (GDPR)</h2>
            <p className="mb-3">Du har rätt att:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Få tillgång till dina personuppgifter</li>
              <li>Rätta felaktig information</li>
              <li>Radera dina personuppgifter ("rätten att bli glömd")</li>
              <li>Invända mot behandling av dina uppgifter</li>
              <li>Begära dataportabilitet</li>
              <li>Återkalla samtycke när som helst</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Datalagring</h2>
            <p>
              Vi lagrar dina personuppgifter endast så länge det är nödvändigt för att tillhandahålla tjänsten 
              eller som krävs enligt lag. Orderhistorik sparas i upp till 7 år för bokföringsändamål.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Barns integritet</h2>
            <p>
              Vår tjänst är inte avsedd för barn under 16 år. Vi samlar inte medvetet in information från barn.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Ändringar i sekretesspolicyn</h2>
            <p>
              Vi kan uppdatera denna policy då och då. Väsentliga ändringar kommer att meddelas via e-post eller 
              genom ett meddelande på vår webbplats.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Kontakta oss</h2>
            <p>
              Vid frågor om denna sekretesspolicy eller din personliga information, kontakta oss på:
            </p>
            <ul className="list-none space-y-2 mt-3">
              <li><strong>E-post:</strong> privacy@homechef.se</li>
              <li><strong>Telefon:</strong> 08-123 456 78</li>
              <li><strong>Adress:</strong> Homechef AB, Storgatan 1, 111 22 Stockholm</li>
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

export default PrivacyPolicy;