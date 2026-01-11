import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Gift } from "lucide-react";

interface RegisterFormProps {
  onToggleMode: () => void;
  initialReferralCode?: string;
}

export const RegisterForm = ({ onToggleMode, initialReferralCode = "" }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState(initialReferralCode);
  const [loading, setLoading] = useState(false);
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Check URL for referral code on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !referralCode) {
      setReferralCode(refCode.toUpperCase());
      validateReferralCode(refCode);
    }
  }, []);

  // Validate referral code when it changes
  const validateReferralCode = async (code: string) => {
    if (!code || code.length < 4) {
      setCodeValid(null);
      return;
    }

    setValidatingCode(true);
    try {
      const { data, error } = await supabase
        .from('user_referral_codes')
        .select('referral_code')
        .eq('referral_code', code.toUpperCase().trim())
        .maybeSingle();

      if (error) throw error;
      setCodeValid(!!data);
    } catch (error) {
      console.error('Error validating referral code:', error);
      setCodeValid(false);
    } finally {
      setValidatingCode(false);
    }
  };

  const handleReferralCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setReferralCode(upperValue);
    if (upperValue.length >= 4) {
      validateReferralCode(upperValue);
    } else {
      setCodeValid(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store referral code in user metadata for processing after signup
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            referral_code: referralCode.trim() || null,
          },
        },
      });

      if (error) throw error;

      // If signup successful and we have a referral code, process it
      if (authData.user && referralCode.trim()) {
        try {
          const { data: referralResult, error: referralError } = await supabase
            .rpc('process_referral_signup', {
              p_new_user_id: authData.user.id,
              p_referral_code: referralCode.trim()
            });

          if (referralError) {
            console.error('Referral processing error:', referralError);
          } else if (referralResult && typeof referralResult === 'object' && 'success' in referralResult) {
            if (referralResult.success) {
              toast({
                title: "Värvningskod accepterad! 🎉",
                description: "Du får 50 bonuspoäng efter ditt första köp.",
              });
            } else {
              console.log('Referral not applied:', referralResult.error);
            }
          }
        } catch (refError) {
          console.error('Error processing referral:', refError);
        }
      }

      toast({
        title: "Registrering lyckades!",
        description: "Kolla din e-post för att bekräfta ditt konto.",
      });
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

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      // Store referral code in localStorage for processing after OAuth
      if (referralCode.trim()) {
        localStorage.setItem('pending_referral_code', referralCode.trim());
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
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

          {/* Referral Code Field */}
          <div className="space-y-2">
            <Label htmlFor="referralCode" className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              Värvningskod (valfritt)
            </Label>
            <div className="relative">
              <Input
                id="referralCode"
                type="text"
                placeholder="T.ex. HC1A2B3C"
                value={referralCode}
                onChange={(e) => handleReferralCodeChange(e.target.value)}
                className={`pr-10 ${
                  codeValid === true ? 'border-green-500 focus-visible:ring-green-500' : 
                  codeValid === false ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              {validatingCode && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
              {!validatingCode && codeValid === true && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  ✓
                </div>
              )}
              {!validatingCode && codeValid === false && referralCode.length >= 4 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  ✗
                </div>
              )}
            </div>
            {codeValid === true && (
              <p className="text-sm text-green-600">
                Giltig kod! Du får 50 bonuspoäng efter ditt första köp.
              </p>
            )}
            {codeValid === false && referralCode.length >= 4 && (
              <p className="text-sm text-red-600">
                Ogiltigt värvningskod. Kontrollera koden och försök igen.
              </p>
            )}
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
