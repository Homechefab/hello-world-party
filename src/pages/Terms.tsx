import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Allmänna villkor</CardTitle>
            <p className="text-muted-foreground">Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* 1. Introduktion */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduktion och acceptans</h2>
              <p className="text-muted-foreground mb-2">
                Dessa allmänna villkor gäller för alla tjänster som tillhandahålls av Homechef AB (org.nr. XXX-XXXXXX) 
                genom plattformen Homechef ("Tjänsten"). Genom att använda Tjänsten godkänner du dessa villkor i sin helhet.
              </p>
              <p className="text-muted-foreground">
                Homechef är en marknadsplatsplattform som kopplar samman hemmakockar, restauranger och kunder 
                för beställning av hemlagad mat, privatkocktjänster, catering, matupplevelser och köksuthyrning.
              </p>
            </section>

            {/* 2. Definitioner */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Definitioner</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>"Kund"</strong> - privatperson som beställer mat eller tjänster via plattformen</li>
                <li><strong>"Hemmakock"</strong> - godkänd säljare som lagar och säljer mat via plattformen</li>
                <li><strong>"Restaurang"</strong> - godkänd restaurangpartner som säljer mat via plattformen</li>
                <li><strong>"Kökspartner"</strong> - person som hyr ut sitt kök till hemmakockar</li>
                <li><strong>"Plattformen"</strong> - Homechefs webbplats och mobilapplikation</li>
                <li><strong>"Tjänsten"</strong> - alla tjänster som tillhandahålls via plattformen</li>
              </ul>
            </section>

            {/* 3. Registrering och konto */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Registrering och användarkonto</h2>
              <p className="text-muted-foreground mb-2">För att använda Tjänsten måste du:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Vara minst 18 år gammal</li>
                <li>Tillhandahålla korrekt och fullständig registreringsinformation</li>
                <li>Hålla dina kontouppgifter och lösenord säkra och konfidentiella</li>
                <li>Omedelbart meddela oss vid obehörig användning av ditt konto</li>
                <li>Inte dela ditt konto med andra personer</li>
                <li>Inte skapa flera konton för samma person</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Du är ensam ansvarig för all aktivitet som sker på ditt konto.
              </p>
            </section>

            {/* 4. Hemmakockar - krav och skyldigheter */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Krav för hemmakockar</h2>
              <p className="text-muted-foreground mb-2">Som hemmakock på Homechef måste du:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Ha ett godkänt kök enligt Livsmedelsverkets föreskrifter (LIVSFS 2005:20)</li>
                <li>Vara registrerad som livsmedelsföretagare hos din kommun</li>
                <li>Inneha F-skattsedel eller bedriva verksamhet via eget företag</li>
                <li>Ha giltiga och lämpliga försäkringar (ansvarsförsäkring, produktansvarsförsäkring)</li>
                <li>Följa HACCP-principer och god livsmedelshygien</li>
                <li>Tillhandahålla korrekt allergeninformation för alla rätter</li>
                <li>Leverera mat enligt överenskomna tider och kvalitetskrav</li>
                <li>Genomgå Homechefs godkännandeprocess före aktivering</li>
              </ul>
            </section>

            {/* 5. Livsmedelssäkerhet */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Livsmedelssäkerhet och hygien</h2>
              <p className="text-muted-foreground mb-2">Alla säljare måste följa:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Livsmedelslagen (2006:804) och tillhörande förordningar</li>
                <li>EU-förordning 852/2004 om livsmedelshygien</li>
                <li>Livsmedelsverkets föreskrifter om livsmedelshygien</li>
                <li>Krav på temperaturkontroll vid förvaring och transport</li>
                <li>Korrekt märkning av livsmedel inklusive ingredienser och allergener</li>
                <li>Spårbarhetskrav enligt gällande lagstiftning</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Homechef förbehåller sig rätten att när som helst kontrollera att säljare uppfyller dessa krav.
              </p>
            </section>

            {/* 6. Beställningar och betalning */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Beställningar och betalning</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Alla priser anges i svenska kronor (SEK) inklusive moms (12% för mat)</li>
                <li>Betalning sker via Klarna, Stripe eller andra av Homechef godkända betalmetoder</li>
                <li>En beställning är bindande när betalning har genomförts</li>
                <li>Orderbekräftelse skickas via e-post till angiven adress</li>
                <li>Homechef tar ut en serviceavgift på 20% av ordervärdet från säljaren</li>
                <li>Utbetalning till säljare sker veckovis till registrerat bankkonto</li>
              </ul>
            </section>

            {/* 7. Leverans och upphämtning */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Leverans och upphämtning</h2>
              <p className="text-muted-foreground mb-2">Leveransvillkor:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Leveranstid anges av säljaren och bekräftas vid beställning</li>
                <li>Kunden ansvarar för att vara tillgänglig vid angiven leveranstid</li>
                <li>Vid upphämtning ska kunden hämta maten inom angiven tid</li>
                <li>Mat som inte hämtas inom 30 minuter efter angiven tid kan kasseras utan återbetalning</li>
                <li>Leveranskostnader anges separat och betalas av kunden</li>
              </ul>
            </section>

            {/* 8. Avbokning och återbetalning */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Avbokning och återbetalning</h2>
              <p className="text-muted-foreground mb-2">Avbokningsregler för kunder:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Matbeställningar:</strong> Kostnadsfri avbokning senast 24 timmar före leverans</li>
                <li><strong>Privatkocktjänster:</strong> Kostnadsfri avbokning senast 48 timmar före bokad tid</li>
                <li><strong>Catering:</strong> Kostnadsfri avbokning senast 7 dagar före eventet</li>
                <li><strong>Matupplevelser:</strong> Kostnadsfri avbokning senast 72 timmar före eventet</li>
              </ul>
              <p className="text-muted-foreground mt-2 mb-2">Vid sen avbokning:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Mindre än 24/48/72 timmar: 50% av ordervärdet debiteras</li>
                <li>Samma dag: Ingen återbetalning</li>
                <li>Återbetalningar behandlas inom 5-10 arbetsdagar</li>
              </ul>
            </section>

            {/* 9. Allergier och särskilda kostbehov */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Allergier och särskilda kostbehov</h2>
              <p className="text-muted-foreground mb-2">
                Säljare är skyldiga att tydligt ange alla ingredienser och allergener i sina rätter enligt 
                EU:s allergenförordning (1169/2011). De 14 deklarationspliktiga allergenerna måste alltid anges.
              </p>
              <p className="text-muted-foreground">
                Kunder med allergier eller särskilda kostbehov ansvarar för att kontrollera ingredienslistan 
                och vid behov kontakta säljaren före beställning. Homechef ansvarar inte för allergiska 
                reaktioner orsakade av felaktig eller utelämnad information från säljare.
              </p>
            </section>

            {/* 10. Köksuthyrning */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Köksuthyrning (Kökspartner)</h2>
              <p className="text-muted-foreground mb-2">För kökspartners gäller:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Köket måste vara godkänt för livsmedelshantering av kommunen</li>
                <li>Kökspartner ansvarar för att köket uppfyller säkerhetskrav</li>
                <li>Tydliga regler för användning och städning ska kommuniceras</li>
                <li>Homechef tar ut 15% serviceavgift på uthyrningsintäkter</li>
                <li>Försäkringsskydd ska finnas för skador på utrustning</li>
              </ul>
            </section>

            {/* 11. Restaurangpartners */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Restaurangpartners</h2>
              <p className="text-muted-foreground mb-2">För restauranger gäller:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Giltigt tillstånd för livsmedelsverksamhet krävs</li>
                <li>Restaurangen ansvarar för kvalitet och säkerhet på all mat</li>
                <li>Homechef tar ut 18% serviceavgift på ordervärdet</li>
                <li>Meny och priser ska hållas uppdaterade på plattformen</li>
              </ul>
            </section>

            {/* 12. Omdömen och recensioner */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Omdömen och recensioner</h2>
              <p className="text-muted-foreground mb-2">
                Kunder kan lämna omdömen och betyg efter genomförda beställningar. Recensioner ska vara:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Sanningsenliga och baserade på faktisk upplevelse</li>
                <li>Respektfulla och utan kränkande innehåll</li>
                <li>Relaterade till den faktiska beställningen</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Homechef förbehåller sig rätten att ta bort olämpliga recensioner.
              </p>
            </section>

            {/* 13. Lojalitetsprogram */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Lojalitetsprogram och poäng</h2>
              <p className="text-muted-foreground mb-2">Homechefs lojalitetsprogram:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Kunder tjänar 1 poäng per 10 kr spenderat</li>
                <li>Var 5:e beställning ger 10% rabatt</li>
                <li>Poäng kan inte lösas in mot kontanter</li>
                <li>Poäng förfaller efter 12 månaders inaktivitet</li>
                <li>Homechef förbehåller sig rätten att ändra programvillkoren</li>
              </ul>
            </section>

            {/* 14. Ansvarsbegränsning */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">14. Ansvarsbegränsning</h2>
              <p className="text-muted-foreground mb-2">
                Homechef fungerar som en förmedlingsplattform mellan säljare och kunder. Homechef ansvarar inte för:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Kvaliteten, säkerheten eller smaken på mat som tillhandahålls av säljare</li>
                <li>Förseningar eller uteblivna leveranser orsakade av säljare eller tredje part</li>
                <li>Allergiska reaktioner eller matförgiftning</li>
                <li>Skador som uppstår i samband med köksuthyrning</li>
                <li>Tvister mellan säljare och kunder som inte kan lösas via vår kundservice</li>
                <li>Indirekta skador, följdskador eller utebliven vinst</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Homechefs maximala ansvar är begränsat till det belopp kunden har betalat för den aktuella beställningen.
              </p>
            </section>

            {/* 15. Reklamation och klagomål */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">15. Reklamation och klagomål</h2>
              <p className="text-muted-foreground mb-2">Vid problem med en beställning:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Kontakta säljaren direkt via plattformens meddelandefunktion</li>
                <li>Om problemet inte löses, kontakta Homechefs kundservice inom 24 timmar</li>
                <li>Dokumentera problemet med bilder om möjligt</li>
                <li>Homechef utreder ärendet och meddelar beslut inom 5 arbetsdagar</li>
              </ul>
            </section>

            {/* 16. Immateriella rättigheter */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">16. Immateriella rättigheter</h2>
              <p className="text-muted-foreground">
                Allt innehåll på Homechef-plattformen, inklusive men inte begränsat till text, bilder, 
                logotyper, grafik, design och programkod, är skyddat av upphovsrätt och andra immateriella 
                rättigheter som tillhör Homechef AB eller våra licensgivare. Kopiering, distribution eller 
                annan användning utan skriftligt tillstånd är förbjuden.
              </p>
            </section>

            {/* 17. Användaruppförande */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">17. Användaruppförande</h2>
              <p className="text-muted-foreground mb-2">Du får inte:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Använda Tjänsten för olagliga ändamål</li>
                <li>Trakassera, hota eller diskriminera andra användare</li>
                <li>Publicera falsk, vilseledande eller kränkande information</li>
                <li>Försöka få obehörig åtkomst till systemet eller andra användares konton</li>
                <li>Använda automatiserade verktyg för att skrapa data från plattformen</li>
                <li>Kringgå plattformen för direkta transaktioner med säljare</li>
                <li>Skapa falska recensioner eller manipulera betygssystemet</li>
              </ul>
            </section>

            {/* 18. Avstängning och uppsägning */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">18. Avstängning och uppsägning</h2>
              <p className="text-muted-foreground mb-2">
                Homechef förbehåller sig rätten att omedelbart stänga av eller avsluta ditt konto om:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Du bryter mot dessa allmänna villkor</li>
                <li>Du upprepade gånger får negativa omdömen</li>
                <li>Du inte uppfyller kraven för livsmedelssäkerhet (säljare)</li>
                <li>Du bedriver bedräglig verksamhet</li>
                <li>Du skadar Homechefs varumärke eller rykte</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Du kan själv avsluta ditt konto när som helst via kontoinställningarna.
              </p>
            </section>

            {/* 19. Personuppgifter och GDPR */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">19. Personuppgifter och integritet</h2>
              <p className="text-muted-foreground">
                Homechef behandlar personuppgifter i enlighet med GDPR och vår integritetspolicy. 
                Genom att använda Tjänsten samtycker du till vår behandling av personuppgifter enligt 
                vad som beskrivs i integritetspolicyn. Du har rätt att begära tillgång till, rättelse 
                eller radering av dina personuppgifter.
              </p>
            </section>

            {/* 20. Ändringar av villkor */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">20. Ändringar av villkoren</h2>
              <p className="text-muted-foreground">
                Homechef kan uppdatera dessa villkor när som helst. Väsentliga ändringar meddelas via 
                e-post och/eller genom meddelande på plattformen minst 30 dagar innan de träder i kraft. 
                Fortsatt användning av Tjänsten efter att ändringar trätt i kraft innebär att du 
                accepterar de nya villkoren.
              </p>
            </section>

            {/* 21. Tillämplig lag och tvister */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">21. Tillämplig lag och tvister</h2>
              <p className="text-muted-foreground mb-2">
                Dessa villkor regleras av svensk lag. Tvister ska i första hand lösas genom förhandling. 
                Om parterna inte kan enas ska tvisten avgöras av:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Allmänna reklamationsnämnden (ARN) för konsumenttvister</li>
                <li>Svensk allmän domstol med Stockholms tingsrätt som första instans</li>
              </ul>
            </section>

            {/* 22. Force majeure */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">22. Force majeure</h2>
              <p className="text-muted-foreground">
                Homechef ansvarar inte för förseningar eller brister i Tjänsten som orsakas av 
                omständigheter utanför vår kontroll, såsom naturkatastrofer, krig, strejk, pandemi, 
                myndighetsåtgärder, elavbrott eller andra oförutsedda händelser.
              </p>
            </section>

            {/* 23. Kontaktinformation */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">23. Kontaktinformation</h2>
              <p className="text-muted-foreground mb-2">
                Om du har frågor om dessa allmänna villkor, kontakta oss:
              </p>
              <div className="text-muted-foreground">
                <p><strong>Homechef AB</strong></p>
                <p>E-post: support@homechef.se</p>
                <p>Telefon: 08-XXX XX XX</p>
                <p>Adress: [Gatuadress], Stockholm, Sverige</p>
                <p>Org.nr: XXX-XXXXXX</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;
