import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import haccpAnalysisImage from "@/assets/kitchen-haccp-analysis.jpg";

const HaccpAnalysis = () => {
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
            HACCP-analys
          </h1>

          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={haccpAnalysisImage} 
              alt="HACCP-analys av risker"
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
                  HACCP (Hazard Analysis Critical Control Points) är ett systematiskt sätt att 
                  identifiera, bedöma och kontrollera risker i din livsmedelshantering. Du måste 
                  genomföra en riskanalys anpassad till just din verksamhet.
                </p>
                <p>
                  Analysen ska identifiera vilka faror som kan uppstå och vilka steg i processen 
                  som är kritiska kontrollpunkter där du måste övervaka och dokumentera.
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
                    <span>Lista alla steg i din matlagningsprocess från inköp till servering</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Identifiera biologiska, kemiska och fysiska faror i varje steg</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Bestäm kritiska kontrollpunkter (t.ex. tillagningstemperatur, kylförvaring)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Sätt gränsvärden och kontrollmetoder för varje kritisk punkt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Dokumentera din analys och håll den uppdaterad</span>
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
                  <li>• Använda en generisk HACCP-plan som inte är anpassad till din verksamhet</li>
                  <li>• Glömma att uppdatera planen när du ändrar meny eller processer</li>
                  <li>• Inte dokumentera kontroller och korrigerande åtgärder</li>
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

export default HaccpAnalysis;
