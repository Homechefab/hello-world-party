import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Clock, Heart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Säkert & tryggt",
    description: "Verifierade kockar och säkra betalningar",
    color: "text-green-600"
  },
  {
    icon: Clock,
    title: "Snabb leverans",
    description: "Hämta din mat inom 30 minuter eller få den levererad hem",
    color: "text-blue-600"
  },
  {
    icon: Star,
    title: "Högsta kvalitet",
    description: "Färska råvaror och äkta hemlagad mat",
    color: "text-yellow-600"
  },
  {
    icon: Heart,
    title: "Stöd lokala kockar",
    description: "Hjälp dina grannar att tjäna pengar på det de kan bäst",
    color: "text-red-600"
  }
];

const stats = [
  { number: "2,500+", label: "Nöjda kunder" },
  { number: "150+", label: "Hemmakockar" },
  { number: "50+", label: "Olika rätter" },
  { number: "4.8", label: "Genomsnittlig betyg" }
];

const Features = () => {
  return (
    <section className="py-8 bg-gradient-secondary rounded-xl my-4">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3 px-3 py-1.5 text-sm">
            Varför välja Homechef?
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            Äkta hemlagad mat från dina grannar
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Vi kopplar ihop dig med duktiga kockar i ditt område som lagar mat hemma.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center border-border hover:shadow-warm transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className={`inline-flex w-10 h-10 items-center justify-center rounded-full bg-secondary mb-3`}>
                    <IconComponent className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;