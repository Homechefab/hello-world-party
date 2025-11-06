import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Integritetspolicy</CardTitle>
            <p className="text-muted-foreground">Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduktion</h2>
              <p className="text-muted-foreground">
                Välkommen till Homechef. Vi respekterar din integritet och är engagerade i att skydda dina personuppgifter. 
                Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar din information när du använder vår tjänst.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Information vi samlar in</h2>
              <p className="text-muted-foreground mb-2">Vi kan samla in följande typer av information:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Namn och kontaktinformation (e-postadress)</li>
                <li>Profilinformation från sociala medier (när du loggar in via Google eller Facebook)</li>
                <li>Beställnings- och leveransinformation</li>
                <li>Betalningsinformation (hanteras säkert via Klarna)</li>
                <li>Användarpreferenser och inställningar</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Hur vi använder din information</h2>
              <p className="text-muted-foreground mb-2">Vi använder din information för att:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Tillhandahålla och förbättra vår tjänst</li>
                <li>Hantera ditt konto och beställningar</li>
                <li>Kommunicera med dig om din användning av tjänsten</li>
                <li>Behandla betalningar och leveranser</li>
                <li>Skicka dig uppdateringar och marknadsföring (med ditt samtycke)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Delning av information</h2>
              <p className="text-muted-foreground">
                Vi delar inte din personliga information med tredje part förutom:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                <li>Med tjänsteleverantörer som hjälper oss att driva vår verksamhet (t.ex. Klarna för betalningar)</li>
                <li>När det krävs enligt lag</li>
                <li>Med ditt uttryckliga samtycke</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Cookies</h2>
              <p className="text-muted-foreground">
                Vi använder cookies och liknande teknologier för att förbättra din upplevelse på vår webbplats. 
                Du kan inaktivera cookies i dina webbläsarinställningar, men vissa funktioner kanske inte fungerar korrekt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Datasäkerhet</h2>
              <p className="text-muted-foreground">
                Vi implementerar lämpliga tekniska och organisatoriska åtgärder för att skydda din information mot 
                obehörig åtkomst, ändring, avslöjande eller förstöring.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Dina rättigheter</h2>
              <p className="text-muted-foreground mb-2">Enligt GDPR har du rätt att:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Få tillgång till dina personuppgifter</li>
                <li>Rätta felaktig information</li>
                <li>Radera dina uppgifter</li>
                <li>Begränsa behandlingen av dina uppgifter</li>
                <li>Invända mot behandling</li>
                <li>Dataportabilitet</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Radering av data</h2>
              <p className="text-muted-foreground">
                Om du vill radera ditt konto och all associerad data, kan du göra det genom att kontakta oss på 
                support@homechef.se eller genom att använda raderingsalternativet i dina kontoinställningar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Ändringar i integritetspolicyn</h2>
              <p className="text-muted-foreground">
                Vi kan uppdatera denna integritetspolicy från tid till annan. Vi kommer att meddela dig om väsentliga 
                ändringar genom att publicera den nya policyn på denna sida.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Kontakta oss</h2>
              <p className="text-muted-foreground">
                Om du har frågor om denna integritetspolicy eller hur vi hanterar dina personuppgifter, kontakta oss på:
              </p>
              <p className="text-muted-foreground mt-2">
                E-post: support@homechef.se<br />
                Adress: Homechef AB, Stockholm, Sverige
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
