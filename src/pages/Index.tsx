import { useState } from "react";
import Hero from "@/components/Hero";
import PopularChefs from "@/components/Categories";
import DishDetails from "@/components/DishDetails";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import RoleBasedServices from "@/components/services/RoleBasedServices";


interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  rating: string;
  location: string;
  sortBy: string;
}

const Index = () => {
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
      <RoleBasedServices />
      <PopularChefs />
      <DishDetails />
      
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
