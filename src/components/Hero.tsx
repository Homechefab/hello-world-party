// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ShoppingCart, ChefHat, Building } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-food.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
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
            Beställ hemlagad mat från duktiga kockar i ditt område.
          </p>
          
          <div id="search" className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log("Search submitted with query:", searchQuery);
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Vad vill du äta? Skriv stad eller adress"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                </div>
                <Button type="submit" variant="food" size="lg" className="px-8">
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