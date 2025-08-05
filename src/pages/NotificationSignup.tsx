import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, MessageCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const NotificationSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState("email");

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Fel",
        description: "Vänligen ange din e-postadress",
        variant: "destructive",
      });
      return;
    }
    
    // Här skulle vi normalt spara e-posten till databasen
    toast({
      title: "Tack!",
      description: "Vi kommer att meddela dig när kockar finns i ditt område",
    });
    setEmail("");
  };

  const handleSmsSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({
        title: "Fel",
        description: "Vänligen ange ditt telefonnummer",
        variant: "destructive",
      });
      return;
    }
    
    // Här skulle vi normalt spara telefonnumret till databasen
    toast({
      title: "Tack!",
      description: "Vi kommer att skicka SMS när kockar finns i ditt område",
    });
    setPhone("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Button>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Bell className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Få notifiering</CardTitle>
              <p className="text-muted-foreground">
                Vi meddelar dig så snart kockar registrerar sig i ditt område
              </p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-post
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    SMS
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-postadress</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="din@email.se"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Registrera för e-postnotifieringar
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="sms">
                  <form onSubmit={handleSmsSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefonnummer</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+46 70 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Registrera för SMS-notifieringar
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Vad händer sedan?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vi sparar din kontaktinformation säkert</li>
                  <li>• Du får ett meddelande när kockar registrerar sig</li>
                  <li>• Du kan avregistrera dig när som helst</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationSignup;