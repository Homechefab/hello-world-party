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
    setTimeout(() => {
      // For demo purposes, randomly assign a role
      const users = Object.values(mockUsers);
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setCurrentUser(randomUser);
      setLoading(false);
    }, 1000);
  }, []);

  const switchRole = (userId: string) => {
    setCurrentUser(mockUsers[userId] || null);
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