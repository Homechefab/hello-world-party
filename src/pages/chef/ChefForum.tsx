import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Textarea import removed (not used)
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, Reply, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChefForum = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const forumTopics = [
    {
      id: 1,
      title: "Bästa recepten för meal prep",
      author: "Chef Anna",
      replies: 15,
      likes: 23,
      category: "Recept",
      preview: "Jag skulle vilja dela med mig av några av mina favorit meal prep-recept som kunderna älskar..."
    },
    {
      id: 2,
      title: "Tips för att hantera storleveranser",
      author: "Chef Marcus",
      replies: 8,
      likes: 12,
      category: "Logistik",
      preview: "Hur planerar ni när ni får beställningar för 20+ portioner samtidigt?"
    },
    {
      id: 3,
      title: "Hygienrutiner i hemmaköket",
      author: "Chef Sara",
      replies: 22,
      likes: 35,
      category: "Hygien",
      preview: "Här är mina bästa tips för att hålla hemmaköket i toppskick enligt kommunens krav..."
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

              <div className="space-y-4">
                {forumTopics.map((topic) => (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{topic.category}</Badge>
                          </div>
                          <CardTitle className="text-xl mb-2">{topic.title}</CardTitle>
                          <CardDescription className="text-sm mb-3">
                            {topic.preview}
                          </CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium">{topic.author}</span>
                            <div className="flex items-center gap-1">
                              <Reply className="w-4 h-4" />
                              <span>{topic.replies} svar</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{topic.likes} gilla</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
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
              <Button className="w-full bg-gradient-primary" size="lg">
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
