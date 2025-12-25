import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Utensils, TrendingUp, ShieldCheck, CheckCircle, ArrowRight, Store, Truck } from "lucide-react";
import businessCateringImage from "@/assets/business-catering.jpg";

const services = [
  {
    icon: Utensils,
    title: "Sälj catering",
    description: "Nå nya kunder genom vår plattform och erbjud catering till företag och privatpersoner"
  },
  {
    icon: Store,
    title: "Sälj färdiglagad mat",
    description: "Lista dina färdiglagade rätter och matlådor för avhämtning eller leverans"
  },
  {
    icon: TrendingUp,
    title: "Öka din försäljning",
    description: "Få tillgång till tusentals hungriga kunder i ditt område"
  },
  {
    icon: Truck,
    title: "Leveranslösningar",
    description: "Använd våra leveranspartners eller hantera leverans själv"
  }
];

const benefits = [
  "Ingen startavgift - betala endast vid försäljning",
  "Enkel beställningshantering via vår app",
  "Automatisk betalningshantering",
  "Marknadsföring till tusentals kunder",
  "Flexibla öppettider och tillgänglighet",
  "Support och hjälp från vårt team"
];

const requirements = [
  "Registrerat livsmedelsföretag",
  "Godkänd av Livsmedelsverket",
  "Giltig ansvarsförsäkring",
  "Möjlighet att hantera beställningar digitalt"
];

const BusinessServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src={businessCateringImage} 
          alt="Företagspartner med Homechef"
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
              Sälj din mat via Homechef
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Är ni ett etablerat företag som erbjuder catering eller säljer färdiglagad mat? 
              Nå fler kunder genom Sveriges första marknadsplats för hemlagad och lokalt producerad mat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/business/application">
                  Ansök som företagspartner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <a href="mailto:info@homechef.nu">Kontakta oss</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Services Grid */}
        <section id="services" className="mb-20 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Vad du kan göra på Homechef
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Som företagspartner får du tillgång till en växande kundbas som söker kvalitetsmat
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
        <section id="benefits" className="mb-20 scroll-mt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Fördelar med Homechef för företag
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Vi hjälper etablerade matföretag att nå nya kunder och öka sin försäljning 
                genom vår digitala marknadsplats.
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
                  <ShieldCheck className="h-5 w-5" />
                  Krav för att bli partner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={req} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex items-center">
                      <p className="text-foreground">{req}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Så kommer du igång
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Ansök</h3>
              <p className="text-muted-foreground">
                Fyll i ansökningsformuläret med information om ditt företag
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Godkänns</h3>
              <p className="text-muted-foreground">
                Vi granskar din ansökan och verifierar dina tillstånd
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Börja sälja</h3>
              <p className="text-muted-foreground">
                Lägg upp din meny och börja ta emot beställningar
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Redo att nå fler kunder?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ansök idag och bli en del av Sveriges växande marknadsplats för kvalitetsmat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/business/application">
                Ansök som företagspartner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:info@homechef.nu">Kontakta oss</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusinessServicesPage;
