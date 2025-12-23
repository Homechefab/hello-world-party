import { Link } from "react-router-dom";
import rentKitchenImage from "@/assets/service-rent-kitchen.jpg";
import orderFoodImage from "@/assets/service-order-food.jpg";
import deliveryImage from "@/assets/service-delivery.jpg";
import businessCateringImage from "@/assets/business-catering.jpg";

const businessServices = [
  {
    image: rentKitchenImage,
    title: "Hyr ut ditt kök",
    description: "Bli kökspartner och tjäna pengar på ditt outhyrda kök",
    href: "/kitchen-partner/register",
    color: "from-blue-500 to-blue-600"
  },
  {
    image: orderFoodImage,
    title: "Beställ mat",
    description: "Upptäck och beställ hemlagad mat från lokala kockar",
    href: "/search-chefs",
    color: "from-orange-500 to-orange-600"
  },
  {
    image: deliveryImage,
    title: "Bli leveranspartner",
    description: "Leverera mat och tjäna extra pengar på din lediga tid",
    href: "/delivery-partner/onboarding",
    color: "from-purple-500 to-purple-600"
  },
  {
    image: businessCateringImage,
    title: "För företag",
    description: "Catering, lunch och måltidslösningar för ditt företag",
    href: "/business",
    color: "from-emerald-500 to-emerald-600"
  }
];

const BusinessServices = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Bli partner med Homechef
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bli en del av Sveriges största marknadsplats för hemlagad mat
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {businessServices.map((service) => (
            <Link
              key={service.title}
              to={service.href}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2 border border-border overflow-hidden h-full">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-center text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessServices;