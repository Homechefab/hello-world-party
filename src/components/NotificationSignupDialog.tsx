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

interface NotificationSignupDialogProps {
  trigger?: React.ReactNode;
  autoOpen?: boolean;
}

const NotificationSignupDialog = ({ trigger, autoOpen = false }: NotificationSignupDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (autoOpen) {
      const hasSeenPopup = localStorage.getItem("notification_popup_seen");
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [autoOpen]);

  const handleClose = () => {
    setOpen(false);
    if (autoOpen) {
      localStorage.setItem("notification_popup_seen", "true");
    }
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
      <DialogContent className="sm:max-w-md p-0 gap-0 border-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 pt-12 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Få Early Access</h2>
          <p className="text-white/90 text-sm">
            Var först med att prova HomeChef när vi lanserar i ditt område!
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6 bg-background">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">E-postadress</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="din@email.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-postalcode">Postnummer</Label>
              <Input
                id="signup-postalcode"
                type="text"
                placeholder="123 45"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-12 text-base"
                maxLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrerar..." : "Registrera dig nu"}
            </Button>
          </form>
          
          <p className="text-center text-xs text-muted-foreground mt-4">
            Vi respekterar din integritet. Avregistrera dig när som helst.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSignupDialog;
