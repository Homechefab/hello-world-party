import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Target, ChefHat, Sparkles, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion för mat",
      description: "Vi tror på kraften i hemlagad mat gjord med kärlek och omsorg."
    },
    {
      icon: Users,
      title: "Community först",
      description: "Vi bygger en stark gemenskap av matälskare och talangfulla hemkockar."
    },
    {
      icon: Target,
      title: "Kvalitet & säkerhet",
      description: "Alla våra kockar är verifierade och följer högsta säkerhetsstandard."
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Grundades",
      description: "Homechef startades med visionen att koppla samman matälskare"
    },
    {
      year: "2024",
      title: "Första kockarna",
      description: "Våra första hemkockar började sälja sin mat på plattformen"
    },
    {
      year: "2024",
      title: "Lansering",
      description: "Officiell lansering av Homechef i Sverige"
    },
    {
      year: "Framtid",
      title: "Expansion",
      description: "Planer på att växa till hela Norden"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-warm py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Om Homechef
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi förenar matälskare med passionerade hemkockar för att skapa Sveriges 
            mest personliga matupplevelse.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Vår Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Att göra äkta hemlagad mat tillgänglig för alla genom att skapa en trygg 
                  och enkel plattform där hemkockar kan dela sin passion och matälskare 
                  kan upptäcka unika smaker från sitt närområde.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Vår Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Att bli Nordens ledande marknadsplats för hemlagad mat, där varje måltid 
                  berättar en historia och varje kock kan förverkliga sina kulinariska drömmar 
                  medan de stärker sitt lokala community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Vår historia
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Homechef föddes ur en enkel tanke: varför ska vi acceptera att all mat 
              kommer från stora kedjor när det finns så många talangfulla hemkockar 
              runt omkring oss?
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Grundarna av Homechef märkte att det fanns en klyfta mellan 
                      människor som älskar att laga mat och de som söker autentiska, 
                      hemlagade måltider. Vi såg en möjlighet att bygga något som 
                      gynnar både parter.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Idag hjälper vi hemkockar att tjäna extra pengar på sin passion 
                      samtidigt som vi ger matälskare tillgång till unik, hemlagad mat 
                      från sitt närområde. Det är mat med själ, gjord av riktiga människor.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Varje rätt som säljs på Homechef representerar någons kärlek till 
                      matlagning och en möjlighet att dela den kärleken med andra.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-16 h-16 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-lg px-6 py-2">
                      Över 500+ kockar
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Våra värderingar
            </h2>
            <p className="text-muted-foreground">
              Detta driver oss varje dag
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-card transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Vår resa
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-px h-16 bg-border mt-4"></div>
                    )}
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{milestone.year}</Badge>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">
                Vill du veta mer?
              </CardTitle>
              <p className="text-muted-foreground">
                Kontakta oss för frågor om vårt företag eller partnerskap
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p>Info@homechef.com</p>
                <p>0734234686</p>
                <p>Båstad, Sverige</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;