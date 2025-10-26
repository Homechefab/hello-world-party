import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, Truck, Star, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import mealBoxesImage from "@/assets/meal-boxes.jpg";
import chickenRiceImage from "@/assets/chicken-rice-mealbox.jpg";
import pastaImage from "@/assets/pasta-mealbox.jpg";
import meatballsImage from "@/assets/meatballs-mealbox.jpg";

const MealBoxesPage = () => {
  const [filter, setFilter] = useState("all");

  // Exempel matlådor
  const mealBoxes = [
    {
      id: 1,
      name: "Kycklinggryta med ris",
      chef: "Anna Andersson",
      price: 89,
      prepTime: "30 min",
      rating: 4.8,
      image: chickenRiceImage,
      available: true,
      delivery: true
    },
    {
      id: 2,
      name: "Pasta med tomatsås",
      chef: "Erik Svensson",
      price: 95,
      prepTime: "25 min",
      rating: 4.9,
      image: pastaImage,
      available: true,
      delivery: false
    },
    {
      id: 3,
      name: "Köttbullar med potatismos",
      chef: "Maria Johansson",
      price: 129,
      prepTime: "20 min",
      rating: 5.0,
      image: meatballsImage,
      available: true,
      delivery: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mealBoxesImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Färdiglagade matlådor
          </h1>
          <p className="text-xl drop-shadow-lg">
            Hemlagad mat som är redo att ätas - hämta upp eller få det levererat
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla matlådor</SelectItem>
              <SelectItem value="delivery">Med hemleverans</SelectItem>
              <SelectItem value="pickup">Endast avhämtning</SelectItem>
              <SelectItem value="vegetarian">Vegetariskt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meal Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mealBoxes.map((box) => (
            <Card key={box.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={box.image} 
                  alt={box.name}
                  className="w-full h-full object-cover"
                />
                {box.delivery && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Leverans
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{box.name}</CardTitle>
                <CardDescription>av {box.chef}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{box.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{box.prepTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{box.price} kr</span>
                  <Button size="sm">
                    Beställ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Package className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Färdiglagat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All mat är färdiglagad av professionella kockar och redo att ätas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Snabb uppvärmning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Värm i mikro eller ugn på 5-10 minuter och njut av hemlagad mat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Leverans eller upphämtning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Välj mellan hemleverans eller hämta upp hos kocken nära dig
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MealBoxesPage;
