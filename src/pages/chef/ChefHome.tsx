import { useEffect } from "react";
import ChefServices from "@/components/services/ChefServices";

const ChefHome = () => {
  useEffect(() => {
    document.title = "Kock – Tjänster | Homechef";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Utforska kockens tjänster på Homechef: sälj din mat, privatkock-tjänster, matupplevelser och kök-krav."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="py-12 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Kockens tjänster
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Välj en tjänst för att se detaljerad information och komma igång.
          </p>
        </div>
      </header>
      <main>
        <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Vad krävs för att börja sälja din mat?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Grundläggande krav</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Godkänt kök som uppfyller livsmedelssäkerhetskrav</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Genomförd hygienutbildning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Registrering hos kommunens miljö- och hälsoskyddskontor</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Egenkontrollprogram för livsmedelssäkerhet</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Så kommer du igång</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                      <span className="text-muted-foreground">Ansök som kock och ladda upp nödvändiga dokument</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                      <span className="text-muted-foreground">Genomför hygienutbildning och få ditt kök godkänt</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                      <span className="text-muted-foreground">Börja sälja din mat och skapa fantastiska matupplevelser</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section aria-labelledby="chef-services-section" className="py-16">
          <div className="container mx-auto px-4">
            <h2 id="chef-services-section" className="text-3xl font-bold text-center mb-12">Välj din tjänst</h2>
            <ChefServices />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChefHome;
