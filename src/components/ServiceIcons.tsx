import { ShoppingBag, ChefHat, Building } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: ShoppingBag,
    title: "Beställ mat",
    description: "Upptäck hemlagade rätter",
    href: "/",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: ChefHat,
    title: "Sälj din mat",
    description: "Börja sälja hemlagad mat",
    href: "/sell",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Building,
    title: "Hyr ut ditt kök",
    description: "Hyra ut kök till kockar",
    href: "/kitchen-partner/register",
    color: "from-purple-500 to-purple-600"
  }
];

const ServiceIcons = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.title}
                to={service.href}
                className="group block"
              >
                <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 border border-border">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-center text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {service.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceIcons;