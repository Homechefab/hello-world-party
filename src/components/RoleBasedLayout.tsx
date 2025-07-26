import React, { ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Users, Building, Shield } from 'lucide-react';

interface RoleBasedLayoutProps {
  children: ReactNode;
}

export const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
  const { user, loading, switchRole, isChef, isCustomer, isKitchenPartner, isAdmin } = useRole();

  console.log('RoleBasedLayout: Current user:', user, 'Loading:', loading);

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
          <div className="flex gap-2 text-sm">
            <Button size="sm" variant="ghost" onClick={() => switchRole('customer1')}>
              Kund
            </Button>
            <Button size="sm" variant="ghost" onClick={() => switchRole('chef1')}>
              Kock
            </Button>
            <Button size="sm" variant="ghost" onClick={() => switchRole('kitchen_partner1')}>
              Kökspartner
            </Button>
            <Button size="sm" variant="ghost" onClick={() => switchRole('admin1')}>
              Admin
            </Button>
          </div>
        </div>
      </div>
      
      {React.cloneElement(children as React.ReactElement, { 
        user, 
        isChef, 
        isCustomer, 
        isKitchenPartner, 
        isAdmin 
      })}
    </div>
  );
};