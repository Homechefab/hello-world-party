import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

const PreRegistrationPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Don't show popup if user is logged in or on the auth page
    if (user) return;
    if (location.pathname === '/auth') return;

    const dismissed = sessionStorage.getItem("preregPopupDismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(timer);
  }, [user, location.pathname]);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("preregPopupDismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !postalCode) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("early_access_signups")
        .insert({ email, postal_code: postalCode });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Du är redan registrerad!", description: "Vi har redan din e-post." });
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      toast({ title: "Något gick fel", description: "Försök igen senare.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 rounded-2xl shadow-2xl [&>button]:hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 backdrop-blur-sm p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div className="flex flex-col">
            {/* Hero section */}
            <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent px-6 py-8 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white mb-4">
                  <Sparkles className="w-3 h-3" />
                  Snart lansering
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Bli först med Homechef!
                </h2>
                <p className="text-white/85 text-sm max-w-xs mx-auto">
                  Registrera dig för att få exklusiv tidig tillgång till Sveriges första marknadsplats för hemlagad mat.
                </p>
              </div>
            </div>

            {/* Form section */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Din e-postadress"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl border-border/60 focus:border-primary"
                />
                <Input
                  type="text"
                  placeholder="Ditt postnummer"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  maxLength={6}
                  className="h-11 rounded-xl border-border/60 focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl text-base font-semibold"
              >
                {isLoading ? "Registrerar..." : "Förregistrera dig"}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Vi delar aldrig din e-post. Du kan avregistrera dig när som helst.
              </p>
            </form>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Tack för din registrering!</h2>
            <p className="text-muted-foreground mb-6">
              Vi meddelar dig så snart Homechef lanseras i ditt område.
            </p>
            <Button onClick={handleClose} variant="outline" className="rounded-xl">
              Stäng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreRegistrationPopup;
