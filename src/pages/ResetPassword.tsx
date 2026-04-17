import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Supabase auto-exchanges the recovery token in the URL hash for a session
    // when the page loads. We listen for PASSWORD_RECOVERY or check existing session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setHasRecoverySession(true);
        setChecking(false);
      }
    });

    // Fallback: if we already have a session (link was clicked, exchange happened)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setHasRecoverySession(true);
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Lösenordet måste vara minst 6 tecken');
      return;
    }
    if (password !== confirm) {
      toast.error('Lösenorden matchar inte');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error('Kunde inte uppdatera lösenord', { description: error.message });
      return;
    }
    toast.success('Lösenord uppdaterat!', {
      description: 'Du är nu inloggad med ditt nya lösenord.',
    });
    navigate('/dashboard', { replace: true });
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
              <CardTitle className="text-2xl">Sätt nytt lösenord</CardTitle>
              <CardDescription>
                Välj ett nytt lösenord för ditt Homechef-konto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {checking ? (
                <p className="text-center text-sm text-muted-foreground">Verifierar länk...</p>
              ) : !hasRecoverySession ? (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Återställningslänken är ogiltig eller har gått ut. Begär en ny länk.
                  </p>
                  <Button className="w-full" onClick={() => navigate('/forgot-password')}>
                    Begär ny återställningslänk
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-md text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Länken verifierad — välj nytt lösenord nedan.</span>
                  </div>
                  <div>
                    <Label htmlFor="password">Nytt lösenord</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minst 6 tecken"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm">Bekräfta lösenord</Label>
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="Skriv lösenordet igen"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sparar...' : 'Spara nytt lösenord'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
