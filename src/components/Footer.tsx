import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-warm border-t border-border rounded-xl mt-4">
      <div className="max-w-7xl mx-auto px-6 py-12" style={{paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'}}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary tracking-tight">
                Homechef
              </span>
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

          {/* För köpare */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">För köpare</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/search" className="hover:text-primary transition-colors">Sök runt</Link></li>
              <li><Link to="/search-chefs" className="hover:text-primary transition-colors">Populära kockar</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Så fungerar det</Link></li>
              <li><Link to="/secure-payments" className="hover:text-primary transition-colors">Säkra betalningar</Link></li>
              <li><Link to="/customer-service" className="hover:text-primary transition-colors">Kundservice</Link></li>
            </ul>
          </div>

          {/* För säljare/kockar */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">För säljare</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/chef/application" className="hover:text-primary transition-colors">Bli hemmakock</Link></li>
              <li><Link to="/seller-guide" className="hover:text-primary transition-colors">Säljguide</Link></li>
              <li><Link to="/sell" className="hover:text-primary transition-colors">Prissättning</Link></li>
              <li><Link to="/chef/kitchen-requirements" className="hover:text-primary transition-colors">Säkerhetsregler</Link></li>
              <li><Link to="/chef/kockforum" className="hover:text-primary transition-colors">Säljarecommunity</Link></li>
              <li><Link to="/chef/manadens-kock" className="hover:text-primary transition-colors">Månadens kock</Link></li>
            </ul>
          </div>

          {/* För kökspartner */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">För kökspartner</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/hyr-ut-ditt-kok" className="hover:text-primary transition-colors">Hyr ut ditt restaurangkök</Link></li>
              <li><Link to="/kitchen-partner/how-it-works" className="hover:text-primary transition-colors">Så fungerar det</Link></li>
              <li><Link to="/kitchen-partner/pricing-terms" className="hover:text-primary transition-colors">Priser & villkor</Link></li>
              <li><Link to="/kitchen-partner/support" className="hover:text-primary transition-colors">Partnersupport</Link></li>
            </ul>
          </div>

          {/* För restauranger */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">För restauranger</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/restaurant" className="hover:text-primary transition-colors">Bli restaurangpartner</Link></li>
              <li><Link to="/restaurant/partnership" className="hover:text-primary transition-colors">Hemkörning</Link></li>
              <li><Link to="/restaurant/partnership" className="hover:text-primary transition-colors">Marknadsföring</Link></li>
              <li><Link to="/restaurant/partnership" className="hover:text-primary transition-colors">Support</Link></li>
              <li><Link to="/restaurant/partnership" className="hover:text-primary transition-colors">Betalningar</Link></li>
            </ul>
          </div>
        </div>

        {/* Kontakt sektion */}
        <div id="kontakt" className="border-t border-border pt-6 mb-6 scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">Kontakt</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>info@homechef.nu</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm invisible">-</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>0734234686</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm invisible">-</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Kiselvägen 15a, 269 41 Östra Karup</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-muted-foreground text-xs pr-16">
          <div className="text-center sm:text-left">
            <p>&copy; 2025 Homechef. Alla rättigheter förbehållna.</p>
            <p>Org.nr: 559547-7026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mr-4">
            <Link to="/about" className="hover:text-primary transition-colors">Om oss</Link>
            <Link to="/press" className="hover:text-primary transition-colors">Press</Link>
            <Link to="/referral" className="hover:text-primary transition-colors">Bjud in vänner</Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Sekretesspolicy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Allmänna villkor</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
