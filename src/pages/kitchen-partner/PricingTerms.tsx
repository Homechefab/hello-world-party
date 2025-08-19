import { Check, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingTerms = () => {
  const pricingPlans = [
    {
      name: "Grundplan",
      price: "15%",
      description: "Perfekt för restauranger som vill testa kökshyrning",
      features: [
        "15% provision på uthyrning",
        "Grundläggande profilsida",
        "E-postsupport",
        "Månadsrapporter",
        "Grundläggande försäkring"
      ],
      popular: false
    },
    {
      name: "Professionell",
      price: "12%",
      description: "För restauranger som vill maximera sina intäkter",
      features: [
        "12% provision på uthyrning",
        "Premium profilsida",
        "Prioriterad support",
        "Detaljerade analysrapporter",
        "Utökad försäkring",
        "Marknadsföringshjälp",
        "Direktchatt med hemkockar"
      ],
      popular: true
    },
    {
      name: "Företag",
      price: "10%",
      description: "För större restaurangkedjor och företag",
      features: [
        "10% provision på uthyrning",
        "Anpassad lösning",
        "Dedikerad kontaktperson",
        "API-integration",
        "White-label möjligheter",
        "Anpassade rapporter",
        "24/7 support",
        "Volymrabatter"
      ],
      popular: false
    }
  ];

  const terms = [
    "Inga uppsägningsavgifter - avsluta när som helst",
    "Betalning sker inom 5 arbetsdagar efter genomförd uthyrning",
    "Alla priser är exklusive moms",
    "Försäkring ingår för alla planer",
    "Hemkockar genomgår bakgrundskontroll",
    "Du bestämmer själv vilka hemkockar som får tillgång",
    "Automatisk fakturering och redovisning"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Priser & Villkor
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transparenta priser utan dolda avgifter. Du tjänar pengar på outhyrd kapacitet och vi tar endast en liten provision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-semibold">Populärast</span>
                  </div>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">
                  {plan.price}
                  <span className="text-base font-normal text-muted-foreground"> provision</span>
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                  <Link to="/kitchen-partner/register">
                    Välj {plan.name}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-warm">
          <CardHeader>
            <CardTitle className="text-2xl text-center mb-6">Allmänna villkor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terms.map((term, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{term}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingTerms;