import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, TrendingUp, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const MealBoxes = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Sälj färdiglagade matlådor
          </h1>
          <p className="text-lg text-muted-foreground">
            Förbered måltider i förväg och erbjud dem för upphämtning eller leverans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Flexibel tidsplanering</CardTitle>
              <CardDescription>
                Laga mat när det passar dig och erbjud upphämtningstider som fungerar för både dig och dina kunder
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Ökad försäljning</CardTitle>
              <CardDescription>
                Nå fler kunder genom att erbjuda måltider som kan beställas i förväg och hämtas upp
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Effektiv tillagning</CardTitle>
              <CardDescription>
                Optimera din matlagning genom att förbereda flera portioner samtidigt
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Leveransalternativ</CardTitle>
              <CardDescription>
                Erbjud både upphämtning och leverans för att nå ut till fler kunder
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Så fungerar det</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Skapa din meny</h3>
                  <p className="text-muted-foreground">
                    Lägg upp dina färdiglagade rätter med beskrivningar, priser och bilder
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ta emot beställningar</h3>
                  <p className="text-muted-foreground">
                    Kunder beställer och betalar online. Du får notifikationer om nya beställningar
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Förbered måltiderna</h3>
                  <p className="text-muted-foreground">
                    Laga maten enligt din planering och förpacka den professionellt
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  4
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Upphämtning eller leverans</h3>
                  <p className="text-muted-foreground">
                    Kunder hämtar upp eller får matlådorna levererade. Du får betalt automatiskt
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/chef/application">
            <Button size="lg" className="gap-2">
              <Package className="w-5 h-5" />
              Kom igång med matlådor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MealBoxes;
