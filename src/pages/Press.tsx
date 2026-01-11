import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Mail, Phone } from "lucide-react";
import SEOHead from "@/components/SEOHead";

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
                    <a href="mailto:info@homechef.nu" className="text-primary hover:underline">
                      info@homechef.nu
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Telefon</div>
                    <a href="tel:+46734234686" className="text-primary hover:underline">
                      0734234686
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
