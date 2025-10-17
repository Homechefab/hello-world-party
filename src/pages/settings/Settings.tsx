import { Link } from "react-router-dom";
import { MapPin, CreditCard, Heart, User, Shield, Bell, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
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
      </div>
    </div>
  );
};

export default SettingsPage;