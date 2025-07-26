import { Button } from "@/components/ui/button";
import { Search, MapPin, ShoppingCart, ChefHat, Building } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-food.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero min-h-[500px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Hemlagad mat"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Homechef
            <span className="block text-xl md:text-2xl font-normal text-yellow-cream">hemlagad mat nära dig</span>
          </h1>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Hitta unika maträtter tillagade av passionerade hemkockar. 
            Från traditionella husmanskost till internationella delikatesser.
          </p>
          
          <div id="search" className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Utforska dagens smaker"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ange din stad eller adress"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                />
              </div>
              <Button variant="food" size="lg" className="px-8">
                Sök mat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;