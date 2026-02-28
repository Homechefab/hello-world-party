import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Integritetspolicy</CardTitle>
            <p className="text-muted-foreground">Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Vi följer EU:s dataskyddsförordning (GDPR) och svensk dataskyddslagstiftning för att skydda dina personuppgifter.
              </AlertDescription>
            </Alert>

            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Personuppgiftsansvarig</h2>
              <p className="text-muted-foreground mb-2">
                Personuppgiftsansvarig för behandlingen av dina personuppgifter är:
              </p>
              <div className="bg-secondary/20 p-4 rounded-lg text-muted-foreground">
                <p><strong>Homechef AB</strong></p>
                <p>Organisationsnummer: 559547-7026</p>
                <p>Adress: Kiselvägen 15a, 269 41 Östra Karup</p>
                <p>E-post: info@homechef.nu</p>
                <p>Telefon: 0734234686</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Vilka personuppgifter samlar vi in?</h2>
              <p className="text-muted-foreground mb-3">
                Vi behandlar följande kategorier av personuppgifter:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Kontaktuppgifter:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Fullständigt namn</li>
                    <li>E-postadress</li>
                    <li>Telefonnummer</li>
                    <li>Leveransadress</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Profilinformation:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Profilbild (frivilligt)</li>
                    <li>Matpreferenser och allergier</li>
                    <li>Användarinställningar</li>
                    <li>Beställningshistorik</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">För hemmakockar (utöver ovanstående):</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Organisationsnummer eller personnummer</li>
                    <li>Företagsuppgifter</li>
                    <li>Bankkontoinformation (för utbetalningar)</li>
                    <li>Livsmedelstillstånd och certifikat</li>
                    <li>Kökinformation och adress</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Teknisk information:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>IP-adress</li>
                    <li>Webbläsartyp och version</li>
                    <li>Enhetsinformation</li>
                    <li>Cookies och liknande teknik</li>
                    <li>Användarstatistik och beteendedata</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Betalningsinformation:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Betalningsmetod (hanteras via säkra tredjepartsleverantörer)</li>
                    <li>Fakturerings- och orderhistorik</li>
                    <li>Transaktionsinformation</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Ändamål och rättslig grund</h2>
              <p className="text-muted-foreground mb-3">
                Vi behandlar dina personuppgifter för följande ändamål med angiven rättslig grund:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-1">Fullgöra avtal (artikel 6.1 b GDPR)</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Hantera och leverera beställningar</li>
                    <li>Skapa och administrera ditt användarkonto</li>
                    <li>Kommunicera om beställningar och leveranser</li>
                    <li>Hantera betalningar och fakturering</li>
                    <li>Tillhandahålla kundtjänst</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-1">Rättslig förpliktelse (artikel 6.1 c GDPR)</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Uppfylla bokföringskrav</li>
                    <li>Hantera skatterapportering</li>
                    <li>Efterleva livsmedelssäkerhetslagstiftning</li>
                    <li>Efterkomma myndighetsbeslut</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-1">Berättigat intresse (artikel 6.1 f GDPR)</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Förbättra och utveckla våra tjänster</li>
                    <li>Säkerställa plattformens säkerhet och förhindra bedrägerier</li>
                    <li>Analysera användarbeteende för att optimera användarupplevelsen</li>
                    <li>Marknadsföra våra tjänster till befintliga kunder</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-1">Samtycke (artikel 6.1 a GDPR)</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Skicka marknadsföring via e-post eller SMS</li>
                    <li>Använda icke-nödvändiga cookies</li>
                    <li>Dela profilinformation offentligt (om du väljer detta)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Du kan när som helst återkalla ditt samtycke utan att det påverkar lagligheten av behandlingen innan återkallelsen.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Lagringstid</h2>
              <p className="text-muted-foreground mb-3">
                Vi lagrar dina personuppgifter endast så länge det är nödvändigt för att uppfylla de ändamål som anges i denna policy:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Kontoinformation:</strong> Så länge ditt konto är aktivt, därefter 3 månader</li>
                <li><strong>Beställningshistorik:</strong> 7 år (bokföringskrav enligt bokföringslagen)</li>
                <li><strong>Marknadsföringsinformation:</strong> Tills du återkallar ditt samtycke eller 24 månader efter sista interaktionen</li>
                <li><strong>Teknisk loggdata:</strong> 12 månader</li>
                <li><strong>Cookies:</strong> Enligt vår cookiepolicy (max 24 månader)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Delning av personuppgifter</h2>
              <p className="text-muted-foreground mb-3">
                Vi delar dina personuppgifter med följande kategorier av mottagare:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personuppgiftsbiträden:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li><strong>Supabase:</strong> Databas- och autentiseringstjänster (EU/Sverige)</li>
                    <li><strong>Stripe:</strong> Betalningshantering (GDPR-kompatibel)</li>
                    <li><strong>Lovable:</strong> Hosting och infrastruktur (EU)</li>
                    <li><strong>E-posttjänster:</strong> För transaktionell kommunikation</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Alla personuppgiftsbiträden har personuppgiftsbiträdesavtal som säkerställer skydd enligt GDPR.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Andra mottagare:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li><strong>Hemmakockar:</strong> Delar leveransinformation som krävs för att fullgöra din beställning</li>
                    <li><strong>Myndigheter:</strong> När det krävs enligt lag (t.ex. Skatteverket, Livsmedelsverket)</li>
                    <li><strong>Leveranspartners:</strong> Om du väljer hemleverans</li>
                  </ul>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Överföring utanför EU/EES:</strong> Vi strävar efter att endast använda tjänsteleverantörer inom EU/EES. 
                  Om personuppgifter överförs utanför EU/EES säkerställer vi adekvat skyddsnivå genom standardavtalsklausuler 
                  godkända av EU-kommissionen.
                </AlertDescription>
              </Alert>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Dina rättigheter enligt GDPR</h2>
              <p className="text-muted-foreground mb-3">
                Du har följande rättigheter gällande dina personuppgifter:
              </p>

              <div className="space-y-3">
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">📋 Rätt till tillgång (artikel 15)</h3>
                  <p className="text-muted-foreground text-sm">
                    Du har rätt att få bekräftelse på om vi behandlar dina personuppgifter och i så fall få tillgång till uppgifterna.
                  </p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">✏️ Rätt till rättelse (artikel 16)</h3>
                  <p className="text-muted-foreground text-sm">
                    Du kan när som helst begära att felaktiga personuppgifter rättas eller att ofullständiga uppgifter kompletteras.
                  </p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🗑️ Rätt till radering (artikel 17)</h3>
                  <p className="text-muted-foreground text-sm">
                    Du har under vissa förutsättningar rätt att få dina personuppgifter raderade (&quot;rätten att bli glömd&quot;). 
                    Detta gäller inte om vi har rättslig förpliktelse att spara uppgifterna (t.ex. bokföringskrav).
                  </p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🔒 Rätt till begränsning (artikel 18)</h3>
                  <p className="text-muted-foreground text-sm">
                    Du kan begära att behandlingen av dina personuppgifter begränsas medan t.ex. riktigheten av uppgifterna kontrolleras.
                  </p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">📦 Rätt till dataportabilitet (artikel 20)</h3>
                  <p className="text-muted-foreground text-sm">
                    Du har rätt att få ut dina personuppgifter i ett strukturerat, allmänt använt och maskinläsbart format 
                    och att överföra dessa till en annan personuppgiftsansvarig.
                  </p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">⛔ Rätt att göra invändningar (artikel 21)</h3>
                  <p className="text-muted-foreground text-sm">
                    Du har rätt att när som helst invända mot behandling som grundar sig på berättigat intresse eller 
                    allmänt intresse. Du har också rätt att när som helst invända mot direktmarknadsföring.
                  </p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🚫 Rätt att inte bli föremål för automatiserat beslutsfattande (artikel 22)</h3>
                  <p className="text-muted-foreground text-sm">
                    Du har rätt att inte bli föremål för beslut som enbart grundas på automatiserad behandling, 
                    inklusive profilering, som har rättslig verkan eller på liknande sätt påverkar dig i betydande grad.
                  </p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">↩️ Rätt att återkalla samtycke</h3>
                  <p className="text-muted-foreground text-sm">
                    Om behandlingen grundar sig på samtycke har du alltid rätt att återkalla ditt samtycke. 
                    Återkallelsen påverkar inte lagligheten av behandlingen innan samtycket återkallades.
                  </p>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  För att utöva dina rättigheter, kontakta oss på <strong>privacy@homechef.nu</strong>. 
                  Vi kommer att besvara din begäran inom 30 dagar.
                </AlertDescription>
              </Alert>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Cookies och liknande tekniker</h2>
              <p className="text-muted-foreground mb-3">
                Vi använder cookies och liknande tekniker för att förbättra din upplevelse på vår plattform.
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Nödvändiga cookies:</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av. 
                    De ställs vanligtvis in som svar på åtgärder som du vidtar, såsom inloggning eller fyllning av formulär.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                    <li>Autentiseringscookies (session)</li>
                    <li>Säkerhetscookies</li>
                    <li>Funktionella cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Prestandacookies:</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen genom att samla in 
                    och rapportera information anonymt.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Marknadsföringscookies:</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Dessa cookies kan sättas genom vår webbplats av våra annonspartners. 
                    De kräver ditt samtycke och kan hanteras i cookieinställningarna.
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mt-3 italic">
                Du kan när som helst ändra dina cookieinställningar i webbläsaren eller genom vår cookiebanner. 
                Observera att vissa funktioner kan påverkas om du inaktiverar cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Säkerhetsåtgärder</h2>
              <p className="text-muted-foreground mb-3">
                Vi har implementerat lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda dina 
                personuppgifter mot obehörig åtkomst, ändring, utlämnande eller förstöring:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Kryptering av data vid överföring (TLS/SSL)</li>
                <li>Kryptering av känsliga data i databaser</li>
                <li>Regelbundna säkerhetskopior</li>
                <li>Åtkomstkontroll och behörighetshantering</li>
                <li>Regelbundna säkerhetsgranskningar</li>
                <li>Utbildning av personal i dataskydd</li>
                <li>Säkra betalningslösningar (PCI-DSS-kompatibla)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Barn och minderåriga</h2>
              <p className="text-muted-foreground">
                Vår tjänst är inte riktad till personer under 18 år. Vi samlar inte medvetet in personuppgifter från 
                barn under 18 år. Om du är förälder eller vårdnadshavare och upptäcker att ditt barn har lämnat 
                personuppgifter till oss, kontakta oss så raderar vi informationen omgående.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Ändringar i integritetspolicyn</h2>
              <p className="text-muted-foreground">
                Vi kan komma att uppdatera denna integritetspolicy från tid till annan för att återspegla ändringar 
                i våra metoder eller av andra operativa, legala eller regulatoriska skäl. Väsentliga ändringar kommer 
                att meddelas via e-post eller genom en framträdande notis på vår webbplats minst 30 dagar innan 
                ändringarna träder i kraft. Senaste uppdateringsdatum anges överst i policyn.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Kontakta oss</h2>
              <p className="text-muted-foreground mb-3">
                Om du har frågor om denna integritetspolicy eller hur vi hanterar dina personuppgifter:
              </p>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="text-muted-foreground mb-2"><strong>Personuppgiftsansvarig:</strong></p>
                <p className="text-muted-foreground">Homechef AB</p>
                <p className="text-muted-foreground">E-post: info@homechef.nu</p>
                <p className="text-muted-foreground">Telefon: 0734234686</p>
                <p className="text-muted-foreground">Adress: Kiselvägen 15a, 269 41 Östra Karup</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Klagomål till tillsynsmyndighet</h2>
              <p className="text-muted-foreground mb-3">
                Om du anser att vi behandlar dina personuppgifter i strid med dataskyddslagstiftningen har du rätt 
                att lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY):
              </p>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="text-muted-foreground"><strong>Integritetsskyddsmyndigheten (IMY)</strong></p>
                <p className="text-muted-foreground">Box 8114</p>
                <p className="text-muted-foreground">104 20 Stockholm</p>
                <p className="text-muted-foreground">Telefon: 08-657 61 00</p>
                <p className="text-muted-foreground">E-post: imy@imy.se</p>
                <p className="text-muted-foreground">Webbplats: www.imy.se</p>
              </div>
              <p className="text-muted-foreground text-sm mt-3 italic">
                Vi uppskattar dock om du kontaktar oss först så att vi kan försöka lösa eventuella problem direkt.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
