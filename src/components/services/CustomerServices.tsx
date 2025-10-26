// @ts-nocheck
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, Users, ChefHat, DollarSign, Star, Utensils, Package } from "lucide-react";
import pickupImage from "@/assets/customer-pickup.jpg";
import experienceImage from "@/assets/experience-dining.jpg";
import privateChefImage from "@/assets/private-chef.jpg";
import cateringImage from "@/assets/catering-service.jpg";
import mealBoxesImage from "@/assets/meal-boxes.jpg";
import becomeChefImage from "@/assets/become-chef-cooking.jpg";
import chefRecruitmentBg from "@/assets/chef-recruitment-bg.jpg";

const customerServices = [
  {
    image: pickupImage,
    title: "Beställ mat för avhämtning",
    description: "Hämta färdig hemlagad mat direkt hos kocken nära dig",
    href: "/pickup",
    icon: ShoppingBag,
    color: "from-blue-500 to-blue-600"
  },
  {
    image: experienceImage,
    title: "Upplevelsepaket, mat hos kocken",
    description: "Ät middag hemma hos en duktig kock",
    href: "/experiences",
    icon: Calendar,
    color: "from-purple-500 to-purple-600"
  },
  {
    image: privateChefImage,
    title: "Anlita en privatkock",
    description: "Få en kock hem till dig för fester och event",
    href: "/private-chef",
    icon: Users,
    color: "from-gold-500 to-gold-600"
  },
  {
    image: cateringImage,
    title: "Beställ catering",
    description: "Catering för företag, fester och speciella tillfällen",
    href: "/catering",
    icon: Utensils,
    color: "from-orange-500 to-orange-600"
  },
  {
    image: mealBoxesImage,
    title: "Färdiglagade matlådor",
    description: "Köp färdiga måltider för upphämtning eller hemleverans",
    href: "/meal-boxes",
    icon: Package,
    color: "from-rose-500 to-rose-600"
  }
];

const CustomerServices = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Din nästa smakupplevelse börjar här
          </h2>
          <p className="text-muted-foreground">
            Upptäck äkta hemlagad mat – precis som du vill ha den
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {customerServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.title}
                to={service.href}
                className="group block"
              >
                <Card className="hover:shadow-card transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-center text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {service.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Utforska
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bli Kock sektion */}
        <div className="mt-16 text-center">
          <div 
            className="rounded-lg p-8 max-w-4xl mx-auto border shadow-sm relative overflow-hidden min-h-[500px]"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${chefRecruitmentBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Content directly on background */}
            <div className="relative z-10 pt-12">
              <h3 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
                Vill du bli kock på Homechef?
              </h3>
              <p className="text-white mb-8 max-w-2xl mx-auto font-medium text-lg drop-shadow-lg">
                Tjäna pengar på din matlagning. Sätt ditt eget pris, jobba när du vill och nå kunder nära dig.
              </p>
              
              {/* Fördelar grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-white drop-shadow-lg">
                  <DollarSign className="w-5 h-5 text-green-400 drop-shadow-lg" />
                  <span>Tjäna extra pengar</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-white drop-shadow-lg">
                  <Users className="w-5 h-5 text-blue-400 drop-shadow-lg" />
                  <span>Nå fler kunder</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-white drop-shadow-lg">
                  <Star className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                  <span>Säker plattform</span>
                </div>
              </div>
              
              <Link to="/chef/application">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                  Ansök om att bli kock
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerServices;