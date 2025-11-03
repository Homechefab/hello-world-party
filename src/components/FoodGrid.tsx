import { useState } from "react";
import FoodCard from "./FoodCard";
import OrderDialog from "./OrderDialog";
import meatballsImage from "@/assets/meatballs.jpg";
import pastaImage from "@/assets/pasta.jpg";
import soupImage from "@/assets/soup.jpg";
import chickenRiceImage from "@/assets/chicken-rice.jpg";
import thaiCurryImage from "@/assets/thai-curry.jpg";
import falafelImage from "@/assets/falafel-hummus.jpg";

// Mapping of dish titles to Stripe Price IDs
const dishPriceIds: Record<string, string> = {
  "Hemgjorda köttbullar": "price_1SKl5741rPpIJXZ0RGnIxSzt",
  "Krämig carbonara": "price_1SPTR841rPpIJXZ0CBZS8Dk8",
  "Grönsaksoppa": "price_1SPTRQ41rPpIJXZ0Y28D38Um",
  "Grillad kyckling med ris": "price_1SPTRi41rPpIJXZ0g3othuNg",
  "Thai-curry": "price_1SKl5j41rPpIJXZ0hISmjkUX",
  "Falafel med hummus": "price_1SPTRx41rPpIJXZ0uEcmHAFm",
};

const mockFoodItems = [
  {
    title: "Hemgjorda köttbullar",
    description: "Klassiska svenska köttbullar med gräddsås och lingon. Gjorda på kött från lokala gårdar.",
    price: 85,
    rating: 4.8,
    reviews: 24,
    cookTime: "30 min",
    distance: "1.2 km",
    seller: "Anna L.",
    image: meatballsImage,
    tags: ["Svenskt", "Klassiskt"],
    isFavorite: true
  },
  {
    title: "Krämig carbonara",
    description: "Italiensk pasta carbonara med ägg, parmesan och guanciale. Gammalt familjerecept.",
    price: 95,
    rating: 4.9,
    reviews: 18,
    cookTime: "25 min",
    distance: "0.8 km",
    seller: "Marco R.",
    image: pastaImage,
    tags: ["Italienskt", "Pasta"],
    isFavorite: false
  },
  {
    title: "Grönsaksoppa",
    description: "Nyttig soppa på säsongens grönsaker. Kommer med hemgjort bröd.",
    price: 65,
    rating: 4.6,
    reviews: 31,
    cookTime: "20 min",
    distance: "2.1 km",
    seller: "Lisa K.",
    image: soupImage,
    tags: ["Vegetariskt", "Hälsosamt"],
    isFavorite: false
  },
  {
    title: "Grillad kyckling med ris",
    description: "Saftig grillad kyckling serverad med fluffigt vitt ris och färska grönsaker.",
    price: 79,
    rating: 4.7,
    reviews: 35,
    cookTime: "25 min",
    distance: "1.5 km",
    seller: "Maria H.",
    image: chickenRiceImage,
    tags: ["Hälsosamt", "Protein"],
    isFavorite: true
  },
  {
    title: "Thai-curry",
    description: "Kryddig röd curry med kyckling och kokosmjölk. Serveras med jasminris.",
    price: 89,
    rating: 4.5,
    reviews: 16,
    cookTime: "35 min",
    distance: "1.8 km",
    seller: "Siriporn T.",
    image: thaiCurryImage,
    tags: ["Asiatiskt", "Kryddigt"],
    isFavorite: false
  },
  {
    title: "Falafel med hummus",
    description: "Krispiga falafels med cremig hummus och färska grönsaker. Helt vegetariskt.",
    price: 78,
    rating: 4.4,
    reviews: 29,
    cookTime: "15 min",
    distance: "0.9 km",
    seller: "Ahmed M.",
    image: falafelImage,
    tags: ["Vegetariskt", "Mellan"],
    isFavorite: false
  }
];

const FoodGrid = () => {
  const [selectedDish, setSelectedDish] = useState<typeof mockFoodItems[0] | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const handleOrderClick = (dish: typeof mockFoodItems[0]) => {
    setSelectedDish(dish);
    setOrderDialogOpen(true);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Populära rätter nära dig
          </h2>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Sortera efter</option>
              <option>Närmast</option>
              <option>Högst betyg</option>
              <option>Lägst pris</option>
              <option>Senast tillagd</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFoodItems.map((item, index) => (
            <FoodCard 
              key={index} 
              {...item} 
              onOrderClick={() => handleOrderClick(item)}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-warm transition-all duration-300 hover:scale-105">
            Visa fler rätter
          </button>
        </div>
      </div>

      {/* Order Dialog */}
      {selectedDish && (
        <OrderDialog
          open={orderDialogOpen}
          onOpenChange={setOrderDialogOpen}
          dish={selectedDish}
          stripePriceId={dishPriceIds[selectedDish.title]}
        />
      )}
    </section>
  );
};

export default FoodGrid;