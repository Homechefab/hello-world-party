import { ChefHat, Clock, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      icon: <ChefHat className="w-12 h-12 text-primary" />,
      title: "Registrera ditt kök",
      description: "Skapa en profil och lägg upp information om ditt kök, öppettider och tillgängliga utrustning."
    },
    {
      icon: <Clock className="w-12 h-12 text-primary" />,
      title: "Sätt tillgänglighet",
      description: "Bestäm när ditt kök är tillgängligt för uthyrning och vilka tider som passar er verksamhet."
    },
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Godkänn hemmakockar",
      description: "Granska och godkänn hemmakockar som vill hyra ditt kök. Du har full kontroll över vem som får tillgång."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: "Tjäna pengar",
      description: "Få betalt för outhyrd kapacitet och skapa nya intäktsströmmar för din restaurang."
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
            Förvandla ditt outhyrda kök till en lönsam tillgång. Låt passionerade hemmakockar använda ditt professionella kök under era lediga timmar.
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
            Redo att börja tjäna pengar på ditt kök?
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Registrera dig idag och börja hyra ut ditt kök till hemmakockar i ditt område.
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