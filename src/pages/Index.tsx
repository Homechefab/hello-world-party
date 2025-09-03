import { useState } from "react";
import Hero from "@/components/Hero";
import PopularChefs from "@/components/Categories";
import DishDetails from "@/components/DishDetails";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import RoleBasedServices from "@/components/services/RoleBasedServices";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  rating: string;
  location: string;
  sortBy: string;
}

const Index = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    priceRange: "",
    rating: "",
    location: "",
    sortBy: "relevance"
  });

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      {/* Show login prompt for non-authenticated users */}
      {!user && (
        <div className="bg-primary/5 py-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Välkommen till Homechef!</h2>
            <p className="text-muted-foreground mb-6">
              Logga in för att beställa mat från lokala kockar eller ansök om att bli kock själv.
            </p>
            <Link to="/auth">
              <Button size="lg">
                Logga in / Skapa konto
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <RoleBasedServices />
      <PopularChefs />
      <DishDetails />
      
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
