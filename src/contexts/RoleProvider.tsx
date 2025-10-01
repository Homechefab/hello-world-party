import { createContext, useContext, ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import type { UserRole } from '@/types/user';

interface RoleContextType {
  role: UserRole | null;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const roleData = useRole();

  return (
    <RoleContext.Provider value={roleData}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
}