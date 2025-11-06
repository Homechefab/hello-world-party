import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Användarvillkor</CardTitle>
            <p className="text-muted-foreground">Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptans av villkor</h2>
              <p className="text-muted-foreground">
                Genom att använda Homechef-tjänsten godkänner du dessa användarvillkor. Om du inte accepterar 
                villkoren ska du inte använda tjänsten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Tjänstebeskrivning</h2>
              <p className="text-muted-foreground">
                Homechef är en plattform som kopplar samman hemmalagade kockar med kunder som vill beställa 
                hemlagad mat, privatkocktjänster, catering och matupplevelser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Användarkonto</h2>
              <p className="text-muted-foreground mb-2">När du skapar ett konto på Homechef:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Måste du vara minst 18 år gammal</li>
                <li>Måste du tillhandahålla korrekt och fullständig information</li>
                <li>Är du ansvarig för att hålla ditt konto säkert</li>
                <li>Får du inte dela ditt konto med andra</li>
                <li>Måste du meddela oss om obehörig användning av ditt konto</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Beställningar och betalning</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Alla priser är i svenska kronor (SEK) och inkluderar moms</li>
                <li>Betalning sker via Klarna eller andra godkända betalmetoder</li>
                <li>Du är ansvarig för eventuella avgifter från din bank</li>
                <li>Beställningar bekräftas via e-post</li>
                <li>Vi förbehåller oss rätten att avböja beställningar</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Avbokning och återbetalning</h2>
              <p className="text-muted-foreground mb-2">Avbokningsregler:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Matbeställningar: Avbokning senast 24 timmar innan leverans för full återbetalning</li>
                <li>Privatkocktjänster: Avbokning senast 48 timmar innan för full återbetalning</li>
                <li>Catering: Avbokning senast 7 dagar innan eventet för full återbetalning</li>
                <li>Återbetalningar behandlas inom 5-10 arbetsdagar</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. För kockar</h2>
              <p className="text-muted-foreground mb-2">Som kock på Homechef måste du:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Ha godkänt kök enligt svenska livsmedelsverkets regler</li>
                <li>Ha nödvändiga tillstånd och försäkringar</li>
                <li>Följa alla livsmedelssäkerhetsbestämmelser</li>
                <li>Tillhandahålla korrekt information om ingredienser och allergener</li>
                <li>Leverera mat enligt överenskomna tider</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Ansvarsbegränsning</h2>
              <p className="text-muted-foreground">
                Homechef fungerar som en plattform mellan kockar och kunder. Vi ansvarar inte för:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                <li>Kvaliteten eller säkerheten på mat som tillhandahålls av kockar</li>
                <li>Förseningar eller missade leveranser</li>
                <li>Allergiska reaktioner eller matförgiftning</li>
                <li>Tvister mellan kockar och kunder</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Immateriella rättigheter</h2>
              <p className="text-muted-foreground">
                Allt innehåll på Homechef-plattformen, inklusive text, bilder, logotyper och design, 
                är skyddat av upphovsrätt och andra immateriella rättigheter som tillhör Homechef AB 
                eller våra licensgivare.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Användarbeteende</h2>
              <p className="text-muted-foreground mb-2">Du får inte:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Använda tjänsten för olagliga ändamål</li>
                <li>Trakassera eller hota andra användare</li>
                <li>Publicera falsk eller vilseledande information</li>
                <li>Försöka få obehörig åtkomst till systemet</li>
                <li>Använda automatiserade verktyg för att skrapa data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Uppsägning</h2>
              <p className="text-muted-foreground">
                Vi förbehåller oss rätten att stänga av eller avsluta ditt konto om du bryter mot 
                dessa villkor eller använder tjänsten på ett olämpligt sätt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Ändringar av villkor</h2>
              <p className="text-muted-foreground">
                Vi kan uppdatera dessa villkor från tid till annan. Väsentliga ändringar meddelas via 
                e-post eller genom meddelande på plattformen. Fortsatt användning av tjänsten efter 
                ändringar innebär att du accepterar de nya villkoren.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Tillämplig lag</h2>
              <p className="text-muted-foreground">
                Dessa villkor regleras av svensk lag. Eventuella tvister ska avgöras av svensk domstol.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Kontakt</h2>
              <p className="text-muted-foreground">
                Om du har frågor om dessa användarvillkor, kontakta oss på:
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

export default Terms;
