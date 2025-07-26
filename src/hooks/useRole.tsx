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
    // Simulate loading user data
    console.log('useRole: Starting to load user data...');
    setTimeout(() => {
      // For demo purposes, start with customer role
      const defaultUser = mockUsers['customer1'];
      console.log('useRole: Setting default user:', defaultUser);
      setCurrentUser(defaultUser);
      setLoading(false);
    }, 100); // Reduced loading time
  }, []);

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