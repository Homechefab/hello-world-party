import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { signInWithSocial } from "@/lib/socialAuth";

interface RegisterFormProps {
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export const RegisterForm = ({ onToggleMode, onSuccess }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Phone validation
    const cleanedPhone = phone.replace(/[\s\-()]/g, "").trim();
    const digitsOnly = cleanedPhone.replace(/\D/g, "");
    if (digitsOnly.length < 8 || digitsOnly.length > 15 || !/^(\+|0)/.test(cleanedPhone)) {
      toast({
        title: "Ogiltigt telefonnummer",
        description: "Ange ett giltigt mobilnummer (t.ex. 070 123 45 67 eller +46701234567).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const returnTo = sessionStorage.getItem('post_auth_return') || '/';
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${returnTo}`,
          data: {
            full_name: fullName,
            phone: cleanedPhone,
          },
        },
      });

      if (error) throw error;

      // No email verification required — log the user in immediately if no session was returned.
      let hasSession = !!data.session;
      if (!hasSession) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        hasSession = !signInError;
      }

      // Persist phone on profile (handle_new_user trigger doesn't read this from metadata)
      if (data.user?.id || hasSession) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser?.id) {
          await supabase
            .from('profiles')
            .update({ phone: cleanedPhone })
            .eq('id', currentUser.id);
        }
      }

      toast({
        title: "Välkommen till Homechef! 🎉",
        description: "Ditt konto är skapat och du är inloggad.",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        const returnPath = sessionStorage.getItem('post_auth_return') || '/dashboard';
        sessionStorage.removeItem('post_auth_return');
        navigate(returnPath, { replace: true });
      }
    } catch (error: unknown) {
      toast({
        title: "Fel vid registrering",
        description: error instanceof Error ? error.message : "Ett fel uppstod vid registrering",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await signInWithSocial(provider);
    } catch (error: unknown) {
      toast({
        title: "Fel vid social registrering",
        description: error instanceof Error ? error.message : "Ett fel uppstod vid social registrering",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Skapa konto</CardTitle>
        <CardDescription>
          Registrera dig för att börja sälja eller köpa hemlagad mat
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Fullt namn</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Ditt fullständiga namn"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Mobilnummer *</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="t.ex. 070 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Används för SMS-avisering när din mat är klar för upphämtning.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minst 6 tecken"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading} variant="food">
            {loading ? "Registrerar..." : "Skapa konto"}
          </Button>
        </form>

        <div className="my-6">
          <Separator />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">eller</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('apple')}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Fortsätt med Apple
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('google')}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Fortsätt med Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('facebook')}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Fortsätt med Facebook
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Har du redan ett konto?{" "}
            <button
              onClick={onToggleMode}
              className="text-primary hover:underline"
            >
              Logga in här
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
