import { RoleBasedLayout } from './RoleBasedLayout';
import { RoleContext, RoleContextType } from '../contexts/RoleContext';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';
import { UserRole } from '../types/user';
import { BrowserRouter } from 'react-router-dom';

interface PreviewWrapperProps {
  children: React.ReactNode;
  mockRole: UserRole | null;
  isAuthenticated?: boolean;
  currentPath?: string;
}

const PreviewWrapper = ({ 
  children, 
  mockRole, 
  isAuthenticated = true,
  currentPath = '/'
}: PreviewWrapperProps) => {
  const mockAuthContext: AuthContextType = {
    user: isAuthenticated ? { email: 'test@example.com', id: 'test-id' } : null,
    signOut: () => Promise.resolve(),
  };

  const mockRoleContext: RoleContextType = {
    user: mockRole ? { 
      id: 'test-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: mockRole,
      roles: mockRole ? [mockRole] as any : [],
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
  };

  // Mock window.location
  Object.defineProperty(window, 'location', {
    value: {
      pathname: currentPath
    },
    writable: true
  });

  return (
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        <RoleContext.Provider value={mockRoleContext}>
          {children}
        </RoleContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default {
  title: 'Layout/RoleBasedLayout',
  component: RoleBasedLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

const DemoContent = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Demo Content</h1>
    <p>This content is protected by role-based access control.</p>
  </div>
);

export const AdminDashboard = () => (
  <PreviewWrapper mockRole="admin" currentPath="/admin/dashboard">
    <RoleBasedLayout>
      <DemoContent />
    </RoleBasedLayout>
  </PreviewWrapper>
);

export const ChefDashboard = () => (
  <PreviewWrapper mockRole="chef" currentPath="/chef/dashboard">
    <RoleBasedLayout>
      <DemoContent />
    </RoleBasedLayout>
  </PreviewWrapper>
);

export const UnauthorizedAccess = () => (
  <PreviewWrapper mockRole="customer" currentPath="/admin/dashboard">
    <RoleBasedLayout>
      <DemoContent />
    </RoleBasedLayout>
  </PreviewWrapper>
);

export const UnauthenticatedAccess = () => (
  <PreviewWrapper mockRole={null} isAuthenticated={false} currentPath="/profile">
    <RoleBasedLayout>
      <DemoContent />
    </RoleBasedLayout>
  </PreviewWrapper>
);