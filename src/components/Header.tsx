import { useState } from "react";
import type { ComponentType, SVGProps, FormEvent } from "react";
import { Search, Menu, Home, UtensilsCrossed, Info, Phone, Users } from "lucide-react";
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
    business: 'Företagare',
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
      business: '/business/services', // Business services page
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
              {(['customer','chef','kitchen_partner','restaurant','business','admin'] as const).map((r) => (
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
              <Button variant="ghost" size="icon" className="h-16 w-16">
                <Menu className="w-9 h-9" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-80 bg-background/95 backdrop-blur-sm p-4"
            >
              <div className="space-y-6">
                {/* Role Switcher - Mobile */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Nuvarande roll:</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {roleLabels[role || 'customer']}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full z-50 bg-background">
                      <DropdownMenuLabel>Byt roll</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(['customer','chef','kitchen_partner','restaurant','business','admin'] as const).map((r) => (
                        <DropdownMenuItem
                          key={r}
                          onClick={() => {
                            handleRoleSwitch(r);
                            setMenuOpen(false);
                          }}
                          className={role === r ? "bg-secondary" : ""}
                        >
                          {roleLabels[r]}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Search */}
                <form onSubmit={(e) => {
                  handleSearch(e);
                  setMenuOpen(false);
                }} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Sök efter hemlagad mat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </form>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.title}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary/80 transition-colors w-full text-left"
                      onClick={() => {
                        // Close menu first
                        setMenuOpen(false);
                        
                        // Wait for sheet animation to complete before navigating
                        setTimeout(() => {
                          // Handle navigation
                          if (item.href === "/") {
                            navigate("/");
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                          } else if (item.href.includes('#')) {
                            const [path, hash] = item.href.split('#');
                            const targetPath = path || "/";
                            
                            // Always navigate to the correct page first
                            if (window.location.pathname !== targetPath) {
                              navigate(targetPath);
                              // Wait for page to load then scroll
                              setTimeout(() => {
                                const element = document.getElementById(hash);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 300);
                            } else {
                              // Already on the page, just scroll
                              const element = document.getElementById(hash);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }
                          } else {
                            navigate(item.href);
                          }
                        }, 300);
                      }}
                    >
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-base font-medium">{item.title}</span>
                    </button>
                  ))}
                </nav>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-border">
                  {isChef && (
                    <Link to="/chef/application" onClick={() => setMenuOpen(false)}>
                      <Button variant="hero" className="w-full justify-start" size="lg">
                        <UtensilsCrossed className="w-5 h-5 mr-2" />
                        Sälj Din Mat
                      </Button>
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                      <Button variant="secondary" className="w-full justify-start" size="lg">
                        Adminpanel
                      </Button>
                    </Link>
                  )}
                  
                  <div className="flex gap-2">
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