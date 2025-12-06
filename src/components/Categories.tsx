import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChefHat, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Chef {
  id: string;
  business_name: string;
  full_name: string | null;
  city: string | null;
  specialties: string | null;
  profile_image_url: string | null;
}

const PopularChefs = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChefs();
  }, []);

  const loadChefs = async () => {
    try {
      const { data, error } = await supabase
        .from("chefs")
        .select("id, business_name, full_name, city, specialties, profile_image_url")
        .eq("kitchen_approved", true)
        .limit(6);

      if (error) throw error;
      setChefs(data || []);
    } catch (error) {
      console.error("Error loading chefs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="popular-chefs" className="py-8 bg-secondary/30 rounded-xl my-4">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-foreground">
            Kockar nära dig
          </h2>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="popular-chefs" className="py-8 bg-secondary/30 rounded-xl my-4">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-foreground">
          Kockar nära dig
        </h2>
        
        {chefs.length === 0 ? (
          <div className="text-center py-16 col-span-full">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Inga kockar registrerade än
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Ingen kock har registrerat sig än. Vill du vara först?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/chef/application" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Registrera dig som kock
                </Button>
              </Link>
              <Link to="/notification-signup" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Få notifiering när kockar finns
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chefs.map((chef) => (
                <Link key={chef.id} to={`/chef/${chef.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-14 h-14 border-2 border-primary/20">
                          <AvatarImage src={chef.profile_image_url || undefined} alt={chef.full_name || chef.business_name} />
                          <AvatarFallback className="bg-primary/10">
                            <ChefHat className="w-6 h-6 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {chef.full_name || chef.business_name}
                          </h3>
                          {chef.city && (
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{chef.city}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">Ny kock</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/chef-search">
                <Button variant="outline">
                  Visa alla kockar
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PopularChefs;
