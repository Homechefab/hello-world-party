import { useState } from "react";
import Hero from "@/components/Hero";
import PopularChefs from "@/components/Categories";
import FoodGrid from "@/components/FoodGrid";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import RoleBasedServices from "@/components/services/RoleBasedServices";
import { useRole } from "@/hooks/useRole";


interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  rating: string;
  location: string;
  sortBy: string;
}

const Index = () => {
  const { role } = useRole();
  console.log('Index component rendering');
  
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <RoleBasedServices />
      {role !== 'chef' && (
        <>
          <PopularChefs />
          <FoodGrid />
        </>
      )}
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
