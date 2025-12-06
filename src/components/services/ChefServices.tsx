import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Users, Calendar, Utensils, CheckCircle, Shield, Building2, Package } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import sellFoodImage from "@/assets/service-sell-food.jpg";
import privateChefImage from "@/assets/private-chef.jpg";
import experienceImage from "@/assets/experience-dining.jpg";
import cateringImage from "@/assets/catering-service.jpg";
import mealBoxesImage from "@/assets/meal-boxes.jpg";
import approvedKitchenImage from "@/assets/swedish-villa-kitchen-realistic.jpg";
import businessRegistrationImage from "@/assets/business-registration.jpg";
import municipalityPermitImage from "@/assets/municipality-permit.jpg";

const mainChefServices = [
  {
    image: sellFoodImage,
    title: "Sälj din mat",
    description: "Lägg upp din meny och nå kunder i ditt område",
    href: "/chef/application",
    icon: ChefHat,
    color: "from-green-500 to-green-600"
  },
  {
    image: privateChefImage,
    title: "Privatkock-tjänster",
    description: "Laga mat hemma hos kunder för speciella tillfällen",
    href: "/chef/private-services",
    icon: Users,
    color: "from-purple-500 to-purple-600"
  },
  {
    image: experienceImage,
    title: "Matupplevelser",
    description: "Bjud in kunder till matlagningskurser och middagar",
    href: "/chef/experiences",
    icon: Calendar,
    color: "from-amber-500 to-amber-600"
  },
  {
    image: cateringImage,
    title: "Catering",
    description: "Ta cateringuppdrag för event och firmafester",
    href: "/chef/catering",
    icon: Utensils,
    color: "from-blue-500 to-blue-600"
  },
  {
    image: mealBoxesImage,
    title: "Sälj färdiglagade matlådor",
    description: "Erbjud färdiga måltider för upphämtning eller leverans",
    href: "/chef/meal-boxes",
    icon: Package,
    color: "from-rose-500 to-rose-600"
  }
];

const otherChefServices = [
  {
    image: municipalityPermitImage,
    title: "Tillstånd från kommun",
    description: "Ansök om tillstånd och registrera din livsmedelsverksamhet",
    href: "/chef/municipality-requirements",
    icon: CheckCircle,
    color: "from-green-500 to-green-600"
  },
  {
    image: approvedKitchenImage,
    title: "Kök-krav",
    description: "Vad som krävs för att få sälja mat från ditt kök",
    href: "/chef/kitchen-requirements",
    icon: Shield,
    color: "from-orange-500 to-orange-600"
  },
  {
    image: businessRegistrationImage,
    title: "Registrera näringsverksamhet",
    description: "Starta företag, hantera skatter och hitta rätt försäkring",
    href: "/chef/business-registration",
    icon: Building2,
    color: "from-blue-500 to-blue-600"
  }
];

const ChefServices = () => {
  const { isChef } = useRole();

  // For approved chefs, main services lead to dashboard
  const getServiceHref = (defaultHref: string) => {
    if (isChef) {
      return "/chef/dashboard";
    }
    return defaultHref;
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Välj hur du vill jobba
          </h2>
          <p className="text-muted-foreground">
            Bygg ditt matföretag på det sätt som passar dig bäst
          </p>
        </div>
        
        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12">
          {mainChefServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.title}
                to={getServiceHref(service.href)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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