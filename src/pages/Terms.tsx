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
            <CardTitle className="text-3xl">Allmänna villkor - Homechefs plattform</CardTitle>
            <p className="text-muted-foreground">Senast uppdaterade: {new Date().toLocaleDateString('sv-SE')}</p>
          </CardHeader>
          
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Innehållsförteckning */}
            <section className="mb-8 p-4 bg-muted/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Innehållsförteckning</h2>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Allmänt</li>
                <li>Ditt konto</li>
                <li>Plattformen och dess utbud</li>
                <li>Beställningar</li>
                <li>Priser och avgifter</li>
                <li>Betalning</li>
                <li>Erbjudanden och tillgodohavanden</li>
                <li>Lojalitetsprogram</li>
                <li>Villkor för leverans och upphämtning</li>
                <li>Innehåll och kvalitet på måltider</li>
                <li>Krav för hemmakockar</li>
                <li>Köksuthyrning</li>
                <li>Restaurangpartners</li>
                <li>Privatkock och catering</li>
                <li>Matupplevelser</li>
                <li>Reklamation och ångerrätt</li>
                <li>Kundrecensioner</li>
                <li>Homechefs rättigheter</li>
                <li>Homechefs rätt att agera mot användare</li>
                <li>Övrigt</li>
                <li>Tillämplig lag och tvistlösning</li>
                <li>Kontaktuppgifter</li>
              </ol>
            </section>

            {/* 1. ALLMÄNT */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Allmänt</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">1.1 Om Villkoren</h3>
                <p className="text-muted-foreground mb-3">
                  Dessa allmänna villkor ("Villkoren") gäller mellan dig som privatperson/konsument eller som 
                  hemmakock, restaurangpartner eller kökspartner ("Du", "Dig", "Användare") och Homechef AB, 
                  org. nr XXX-XXXXXX, Stockholm, Sverige ("Homechef", "vi", "oss"), när Du använder homechef.se 
                  och Homechefs mobilapp (tillsammans "Plattformen").
                </p>
                <p className="text-muted-foreground mb-3">
                  Via Plattformen kan Du beställa produkter i form av hemlagade måltider, matlådor, catering, 
                  privatkocktjänster och matupplevelser ("Produkter") som Homechef, våra godkända hemmakockar 
                  ("Hemmakockar") samt restaurangpartners ("Restauranger") håller tillgängliga på Plattformen. 
                  Hemmakockar och Restauranger benämns härefter gemensamt som "Säljare".
                </p>
                <p className="text-muted-foreground mb-3">
                  Genom att registrera ett konto hos Homechef och lägga en beställning via Plattformen, bekräftar 
                  Du att Du har läst och godkänner dessa Villkor med bindande verkan samt intygar riktigheten i 
                  de uppgifter som Du lämnat.
                </p>
                <p className="text-muted-foreground">
                  Genom att lägga en beställning via Plattformen intygar Du vidare att:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                  <li>Du är minst 18 år</li>
                  <li>Du har rättskapacitet att ingå avtal</li>
                  <li>Du är innehavare av det bank-/kreditkort eller bankkonto som används för köp på Plattformen</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">1.2 Om Homechefs rätt att begränsa</h3>
                <p className="text-muted-foreground">
                  Vi förbehåller oss rätten att utforma och använda oss av policyer, förfaranden, åtgärder och 
                  verktyg för att säkerställa att Plattformen används på ett sätt som inte är olagligt och i 
                  övrigt överensstämmer med våra policyer och dessa Villkor. För det fall Plattformen används 
                  på ett sätt som är olagligt eller i övrigt inte överensstämmer med våra policyer eller dessa 
                  Villkor, förbehåller vi oss rätten att granska och agera mot sådana förfaranden.
                </p>
              </div>
            </section>

            {/* 2. DITT KONTO */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">2. Ditt konto</h2>
              <p className="text-muted-foreground mb-3">
                Homechef tillåter bara ett konto per Användare. Du ansvarar för att förvara Dina inloggningsuppgifter 
                säkert för att undvika att de sprids vidare. Om tredje part får tillgång, eller om Du misstänker 
                att tredje part har tillgång till, Dina inloggningsuppgifter ska Du genast informera Homechef, 
                i vilket fall Homechef förbehåller sig rätten att stänga ner eller radera Ditt konto utan vidare 
                underrättelse.
              </p>
              <p className="text-muted-foreground mb-3">
                Om Du glömmer Ditt lösenord kan det återställas genom att använda funktionen "Glömt lösenord" på Plattformen.
              </p>
              <p className="text-muted-foreground">
                Om Du vill radera Ditt konto, vänligen gå till kontoinställningar och välj "Radera konto" eller 
                kontakta vår kundservice via e-post.
              </p>
            </section>

            {/* 3. PLATTFORMEN OCH DESS UTBUD */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">3. Plattformen och dess utbud</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3.1 Plattformens utbud</h3>
                <p className="text-muted-foreground mb-3">
                  Vi använder oss av rekommendationssystem för att tipsa om Produkter och Säljare på Plattformen. 
                  Utbudet och rankningen av Säljare och Produkter på Plattformen kan variera från tid till annan 
                  men är alltid utformat för att ge Dig en bra kundupplevelse.
                </p>
                <p className="text-muted-foreground">
                  Utbudet som presenteras baseras bl.a. på vilken leveransadress Du anger samt eventuella filter 
                  som Du själv kan använda för att sortera utbudet på Plattformen, t.ex. filtrering på specifika 
                  kategorier, kostpreferenser eller efter leveranstid.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">3.2 Närmare om hur sökresultat rankas</h3>
                <p className="text-muted-foreground mb-2">Vid sökningar på Säljare och Produkter rankas sökresultaten baserat på:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Innehållet i Din sökning och matchning mot Säljarens utbud</li>
                  <li>Öppettider, avstånd och leveranstid till Din angivna adress</li>
                  <li>Popularitet baserad på betyg, recensioner och beställningshistorik</li>
                  <li>Säljarens tillgänglighet och kapacitet</li>
                </ul>
              </div>
            </section>

            {/* 4. BESTÄLLNINGAR */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">4. Beställningar</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">4.1 Övergripande om beställningar</h3>
                <p className="text-muted-foreground mb-3">
                  På Plattformen kan Du beställa Produkter för leverans eller upphämtning ("Pick-Up"). Du kan 
                  genomföra beställningar på svenska och engelska och kommer, efter att ha lagt en beställning, 
                  få en bekräftelse skickad till den e-postadress som Du angett när Du registrerade Ditt konto.
                </p>
                <p className="text-muted-foreground">
                  Produkterna levereras av Homechef, eventuell tredje part eller av Säljaren själv till den 
                  leveransadress som angetts av Dig vid beställningstillfället.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">4.2 Hur du genomför en beställning</h3>
                <p className="text-muted-foreground mb-3">
                  Samtliga beställningar genomförs på Plattformen genom att Du väljer om Du vill få beställningen 
                  levererad eller utlämnad genom Pick-Up. Du kan också välja att göra en förbeställning för 
                  leverans eller Pick-Up vid en senare tidpunkt.
                </p>
                <p className="text-muted-foreground mb-3">
                  När Du trycker på "Lägg beställning" lämnar Du ett erbjudande att köpa de Produkter som anges 
                  i beställningen för ett belopp motsvarande ordervärdet. Efter genomförd beställning får Du ett 
                  mejl som bekräftar att Homechef mottagit beställningen.
                </p>
                <p className="text-muted-foreground">
                  <strong>Observera:</strong> En beställning kan inte avbrytas av Dig efter att den accepterats 
                  av Säljaren. Dessförinnan kan Du när som helst ändra eller avbryta en beställning.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">4.3 Partsförhållandet vid köp</h3>
                <p className="text-muted-foreground mb-3">
                  När måltider och andra Produkter köps från Hemmakockar på Plattformen, agerar Homechef som 
                  förmedlare mellan Dig och Hemmakocken. Du ingår avtal med Hemmakocken om köp av Produkterna, 
                  medan Du ingår ett avtal med Homechef om eventuell leverans.
                </p>
                <p className="text-muted-foreground">
                  Homechef tar ut en serviceavgift på 20% av ordervärdet från Säljaren. Denna avgift täcker 
                  plattformens drift, support och marknadsföring.
                </p>
              </div>
            </section>

            {/* 5. PRISER OCH AVGIFTER */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">5. Priser och avgifter</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">5.1 Pris</h3>
                <p className="text-muted-foreground">
                  Aktuella priser för Produkter, leveransavgifter och eventuella serviceavgifter visas på 
                  Plattformen. Samtliga priser anges i svenska kronor (SEK) inklusive mervärdesskatt (12% för mat). 
                  Homechef reserverar sig för eventuella uppenbara felskrivningar avseende pris.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">5.2 Leveransavgift</h3>
                <p className="text-muted-foreground">
                  Vid beställning med leverans visas tillämplig leveransavgift på Plattformen samt i Din varukorg. 
                  Leveransavgiften baseras på avståndet till Säljaren och kan variera beroende på efterfrågan.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">5.3 Minsta ordervärde</h3>
                <p className="text-muted-foreground">
                  Vid köp via Plattformen kan ett minsta ordervärde gälla för beställningar. Vilket minsta 
                  ordervärde som gäller kan variera mellan Säljare men framgår alltid av Din varukorg innan 
                  Du lägger beställningen.
                </p>
              </div>
            </section>

            {/* 6. BETALNING */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">6. Betalning</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">6.1 Hur betalning går till</h3>
                <p className="text-muted-foreground mb-3">
                  Betalning för Din beställning sker till Homechef vid beställningstillfället med bank-/kreditkort, 
                  Klarna, Swish, eller andra betalningsmetoder som erbjuds på Plattformen vid beställningstillfället.
                </p>
                <p className="text-muted-foreground">
                  Med Ditt samtycke kan Ditt bank-/kreditkort eller betalningsinformation sparas hos våra 
                  tredjeparts betalleverantörer för framtida beställningar.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">6.2 Dricks</h3>
                <p className="text-muted-foreground">
                  När Du köper Produkter för leverans kan Du ge budet eller Hemmakocken dricks genom att välja 
                  ett dricksbelopp i samband med betalning eller efter att leveransen skett.
                </p>
              </div>
            </section>

            {/* 7. ERBJUDANDEN OCH TILLGODOHAVANDEN */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">7. Erbjudanden och tillgodohavanden</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">7.1 Kampanjer och rabattkoder</h3>
                <p className="text-muted-foreground">
                  Homechef kan från tid till annan ha erbjudanden i form av kampanjer och andra typer av 
                  rabatter på Plattformen ("Kampanjer"). Homechef kan också komma att erbjuda Dig 
                  tillgodohavanden som kan användas för att köpa Produkter på Plattformen ("Rabattkoder").
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">7.2 Begränsningar</h3>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Vissa Säljare och Produkter kan vara undantagna från Kampanjer och Rabattkoder</li>
                  <li>Rabattkoder kan inte lösas in mot kontanter och kan bara användas en gång</li>
                  <li>Rabattkoder förbrukas vid användning oavsett om hela beloppet nyttjats eller ej</li>
                  <li>Homechef adderar inte Kampanjer eller Rabattkoder på beställningar i efterhand</li>
                  <li>När giltighetsperioden har gått ut kan Rabattkoden inte längre användas</li>
                </ul>
              </div>
            </section>

            {/* 8. LOJALITETSPROGRAM */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">8. Lojalitetsprogram</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">8.1 Om lojalitetsprogrammet</h3>
                <p className="text-muted-foreground mb-2">Homechefs lojalitetsprogram fungerar enligt följande:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Du tjänar 1 poäng per 10 kr spenderat på Plattformen</li>
                  <li>Var 5:e beställning ger 10% rabatt på nästa köp</li>
                  <li>Poäng kan inte lösas in mot kontanter</li>
                  <li>Poäng förfaller efter 12 månaders inaktivitet</li>
                  <li>Homechef förbehåller sig rätten att ändra programvillkoren</li>
                </ul>
              </div>
            </section>

            {/* 9. VILLKOR FÖR LEVERANS OCH PICK-UP */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">9. Villkor för leverans och upphämtning</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">9.1 Leveranstider</h3>
                <p className="text-muted-foreground">
                  Leveranstider och upphämtningstider som anges i samband med Din beställning utgör ungefärliga 
                  tider och kan förändras till följd av trafik- eller väderförhållanden och andra orsaker 
                  bortom Homechefs kontroll. Vid förseningar kommer vi meddela Dig så snart vi kan.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">9.2 Leverans</h3>
                <p className="text-muted-foreground mb-2">Inför leverans ansvarar Du för att:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Finnas tillgänglig för att motta meddelanden och samtal på angivet telefonnummer</li>
                  <li>Vara tillgänglig på den angivna leveransadressen för att motta beställningen</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Om Du inte är tillgänglig vid leveransen har Homechef eller Säljaren rätt att lämna 
                  leveransen utanför dörren eller avbryta beställningen. Vid avbruten beställning på grund 
                  av Din otillgänglighet förverkar Du rätten till återbetalning.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">9.3 Pick-Up (upphämtning)</h3>
                <p className="text-muted-foreground mb-3">
                  Om Du har valt Pick-Up ska Produkterna hämtas av Dig hos Säljaren vid den tid som anges 
                  på Plattformen. Beroende på vilken typ av Produkt Du beställt kan Säljaren kräva att Du 
                  identifierar Dig med giltig legitimation.
                </p>
                <p className="text-muted-foreground">
                  Om beställningen inte hämtas inom 30 minuter efter angiven upphämtningstid kan Du debiteras 
                  fullt pris för Produkterna och beställningen kan kasseras.
                </p>
              </div>
            </section>

            {/* 10. INNEHÅLL OCH KVALITET PÅ MÅLTIDER */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">10. Innehåll och kvalitet på måltider</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">10.1 Ansvarsfördelning</h3>
                <p className="text-muted-foreground">
                  Måltider och andra livsmedel som görs tillgängliga för köp på Plattformen är förberedda 
                  och förpackade av Säljare. Homechef förbereder inte och är inte involverade i förberedelsen, 
                  tillredningen eller paketeringen av Produkterna. Säljaren ansvarar för att vara registrerad 
                  som livsmedelsanläggning hos kommunen och att följa Livsmedelsverkets krav.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">10.2 Allergeninformation</h3>
                <p className="text-muted-foreground mb-3">
                  Säljaren tillhandahåller information om ingredienser och allergener enligt EU:s 
                  allergenförordning (1169/2011). De 14 deklarationspliktiga allergenerna ska alltid anges.
                </p>
                <p className="text-muted-foreground">
                  Homechef kan inte garantera att informationen är fullständigt korrekt vid var tid. Vid 
                  allergier bör Du kontakta Säljaren direkt före beställning.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">10.3 Kvalitet</h3>
                <p className="text-muted-foreground">
                  Om inte annat särskilt anges är måltiderna avsedda att förtäras omedelbart efter leverans. 
                  Vi ansvarar inte för måltidens kvalitet om den förtäras senare än rekommenderat.
                </p>
              </div>
            </section>

            {/* 11. KRAV FÖR HEMMAKOCKAR */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">11. Krav för hemmakockar</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">11.1 Grundläggande krav</h3>
                <p className="text-muted-foreground mb-2">Som Hemmakock på Homechef måste Du:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Ha ett godkänt kök enligt Livsmedelsverkets föreskrifter (LIVSFS 2005:20)</li>
                  <li>Vara registrerad som livsmedelsföretagare hos Din kommun</li>
                  <li>Inneha F-skattsedel eller bedriva verksamhet via eget företag</li>
                  <li>Ha giltiga försäkringar (ansvarsförsäkring, produktansvarsförsäkring)</li>
                  <li>Följa HACCP-principer och god livsmedelshygien</li>
                  <li>Tillhandahålla korrekt allergeninformation för alla rätter</li>
                  <li>Leverera mat enligt överenskomna tider och kvalitetskrav</li>
                  <li>Genomgå Homechefs godkännandeprocess före aktivering</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">11.2 Livsmedelssäkerhet</h3>
                <p className="text-muted-foreground mb-2">Alla Hemmakockar måste följa:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Livsmedelslagen (2006:804) och tillhörande förordningar</li>
                  <li>EU-förordning 852/2004 om livsmedelshygien</li>
                  <li>Livsmedelsverkets föreskrifter om livsmedelshygien</li>
                  <li>Krav på temperaturkontroll vid förvaring och transport</li>
                  <li>Korrekt märkning av livsmedel inklusive ingredienser och allergener</li>
                  <li>Spårbarhetskrav enligt gällande lagstiftning</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">11.3 Serviceavgift</h3>
                <p className="text-muted-foreground">
                  Homechef tar ut en serviceavgift på 20% av ordervärdet från Hemmakockar. Utbetalning till 
                  Hemmakockar sker veckovis till registrerat bankkonto.
                </p>
              </div>
            </section>

            {/* 12. KÖKSUTHYRNING */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">12. Köksuthyrning (Kökspartner)</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">12.1 Krav för kökspartners</h3>
                <p className="text-muted-foreground mb-2">Som Kökspartner gäller:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Köket måste vara godkänt för livsmedelshantering av kommunen</li>
                  <li>Kökspartner ansvarar för att köket uppfyller säkerhetskrav</li>
                  <li>Tydliga regler för användning och städning ska kommuniceras</li>
                  <li>Försäkringsskydd ska finnas för skador på utrustning</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">12.2 Serviceavgift</h3>
                <p className="text-muted-foreground">
                  Homechef tar ut 15% serviceavgift på uthyrningsintäkter. Utbetalning sker månadsvis.
                </p>
              </div>
            </section>

            {/* 13. RESTAURANGPARTNERS */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">13. Restaurangpartners</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">13.1 Krav för restauranger</h3>
                <p className="text-muted-foreground mb-2">Som Restaurangpartner gäller:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Giltigt tillstånd för livsmedelsverksamhet krävs</li>
                  <li>Restaurangen ansvarar för kvalitet och säkerhet på all mat</li>
                  <li>Meny och priser ska hållas uppdaterade på Plattformen</li>
                  <li>Leveranstider ska hållas enligt överenskommelse</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">13.2 Serviceavgift</h3>
                <p className="text-muted-foreground">
                  Homechef tar ut 18% serviceavgift på ordervärdet från Restaurangpartners.
                </p>
              </div>
            </section>

            {/* 14. PRIVATKOCK OCH CATERING */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">14. Privatkock och catering</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">14.1 Privatkocktjänster</h3>
                <p className="text-muted-foreground mb-2">
                  Vid bokning av privatkock gäller särskilda villkor:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Bokning ska göras minst 48 timmar i förväg</li>
                  <li>Avbokning senast 48 timmar före för full återbetalning</li>
                  <li>Kunden ansvarar för att tillhandahålla lämpligt kök</li>
                  <li>Ingredienskostnader kan tillkomma utöver tjänstekostnaden</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">14.2 Catering</h3>
                <p className="text-muted-foreground mb-2">
                  Vid cateringbeställningar gäller:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Bokning ska göras minst 7 dagar i förväg för större evenemang</li>
                  <li>Avbokning senast 7 dagar före för full återbetalning</li>
                  <li>Förskottsbetalning på 50% kan krävas vid bokningstillfället</li>
                  <li>Särskilda allergikrav ska meddelas vid bokning</li>
                </ul>
              </div>
            </section>

            {/* 15. MATUPPLEVELSER */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">15. Matupplevelser</h2>
              <p className="text-muted-foreground mb-2">
                Vid bokning av matupplevelser (middagskvällar, matlagningskurser, etc.) gäller:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Avbokning senast 72 timmar före för full återbetalning</li>
                <li>Mindre än 72 timmar: 50% av priset debiteras</li>
                <li>Samma dag: Ingen återbetalning</li>
                <li>Matupplevelsen genomförs enligt beskrivning på Plattformen</li>
                <li>Säljaren kan ställa in evenemanget vid för få deltagare (full återbetalning)</li>
              </ul>
            </section>

            {/* 16. REKLAMATION OCH ÅNGERRÄTT */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">16. Reklamation och ångerrätt</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">16.1 Reklamation</h3>
                <p className="text-muted-foreground mb-3">
                  Du som lägger en beställning i egenskap av privatperson/konsument har under tre (3) år 
                  från inköpstillfället rätt att reklamera beställningen i de fall det skulle saknas några 
                  Produkter eller om Produkterna som har levererats till Dig är bristfälliga, felaktiga 
                  eller annars inte överensstämmer med Din beställning.
                </p>
                <p className="text-muted-foreground">
                  Kontakta vår kundservice med en beskrivning av felet inom två (2) månader från att Du 
                  upptäckt problemet. Dokumentera problemet med bilder om möjligt. Vi utreder ärendet och 
                  meddelar beslut inom 5 arbetsdagar.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">16.2 Ångerrätt</h3>
                <p className="text-muted-foreground mb-3">
                  Du har i vissa fall rätt att frånträda avtalet (utnyttja Din ångerrätt) inom 14 dagar. 
                  Vänligen notera att ångerrätten <strong>inte gäller</strong> för:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Köp av måltider, livsmedel eller andra Produkter med kort hållbarhet</li>
                  <li>Produkter som snabbt kan försämras eller bli för gamla</li>
                  <li>Produkter som var förseglade vid leverans men där förseglingen brutits</li>
                  <li>Leveranstjänster som redan fullgjorts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">16.3 Avbokningsregler</h3>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li><strong>Matbeställningar:</strong> Kostnadsfri avbokning senast 24 timmar före leverans</li>
                  <li><strong>Privatkocktjänster:</strong> Kostnadsfri avbokning senast 48 timmar före</li>
                  <li><strong>Catering:</strong> Kostnadsfri avbokning senast 7 dagar före</li>
                  <li><strong>Matupplevelser:</strong> Kostnadsfri avbokning senast 72 timmar före</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Vid sen avbokning kan 50-100% av ordervärdet debiteras. Återbetalningar behandlas inom 
                  5-10 arbetsdagar.
                </p>
              </div>
            </section>

            {/* 17. KUNDRECENSIONER */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">17. Kundrecensioner</h2>
              <p className="text-muted-foreground mb-3">
                Kunder har möjligheten att betygsätta och ge omdömen om Säljare och Produkter på Plattformen. 
                För att säkerställa att betyg och omdömen kommer från Kunder som faktiskt köpt Produkter, 
                kan Kunder bara betygsätta och skriva omdömen efter att beställningen har levererats.
              </p>
              <p className="text-muted-foreground mb-2">
                Recensioner som lämnas på Plattformen ska vara:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Sanningsenliga och baserade på faktisk upplevelse</li>
                <li>Respektfulla och utan kränkande innehåll</li>
                <li>Fria från rasistiskt, sexistiskt eller hotfullt innehåll</li>
                <li>Relaterade till den faktiska beställningen</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Homechef förbehåller sig rätten att ta bort olämpliga recensioner.
              </p>
            </section>

            {/* 18. HOMECHEFS RÄTTIGHETER */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">18. Homechefs rättigheter</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">18.1 Immateriella rättigheter</h3>
                <p className="text-muted-foreground">
                  Allt innehåll på Plattformen, inklusive men inte begränsat till text, bilder, logotyper, 
                  grafik, design och programkod, är skyddat av upphovsrätt och andra immateriella rättigheter 
                  som tillhör Homechef AB eller våra licensgivare. Kopiering, distribution eller annan 
                  användning utan skriftligt tillstånd är förbjuden.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">18.2 Respekt för egendom</h3>
                <p className="text-muted-foreground">
                  Du får inte använda automatiserade verktyg för att skrapa data från Plattformen eller på 
                  annat sätt försöka få obehörig åtkomst till systemet.
                </p>
              </div>
            </section>

            {/* 19. HOMECHEFS RÄTT ATT AGERA MOT ANVÄNDARE */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">19. Homechefs rätt att agera mot användare</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">19.1 Tillfällig eller omedelbar avstängning</h3>
                <p className="text-muted-foreground mb-2">
                  Homechef förbehåller sig rätten att omedelbart stänga av eller avsluta Ditt konto om:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Du bryter mot dessa Villkor</li>
                  <li>Du upprepade gånger får negativa omdömen (Säljare)</li>
                  <li>Du inte uppfyller kraven för livsmedelssäkerhet (Säljare)</li>
                  <li>Du bedriver bedräglig verksamhet</li>
                  <li>Du agerar våldsamt, hotfullt eller kränkande</li>
                  <li>Du skadar Homechefs varumärke eller rykte</li>
                  <li>Du kringgår Plattformen för direkta transaktioner</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">19.2 Klagomålshantering</h3>
                <p className="text-muted-foreground">
                  Om Du vill överklaga ett beslut om avstängning eller annan åtgärd, kontakta vår kundservice. 
                  Vi behandlar alla klagomål och meddelar beslut inom 10 arbetsdagar.
                </p>
              </div>
            </section>

            {/* 20. ÖVRIGT */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">20. Övrigt</h2>
              
              <div>
                <h3 className="text-lg font-medium mb-2">20.1 Plattformens tillgänglighet</h3>
                <p className="text-muted-foreground">
                  Homechef strävar efter att Plattformen ska vara tillgänglig dygnet runt, men garanterar 
                  inte oavbruten tillgång. Planerat underhåll kan påverka tillgängligheten.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">20.2 Force majeure</h3>
                <p className="text-muted-foreground">
                  Homechef ansvarar inte för förseningar eller brister i Tjänsten som orsakas av 
                  omständigheter utanför vår kontroll, såsom naturkatastrofer, krig, strejk, pandemi, 
                  myndighetsåtgärder, elavbrott eller andra oförutsedda händelser.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">20.3 Ändringar av villkoren</h3>
                <p className="text-muted-foreground">
                  Homechef har rätt att när som helst uppdatera eller ändra Villkoren. Vid betydande 
                  ändringar underrättar vi Dig via e-post minst 30 dagar innan de träder i kraft. 
                  Fortsatt användning av Tjänsten efter att ändringar trätt i kraft innebär att Du 
                  accepterar de nya villkoren.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">20.4 Ansvarsbegränsning</h3>
                <p className="text-muted-foreground mb-2">
                  Homechef fungerar som en förmedlingsplattform och ansvarar inte för:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li>Kvaliteten, säkerheten eller smaken på mat från Säljare</li>
                  <li>Förseningar eller uteblivna leveranser orsakade av Säljare eller tredje part</li>
                  <li>Allergiska reaktioner eller matförgiftning</li>
                  <li>Tvister mellan Säljare och Kunder som inte kan lösas via kundservice</li>
                  <li>Indirekta skador, följdskador eller utebliven vinst</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Homechefs maximala ansvar är begränsat till det belopp Kunden har betalat för aktuell beställning.
                </p>
              </div>
            </section>

            {/* 21. TILLÄMPLIG LAG OCH TVISTLÖSNING */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">21. Tillämplig lag och tvistlösning</h2>
              <p className="text-muted-foreground mb-3">
                Dessa Villkor regleras av svensk lag. Tvister ska i första hand lösas genom förhandling. 
                Om parterna inte kan enas ska tvisten avgöras av:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Allmänna reklamationsnämnden (ARN) för konsumenttvister</li>
                <li>Svensk allmän domstol med Stockholms tingsrätt som första instans</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Du kan även använda EU:s plattform för tvistlösning online: 
                <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline ml-1">
                  ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>

            {/* 22. KONTAKTUPPGIFTER */}
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">22. Kontaktuppgifter</h2>
              <p className="text-muted-foreground mb-3">
                Om Du har frågor om dessa Villkor eller vill komma i kontakt med oss:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold">Homechef AB</p>
                <p className="text-muted-foreground">Org.nr: XXX-XXXXXX</p>
                <p className="text-muted-foreground">E-post: support@homechef.se</p>
                <p className="text-muted-foreground">Telefon: 08-XXX XX XX</p>
                <p className="text-muted-foreground">Adress: Stockholm, Sverige</p>
              </div>
              <p className="text-muted-foreground mt-4">
                Vår kundservice är tillgänglig vardagar 09:00-18:00 och helger 10:00-16:00.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;