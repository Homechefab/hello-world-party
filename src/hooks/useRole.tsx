import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserProfile } from '@/types/user';

export const useRole = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Check if user is an approved chef
        if (profile.role === 'chef') {
          const { data: chefData } = await supabase
            .from('chefs')
            .select('*')
            .eq('user_id', user.id)
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

  // Mock function to maintain compatibility - in real app this would switch user context
  const switchRole = (userId: string) => {
    console.log('Role switching not available with real auth');
  };

  return {
    user: currentUser,
    loading,
    switchRole,
    isChef: currentUser?.role === 'chef' && currentUser?.municipality_approved,
    isCustomer: currentUser?.role === 'customer' || !currentUser?.role,
    isKitchenPartner: currentUser?.role === 'kitchen_partner',
    isAdmin: currentUser?.role === 'admin'
  };
};