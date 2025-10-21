import FoodCard from "./FoodCard";
import meatballsImage from "@/assets/meatballs.jpg";
import pastaImage from "@/assets/pasta.jpg";
import soupImage from "@/assets/soup.jpg";
import applePieImage from "@/assets/apple-pie.jpg";
import thaiCurryImage from "@/assets/thai-curry.jpg";
import falafelImage from "@/assets/falafel-hummus.jpg";

const mockFoodItems = [
  {
    title: "Hemgjorda köttbullar",
    description: "Klassiska svenska köttbullar med gräddsås och lingonsylt. Gjorda på kött från lokala gårdar.",
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
    description: "Autentisk italiensk pasta carbonara med ägg, parmesan och guanciale. Tillagad enligt familjerecept.",
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
    description: "Näringsrik soppa gjord på säsongens färska grönsaker. Serveras med hemgjort bröd.",
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
    title: "Hemgjord äppelpaj",
    description: "Klassisk äppelpaj med kanel och vaniljsås. Gjord på äpplen från egna trädgården.",
    price: 75,
    rating: 4.7,
    reviews: 42,
    cookTime: "15 min",
    distance: "1.5 km",
    seller: "Gunnar S.",
    image: applePieImage,
    tags: ["Dessert", "Hemgjort"],
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
            <FoodCard key={index} {...item} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-warm transition-all duration-300 hover:scale-105">
            Visa fler rätter
          </button>
        </div>
      </div>
    </section>
  );
};

export default FoodGrid;