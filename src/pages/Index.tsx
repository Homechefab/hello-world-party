import Hero from "@/components/Hero";
import PopularChefs from "@/components/Categories";
import FoodGrid from "@/components/FoodGrid";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import RoleBasedServices from "@/components/services/RoleBasedServices";
import { useRole } from "@/hooks/useRole";
import SEOHead from "@/components/SEOHead";


const Index = () => {
  const { role } = useRole();
  console.log('Index component rendering');
  
  return (
    <>
      <SEOHead
        title="Hemlagad mat direkt från lokala kockar"
        description="Sveriges första marknadsplats för hemlagad mat. Beställ autentisk, hemlagad mat från passionerade hemkockar i ditt område. Upptäck unika maträtter idag!"
        keywords="hemlagad mat, hemkock, matbeställning, lokal mat, svensk husmanskost, catering, matupplevelse"
        type="website"
      />
      
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
    </>
  );
};

export default Index;
