import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, Lock, CheckCircle, AlertTriangle, Phone } from "lucide-react";

const SecurePayments = () => {
  const paymentMethods = [
    {
      name: "Klarna",
      description: "Betala direkt, dela upp betalningen eller betala senare. Tryggt och flexibelt.",
      features: ["Köparskydd", "Dela upp betalning", "Betala senare", "Ingen ränta"]
    },
    {
      name: "Kort",
      description: "Alla större kredit- och betalkort accepteras med 256-bitars SSL-kryptering.",
      features: ["Visa", "Mastercard", "American Express", "Säker kryptering"]
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "SSL-kryptering",
      description: "All data skyddas med 256-bitars SSL-kryptering, samma standard som banker använder."
    },
    {
      icon: Lock,
      title: "PCI DSS-certifiering",
      description: "Vi följer de högsta säkerhetsstandarderna för hantering av kortinformation."
    },
    {
      icon: CheckCircle,
      title: "Köparskydd",
      description: "Full garanti på alla beställningar. Inte nöjd? Pengarna tillbaka."
    }
  ];

  const protectionSteps = [
    "Vi sparar aldrig dina kortuppgifter på våra servrar",
    "All betalningsdata hanteras av certifierade betalningspartners",
    "Transaktioner övervakas för misstänkt aktivitet 24/7",
    "Du får bekräftelse direkt efter genomförd betalning",
    "Pengarna hålls i escrow tills du bekräftar att du fått din mat"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-warm py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Säkra betalningar
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi tar din säkerhet på allvar. Alla betalningar är skyddade med banknivå-kryptering 
            och du har full köpargaranti på alla dina beställningar.
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Betalningsalternativ
            </h2>
            <p className="text-muted-foreground">
              Välj det betalningssätt som passar dig bäst
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <CardTitle className="text-2xl">{method.name}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">{method.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {method.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="justify-center">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ditt skydd är vår prioritet
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Protection Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Så skyddar vi dina betalningar
              </h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Säkerhetsåtgärder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {protectionSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-medium">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Resolution */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Problem med betalning?
              </h2>
              <p className="text-muted-foreground">
                Vi hjälper dig direkt om något går fel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    Vanliga problem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Betalning avvisades</li>
                    <li>• Dubbel debitering</li>
                    <li>• Fel belopp</li>
                    <li>• Pengarna tillbaka</li>
                    <li>• Tekniska problem</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-6 h-6 text-primary" />
                    Få hjälp direkt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-foreground">Kundservice</p>
                      <p className="text-muted-foreground">Info@homechef.com</p>
                      <p className="text-muted-foreground">0734234686</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Öppettider</p>
                      <p className="text-muted-foreground">Vardagar 08:00-17:00</p>
                      <p className="text-muted-foreground">Helger: Akut support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecurePayments;