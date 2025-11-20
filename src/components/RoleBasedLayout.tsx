import React, { ReactNode } from 'react';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import LiveChat from './LiveChat';
import Header from './Header';
import useAutoSafeArea from '@/hooks/useAutoSafeArea';

interface RoleBasedLayoutProps {
  children: ReactNode;
}

export const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
  useAutoSafeArea();
  const { role, loading } = useRole();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Protect all role-specific routes
  React.useEffect(() => {
    if (loading || !location.pathname) return;

    // Require authentication for protected routes
    const requiresAuth = ['/profile', '/settings', '/my-orders', '/my-points'].some(
      path => location.pathname.startsWith(path)
    );

    if (requiresAuth && !authUser) {
      navigate('/auth');
      return;
    }

    // Role-specific route protection
    const roleRoutes = {
      chef: ['/chef'],
      admin: ['/admin'],
      kitchen_partner: ['/kitchen-partner'],
      restaurant: ['/restaurant']
    };

    Object.entries(roleRoutes).forEach(([requiredRole, paths]) => {
      const isProtectedPath = paths.some(path => location.pathname.startsWith(path));
      if (isProtectedPath) {
        if (!role) {
          navigate('/auth');
          return;
        }
        
        if (role !== requiredRole) {
          navigate('/');
          return;
        }
      }
    });
  }, [authUser, role, loading, location.pathname, navigate]);

  // Redirect to the correct dashboard when role changes to avoid race conditions
  React.useEffect(() => {
    if (loading) return;

    const targets: Record<string, { base: string; target: string }> = {
      admin: { base: '/admin', target: '/admin/dashboard' },
      chef: { base: '/chef', target: '/chef/dashboard' },
      kitchen_partner: { base: '/kitchen-partner', target: '/kitchen-partner/dashboard' },
      restaurant: { base: '/restaurant', target: '/restaurant/dashboard' },
      customer: { base: '/', target: '/' },
    };

    if (!role) {
      const protectedBases = ['/chef', '/admin', '/kitchen-partner', '/restaurant'];
      if (protectedBases.some((b) => location.pathname.startsWith(b))) {
        navigate('/');
      }
      return;
    }

    const config = targets[role];
    if (config && !location.pathname.startsWith(config.base)) {
      navigate(config.target);
    }
  }, [role, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </main>
      
      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  );
};