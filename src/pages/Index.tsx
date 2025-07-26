import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FoodGrid from "@/components/FoodGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <FoodGrid />
      <Footer />
    </div>
  );
};

export default Index;
