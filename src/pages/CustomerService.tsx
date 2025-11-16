import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MessageCircle, Users, HeadphonesIcon, CheckCircle } from "lucide-react";
import CustomerFAQ from "@/components/services/CustomerFAQ";

const CustomerService = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Telefon",
      description: "Ring oss direkt för akut hjälp",
      contact: "0734234686",
      availability: "Vardagar 08:00-17:00",
      response: "Direkt svar"
    },
    {
      icon: Mail,
      title: "E-post",
      description: "Skicka din fråga så svarar vi snabbt",
      contact: "Info@homechef.com",
      availability: "24/7",
      response: "Inom 2 timmar"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chatta med oss direkt på webbsidan",
      contact: "Chatfunktion",
      availability: "Vardagar 08:00-17:00",
      response: "Direkt svar"
    }
  ];

  const supportAreas = [
    {
      icon: Users,
      title: "Beställningshjälp",
      description: "Problem med beställningar, leveranser och refunds",
      topics: ["Ändra beställning", "Avboka", "Leveransproblem", "Pengarna tillbaka"]
    },
    {
      icon: CheckCircle,
      title: "Kontoproblem",
      description: "Inloggning, profil och kontoinställningar",
      topics: ["Glömt lösenord", "Uppdatera profil", "Raderaconto", "Säkerhet"]
    },
    {
      icon: HeadphonesIcon,
      title: "Teknisk support",
      description: "App-problem, buggrapporter och tekniska frågor",
      topics: ["App kraschar", "Rapportera bugg", "Kompatibilitet", "Uppdateringar"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-warm py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <HeadphonesIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Kundservice
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi finns här för att hjälpa dig! Oavsett om du har frågor om beställningar, 
            betalningar eller tekniska problem - vi löser det tillsammans.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Kontakta oss
            </h2>
            <p className="text-muted-foreground">
              Välj det sätt som passar dig bäst
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="text-center hover:shadow-card transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <p className="text-muted-foreground">{method.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-foreground">{method.contact}</p>
                        <p className="text-sm text-muted-foreground">{method.availability}</p>
                      </div>
                      <Badge variant="secondary">{method.response}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Areas */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Vad kan vi hjälpa dig med?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{area.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{area.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {area.topics.map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="mr-2 mb-2">
                          {topic}
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

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <CustomerFAQ />
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">
                Akut problem?
              </CardTitle>
              <p className="text-muted-foreground">
                Ring oss direkt för problem som inte kan vänta
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-xl font-semibold text-foreground">
                  <Phone className="w-6 h-6 text-primary" />
                  0734234686
                </div>
                <p className="text-muted-foreground">
                  Vardagar 08:00-17:00 | Helger: Endast akuta ärenden
                </p>
                <Button size="lg" className="mt-4">
                  Ring nu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CustomerService;