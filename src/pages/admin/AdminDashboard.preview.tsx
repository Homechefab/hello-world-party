import { AdminDashboard } from './AdminDashboard';
import { AuthContext } from '@/contexts/AuthContext';
import { RoleContext } from '@/contexts/RoleContext';
import { BrowserRouter } from 'react-router-dom';
import { UserRole } from '@/types/user';

export default {
  title: 'Pages/Admin/Dashboard',
  component: AdminDashboard,
  parameters: {
    layout: 'fullscreen',
  },
};

const AdminWrapper = () => {
  const mockAuthContext = {
    user: { email: 'admin@example.com', id: 'admin-id' },
    signOut: () => Promise.resolve(),
  };

  const mockRoleContext = {
    user: {
      id: 'admin-id',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin' as UserRole,
      roles: ['admin' as UserRole],
      created_at: new Date().toISOString(),
    },
    role: 'admin' as UserRole,
    roles: ['admin' as UserRole],
    isChef: false,
    isAdmin: true,
    isKitchenPartner: false,
    isRestaurant: false,
    isCustomer: false,
    loading: false,
    usingMockData: true,
    logout: () => Promise.resolve(),
    switchRole: () => {},
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        <RoleContext.Provider value={mockRoleContext}>
          <AdminDashboard />
        </RoleContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export const Default = () => <AdminWrapper />;