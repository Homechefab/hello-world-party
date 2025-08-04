import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Search, ShoppingBag, User, Menu, X, Home, UtensilsCrossed, Info, Phone, Users, Building, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, switchRole, isChef, isCustomer, isKitchenPartner, isAdmin } = useRole();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Hem", href: "/", icon: Home },
    { title: "Kategorier", href: "#kategorier", icon: UtensilsCrossed },
    { title: "Om oss", href: "/about", icon: Info },
    { title: "Kontakt", href: "#kontakt", icon: Phone },
  ];

  const roles = [
    { id: 'customer1', name: 'Kund', icon: Users, active: isCustomer, dashboard: '/' },
    { id: 'chef1', name: 'Kock', icon: ChefHat, active: isChef, dashboard: '/chef/dashboard' },
    { id: 'kitchen_partner1', name: 'Kökspartner', icon: Building, active: isKitchenPartner, dashboard: '/kitchen-partner/dashboard' },
    { id: 'admin1', name: 'Admin', icon: Shield, active: isAdmin, dashboard: '/admin/dashboard' },
  ];

  const handleRoleSwitch = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      switchRole(roleId);
      toast.success(`Bytte till ${role.name} roll`);
      navigate(role.dashboard);
      setMenuOpen(false);
    }
  };

  const getRoleIcon = () => {
    if (isChef) return <ChefHat className="w-4 h-4" />;
    if (isKitchenPartner) return <Building className="w-4 h-4" />;
    if (isAdmin) return <Shield className="w-4 h-4" />;
    return <Users className="w-4 h-4" />;
  };

  const getRoleName = () => {
    if (isChef) return 'Kock';
    if (isKitchenPartner) return 'Kökspartner';
    if (isAdmin) return 'Admin';
    return 'Kund';
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Homechef
          </h1>
        </Link>
        
        {/* Desktop Search - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Sök efter hemlagad mat..."
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Desktop Actions - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            {getRoleIcon()}
            {getRoleName()}: {user?.full_name}
          </Badge>
          
          <Button variant="ghost" size="icon">
            <ShoppingBag className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
          
          <Link to="/sell">
            <Button variant="hero" size="sm">
              Sälj mat
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-sm">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-bold">
                    Homechef
                  </span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-8 space-y-6">
                {/* Current Role Display */}
                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                  {getRoleIcon()}
                  <div>
                    <p className="text-sm font-medium">{getRoleName()}</p>
                    <p className="text-xs text-muted-foreground">{user?.full_name}</p>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground px-3">Byt roll</h3>
                  {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <Button
                        key={role.id}
                        variant={role.active ? "default" : "outline"}
                        className="w-full justify-start h-12"
                        onClick={() => handleRoleSwitch(role.id)}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        {role.name}
                        {role.active && (
                          <Badge variant="secondary" className="ml-auto">
                            Aktiv
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Sök efter hemlagad mat..."
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary/80 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-base font-medium">{item.title}</span>
                    </Link>
                  ))}
                </nav>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <Link 
                    to="/sell" 
                    className="block"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Button variant="hero" className="w-full justify-start" size="lg">
                      <UtensilsCrossed className="w-5 h-5 mr-2" />
                      Sälj mat
                    </Button>
                  </Link>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" className="flex-1 justify-start">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Varukorg
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1 justify-start">
                      <User className="w-5 h-5 mr-2" />
                      Profil
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;