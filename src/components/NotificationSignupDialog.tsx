import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSignupDialogProps {
  trigger?: React.ReactNode;
}

const NotificationSignupDialog = ({ trigger }: NotificationSignupDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [open, setOpen] = useState(false);

  const handleEmailSignup = (e: React.FormEvent) => {
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
      title: "Tack!",
      description: "Vi kommer att meddela dig när kockar finns i ditt område",
    });
    setEmail("");
    setOpen(false);
  };

  const handleSmsSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({
        title: "Fel",
        description: "Vänligen ange ditt telefonnummer",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Tack!",
      description: "Vi kommer att skicka SMS när kockar finns i ditt område",
    });
    setPhone("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Bell className="w-4 h-4" />
            Meddela mig
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl text-center">Få notifiering</DialogTitle>
          <DialogDescription className="text-center">
            Vi meddelar dig så snart kockar registrerar sig i ditt område
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-post
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              SMS
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="mt-4">
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-email">E-postadress</Label>
                <Input
                  id="notification-email"
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Registrera för e-postnotifieringar
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="sms" className="mt-4">
            <form onSubmit={handleSmsSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-phone">Telefonnummer</Label>
                <Input
                  id="notification-phone"
                  type="tel"
                  placeholder="+46 70 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Registrera för SMS-notifieringar
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Vad händer sedan?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Vi sparar din kontaktinformation säkert</li>
            <li>• Du får ett meddelande när kockar registrerar sig</li>
            <li>• Du kan avregistrera dig när som helst</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSignupDialog;
