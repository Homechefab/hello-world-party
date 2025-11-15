import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Video, MessageSquare, Star, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Mentorship = () => {
  const navigate = useNavigate();

  const mentors = [
    {
      name: "Chef Anna Bergström",
      specialty: "Skandinavisk matlagning",
      experience: "8 år",
      rating: 4.9,
      students: 23,
      image: "AB"
    },
    {
      name: "Chef Marcus Lindgren",
      specialty: "Meal prep & catering",
      experience: "6 år",
      rating: 4.8,
      students: 18,
      image: "ML"
    },
    {
      name: "Chef Sara Johansson",
      specialty: "Vegansk matlagning",
      experience: "5 år",
      rating: 5.0,
      students: 15,
      image: "SJ"
    }
  ];

  const benefits = [
    {
      icon: Video,
      title: "Personliga videomöten",
      description: "En-till-en sessioner med erfarna kockar som guidar dig"
    },
    {
      icon: BookOpen,
      title: "Strukturerade läroplaner",
      description: "Följ en genomtänkt väg från nybörjare till erfaren säljare"
    },
    {
      icon: MessageSquare,
      title: "Löpande support",
      description: "Chat-support med din mentor mellan sessionerna"
    },
    {
      icon: Award,
      title: "Certifiering",
      description: "Få erkänd certifiering när du slutför programmet"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate("/seller-guide")}
          className="mb-6"
        >
          ← Tillbaka till Säljarguiden
        </Button>

        <div className="max-w-6xl mx-auto">
          <Card className="mb-8 bg-gradient-primary text-white">
            <CardHeader className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <CardTitle className="text-4xl mb-2">Mentorskap</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                Lär av erfarna kockar och väx snabbare i din försäljning
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vad är mentorskapsprogrammet?</CardTitle>
              <CardDescription>
                Ett strukturerat program där nya säljare matchas med erfarna kockar som delar med sig av sina kunskaper och erfarenheter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Våra mentorer</CardTitle>
              <CardDescription>Erfarna kockar som vill hjälpa dig lyckas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mentors.map((mentor, index) => (
                  <Card key={index}>
                    <CardHeader className="text-center">
                      <div className="w-20 h-20 bg-gradient-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        {mentor.image}
                      </div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription>{mentor.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Erfarenhet:</span>
                        <span className="font-medium">{mentor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Studenter:</span>
                        <span className="font-medium">{mentor.students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Betyg:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {mentor.rating}
                        </span>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Välj mentor
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Hur fungerar det?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Ansök och matchas</h4>
                  <p className="text-sm text-muted-foreground">
                    Fyll i en kort ansökan om dina mål och intressen. Vi matchar dig med en lämplig mentor.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Planera sessioner</h4>
                  <p className="text-sm text-muted-foreground">
                    Boka in regelbundna videomöten med din mentor. Vanligtvis 1-2 timmar per vecka.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Lär och väx</h4>
                  <p className="text-sm text-muted-foreground">
                    Följ en strukturerad läroplan och få personlig vägledning för din försäljning.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Få certifiering</h4>
                  <p className="text-sm text-muted-foreground">
                    När du slutför programmet får du en certifiering som ökar förtroendet hos dina kunder.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anslut dig till mentorskapsprogrammet</CardTitle>
              <CardDescription>
                Ta första steget mot att bli en framgångsrik hemmakock genom att ansöka om mentorskap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-primary" size="lg">
                Ansök om mentorskap
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
