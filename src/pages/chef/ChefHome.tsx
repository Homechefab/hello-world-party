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
        <section aria-labelledby="chef-services-section">
          <h2 id="chef-services-section" className="sr-only">Tjänsteöversikt för kock</h2>
          <ChefServices />
        </section>
      </main>
    </div>
  );
};

export default ChefHome;
