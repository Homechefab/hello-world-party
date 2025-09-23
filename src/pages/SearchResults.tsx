import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, UtensilsCrossed } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchContent = async () => {
      try {
        setLoading(true);
        // Simulate search delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };

    searchContent();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Söker efter kockar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {query ? 'Sökresultat' : 'Utforska'}
            </h1>
            {query && (
              <p className="text-xl text-white/90 mb-2">
                Inga resultat hittades för "{query}"
              </p>
            )}
            {!query && (
              <p className="text-xl text-white/90">
                Inga kockar registrerade än
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <UtensilsCrossed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">
              {query ? `Inga resultat hittades för "${query}"` : "Inga kockar registrerade än"}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {query 
                ? "Prova att söka på något annat eller kontrollera stavningen."
                : "Vi arbetar på att få fler kockar och rätter registrerade."
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/chef/application">
                <Button size="lg">
                  Registrera dig som kock
                </Button>
              </Link>
              <Link to="/notification-signup">
                <Button variant="outline" size="lg">
                  Få notifiering när kockar finns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchResults;