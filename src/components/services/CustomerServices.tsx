import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, Users } from "lucide-react";
import pickupImage from "@/assets/customer-pickup.jpg";
import experienceImage from "@/assets/experience-dining.jpg";
import privateChefImage from "@/assets/private-chef.jpg";

const customerServices = [
  {
    image: pickupImage,
    title: "Beställ mat för avhämtning",
    description: "Hämta hemlagad mat direkt från kocken i ditt närområde",
    href: "/pickup",
    icon: ShoppingBag,
    color: "from-blue-500 to-blue-600"
  },
  {
    image: experienceImage,
    title: "Upplevelsepaket, mat hos kocken",
    description: "Njut av en unik middag hemma hos en professionell kock",
    href: "/experiences",
    icon: Calendar,
    color: "from-purple-500 to-purple-600"
  },
  {
    image: privateChefImage,
    title: "Anlita en privatkock",
    description: "Få en kock hem till dig för speciella tillfällen och evenemang",
    href: "/private-chef",
    icon: Users,
    color: "from-gold-500 to-gold-600"
  }
];

const CustomerServices = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Vad vill du göra idag?
          </h2>
          <p className="text-muted-foreground">
            Välj från våra populära alternativ för att upptäcka hemlagad mat
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
      </div>
    </section>
  );
};

export default CustomerServices;