import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Calendar, Shield, TrendingUp, Truck } from "lucide-react";
import rentKitchenImage from "@/assets/service-rent-kitchen.jpg";
import deliveryImage from "@/assets/service-delivery.jpg";
import partnershipImage from "@/assets/partnership-collaboration.jpg";
import securityImage from "@/assets/business-insurance-meeting.jpg";

const kitchenPartnerServices = [
  {
    image: rentKitchenImage,
    title: "Hyr ut ditt restaurangkök",
    description: "Maximera intäkterna från ditt restaurangkök genom att hyra ut till kockar",
    href: "/hyr-ut-ditt-kok",
    icon: Building,
    color: "from-purple-500 to-purple-600"
  },
  {
    image: deliveryImage,
    title: "Homechef delivery",
    description: "Samarbeta med oss för leveranstjänster och utöka din räckvidd",
    href: "/delivery-partner/onboarding",
    icon: Truck,
    color: "from-blue-500 to-blue-600"
  },
  {
    image: partnershipImage,
    title: "Samarbeta med oss",
    description: "Bli en del av Homechef-familjen och väx tillsammans med oss",
    href: "/partnership",
    icon: TrendingUp,
    color: "from-orange-500 to-orange-600"
  },
  {
    image: securityImage,
    title: "Säkerhet & försäkring",
    description: "Information om våra säkerhets- och försäkringslösningar",
    href: "/kitchen-partner/security",
    icon: Shield,
    color: "from-green-500 to-green-600"
  }
];

const KitchenPartnerServices = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Dina kökspartnertjänster
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Optimera ditt kök och skapa nya intäktsströmmar genom vårt partnerskapsprogram
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {kitchenPartnerServices.map((service) => {
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
      </div>
    </section>
  );
};

export default KitchenPartnerServices;