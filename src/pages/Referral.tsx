import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, Copy, Check, Share2, MessageCircle, Facebook, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import SEOHead from "@/components/SEOHead";

const Referral = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    earnedPoints: 0,
  });

  useEffect(() => {
    // Generate or fetch referral code based on user
    if (user) {
      // Generate a simple referral code based on user ID
      const code = `HC${user.id.substring(0, 6).toUpperCase()}`;
      setReferralCode(code);
      
      // In production, fetch actual stats from database
      setReferralStats({
        totalReferrals: 0,
        pendingReferrals: 0,
        earnedPoints: 0,
      });
    } else {
      setReferralCode("HOMECHEF2025");
    }
  }, [user]);

  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Kopierad!",
        description: "Din värvningskod har kopierats.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Kunde inte kopiera",
        description: "Försök igen.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Länk kopierad!",
        description: "Din värvningslänk har kopierats.",
      });
    } catch (err) {
      toast({
        title: "Kunde inte kopiera",
        description: "Försök igen.",
        variant: "destructive",
      });
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Testa Homechef - Sveriges marknadsplats för hemlagad mat! Använd min kod ${referralCode} och få 50 bonuspoäng: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(`Använd min Homechef-kod ${referralCode} och få 50 bonuspoäng!`)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const rewards = [
    {
      title: "Du får 50 poäng",
      description: "För varje vän som registrerar sig med din kod",
      icon: Star,
    },
    {
      title: "Din vän får 50 poäng",
      description: "Som välkomstbonus vid första köpet",
      icon: Gift,
    },
    {
      title: "Ingen gräns",
      description: "Bjud in så många vänner du vill",
      icon: Users,
    },
  ];

  return (
    <>
      <SEOHead
        title="Bjud in vänner"
        description="Bjud in dina vänner till Homechef och få bonuspoäng! Dela din personliga värvningskod och tjäna poäng för varje vän som registrerar sig."
        keywords="Homechef värvning, bjud in vänner, bonuspoäng, referral"
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-hero py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <Gift className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Bjud in vänner, få poäng!
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Dela din unika kod med vänner och familj. Ni får båda bonuspoäng som kan användas vid beställningar.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Referral Code Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Din personliga värvningskod</CardTitle>
              <CardDescription>
                Dela denna kod med dina vänner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="text-2xl font-bold text-center tracking-widest"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Eller dela din personliga länk:
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="text-sm"
                  />
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Dela direkt på sociala medier:
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleShareWhatsApp}
                  >
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleShareFacebook}
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats (if logged in) */}
          {user && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-center">Din värvningsstatistik</h2>
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary">{referralStats.totalReferrals}</div>
                    <div className="text-sm text-muted-foreground">Värvade vänner</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary">{referralStats.pendingReferrals}</div>
                    <div className="text-sm text-muted-foreground">Väntande</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary">{referralStats.earnedPoints}</div>
                    <div className="text-sm text-muted-foreground">Intjänade poäng</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* How it works */}
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Så funkar det</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {rewards.map((reward, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <reward.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Steg för steg</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <Badge className="h-6 w-6 shrink-0 flex items-center justify-center">1</Badge>
                    <div>
                      <p className="font-medium">Dela din kod</p>
                      <p className="text-sm text-muted-foreground">
                        Kopiera din värvningskod eller länk och skicka till dina vänner
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Badge className="h-6 w-6 shrink-0 flex items-center justify-center">2</Badge>
                    <div>
                      <p className="font-medium">Din vän registrerar sig</p>
                      <p className="text-sm text-muted-foreground">
                        Din vän skapar ett konto och anger din kod vid registrering
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Badge className="h-6 w-6 shrink-0 flex items-center justify-center">3</Badge>
                    <div>
                      <p className="font-medium">Första köpet</p>
                      <p className="text-sm text-muted-foreground">
                        När din vän gör sitt första köp får ni båda 50 bonuspoäng
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Badge className="h-6 w-6 shrink-0 flex items-center justify-center">4</Badge>
                    <div>
                      <p className="font-medium">Använd dina poäng</p>
                      <p className="text-sm text-muted-foreground">
                        Poängen kan användas som rabatt vid framtida beställningar
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          {!user && (
            <section className="text-center">
              <Card className="max-w-md mx-auto bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-2">Inte medlem ännu?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Skapa ett konto för att få din personliga värvningskod
                  </p>
                  <Button variant="food" asChild>
                    <a href="/auth">Skapa konto</a>
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Referral;
