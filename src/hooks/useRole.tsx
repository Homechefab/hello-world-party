import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserProfile } from '@/types/user';

// Mock user data for testing - can be used alongside real auth
const mockUsers: Record<string, UserProfile> = {
  'chef1': {
    id: 'chef1',
    email: 'chef@example.com',
    full_name: 'Anna Kök',
    role: 'chef',
    municipality_approved: true,
    onboarding_completed: true,
    created_at: new Date().toISOString()
  },
  'customer1': {
    id: 'customer1',
    email: 'customer@example.com',
    full_name: 'Lars Kund',
    role: 'customer',
    created_at: new Date().toISOString()
  },
  'kitchen_partner1': {
    id: 'kitchen_partner1',
    email: 'partner@example.com',
    full_name: 'Maria Restaurang',
    role: 'kitchen_partner',
    created_at: new Date().toISOString()
  },
  'admin1': {
    id: 'admin1',
    email: 'admin@example.com',
    full_name: 'Erik Admin',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  'restaurant1': {
    id: 'restaurant1',
    email: 'restaurant@example.com',
    full_name: 'Sofia Restaurang',
    role: 'restaurant',
    created_at: new Date().toISOString()
  }
};

export const useRole = () => {
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(true);

  useEffect(() => {
    if (authUser && !usingMockData) {
      loadUserProfile();
    } else {
      // Use mock data system
      const savedRole = localStorage.getItem('selectedRole') || 'customer1';
      const savedUser = mockUsers[savedRole];
      if (savedUser) {
        setCurrentUser(savedUser);
      } else {
        setCurrentUser(mockUsers['customer1']);
      }
      setLoading(false);
    }
  }, [authUser, usingMockData]);

  const loadUserProfile = async () => {
    if (!authUser) return;

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

          setCurrentUser({
            ...profile,
            role: profile.role as UserRole,
            municipality_approved: chefData?.kitchen_approved || false,
            onboarding_completed: true
          });
        } else {
          setCurrentUser({
            ...profile,
            role: profile.role as UserRole
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (userId: string) => {
    const newUser = mockUsers[userId];
    if (newUser) {
      setCurrentUser(newUser);
      localStorage.setItem('selectedRole', userId);
      setUsingMockData(true);
      console.log('useRole: Successfully switched to:', newUser.role, newUser.full_name);
    }
  };

  const switchToRealAuth = () => {
    setUsingMockData(false);
    if (authUser) {
      loadUserProfile();
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  };

  return {
    user: currentUser,
    loading,
    switchRole,
    switchToRealAuth,
    usingMockData,
    authUser,
    isChef: currentUser?.role === 'chef',
    isCustomer: currentUser?.role === 'customer',
    isKitchenPartner: currentUser?.role === 'kitchen_partner',
    isAdmin: currentUser?.role === 'admin',
    isRestaurant: currentUser?.role === 'restaurant'
  };
};