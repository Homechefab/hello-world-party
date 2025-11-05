import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Apple } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Konto skapat!",
          description: "Kontrollera din e-post för att verifiera ditt konto.",
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
      }
    } catch (error: any) {
      toast({
        title: "Fel uppstod",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    
    try {
      // Use the current page as redirect URL
      const redirectUrl = window.location.origin;
      
      // Special handling for Apple since it's not a standard OAuth provider
      if (provider === 'apple') {
        toast({
          title: "Apple Sign In",
          description: "Apple Sign In kommer snart. Använd Google eller Facebook för tillfället.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false
        }
      });

      if (error) {
        console.error('Auth error:', error);
        throw error;
      }

      // Check if we got a valid response
      if (!data) {
        throw new Error('Inget svar från autentiseringstjänsten');
      }

    } catch (error: any) {
      toast({
        title: "Inloggning misslyckades",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {isSignUp ? 'Skapa konto' : 'Logga in'}
              </CardTitle>
              <CardDescription>
                {isSignUp 
                  ? 'Skapa ditt Homechef-konto för att komma igång'
                  : 'Logga in på ditt Homechef-konto'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialAuth('google')}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Fortsätt med Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Fortsätt med Facebook
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialAuth('apple')}
                  disabled={isLoading}
                >
                  <Apple className="w-5 h-5 mr-2" />
                  Fortsätt med Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Eller
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && (
                  <div>
                    <Label htmlFor="fullName">Fullständigt namn</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Anna Andersson"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email">E-postadress</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="anna@exempel.se"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Lösenord</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Laddar...' : (isSignUp ? 'Skapa konto' : 'Logga in')}
                </Button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignUp 
                    ? 'Har du redan ett konto? Logga in' 
                    : 'Har du inget konto? Skapa ett'
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;