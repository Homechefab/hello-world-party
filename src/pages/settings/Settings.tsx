import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Heart, User, Shield, Bell, HelpCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Refresh session before calling the function
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Du är inte inloggad",
          description: "Logga in igen och försök sedan radera kontot.",
          variant: "destructive",
        });
        setIsDeleting(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('delete-account', {
        method: 'POST',
      });
      
      console.log('Delete account response:', { data, error });
      
      if (error) throw error;
      if (data && data.error) throw new Error(data.error);
      
      await supabase.auth.signOut();
      toast({ title: "Konto raderat", description: "Ditt konto och all din data har raderats." });
      navigate('/auth');
    } catch (err) {
      console.error('Delete account error:', err);
      toast({
        title: "Det gick inte att radera kontot",
        description: "Försök igen eller kontakta support@homechef.nu.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const settingsItems = [
    {
      title: "Leveransadresser",
      description: "Hantera dina leveransadresser",
      icon: MapPin,
      href: "/settings/addresses",
      color: "text-blue-600"
    },
    {
      title: "Betalningsmetoder",
      description: "Sparade betalningsmetoder och fakturering",
      icon: CreditCard,
      href: "/settings/payment-methods",
      color: "text-green-600"
    },
    {
      title: "Personliga preferenser",
      description: "Allergier, favoriträtter och kostpreferenser",
      icon: Heart,
      href: "/settings/preferences",
      color: "text-red-600"
    },
    {
      title: "Profil",
      description: "Uppdatera din profilinformation",
      icon: User,
      href: "/profile",
      color: "text-purple-600"
    },
    {
      title: "Säkerhet",
      description: "Lösenord och säkerhetsinställningar",
      icon: Shield,
      href: "/settings/security",
      color: "text-orange-600"
    },
    {
      title: "Notifikationer",
      description: "E-post och push-notifikationer",
      icon: Bell,
      href: "/settings/notifications",
      color: "text-yellow-600"
    },
    {
      title: "Hjälp & Support",
      description: "FAQ, kontakta support och användarguider",
      icon: HelpCircle,
      href: "/help",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Inställningar</h1>
          <p className="text-muted-foreground">
            Hantera ditt konto och dina preferenser
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {settingsItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.href} to={item.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors`}>
                        <IconComponent className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 p-6 bg-secondary/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Snabbåtgärder</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/settings/addresses">
              <Button variant="outline" size="sm">
                Lägg till adress
              </Button>
            </Link>
            <Link to="/settings/payment-methods">
              <Button variant="outline" size="sm">
                Lägg till betalning
              </Button>
            </Link>
            <Link to="/settings/preferences">
              <Button variant="outline" size="sm">
                Uppdatera preferenser
              </Button>
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 border border-destructive/40 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-destructive mb-1 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Farlig zon
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Åtgärder här kan inte ångras.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? "Raderar..." : "Radera mitt konto"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Radera konto permanent?</AlertDialogTitle>
                <AlertDialogDescription>
                  Detta raderar permanent ditt konto, din profil, beställningshistorik,
                  sparade adresser och all annan personlig data. Åtgärden kan inte ångras.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Ja, radera mitt konto
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;