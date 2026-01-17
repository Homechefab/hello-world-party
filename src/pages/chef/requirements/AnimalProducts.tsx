import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import animalProductsImage from "@/assets/kitchen-animal-products.jpg";

const AnimalProducts = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/chef/kitchen-requirements">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till kökskrav
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">Kommunalt krav</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Hantering av animaliska produkter
          </h1>

          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={animalProductsImage} 
              alt="Hantering av fisk, kött och animaliska produkter"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Vad innebär detta krav?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Vid hantering av fisk, kött och andra animaliska produkter krävs extra 
                  noggrannhet. Dessa livsmedel har högre risk för tillväxt av skadliga 
                  bakterier och kräver strikt temperaturkontroll och hygien.
                </p>
                <p>
                  Du måste följa specifika regler för förvaring, tillagning och hantering 
                  för att säkerställa att produkterna är säkra att äta.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Så uppfyller du kravet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Förvara kött och fisk vid max +4°C, fryst vid -18°C eller kallare</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Använd separata skärbrädor och knivar för rått kött/fisk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Kontrollera innertemperatur: fågel 72°C, nötkött 63°C, fläsk 68°C</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Tina frysta produkter i kylskåp, inte i rumstemperatur</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Tvätta händer noggrant efter hantering av rått kött/fisk</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-5 h-5" />
                  Vanliga misstag att undvika
                </CardTitle>
              </CardHeader>
              <CardContent className="text-amber-800 dark:text-amber-200">
                <ul className="space-y-2">
                  <li>• Tina kött/fisk i rumstemperatur eller i varmt vatten</li>
                  <li>• Använda samma skärbräda för rått och tillagat kött</li>
                  <li>• Servera kyckling som inte är genomstekt</li>
                  <li>• Förvara rått kött ovanför andra livsmedel i kylen</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/chef/kitchen-requirements">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tillbaka till alla krav
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalProducts;
