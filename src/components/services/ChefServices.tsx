// @ts-nocheck
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Users, Calendar, Utensils, CheckCircle, Shield, Building2 } from "lucide-react";
import sellFoodImage from "@/assets/service-sell-food.jpg";
import privateChefImage from "@/assets/private-chef.jpg";
import experienceImage from "@/assets/experience-dining.jpg";
import cateringImage from "@/assets/catering-service.jpg";
import approvedKitchenImage from "@/assets/swedish-villa-kitchen-realistic.jpg";
import businessRegistrationImage from "@/assets/business-registration.jpg";

const mainChefServices = [
  {
    image: sellFoodImage,
    title: "Sälj din mat",
    description: "Skapa och sälj dina egna rätter till hungriga kunder",
    href: "/chef/application",
    icon: ChefHat,
    color: "from-green-500 to-green-600"
  },
  {
    image: privateChefImage,
    title: "Privatkock-tjänster",
    description: "Erbjud dina tjänster som privatkock för speciella evenemang",
    href: "/chef/private-services",
    icon: Users,
    color: "from-purple-500 to-purple-600"
  },
  {
    image: experienceImage,
    title: "Matupplevelser",
    description: "Skapa unika matupplevelser hemma hos dig",
    href: "/chef/experiences",
    icon: Calendar,
    color: "from-amber-500 to-amber-600"
  },
  {
    image: cateringImage,
    title: "Catering",
    description: "Erbjud professionell catering till företag och privatpersoner",
    href: "/chef/catering",
    icon: Utensils,
    color: "from-blue-500 to-blue-600"
  }
];

const otherChefServices = [
  {
    image: approvedKitchenImage,
    title: "Kök-krav",
    description: "Lär dig vad som krävs för att få ditt kök godkänt",
    href: "/chef/kitchen-requirements",
    icon: Shield,
    color: "from-orange-500 to-orange-600"
  },
  {
    image: businessRegistrationImage,
    title: "Registrera näringsverksamhet",
    description: "Lär dig starta företag, skatter, avdrag och försäkringar",
    href: "/chef/business-registration",
    icon: Building2,
    color: "from-blue-500 to-blue-600"
  }
];

const ChefServices = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Vad vill du göra som kock?
          </h2>
          <p className="text-muted-foreground">
            Utveckla ditt kockyrke och nå fler kunder genom våra olika tjänster
          </p>
        </div>
        
        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {mainChefServices.map((service) => {
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

        {/* Övrigt Section */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-4">Övrigt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherChefServices.map((service) => {
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
        </div>
      </div>
    </section>
  );
};

export default ChefServices;