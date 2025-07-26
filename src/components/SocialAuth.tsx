import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, User, Lock, Chrome, Facebook as FacebookIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialAuthProps {
  onSuccess: () => void;
  isGuest?: boolean;
}

const SocialAuth = ({ onSuccess, isGuest = false }: SocialAuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [guestEmail, setGuestEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    acceptTerms: false
  });
  const { toast } = useToast();

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `Loggar in med ${provider}...`,
      description: "Du omdirigeras till inloggningssidan"
    });
    
    // Här skulle vi integrera med Supabase Auth
    setTimeout(() => {
      toast({
        title: "Inloggning lyckad!",
        description: `Du är nu inloggad med ${provider}`
      });
      onSuccess();
    }, 1500);
  };

  const handleEmailAuth = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast({
          title: "Fyll i alla fält",
          description: "E-post och lösenord krävs för inloggning",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!formData.email || !formData.password || !formData.fullName) {
        toast({
          title: "Fyll i alla fält", 
          description: "Alla fält krävs för registrering",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.acceptTerms) {
        toast({
          title: "Acceptera villkor",
          description: "Du måste acceptera användarvillkoren för att registrera dig",
          variant: "destructive"
        });
        return;
      }
    }

    toast({
      title: isLogin ? "Loggar in..." : "Skapar konto...",
      description: isLogin ? "Kontrollerar dina uppgifter" : "Skickar bekräftelse till din e-post"
    });

    setTimeout(() => {
      toast({
        title: isLogin ? "Inloggning lyckad!" : "Konto skapat!",
        description: isLogin ? "Välkommen tillbaka" : "Kontrollera din e-post för att bekräfta kontot"
      });
      onSuccess();
    }, 1500);
  };

  const handleGuestCheckout = () => {
    if (!guestEmail || !guestEmail.includes('@')) {
      toast({
        title: "Ogiltig e-post",
        description: "Ange en giltig e-postadress för kvitto",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Fortsätter som gäst",
      description: "Du kommer få orderbekräftelse på din e-post"
    });
    onSuccess();
  };

  if (isGuest) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Fortsätt som gäst</CardTitle>
          <CardDescription>
            Ange din e-post för orderbekräftelse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="guest-email">E-postadress</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="guest-email"
                type="email"
                placeholder="din@email.se"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button onClick={handleGuestCheckout} className="w-full" variant="food">
            Fortsätt till betalning
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Eller{" "}
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                logga in för snabbare checkout
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{isLogin ? "Logga in" : "Skapa konto"}</CardTitle>
        <CardDescription>
          {isLogin 
            ? "Välkommen tillbaka till Homechef" 
            : "Bli medlem för att börja beställa mat"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sociala inloggningar */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleSocialLogin("Google")}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Fortsätt med Google
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleSocialLogin("Facebook")}
          >
            <FacebookIcon className="w-4 h-4 mr-2" />
            Fortsätt med Facebook
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">ELLER</span>
          <Separator className="flex-1" />
        </div>

        {/* E-post inloggning */}
        <div className="space-y-3">
          {!isLogin && (
            <div>
              <Label htmlFor="fullName">Fullständigt namn</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ditt fullständiga namn"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email">E-postadress</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="din@email.se"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Lösenord</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={isLogin ? "Ditt lösenord" : "Minst 6 tecken"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-9"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, acceptTerms: checked === true }))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                Jag accepterar{" "}
                <a href="#" className="text-primary hover:underline">
                  användarvillkoren
                </a>{" "}
                och{" "}
                <a href="#" className="text-primary hover:underline">
                  integritetspolicyn
                </a>
              </Label>
            </div>
          )}

          <Button onClick={handleEmailAuth} className="w-full" variant="food">
            {isLogin ? "Logga in" : "Skapa konto"}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Har du inget konto? " : "Har du redan ett konto? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Registrera dig" : "Logga in"}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialAuth;