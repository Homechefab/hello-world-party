import { createContext, useContext, ReactNode } from 'react';
import { useRole as useRoleHook, UserRole } from '@/hooks/useRole';

interface RoleContextType {
  role: UserRole;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const roleData = useRoleHook();

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