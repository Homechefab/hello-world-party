import React, { ReactNode, useState } from 'react';
import { useRole } from '@/hooks/useRole';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Users, Building, Shield, Menu } from 'lucide-react';
import { toast } from 'sonner';
import LiveChat from '@/components/LiveChat';
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
      {children}
      
      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  );
};