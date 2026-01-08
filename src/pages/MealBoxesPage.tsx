import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, Truck, Info } from "lucide-react";
import mealBoxesImage from "@/assets/meal-boxes.jpg";

const MealBoxesPage = () => {
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
        {/* Coming Soon Message */}
        <div className="text-center py-16 max-w-2xl mx-auto">
          <Info className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Kommer snart!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Vi jobbar på att få våra hemkockar att erbjuda färdiglagade matlådor. 
            Snart kan du beställa hemlagad mat som är redo att värmas och ätas.
          </p>
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
