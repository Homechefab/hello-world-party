import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, CheckCircle, Phone, MessageCircle, Store } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const RestaurantApplicationPending = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Ansökan mottagen!</h1>
            <p className="text-lg text-muted-foreground">
              Tack för din ansökan att bli Homechef-restaurangpartner
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Under granskning
                </Badge>
              </CardTitle>
              <CardDescription>
                Din ansökan granskas nu av vårt team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Vad händer nu?</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Vi granskar din restaurangansökan och verifierar uppgifterna
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Vi kontrollerar att alla krav och dokument är uppfyllda
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Du får besked via e-mail inom 2-3 arbetsdagar
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-1">E-postbekräftelse</h4>
                  <p className="text-sm text-muted-foreground">
                    Skickad till din registrerade e-post
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Svarstid</h4>
                  <p className="text-sm text-muted-foreground">
                    2-3 arbetsdagar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Har du frågor?</CardTitle>
              <CardDescription>
                Vi hjälper gärna till under granskningsprocessen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Ring oss</div>
                      <div className="text-sm text-muted-foreground">08-123 456 78</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Chatta med oss</div>
                      <div className="text-sm text-muted-foreground">Direktsupport</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Under tiden kan du utforska vad som väntar dig som Homechef-restaurangpartner
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/restaurant/partnership">
                <Button variant="outline">
                  <Store className="w-4 h-4 mr-2" />
                  Läs mer om partnerskapet
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost">
                  Tillbaka till startsidan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantApplicationPending;