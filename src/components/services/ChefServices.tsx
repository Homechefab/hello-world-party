import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Users, Calendar, Utensils } from "lucide-react";
import sellFoodImage from "@/assets/service-sell-food.jpg";
import privateChefImage from "@/assets/private-chef.jpg";
import experienceImage from "@/assets/experience-dining.jpg";

const chefServices = [
  {
    image: sellFoodImage,
    title: "Sälj din mat",
    description: "Skapa och sälj dina egna rätter till hungriga kunder",
    href: "/chef/dashboard",
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
    color: "from-blue-500 to-blue-600"
  }
];

const ChefServices = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Dina kocktjänster
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Utveckla ditt kockyrke och nå fler kunder genom våra olika tjänster
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {chefServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.title}
                to={service.href}
                className="group block"
              >
                <Card className="h-full hover:shadow-card transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-center text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-center leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Kom igång
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-card rounded-lg p-8 max-w-2xl mx-auto border">
            <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Behöver du mer hjälp?</h3>
            <p className="text-muted-foreground mb-6">
              Kontakta vårt team för personlig rådgivning om hur du kan maximera dina intäkter som kock.
            </p>
            <Button>
              Kontakta oss
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefServices;