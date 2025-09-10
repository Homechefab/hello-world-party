import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Users, Calendar, Utensils, CheckCircle, Shield } from "lucide-react";
import sellFoodImage from "@/assets/service-sell-food.jpg";
import privateChefImage from "@/assets/private-chef.jpg";
import experienceImage from "@/assets/experience-dining.jpg";
import approvedKitchenImage from "@/assets/kitchen-with-island.jpg";

const chefServices = [
  {
    image: sellFoodImage,
    title: "Sälj din mat",
    description: "Skapa och sälj dina egna rätter till hungriga kunder",
    href: "/chef/dashboard",
    icon: ChefHat,
    color: "from-green-500 to-green-600"
  },
  {
    image: privateChefImage,
    title: "Privatkock-tjänster",
    description: "Erbjud dina tjänster som privatkock för speciella evenemang",
    href: "/chef/private-services",
    icon: Users,
    color: "from-purple-500 to-purple-600"
  },
  {
    image: experienceImage,
    title: "Matupplevelser",
    description: "Skapa unika matupplevelser hemma hos dig",
    href: "/chef/experiences",
    icon: Calendar,
    color: "from-blue-500 to-blue-600"
  }
];

const ChefServices = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Dina kocktjänster
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Utveckla ditt kockyrke och nå fler kunder genom våra olika tjänster
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {chefServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.title}
                to={service.href}
                className="group block"
              >
                <Card className="h-full hover:shadow-card transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-center text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-center leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Kom igång
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Approved Kitchen Information Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Så här ser ett godkänt kök ut
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              För att få sälja mat från ditt kök måste det uppfylla kommunens krav för livsmedelssäkerhet. 
              Här är ett exempel på hur ett godkänt kök kan se ut.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Kitchen Image */}
            <div className="relative">
              <img 
                src={approvedKitchenImage} 
                alt="Exempel på godkänt kök enligt kommunala krav"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Godkänt kök
              </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-semibold">Kommunala krav</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    "Separering mellan verksamhet och privat användning - i tid eller rum",
                    "Handhygien - möjlighet att tvätta händer mellan olika moment",
                    "Rutiner för sjukdom - vad som gäller när någon i hemmet är sjuk", 
                    "Rengöringsrutiner för redskap, ytor och utrustning",
                    "Rutiner för familjemedlemmar och husdjur under verksamhet",
                    "Tillräckligt med ytor för att separera råvaror och färdiga produkter",
                    "Lämplig utrustning för temperaturkontroll och hygien",
                    "HACCP-analys av risker i din specifika verksamhet",
                    "Extra noggrannhet vid hantering av fisk, kött och animaliska produkter",
                    "Rutiner för arbetskläder, kökshanddukar och städmaterial",
                    "Vattenkvalitet - extra rutiner vid egen brunn"
                  ].map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{requirement}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-200/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Enligt livsmedelslagstiftningen
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        "Det måste finnas ordentlig separation mellan det som tillhör din livsmedelsverksamhet 
                        och det som hör till dina normala hushållsaktiviteter. I vissa fall kan separering ske i tid, 
                        förutsatt att du har goda rutiner för detta."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-card rounded-lg p-8 max-w-2xl mx-auto border">
            <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Behöver du mer hjälp?</h3>
            <p className="text-muted-foreground mb-6">
              Kontakta vårt team för personlig rådgivning om hur du kan maximera dina intäkter som kock.
            </p>
            <Button>
              Kontakta oss
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefServices;