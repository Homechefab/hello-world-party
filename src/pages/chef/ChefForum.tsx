import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Textarea import removed (not used)
import { MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChefForum = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <MessageCircle className="w-8 h-8 text-primary" />
                Kockforum
              </CardTitle>
              <CardDescription>
                Anslut dig till vårt community av hemmakockar. Dela erfarenheter, ställ frågor och lär av varandra.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Sök i forumet..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-gradient-primary">Nytt inlägg</Button>
              </div>

              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Inga inlägg ännu</h3>
                <p className="text-muted-foreground max-w-md">
                  Forumet öppnar snart! Här kommer du kunna dela erfarenheter, ställa frågor och diskutera med andra kockar.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vill du ansluta dig till forumet?</CardTitle>
              <CardDescription>
                Som medlem kan du delta i diskussioner, ställa frågor och dela dina erfarenheter med andra kockar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-primary" size="lg" onClick={() => navigate("/auth")}>
                Anslut dig nu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChefForum;
