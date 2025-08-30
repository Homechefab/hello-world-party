import { useState, useEffect } from 'react';
import { UserRole, UserProfile } from '@/types/user';

// Mock user data - replace with real Supabase integration
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
  }
};

export const useRole = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current route to determine initial role
    const currentPath = window.location.pathname;
    console.log('useRole: Current path:', currentPath);
    
    let defaultUserId = 'customer1'; // Default fallback
    
    if (currentPath.startsWith('/admin')) {
      defaultUserId = 'admin1';
    } else if (currentPath.startsWith('/chef')) {
      defaultUserId = 'chef1';
    } else if (currentPath.startsWith('/kitchen-partner')) {
      defaultUserId = 'kitchen_partner1';
    }
    
    console.log('useRole: Setting user based on route:', defaultUserId);
    const defaultUser = mockUsers[defaultUserId];
    console.log('useRole: Setting default user:', defaultUser);
    setCurrentUser(defaultUser);
    setLoading(false);
  }, [window.location.pathname]); // Add dependency to re-run when route changes

  const switchRole = (userId: string) => {
    console.log('useRole: Switching to role:', userId, mockUsers[userId]);
    const newUser = mockUsers[userId];
    if (newUser) {
      setCurrentUser(newUser);
      console.log('useRole: Successfully switched to:', newUser.role, newUser.full_name);
    }
  };

  return {
    user: currentUser,
    loading,
    switchRole,
    isChef: currentUser?.role === 'chef',
    isCustomer: currentUser?.role === 'customer',
    isKitchenPartner: currentUser?.role === 'kitchen_partner',
    isAdmin: currentUser?.role === 'admin'
  };
};