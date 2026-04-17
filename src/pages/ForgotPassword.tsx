import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, ChefHat } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error('Kunde inte skicka återställningslänk', {
        description: error.message,
      });
      return;
    }

    setSent(true);
    toast.success('Återställningslänk skickad', {
      description: `Kolla din inkorg på ${email}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Glömt lösenord?</CardTitle>
              <CardDescription>
                {sent
                  ? 'Vi har skickat en återställningslänk till din e-post.'
                  : 'Ange din e-post så skickar vi en länk för att återställa ditt lösenord.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sent ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Klicka på länken i mejlet för att sätta ett nytt lösenord. Kontrollera även skräpposten.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSent(false);
                      setEmail('');
                    }}
                  >
                    Skicka till en annan e-post
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => navigate('/auth')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tillbaka till inloggning
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-postadress</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="anna@exempel.se"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Skickar...' : 'Skicka återställningslänk'}
                  </Button>
                  <div className="text-center">
                    <Link to="/auth" className="text-sm text-primary hover:underline inline-flex items-center">
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Tillbaka till inloggning
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default ForgotPassword;
