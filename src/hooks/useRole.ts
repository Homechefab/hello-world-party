import { useContext } from 'react';
import { RoleContext, RoleContextType } from '@/contexts/RoleContext';

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}