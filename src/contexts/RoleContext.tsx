import { createContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface RoleContextType {
  role: UserRole | null;
  loading: boolean;
  user: UserProfile | null;
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

            const userProfile = {
              ...profile,
              role: profile.role as UserRole,
              municipality_approved: chefData?.kitchen_approved || false,
              onboarding_completed: true
            };
            setUser(userProfile);
            setRole(userProfile.role);
          } else {
            const userProfile = {
              ...profile,
              role: profile.role as UserRole
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

  return (
    <RoleContext.Provider value={{ role, loading, user }}>
      {children}
    </RoleContext.Provider>
  );
}