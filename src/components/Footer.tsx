import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Link } from "react-router-dom";
import homechefLogo from "@/assets/homechef-logo-orange.png";

const Footer = () => {
  const { isChef, isRestaurant } = useRole();
  
  return (
    <footer className="bg-gradient-warm border-t border-border rounded-xl mt-4">
      <div className="max-w-4xl mx-auto px-6 py-8" style={{paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'}}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center">
              <img 
                src={homechefLogo} 
                alt="Homechef" 
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sveriges första marknadsplats för hemlagad mat.
            </p>
            <div className="flex gap-2">
              <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Snabblänkar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Så fungerar det</Link></li>
              <li><Link to="/chef/application" className="hover:text-primary transition-colors">Bli hemmakock</Link></li>
              <li><Link to="/hyr-ut-ditt-kok" className="hover:text-primary transition-colors">Hyr ut kök</Link></li>
              <li><Link to="/restaurant" className="hover:text-primary transition-colors">För restauranger</Link></li>
              {isChef && (
                <li><Link to="/chef/dashboard" className="hover:text-primary transition-colors">Min dashboard</Link></li>
              )}
              {isRestaurant && (
                <li><Link to="/restaurant/dashboard" className="hover:text-primary transition-colors">Restaurangdashboard</Link></li>
              )}
            </ul>
          </div>

          {/* Kontakt */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Kontakt</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Info@homechef.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>0734234686</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Båstad</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
          <p>&copy; 2024 Homechef. Alla rättigheter förbehållna.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-primary transition-colors">Om oss</Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Sekretesspolicy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Villkor</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;