import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

const popularChefs: never[] = [];

const PopularChefs = () => {
  return (
    <section id="popular-chefs" className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Populära kockar i närområdet
        </h2>
        
        {popularChefs.length === 0 && (
          <div className="text-center py-16 col-span-full">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Inga kockar registrerade än
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Vi arbetar på att få fler kockar att registrera sig. Bli den första att registrera dig som kock här!
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
        )}
      </div>
    </section>
  );
};

export default PopularChefs;