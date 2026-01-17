import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import illnessRoutinesImage from "@/assets/kitchen-illness-routines.jpg";

const IllnessRoutines = () => {
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
            Rutiner för sjukdom
          </h1>

          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={illnessRoutinesImage} 
              alt="Rutiner för sjukdom i hemmet"
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
                  Du måste ha rutiner för vad som gäller när du själv eller någon i ditt hushåll 
                  blir sjuk, särskilt vid mag-tarmsjukdomar. Smitta kan lätt spridas via livsmedel.
                </p>
                <p>
                  Verksamheten bör pausas vid sjukdom och det måste finnas tydliga regler för 
                  när det är säkert att återuppta arbetet.
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
                    <span>Pausa verksamheten vid mag-tarmsjukdom hos dig eller familjemedlem</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Vänta minst 48 timmar efter symtomfrihet innan du återupptar arbetet</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Dokumentera sjukdomsfall och vidtagna åtgärder</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Ha rutiner för extra rengöring efter sjukdom i hushållet</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Informera kunder om eventuella förseningar på grund av sjukdom</span>
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
                  <li>• Fortsätta arbeta trots sjukdomssymtom</li>
                  <li>• Återuppta arbetet för tidigt efter tillfrisknande</li>
                  <li>• Glömma att familjemedlemmars sjukdom också påverkar verksamheten</li>
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

export default IllnessRoutines;
