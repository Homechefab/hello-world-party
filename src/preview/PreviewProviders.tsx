import { ReactNode } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext.tsx';
import { RoleContext, RoleContextType } from '@/contexts/RoleContext';
import { UserProfile, UserRole } from '@/types/user';

interface PreviewProvidersProps {
  children: ReactNode;
  mockRole?: UserRole | null;
}

const createMockUser = (role: UserRole | null): UserProfile | null => {
  if (!role) return null;
  return {
    id: 'preview-user-id',
    email: 'preview@example.com',
    full_name: 'Preview User',
    role,
    created_at: new Date().toISOString(),
  };
};

export const PreviewProviders = ({ children, mockRole = 'customer' }: PreviewProvidersProps) => {
  const mockAuth: AuthContextType = {
    user: mockRole ? { email: 'preview@example.com', id: 'preview-user-id' } : null,
    signOut: async () => {}
  };

  const profile = createMockUser(mockRole);

  const mockRoleContext: RoleContextType = {
    role: mockRole ?? null,
    roles: mockRole ? [mockRole] : [],
    loading: false,
    user: profile,
    isChef: mockRole === 'chef',
    isKitchenPartner: mockRole === 'kitchen_partner',
    isCustomer: mockRole === 'customer' || mockRole === null,
    isRestaurant: mockRole === 'restaurant',
    isAdmin: mockRole === 'admin',
    usingMockData: true,
    logout: async () => {}
  };

  return (
    <AuthContext.Provider value={mockAuth}>
      <RoleContext.Provider value={mockRoleContext}>
        {children}
      </RoleContext.Provider>
    </AuthContext.Provider>
  );
};

export default PreviewProviders;
