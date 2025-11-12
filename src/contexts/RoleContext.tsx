import { createContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile } from '../types/user';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';

export interface RoleContextType {
  // Primary role (highest priority)
  role: UserRole | null;
  // All roles the user has
  roles: UserRole[];
  loading: boolean;
  user: UserProfile | null;
  isChef: boolean;
  isKitchenPartner: boolean;
  isCustomer: boolean;
  isRestaurant: boolean;
  isAdmin: boolean;
  usingMockData: boolean;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
}

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (!authUser?.id) {
        setRole(null);
        setRoles([]);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Load profile info
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        }

        // Load all roles for this user
        const { data: roleRows, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authUser.id);

        if (rolesError) {
          console.error('Roles fetch error:', rolesError);
        }

        const fetchedRoles = (roleRows?.map(r => r.role) || []) as UserRole[];
        // Fallback to profile.role if roles table empty (legacy)
        const combinedRoles: UserRole[] = fetchedRoles.length
          ? fetchedRoles
          : (profile?.role ? [profile.role as UserRole] : ['customer']);

        // Determine primary role by priority
        const priority: UserRole[] = ['admin', 'chef', 'kitchen_partner', 'restaurant', 'customer'];
        const primary = priority.find(r => combinedRoles.includes(r)) ?? 'customer';

        // If user has chef role, fetch chef-specific data
        let chefApproved: boolean | undefined;
        if (combinedRoles.includes('chef')) {
          const { data: chefData } = await supabase
            .from('chefs')
            .select('kitchen_approved')
            .eq('user_id', authUser.id)
            .maybeSingle();
          chefApproved = chefData?.kitchen_approved ?? undefined;
        }

        if (profile) {
          const userProfile: UserProfile = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: primary as UserRole,
            roles: combinedRoles,
            phone: profile.phone || undefined,
            address: profile.address || undefined,
            municipality_approved: chefApproved,
            onboarding_completed: profile.onboarding_completed || undefined,
            created_at: profile.created_at
          };
          setUser(userProfile);
          setRole(userProfile.role);
          setRoles(combinedRoles);
        } else {
          // No profile yet - create minimal user object
          const userProfile: UserProfile = {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.email?.split('@')[0] || 'Användare',
            role: primary as UserRole,
            roles: combinedRoles,
            created_at: new Date().toISOString()
          };
          setUser(userProfile);
          setRole(primary as UserRole);
          setRoles(combinedRoles);
        }
      } catch (error) {
        console.error('Error loading user profile/roles:', error);
        // Set default customer role on error
        const defaultProfile: UserProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: 'Användare',
          role: 'customer',
          roles: ['customer'],
          created_at: new Date().toISOString()
        };
        setUser(defaultProfile);
        setRole('customer');
        setRoles(['customer']);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [authUser]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setRole(null);
      setRoles([]);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const switchRole = (newRole: UserRole) => {
    console.log('switchRole called with:', newRole, 'current roles:', roles);
    // Allow switching even if role is not persisted (preview/demo convenience)
    if (!roles.includes(newRole)) {
      setRoles(prev => [...prev, newRole]);
    }
    setRole(newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const contextValue: RoleContextType = {
    role,
    roles,
    loading,
    user,
    isChef: role === 'chef',
    isKitchenPartner: role === 'kitchen_partner',
    isCustomer: role === 'customer' || !role,
    isRestaurant: role === 'restaurant',
    isAdmin: role === 'admin',
    usingMockData: false,
    logout,
    switchRole
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}