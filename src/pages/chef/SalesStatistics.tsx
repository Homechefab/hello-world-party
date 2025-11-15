import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalesStatistics = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total försäljning denna månad", value: "23 450 kr", icon: DollarSign, trend: "+15%" },
    { label: "Antal beställningar", value: "47", icon: ShoppingCart, trend: "+8%" },
    { label: "Genomsnittlig ordervärde", value: "499 kr", icon: TrendingUp, trend: "+12%" },
    { label: "Aktiva rätter", value: "12", icon: BarChart3, trend: "0%" }
  ];

  const monthlyData = [
    { month: "Juli", sales: 18200, orders: 35 },
    { month: "Augusti", sales: 21500, orders: 42 },
    { month: "September", sales: 19800, orders: 38 },
    { month: "Oktober", sales: 22100, orders: 43 },
    { month: "November", sales: 23450, orders: 47 }
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

        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <BarChart3 className="w-8 h-8 text-primary" />
                Försäljningsstatistik
              </CardTitle>
              <CardDescription>
                Få detaljerad insikt i din försäljning och följ din tillväxt över tid
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-green-600">{stat.trend}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Försäljningsutveckling</CardTitle>
              <CardDescription>Senaste 5 månaderna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <span className="text-muted-foreground">{data.sales.toLocaleString('sv-SE')} kr / {data.orders} beställningar</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-primary h-full transition-all"
                        style={{ width: `${(data.sales / 25000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Funktioner i statistikverktyget</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-0.5 text-primary" />
                    <div>
                      <h4 className="font-semibold mb-1">Anpassningsbara perioder</h4>
                      <p className="text-sm text-muted-foreground">Välj daglig, veckovis eller månadsvy</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 mt-0.5 text-primary" />
                    <div>
                      <h4 className="font-semibold mb-1">Trendanalys</h4>
                      <p className="text-sm text-muted-foreground">Se tillväxt och mönster i din försäljning</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 mt-0.5 text-primary" />
                    <div>
                      <h4 className="font-semibold mb-1">Rätt-för-rätt analys</h4>
                      <p className="text-sm text-muted-foreground">Se vilka rätter som säljer bäst</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export och rapporter</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 text-primary">📊</div>
                    <div>
                      <h4 className="font-semibold mb-1">Excel-export</h4>
                      <p className="text-sm text-muted-foreground">Ladda ner din data för egen analys</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 text-primary">📧</div>
                    <div>
                      <h4 className="font-semibold mb-1">Månatliga rapporter</h4>
                      <p className="text-sm text-muted-foreground">Automatiska sammanfattningar via e-post</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 text-primary">💰</div>
                    <div>
                      <h4 className="font-semibold mb-1">Skatteunderlag</h4>
                      <p className="text-sm text-muted-foreground">Förberedda rapporter för bokföring</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Kom igång med statistikverktyget</CardTitle>
              <CardDescription>
                Anslut dig till vårt säljar-community för att få tillgång till detaljerad försäljningsstatistik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-primary" size="lg">
                Aktivera statistikverktyget
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesStatistics;
