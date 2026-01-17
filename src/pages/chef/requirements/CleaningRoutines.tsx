import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import cleaningRoutinesImage from "@/assets/kitchen-cleaning-routines.jpg";

const CleaningRoutines = () => {
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
            Rengöringsrutiner
          </h1>

          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={cleaningRoutinesImage} 
              alt="Rengöringsrutiner för köket"
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
                  Du måste ha dokumenterade rutiner för rengöring av redskap, ytor och utrustning. 
                  Regelbunden och korrekt rengöring är avgörande för livsmedelssäkerheten.
                </p>
                <p>
                  Rutinerna ska beskriva vad som ska rengöras, hur ofta, med vilka metoder 
                  och produkter, samt vem som är ansvarig.
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
                    <span>Skapa ett rengöringsschema för daglig, veckovis och månadsvis rengöring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Använd livsmedelsgodkända rengörings- och desinfektionsmedel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Rengör skärbrädor och knivar noggrant mellan olika livsmedel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Dokumentera genomförda rengöringar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Ha separata trasor/svampar för olika ytor och ändamål</span>
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
                  <li>• Använda samma trasa för alla ytor</li>
                  <li>• Glömma att rengöra svåråtkomliga ställen regelbundet</li>
                  <li>• Använda utspädda eller för gamla rengöringsprodukter</li>
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

export default CleaningRoutines;
