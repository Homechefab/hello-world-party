// @ts-nocheck
import { useState } from "react";
import Hero from "@/components/Hero";
import PopularChefs from "@/components/Categories";
import FoodGrid from "@/components/FoodGrid";
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
  console.log('Index component rendering');
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    priceRange: "",
    rating: "",
    location: "",
    sortBy: "relevance"
  });

  console.log('Index: About to render components');
  
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <RoleBasedServices />
      <PopularChefs />
      <FoodGrid />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
