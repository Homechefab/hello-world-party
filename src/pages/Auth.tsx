import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  ChefHat, 
  Mail, 
  Lock, 
  User,
  ArrowLeft,
  Chrome,
  Facebook,
  CreditCard,
  Shield
} from "lucide-react";
import Header from "@/components/Header";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: name,
              role: 'customer'
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Kontrollera din e-post",
          description: "Vi har skickat en bekräftelselänk till din e-post.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Välkommen tillbaka!",
          description: "Du är nu inloggad.",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Fel vid autentisering",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Fel vid inloggning",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleBankIDAuth = () => {
    toast({
      title: "BankID kommer snart",
      description: "BankID-integration är under utveckling och kommer vara tillgänglig snart.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till startsidan
          </Link>

          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Välkommen till Homechef</CardTitle>
                <CardDescription>
                  Logga in för att komma åt alla funktioner
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleSocialAuth('google')}
                  disabled={loading}
                  variant="outline"
                  className="w-full h-12 text-left justify-start"
                >
                  <Chrome className="w-5 h-5 mr-3 text-red-500" />
                  Fortsätt med Google
                </Button>

                <Button
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={loading}
                  variant="outline" 
                  className="w-full h-12 text-left justify-start"
                >
                  <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                  Fortsätt med Facebook
                </Button>

                <Button
                  onClick={handleBankIDAuth}
                  disabled={loading}
                  variant="outline"
                  className="w-full h-12 text-left justify-start"
                >
                  <Shield className="w-5 h-5 mr-3 text-blue-700" />
                  Fortsätt med BankID
                  <span className="ml-auto text-xs text-muted-foreground">Kommer snart</span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">eller</span>
                </div>
              </div>

              {/* Email/Password Forms */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Logga in</TabsTrigger>
                  <TabsTrigger value="signup">Skapa konto</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={(e) => handleEmailAuth(e, false)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">E-post</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="din@email.se"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Lösenord</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Ditt lösenord"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-primary text-white hover:opacity-90"
                    >
                      {loading ? "Loggar in..." : "Logga in"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={(e) => handleEmailAuth(e, true)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Fullt namn</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Ditt fulla namn"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">E-post</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="din@email.se"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Lösenord</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Välj ett starkt lösenord"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-primary text-white hover:opacity-90"
                    >
                      {loading ? "Skapar konto..." : "Skapa konto"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Genom att fortsätta godkänner du våra{" "}
                  <Link to="/terms" className="underline hover:text-foreground">
                    villkor
                  </Link>{" "}
                  och{" "}
                  <Link to="/privacy" className="underline hover:text-foreground">
                    integritetspolicy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;