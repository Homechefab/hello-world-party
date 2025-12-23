import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Utensils, CalendarDays, Truck, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import businessCateringImage from "@/assets/business-catering.jpg";

const services = [
  {
    icon: Utensils,
    title: "Lunch till kontoret",
    description: "Daglig eller veckovis leverans av hemlagad lunch till ert kontor"
  },
  {
    icon: CalendarDays,
    title: "Eventcatering",
    description: "Catering till möten, konferenser och företagsevent"
  },
  {
    icon: Users,
    title: "Personalfester",
    description: "Mat till kickoffs, julfester och andra personalarrangemang"
  },
  {
    icon: Truck,
    title: "Regelbundna leveranser",
    description: "Prenumerationstjänst för kontinuerlig matleverans"
  }
];

const benefits = [
  "Lokala hemmakockar med autentiska recept",
  "Flexibla beställningar efter era behov",
  "Mångfald av kök och smaker",
  "Enkel fakturering för företag",
  "Schemalagda leveranser",
  "Allergianpassade alternativ"
];

const BusinessServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src={businessCateringImage} 
          alt="Företagscatering från Homechef"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/90 px-4 py-2 rounded-full text-sm mb-6">
              <Building2 className="h-4 w-4" />
              För företag
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hemlagad mat för ditt företag
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Ge dina medarbetare och gäster en unik matupplevelse med lokala 
              hemmakockar. Från daglig lunch till stora event.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/business/contact">
                  Kontakta oss
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link to="/business/register">Registrera företag</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Services Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Våra företagstjänster
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vi erbjuder skräddarsydda matlösningar för företag av alla storlekar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Varför välja Homechef för företag?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Vi kopplar ihop lokala hemmakockar med företag som vill erbjuda 
                sina medarbetare och gäster något extra. Autentisk, hemlagad mat 
                med personlig touch.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Så fungerar det
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Kontakta oss</h4>
                    <p className="text-sm text-muted-foreground">
                      Berätta om era behov och önskemål
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Vi matchar er med kockar</h4>
                    <p className="text-sm text-muted-foreground">
                      Baserat på meny, allergier och leveranstider
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Njut av hemlagad mat</h4>
                    <p className="text-sm text-muted-foreground">
                      Levererat direkt till ert kontor eller event
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Redo att komma igång?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Kontakta oss idag för att diskutera hur vi kan hjälpa ert företag 
            med hemlagad mat av högsta kvalitet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/business/contact">
                Kontakta oss
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:foretag@homechef.nu">foretag@homechef.nu</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusinessServicesPage;
