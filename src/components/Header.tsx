import { useState } from "react";
import type { ComponentType, SVGProps, FormEvent } from "react";
import { Search, Menu, Home, UtensilsCrossed, Info, Phone, Users, ChevronDown, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import type { UserRole } from "@/types/user";
import { Cart } from "@/components/Cart";
import UserMenu from "@/components/UserMenu";
import { AdminNotifications } from "@/components/admin/AdminNotifications";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isChef, role, switchRole } = useRole();
  const navigate = useNavigate();

  const roleLabels: Record<UserRole, string> = {
    customer: 'Kund',
    chef: 'Kock',
    kitchen_partner: 'Kökspartner',
    restaurant: 'Restaurang',
    admin: 'Administratör'
  };

  const handleSearch = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    toast.success(`Bytte till ${roleLabels[newRole]}`);

    // Navigate to public service pages (not dashboards) when switching roles
    const targetByRole: Record<UserRole, string> = {
      customer: '/',
      admin: '/admin/dashboard', // Admin dashboard is always accessible for admins
      chef: '/chef', // Public chef services page
      kitchen_partner: '/kitchen-partner/hyr-ut-ditt-kok', // Public kitchen partner info page
      restaurant: '/restaurant/partnership', // Public restaurant partnership page
    };

    navigate(targetByRole[newRole] || '/');
  };

  // Removed auth requirement - all features available

  const menuItems: Array<{
    title: string;
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
  }> = [
    { title: "Hem", href: "/", icon: Home },
    { title: "Kategorier", href: "/#kategorier", icon: UtensilsCrossed },
    { title: "Om oss", href: "/about", icon: Info },
    { title: "Kontakt", href: "#kontakt", icon: Phone },
  ];

  // Role functionality has been removed

  // Role functions have been removed

  return (
    <header
      className={`bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full transition-opacity ${menuOpen ? 'md:opacity-100 opacity-0 pointer-events-none md:pointer-events-auto' : ''}`}
      data-no-safe-adjust
    >
      <div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        style={{ 
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem'
        }}
      >
        {/* Logo - Simple text */}
        <Link to="/" className="flex items-center ml-4 md:ml-8">
          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary tracking-tight">
            Homechef
          </span>
        </Link>
        
  {/* Desktop Search - hidden on mobile */}
  <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-6 lg:mx-8">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Sök efter hemlagad mat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </form>
        </div>

        {/* Desktop Actions - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Role Switcher - Only show if user has multiple roles */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                {roleLabels[role || 'customer']}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-50 bg-background">
              <DropdownMenuLabel>Byt roll</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(['customer','chef','kitchen_partner','restaurant','admin'] as const).map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={role === r ? "bg-secondary" : ""}
                >
                  {roleLabels[r]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {role === 'admin' && <AdminNotifications />}
          
          <Cart />
          
          <UserMenu />
          
          {/* Desktop Navigation - Show for chefs */}
          {isChef && (
            <div className="hidden md:flex">
              <Link to="/chef/application">
                <Button variant="hero" size="sm">
                  Sälj Din Mat
                </Button>
              </Link>
            </div>
          )}
          {/* Desktop Navigation - Show for admin */}
          {role === 'admin' && (
            <div className="hidden md:flex">
              <Link to="/admin/dashboard">
                <Button variant="secondary" size="sm">
                  Adminpanel
                </Button>
              </Link>
            </div>
          )}
        </div>

  {/* Mobile Hamburger Menu - Larger */}
  <div className="md:hidden mr-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-16 w-16 hover:bg-primary/10 transition-all duration-300">
                <Menu className="w-9 h-9 transition-transform duration-300 hover:scale-110" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-80 bg-background/98 backdrop-blur-md p-0 border-l border-border/50"
            >
              <div className="flex flex-col h-full">
                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/30">
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Nuvarande roll</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 group">
                          <span className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{roleLabels[role || 'customer']}</span>
                          </span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 z-50 bg-background/98 backdrop-blur-md border-border/50">
                        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">Byt roll</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {(['customer','chef','kitchen_partner','restaurant','admin'] as const).map((r) => (
                          <DropdownMenuItem
                            key={r}
                            onClick={() => {
                              handleRoleSwitch(r);
                              setMenuOpen(false);
                            }}
                            className={`cursor-pointer transition-all duration-200 ${role === r ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary/80"}`}
                          >
                            {roleLabels[r]}
                            {role === r && <span className="ml-auto text-primary">✓</span>}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Mobile Search */}
                  <form 
                    onSubmit={(e) => {
                      handleSearch(e);
                      setMenuOpen(false);
                    }} 
                    className="relative animate-fade-in"
                    style={{ animationDelay: '50ms' }}
                  >
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="text-primary w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Sök efter hemlagad mat..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-background transition-all duration-300 placeholder:text-muted-foreground/70"
                    />
                  </form>

                  {/* Navigation Menu with staggered animations */}
                  <nav className="space-y-1">
                    {menuItems.map((item, index) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-primary/10 active:bg-primary/15 transition-all duration-300 group animate-fade-in"
                        style={{ animationDelay: `${100 + index * 50}ms` }}
                        onClick={() => {
                          setMenuOpen(false);
                          if (item.href.includes('#')) {
                            const hash = item.href.split('#')[1];
                            setTimeout(() => {
                              const element = document.getElementById(hash);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <span className="text-base font-medium group-hover:text-primary transition-colors duration-300">{item.title}</span>
                        <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground/50 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    ))}
                  </nav>

                  {/* Special Actions */}
                  {(isChef || role === 'admin') && (
                    <div className="space-y-3 pt-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium px-4">Snabbåtgärder</p>
                      {isChef && (
                        <Link to="/chef/application" onClick={() => setMenuOpen(false)}>
                          <Button variant="hero" className="w-full justify-start gap-3 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" size="lg">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                              <UtensilsCrossed className="w-4 h-4" />
                            </div>
                            Sälj Din Mat
                          </Button>
                        </Link>
                      )}
                      {role === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                          <Button variant="secondary" className="w-full justify-start gap-3 h-14 rounded-xl hover:scale-[1.02] transition-all duration-300" size="lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            Adminpanel
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer with cart and user */}
                <div className="border-t border-border/30 bg-secondary/20 p-4 animate-fade-in" style={{ animationDelay: '350ms' }}>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Cart />
                    </div>
                    <div className="flex-1">
                      <UserMenu />
                    </div>
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