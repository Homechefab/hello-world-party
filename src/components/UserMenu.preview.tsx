import UserMenu from './UserMenu';
import { RoleContext, RoleContextType } from '../contexts/RoleContext';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';
import { UserRole } from '../types/user';
import { ReactNode } from 'react';

interface PreviewWrapperProps {
  children: ReactNode;
  mockRole: UserRole | null;
}

// Mock providers for preview
const PreviewWrapper = ({ children, mockRole }: PreviewWrapperProps) => {
  const mockAuthContext: AuthContextType = {
    user: mockRole ? { email: 'test@example.com', id: 'test-id' } : null,
    signOut: () => Promise.resolve(),
  };

  const mockRoleContext: RoleContextType = {
    user: mockRole ? { 
      id: 'test-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: mockRole,
      roles: mockRole ? [mockRole] : [],
      created_at: new Date().toISOString(),
    } : null,
    role: mockRole,
    roles: mockRole ? [mockRole] : [],
    isChef: mockRole === 'chef',
    isAdmin: mockRole === 'admin',
    isKitchenPartner: mockRole === 'kitchen_partner',
    isRestaurant: mockRole === 'restaurant',
    isCustomer: mockRole === 'customer',
    loading: false,
    usingMockData: false,
    logout: () => Promise.resolve(),
    switchRole: () => {},
  };

  return (
    <AuthContext.Provider value={mockAuthContext}>
      <RoleContext.Provider value={mockRoleContext}>
        <div className="p-4">
          <div className="flex justify-end">
            {children}
          </div>
        </div>
      </RoleContext.Provider>
    </AuthContext.Provider>
  );
};

export default {
  title: 'Navigation/UserMenu',
  component: UserMenu,
  parameters: {
    layout: 'fullscreen',
  },
};

export const AdminMenu = () => (
  <PreviewWrapper mockRole="admin">
    <UserMenu />
  </PreviewWrapper>
);

export const ChefMenu = () => (
  <PreviewWrapper mockRole="chef">
    <UserMenu />
  </PreviewWrapper>
);

export const KitchenPartnerMenu = () => (
  <PreviewWrapper mockRole="kitchen_partner">
    <UserMenu />
  </PreviewWrapper>
);

export const RestaurantMenu = () => (
  <PreviewWrapper mockRole="restaurant">
    <UserMenu />
  </PreviewWrapper>
);

export const CustomerMenu = () => (
  <PreviewWrapper mockRole="customer">
    <UserMenu />
  </PreviewWrapper>
);

export const SignedOut = () => (
  <PreviewWrapper mockRole={null}>
    <UserMenu />
  </PreviewWrapper>
);