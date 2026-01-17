import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import workClothesImage from "@/assets/kitchen-work-clothes.jpg";

const WorkClothes = () => {
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
            Arbetskläder, kökshanddukar och städmaterial
          </h1>

          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={workClothesImage} 
              alt="Arbetskläder och textilier i köket"
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
                  Du måste ha rutiner för arbetskläder, kökshanddukar och städmaterial. 
                  Dessa textilier kan sprida bakterier om de inte hanteras korrekt och 
                  tvättas regelbundet.
                </p>
                <p>
                  Arbetskläder ska vara rena och bytas regelbundet. Kökshanddukar och 
                  städmaterial ska hållas separata och tvättas vid hög temperatur.
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
                    <span>Använd rena förkläden som byts dagligen eller vid nedsmutsning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Ha separata handdukar för händer och för att torka redskap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Byt kökshanddukar dagligen och tvätta vid minst 60°C</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Använd färgkodade trasor för olika ändamål (städ vs. matlagning)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Förvara smutsiga textilier separat från rena</span>
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
                  <li>• Använda samma handduk för händer och disk</li>
                  <li>• Tvätta kökshanddukar vid för låg temperatur</li>
                  <li>• Använda samma trasa för att torka bänk och golv</li>
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

export default WorkClothes;
