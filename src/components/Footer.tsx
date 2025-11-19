import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Link, useNavigate } from "react-router-dom";
import { scrollToSection } from "@/utils/scrollUtils";
import homechefLogo from "@/assets/homechef-logo-orange.png";

const Footer = () => {
  const { isChef, isRestaurant } = useRole();
  const navigate = useNavigate();

  const handleRestaurantLink = (hash: string) => {
    navigate(`/restaurant/partnership${hash}`);
    scrollToSection(hash);
  };
  return (
    <footer className="bg-gradient-warm border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'}}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 items-start lg:divide-x lg:divide-border">
          {/* Brand */}
          <div className="space-y-4 lg:pr-6">
            <Link to="/" className="flex items-center">
              <img 
                src={homechefLogo} 
                alt="Homechef" 
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Sveriges första marknadsplats för hemlagad mat. Upptäck unika rätter från passionerade hemmakockar i ditt närområde.
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-soft">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* För köpare */}
          <div className="space-y-4 lg:px-6">
            <h4 className="font-semibold text-foreground">För köpare</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => {
                      const searchInput = document.querySelector('input[placeholder*="Sök efter hemlagad mat"]') as HTMLInputElement;
                      if (searchInput) {
                        searchInput.focus();
                      }
                    }, 300);
                  }}
                  className="hover:text-primary transition-colors"
                >
                  Sök mat
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('popular-chefs');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      // If not on homepage, navigate there first
                      window.location.href = '/#popular-chefs';
                    }
                  }}
                  className="hover:text-primary transition-colors text-left"
                >
                  Populära kockar
                </button>
              </li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Så fungerar det</Link></li>
              <li><Link to="/secure-payments" className="hover:text-primary transition-colors">Säkra betalningar</Link></li>
              <li><Link to="/customer-service" className="hover:text-primary transition-colors">Kundservice</Link></li>
            </ul>
          </div>

          {/* För säljare - Show for all users */}
          <div className="space-y-4 lg:px-6">
            <h4 className="font-semibold text-foreground">För säljare</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/chef/application" className="hover:text-primary transition-colors">Bli hemmakock</Link></li>
              <li><Link to="/seller-guide#säljguide" className="hover:text-primary transition-colors">Säljguide</Link></li>
              <li><Link to="/seller-guide#prissättning" className="hover:text-primary transition-colors">Prissättning</Link></li>
              <li><Link to="/seller-guide#säkerhetsregler" className="hover:text-primary transition-colors">Säkerhetsregler</Link></li>
              <li><Link to="/seller-guide#community" className="hover:text-primary transition-colors">Säljarcommunityn</Link></li>
              {isChef && (
                <li><Link to="/chef/dashboard" className="hover:text-primary transition-colors">Min säljardashboard</Link></li>
              )}
            </ul>
          </div>

          {/* För kökspartner */}
          <div className="space-y-4 lg:px-6">
            <h4 className="font-semibold text-foreground">För kökspartner</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/hyr-ut-ditt-kok" className="hover:text-primary transition-colors">Hyr ut ditt restaurangkök</Link></li>
              <li><Link to="/kitchen-partner/how-it-works" className="hover:text-primary transition-colors">Så fungerar det</Link></li>
              <li><Link to="/kitchen-partner/pricing-terms" className="hover:text-primary transition-colors">Priser & villkor</Link></li>
              <li><Link to="/kitchen-partner/support" className="hover:text-primary transition-colors">Partnersupport</Link></li>
            </ul>
          </div>

          {/* För restauranger */}
          <div className="space-y-4 lg:px-6">
            <h4 className="font-semibold text-foreground">För restauranger</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/restaurant" className="hover:text-primary transition-colors">Bli restaurangpartner</Link></li>
              <li>
                <button 
                  onClick={() => handleRestaurantLink('#våra-tjänster')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Hemkörning för restauranger
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleRestaurantLink('#våra-tjänster')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Marknadsföring
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleRestaurantLink('#våra-tjänster')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Restaurangsupport
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleRestaurantLink('#våra-tjänster')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Betalningar
                </button>
              </li>
              {isRestaurant && (
                <li><Link to="/restaurant/dashboard" className="hover:text-primary transition-colors">Restaurangdashboard</Link></li>
              )}
            </ul>
          </div>

          {/* Kontakt */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Kontakt</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Info@homechef.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>0734234686</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Båstad</span>
              </div>
            </div>
          </div>
        </div>

  <div className="border-t border-border mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
          <p>&copy; 2024 Homechef. Alla rättigheter förbehållna.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/about" className="hover:text-primary transition-colors">Om oss</Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Sekretesspolicy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Användarvillkor</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;