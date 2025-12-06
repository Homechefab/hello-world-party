import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Phone, Calendar, Users, ChefHat, ShoppingBag, MapPin } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const pressReleases = [
  {
    id: 1,
    title: "Homechef lanserar Sveriges första marknadsplats för hemlagad mat",
    date: "2025-01-15",
    summary: "Homechef revolutionerar hur svenskar köper och säljer hemlagad mat genom en ny digital plattform som kopplar samman hemkockar med matälskare.",
    category: "Lansering",
  },
  {
    id: 2,
    title: "Över 100 hemkockar anslutna till Homechef",
    date: "2025-02-01",
    summary: "Bara några veckor efter lansering har Homechef redan över 100 registrerade hemkockar som erbjuder allt från traditionell husmanskost till internationella specialiteter.",
    category: "Milstolpe",
  },
  {
    id: 3,
    title: "Homechef expanderar med köksuthyrning",
    date: "2025-03-01",
    summary: "Ny funktion låter professionella kök hyras ut till hemkockar som vill skala upp sin verksamhet.",
    category: "Produkt",
  },
];

const statistics = [
  { label: "Registrerade hemkockar", value: "100+", icon: ChefHat },
  { label: "Genomförda beställningar", value: "1,000+", icon: ShoppingBag },
  { label: "Nöjda kunder", value: "95%", icon: Users },
  { label: "Städer", value: "Stockholm", icon: MapPin },
];

const Press = () => {
  const handleDownloadLogo = (format: string) => {
    // In production, these would be actual download links
    const logoUrls: Record<string, string> = {
      svg: "/homechef-logo.svg",
      png: "/app-icon.png",
    };
    
    const link = document.createElement("a");
    link.href = logoUrls[format] || "/app-icon.png";
    link.download = `homechef-logo.${format}`;
    link.click();
  };

  return (
    <>
      <SEOHead
        title="Press & Media"
        description="Pressrum för Homechef - Sveriges första marknadsplats för hemlagad mat. Hitta pressmeddelanden, logotyper och kontaktinformation för media."
        keywords="Homechef press, hemlagad mat nyheter, matplattform Sverige"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Press & Media
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Välkommen till Homechefs pressrum. Här hittar du allt material du behöver för att skriva om oss.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Statistics */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-center">Homechef i siffror</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statistics.map((stat) => (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* About Homechef */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Om Homechef</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Homechef</strong> är Sveriges första digitala marknadsplats för hemlagad mat. 
                  Plattformen kopplar samman passionerade hemkockar med matälskare som vill njuta av 
                  autentisk, hemlagad mat.
                </p>
                <p>
                  Vår vision är att demokratisera matbranschen och ge alla med passion för matlagning 
                  möjligheten att dela sina kulinariska skapelser med andra. Genom Homechef kan hemkockar 
                  starta sin egen matverksamhet på sina egna villkor, medan kunder får tillgång till 
                  unik, hemlagad mat som inte finns någon annanstans.
                </p>
                <p>
                  Plattformen erbjuder ett komplett ekosystem som inkluderar:
                </p>
                <ul>
                  <li>Marknadsplats för försäljning av hemlagad mat</li>
                  <li>Köksuthyrning för hemkockar som vill skala upp</li>
                  <li>Cateringtjänster och matupplevelser</li>
                  <li>Stöd för att följa livsmedelsregler och hygienföreskrifter</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Press Releases */}
          <section>
            <h2 className="text-2xl font-bold mb-8">Pressmeddelanden</h2>
            <div className="space-y-4">
              {pressReleases.map((release) => (
                <Card key={release.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{release.category}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(release.date).toLocaleDateString("sv-SE")}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{release.title}</CardTitle>
                        <CardDescription className="mt-2">{release.summary}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Brand Assets */}
          <section>
            <h2 className="text-2xl font-bold mb-8">Varumärkesmaterial</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logotyp</CardTitle>
                  <CardDescription>
                    Ladda ner vår logotyp i olika format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-8 mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">Homechef</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadLogo("png")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PNG
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadLogo("svg")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      SVG
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Varumärkesfärger</CardTitle>
                  <CardDescription>
                    Våra primära varumärkesfärger
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary" />
                      <div>
                        <div className="font-medium">Primär Orange</div>
                        <div className="text-sm text-muted-foreground">#FF6B35</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary" />
                      <div>
                        <div className="font-medium">Sekundär</div>
                        <div className="text-sm text-muted-foreground">Varm beige</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-foreground" />
                      <div>
                        <div className="font-medium">Text</div>
                        <div className="text-sm text-muted-foreground">Mörk grå</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Media Contact */}
          <section>
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle>Mediakontakt</CardTitle>
                <CardDescription>
                  Har du frågor eller vill intervjua oss? Kontakta vårt pressrum.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">E-post</div>
                    <a href="mailto:press@homechef.se" className="text-primary hover:underline">
                      press@homechef.se
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Telefon</div>
                    <a href="tel:+46701234567" className="text-primary hover:underline">
                      +46 70 123 45 67
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default Press;
