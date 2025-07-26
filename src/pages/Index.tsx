import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import DishDetails from "@/components/DishDetails";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import SearchAndFilters from "@/components/SearchAndFilters";

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
      <Header />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <SearchAndFilters 
          onFiltersChange={setFilters}
          activeFilters={filters}
        />
      </div>
      <Categories />
      <DishDetails />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
