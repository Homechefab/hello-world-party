import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSignupDialogProps {
  trigger?: React.ReactNode;
  autoOpen?: boolean;
}

const NotificationSignupDialog = ({ trigger, autoOpen = false }: NotificationSignupDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Fel",
        description: "Vänligen ange din e-postadress",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Tack för din registrering!",
      description: "Du kommer få early access när vi lanserar i ditt område",
    });
    setEmail("");
    handleClose();
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
              <Input
                type="email"
                placeholder="Din e-postadress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold">
              Registrera dig nu
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
