import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Clock, Heart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Säkert & tryggt",
    description: "Alla våra kockar är verifierade och alla transaktioner är säkra",
    color: "text-green-600"
  },
  {
    icon: Clock,
    title: "Snabb leverans",
    description: "Hämta din mat inom 30 minuter eller få leverans hem till dörren",
    color: "text-blue-600"
  },
  {
    icon: Star,
    title: "Högsta kvalitet",
    description: "Vi garanterar färska ingredienser och hemlagad kvalitet",
    color: "text-yellow-600"
  },
  {
    icon: Heart,
    title: "Stöd lokala kockar",
    description: "Hjälp din grannar att tjäna extra pengar på det de älskar",
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
    <section className="py-16 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Varför välja Homechef?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Upplev äkta hemlagad mat
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Från din grannes kök till ditt bord. Vi kopplar samman matälskare med passionerade hemmakockar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center border-border hover:shadow-warm transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className={`inline-flex w-12 h-12 items-center justify-center rounded-full bg-secondary mb-4`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
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
        
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
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