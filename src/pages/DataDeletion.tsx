import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Mail, AlertCircle } from 'lucide-react';

const DataDeletion = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Trash2 className="w-8 h-8" />
              Radering av data
            </CardTitle>
            <p className="text-muted-foreground">
              Instruktioner för hur du raderar dina personuppgifter från Homechef
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Viktigt att veta
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    När du raderar ditt konto kommer all din personliga information att tas bort permanent. 
                    Detta inkluderar din profil, beställningshistorik, sparade adresser och preferenser.
                  </p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Metod 1: Via din profilinställningar</h2>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>Logga in på ditt Homechef-konto</li>
                <li>Gå till <strong>Inställningar</strong> i menyn</li>
                <li>Klicka på <strong>Konto</strong></li>
                <li>Scrolla ner till <strong>"Radera mitt konto"</strong></li>
                <li>Följ instruktionerna för att bekräfta raderingen</li>
              </ol>
              <p className="text-muted-foreground mt-3">
                Din data kommer att raderas inom 30 dagar efter att du har begärt radering.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Metod 2: Kontakta kundtjänst</h2>
              <p className="text-muted-foreground mb-3">
                Om du föredrar att få hjälp med att radera ditt konto kan du kontakta vår kundtjänst:
              </p>
              
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">E-post</h3>
                    <p className="text-muted-foreground">support@homechef.se</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ange "Radera mitt konto" i ämnesraden och inkludera din e-postadress 
                      som är kopplad till kontot.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => window.location.href = 'mailto:support@homechef.se?subject=Radera mitt konto'}
                    className="w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Skicka raderingsförfrågan
                  </Button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Vad händer när du raderar ditt konto?</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Din profil och personuppgifter raderas permanent</li>
                <li>All beställningshistorik tas bort</li>
                <li>Sparade adresser och betalningsmetoder raderas</li>
                <li>Du kommer inte längre kunna logga in på kontot</li>
                <li>Eventuella lojalitetspoäng går förlorade</li>
                <li>Pågående beställningar måste slutföras eller avbrytas först</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Data som kan behållas</h2>
              <p className="text-muted-foreground mb-2">
                I enlighet med lagkrav kan vissa uppgifter behållas för:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Bokföringsändamål (enligt bokföringslagen)</li>
                <li>Hantering av eventuella reklamationer eller tvister</li>
                <li>Efterlevnad av skatte- och betalningsregler</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Dessa uppgifter raderas automatiskt när lagringstiden löper ut.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Tidsram för radering</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Normal radering:</strong> Din data raderas inom 30 dagar efter begäran.
                  <br />
                  <strong>Omedelbar radering:</strong> Om du har särskilda skäl kan vi påskynda processen. 
                  Kontakta kundtjänst för att diskutera detta.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Ångra radering</h2>
              <p className="text-muted-foreground">
                Du har 7 dagar på dig att ångra din raderingsbegäran. Efter det kommer datan att 
                raderas permanent och kan inte återställas. Kontakta oss omedelbart om du ångrar dig.
              </p>
            </section>

            <section className="pt-6 border-t">
              <h2 className="text-2xl font-semibold mb-3">Behöver du hjälp?</h2>
              <p className="text-muted-foreground mb-4">
                Om du har frågor om raderingsprocessen eller vill diskutera alternativ, tveka inte att kontakta oss:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>E-post:</strong> support@homechef.se</p>
                <p><strong>Svarstid:</strong> Inom 48 timmar</p>
              </div>
            </section>

            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Obs! Detta går inte att ångra
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    När raderingen är genomförd kan din data inte återställas. Se till att du verkligen 
                    vill radera ditt konto innan du fortsätter.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataDeletion;
