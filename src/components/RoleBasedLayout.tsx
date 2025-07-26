import React, { ReactNode, useState } from 'react';
import { useRole } from '@/hooks/useRole';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Users, Building, Shield, Menu } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface RoleBasedLayoutProps {
  children: ReactNode;
}

export const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
  const { user, loading, switchRole, isChef, isCustomer, isKitchenPartner, isAdmin } = useRole();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('RoleBasedLayout: Current user:', user, 'Loading:', loading);

  const handleRoleSwitch = (roleId: string) => {
    const roleNames = {
      'customer1': 'Kund',
      'chef1': 'Kock', 
      'kitchen_partner1': 'Kökspartner',
      'admin1': 'Admin'
    };
    
    switchRole(roleId);
    toast.success(`Bytte till ${roleNames[roleId as keyof typeof roleNames]} roll`);
    
    // Navigate to appropriate page based on role
    switch (roleId) {
      case 'chef1':
        navigate('/chef/dashboard');
        break;
      case 'kitchen_partner1':
        navigate('/kitchen-partner/dashboard');
        break;
      case 'admin1':
        navigate('/admin/dashboard');
        break;
      default: // customer1
        navigate('/');
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      </div>
    );
  }

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

  const roles = [
    { id: 'customer1', name: 'Kund', icon: Users, active: isCustomer },
    { id: 'chef1', name: 'Kock', icon: ChefHat, active: isChef },
    { id: 'kitchen_partner1', name: 'Kökspartner', icon: Building, active: isKitchenPartner },
    { id: 'admin1', name: 'Admin', icon: Shield, active: isAdmin },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Demo role switcher - remove in production */}
      <div className="bg-muted/50 border-b p-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getRoleIcon()}
              {getRoleName()}: {user?.full_name}
            </Badge>
          </div>
          
          {/* Desktop Role Buttons - hidden on mobile */}
          <div className="hidden md:flex gap-2 text-sm">
            {roles.map((role) => (
              <Button 
                key={role.id}
                size="sm" 
                variant={role.active ? "default" : "ghost"} 
                onClick={() => handleRoleSwitch(role.id)}
              >
                {role.name}
              </Button>
            ))}
          </div>

          {/* Mobile Role Menu */}
          <div className="md:hidden">
            <Sheet open={roleMenuOpen} onOpenChange={setRoleMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-4 h-4 mr-1" />
                  Roller
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-sm">
                <SheetHeader>
                  <SheetTitle className="text-left">Välj roll</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-2">
                  {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <Button
                        key={role.id}
                        variant={role.active ? "default" : "outline"}
                        className="w-full justify-start h-12"
                        onClick={() => {
                          handleRoleSwitch(role.id);
                          setRoleMenuOpen(false);
                        }}
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
};