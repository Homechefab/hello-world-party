import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Clock, Star, Shield, Utensils } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Sök och upptäck",
      description: "Bläddra bland hundratals hemlagade rätter från passionerade kockar i ditt närområde. Filtrera på kostpreferenser, pris och avstånd.",
      features: ["Geolokalisering", "Smarta filter", "Recensioner & betyg"]
    },
    {
      icon: ShoppingCart,
      title: "2. Beställ enkelt",
      description: "Välj dina favoriter, lägg i varukorgen och betala säkert med Klarna eller kort. Du får direkt bekräftelse på din beställning.",
      features: ["Säkra betalningar", "Direktbekräftelse", "Orderhistorik"]
    },
    {
      icon: Clock,
      title: "3. Välj upphämtning",
      description: "Koordinera upphämtningstid med kocken. Du får kockens adress och kontaktuppgifter när beställningen bekräftas.",
      features: ["Flexibla tider", "Direkt kontakt", "GPS-navigation"]
    },
    {
      icon: Utensils,
      title: "4. Njut av maten",
      description: "Hämta din färdiglagade mat och njut! Lämna gärna en recension för att hjälpa andra köpare och stödja kocken.",
      features: ["Färdig mat", "Betygsystem", "Community"]
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Unik kvalitet",
      description: "Hemlagad mat med kärlek och passion - inte massproducerad restaurangmat."
    },
    {
      icon: Shield,
      title: "Trygg handel",
      description: "Alla kockar är verifierade och godkända. Säkra betalningar och köparskydd."
    },
    {
      icon: Clock,
      title: "Spar tid",
      description: "Slipp handla och laga mat. Beställ när det passar dig och hämta färdig mat."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-warm py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Så fungerar Homechef
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upptäck, beställ och njut av äkta hemlagad mat från passionerade kockar i ditt närområde. 
            Det är enkelt, tryggt och bara några klick bort.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Från hunger till lycka på 4 enkla steg
            </h2>
            <p className="text-muted-foreground">
              Så enkelt är det att beställa hemlagad mat genom Homechef
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="text-center hover:shadow-card transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <div className="space-y-2">
                      {step.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Varför välja Homechef?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Vanliga frågor
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hur vet jag att maten är säker?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Alla kockar går igenom en noggrann verifieringsprocess. Det ställs krav på att kockar 
                  har kunskap om hygien och godkännande från kommunen. Vi följer alla livsmedelssäkerhetsregler.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vad händer om jag inte är nöjd?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vi har full köpgaranti. Om du inte är nöjd med din beställning kontaktar du vår 
                  kundservice så löser vi det direkt - antingen ny mat eller pengarna tillbaka.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kan jag beställa i förväg?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ja! Du kan beställa upp till 7 dagar i förväg. Perfekt för planerade middagar eller 
                  när du vet att du kommer hem sent från jobbet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;