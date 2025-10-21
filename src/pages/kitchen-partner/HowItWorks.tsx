import { ChefHat, Clock, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      icon: <ChefHat className="w-12 h-12 text-primary" />,
      title: "Registrera",
      description: "Lägg in ditt kök med info om utrustning och när det är ledigt."
    },
    {
      icon: <Clock className="w-12 h-12 text-primary" />,
      title: "Välj tider",
      description: "Bestäm när köket är ledigt och kan hyras ut."
    },
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Kockar bokar",
      description: "Kockar bokar ditt kök - alla är kontrollerade och godkända."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: "Få betalt",
      description: "Pengarna betalas ut automatiskt efter varje bokning."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Så fungerar kökshyrning
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tjäna pengar på ditt kök när det står tomt. Låt hemkockar hyra det under era lediga timmar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="text-center border-2 hover:border-primary transition-all duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-warm rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Redo att börja?
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Registrera dig idag och börja hyra ut till kockar i ditt område.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/kitchen-partner/register">
              Registrera ditt kök
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;