import { createContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface RoleContextType {
  role: UserRole | null;
  loading: boolean;
  user: UserProfile | null;
  isChef: boolean;
  isKitchenPartner: boolean;
  isCustomer: boolean;
  isRestaurant: boolean;
  isAdmin: boolean;
  usingMockData: boolean;
  switchRole: (newRole: UserRole) => void;
  switchToRealAuth: () => void;
}

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (!authUser) {
        setRole(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          if (profile.role === 'chef') {
            const { data: chefData } = await supabase
              .from('chefs')
              .select('*')
              .eq('user_id', authUser.id)
              .single();

            const userProfile: UserProfile = {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role as UserRole,
              phone: profile.phone || undefined,
              address: profile.address || undefined,
              municipality_approved: chefData?.kitchen_approved || undefined,
              onboarding_completed: true,
              created_at: profile.created_at
            };
            setUser(userProfile);
            setRole(userProfile.role);
          } else {
            const userProfile: UserProfile = {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role as UserRole,
              phone: profile.phone || undefined,
              address: profile.address || undefined,
              municipality_approved: undefined,
              onboarding_completed: undefined,
              created_at: profile.created_at
            };
            setUser(userProfile);
            setRole(userProfile.role);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [authUser]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const switchToRealAuth = () => {
    // This would navigate to auth page
    window.location.href = '/auth';
  };

  const contextValue: RoleContextType = {
    role,
    loading,
    user,
    isChef: role === 'chef',
    isKitchenPartner: role === 'kitchen_partner',
    isCustomer: role === 'customer',
    isRestaurant: role === 'restaurant',
    isAdmin: role === 'admin',
    usingMockData: false,
    switchRole,
    switchToRealAuth
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}