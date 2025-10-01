import { useContext } from 'react';
import { RoleContext } from '@/contexts/RoleContext';
import type { UserProfile, UserRole } from '@/types/user';

interface RoleContextType {
  role: UserRole | null;
  loading: boolean;
  user: UserProfile | null;
}

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}