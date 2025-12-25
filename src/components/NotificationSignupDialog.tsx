import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import popupHeaderBg from "@/assets/popup-header-bg.jpg";

interface NotificationSignupDialogProps {
  trigger?: React.ReactNode;
  autoOpen?: boolean;
  triggerOnScroll?: string; // CSS selector to watch for scroll
}

const NotificationSignupDialog = ({ trigger, autoOpen = false, triggerOnScroll }: NotificationSignupDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // TODO: Återställ denna kontroll efter testning
    // const hasSeenPopup = localStorage.getItem("notification_popup_seen");
    // if (hasSeenPopup) return;

    if (triggerOnScroll) {
      const handleScroll = () => {
        const element = document.querySelector(triggerOnScroll);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight * 0.8;
          if (isVisible) {
            setOpen(true);
            window.removeEventListener("scroll", handleScroll);
          }
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      // Check immediately in case already scrolled
      handleScroll();
      
      return () => window.removeEventListener("scroll", handleScroll);
    } else if (autoOpen) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoOpen, triggerOnScroll]);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("notification_popup_seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Fel",
        description: "Vänligen ange din e-postadress",
        variant: "destructive",
      });
      return;
    }

    if (!postalCode) {
      toast({
        title: "Fel",
        description: "Vänligen ange ditt postnummer",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("early_access_signups")
        .insert({
          email: email.trim(),
          postal_code: postalCode.trim(),
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Tack för din registrering!",
        description: "Du kommer få early access när vi lanserar i ditt område",
      });
      setEmail("");
      setPostalCode("");
      handleClose();
    } catch (error: any) {
      console.error("Error saving signup:", error);
      toast({
        title: "Något gick fel",
        description: "Försök igen senare",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      {trigger && (
        <div onClick={() => setOpen(true)}>
          {trigger}
        </div>
      )}
      <DialogContent 
        className="w-[340px] max-w-[90vw] p-0 gap-0 border-0 overflow-hidden rounded-xl shadow-2xl"
        hideCloseButton
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 bg-black/20 hover:bg-black/30 transition-colors"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        {/* Header with background image and gradient overlay */}
        <div className="relative p-6 pt-8 text-center text-white overflow-hidden">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${popupHeaderBg})` }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/75 to-primary/65" />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex justify-center mb-3">
              <div className="p-2.5 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">Få Early Access</h2>
            <p className="text-white/90 text-sm">
              Bli först när vi lanserar i ditt område!
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-5 bg-background">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="signup-email" className="text-sm">E-postadress</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="din@email.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-postalcode" className="text-sm">Postnummer</Label>
              <Input
                id="signup-postalcode"
                type="text"
                placeholder="123 45"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-10"
                maxLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-10 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrerar..." : "Registrera dig"}
            </Button>
          </form>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            Vi respekterar din integritet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSignupDialog;
