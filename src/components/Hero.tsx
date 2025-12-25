import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-food.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  return (
    <section className="relative bg-gradient-hero min-h-[400px] flex items-center overflow-hidden rounded-xl my-4">
      <div className="absolute inset-0 rounded-xl">
        <img
          src={heroImage}
          alt="Hemlagad mat"
          className="w-full h-full object-cover opacity-20 rounded-xl"
        />
        <div className="absolute inset-0 bg-gradient-hero/80 rounded-xl"></div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Homechef
            <span className="block text-lg md:text-xl font-normal text-yellow-cream mt-2">hemlagad mat nära dig</span>
          </h1>
          <p className="text-lg mb-6 text-white/90">
            Beställ hemlagad mat från kommunalt godkända kockar i ditt område.
          </p>
          
          <div id="search" className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl max-w-2xl mx-auto">
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log("Search submitted with query:", searchQuery);
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Vad vill du äta? Skriv stad eller adress"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm"
                  />
                </div>
                <Button type="submit" variant="food" size="default" className="px-6">
                  Beställ mat
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;