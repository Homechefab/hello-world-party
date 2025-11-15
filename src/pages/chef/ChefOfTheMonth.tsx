import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChefOfTheMonth = () => {
  const navigate = useNavigate();

  const currentChef = {
    name: "Chef Maria Andersson",
    month: "November 2024",
    sales: "127 000 kr",
    rating: 4.9,
    dishes: 23,
    image: "MA"
  };

  const nominees = [
    { name: "Chef Johan Berg", sales: "98 000 kr", rating: 4.8, image: "JB" },
    { name: "Chef Lisa Holm", sales: "89 000 kr", rating: 4.9, image: "LH" },
    { name: "Chef Erik Svensson", sales: "76 000 kr", rating: 4.7, image: "ES" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate("/seller-guide")}
          className="mb-6"
        >
          ← Tillbaka till Säljarguiden
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 bg-gradient-primary text-white">
            <CardHeader className="text-center pb-0">
              <Award className="w-16 h-16 mx-auto mb-4" />
              <CardTitle className="text-4xl mb-2">Månadens Kock</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                {currentChef.month}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-8">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                {currentChef.image}
              </div>
              <h3 className="text-3xl font-bold mb-6">{currentChef.name}</h3>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-white/10 rounded-lg p-4">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{currentChef.sales}</div>
                  <div className="text-sm text-white/80">Försäljning</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{currentChef.rating}</div>
                  <div className="text-sm text-white/80">Betyg</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{currentChef.dishes}</div>
                  <div className="text-sm text-white/80">Rätter</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Hur utses Månadens Kock?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Försäljningssiffror</h4>
                  <p className="text-sm text-muted-foreground">Total försäljning under månaden väger tungt</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Kundbetyg</h4>
                  <p className="text-sm text-muted-foreground">Genomsnittligt betyg och antal recensioner</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Kundnöjdhet</h4>
                  <p className="text-sm text-muted-foreground">Återkommande kunder och positiv feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nominerade denna månad</CardTitle>
              <CardDescription>Dessa kockar har imponerat extra mycket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nominees.map((nominee, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold">
                          {nominee.image}
                        </div>
                        <div>
                          <h4 className="font-semibold">{nominee.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{nominee.sales}</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {nominee.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">#{index + 2}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vill du tävla?</CardTitle>
              <CardDescription>
                Bli en del av vårt community och tävla om att bli Månadens Kock. Extra exponering och marknadsföring väntar!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-primary" size="lg">
                Anslut dig och tävla
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChefOfTheMonth;
