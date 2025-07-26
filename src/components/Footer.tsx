import { ChefHat, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-warm border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Hemlagat</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Sveriges första marknadsplats för hemlagad mat. Upptäck unika rätter från passionerade hemkockar i ditt närområde.
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* För köpare */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">För köpare</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Sök mat</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Populära kategorier</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Så fungerar det</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Säkra betalningar</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kundservice</a></li>
            </ul>
          </div>

          {/* För säljare */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">För säljare</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Börja sälja</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Säljguide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Prissättning</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Säkerhetsregler</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Säljarcommunityn</a></li>
            </ul>
          </div>

          {/* Kontakt */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Kontakt</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>hej@hemlagat.se</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>08-123 45 67</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Stockholm, Sverige</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
          <p>&copy; 2024 Hemlagat. Alla rättigheter förbehållna.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Integritetspolicy</a>
            <a href="#" className="hover:text-primary transition-colors">Användarvillkor</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;