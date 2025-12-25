import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Mail, ArrowRight } from "lucide-react";

const BusinessApplicationPending = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Tack för din ansökan!</CardTitle>
            <CardDescription className="text-lg">
              Vi har tagit emot din ansökan om att bli företagspartner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Vårt team granskar nu din ansökan. Du kommer att få ett svar via e-post 
              inom 2-3 arbetsdagar.
            </p>

            <div className="bg-secondary/30 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Vad händer nu?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Granskning</p>
                    <p className="text-sm text-muted-foreground">
                      Vi verifierar dina uppgifter och kontrollerar ditt företag
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Bekräftelse</p>
                    <p className="text-sm text-muted-foreground">
                      Du får ett e-postmeddelande med besked om din ansökan
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Kom igång</p>
                    <p className="text-sm text-muted-foreground">
                      Vid godkännande hjälper vi dig att komma igång med att sälja
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Har du frågor? Kontakta oss på <a href="mailto:info@homechef.nu" className="text-primary hover:underline">info@homechef.nu</a></span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild>
                <Link to="/">
                  Tillbaka till startsidan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/business">Läs mer om företagspartnerskap</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessApplicationPending;
