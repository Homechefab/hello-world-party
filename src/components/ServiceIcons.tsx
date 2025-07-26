import { Link } from "react-router-dom";
import orderFoodImage from "@/assets/service-order-food.jpg";
import sellFoodImage from "@/assets/service-sell-food.jpg";
import rentKitchenImage from "@/assets/service-rent-kitchen.jpg";

const services = [
  {
    image: orderFoodImage,
    title: "Beställ mat",
    description: "Upptäck hemlagade rätter",
    href: "#search",
    color: "from-blue-500 to-blue-600"
  },
  {
    image: sellFoodImage,
    title: "Sälj din mat",
    description: "Börja sälja hemlagad mat",
    href: "/sell",
    color: "from-green-500 to-green-600"
  },
  {
    image: rentKitchenImage,
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
            return (
              <Link
                key={service.title}
                to={service.href}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2 border border-border overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-center text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {service.description}
                    </p>
                  </div>
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