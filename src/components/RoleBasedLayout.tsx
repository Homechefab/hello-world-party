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
  const { role, loading, isApproved } = useRole();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Protect all role-specific routes
  React.useEffect(() => {
    if (loading || !location.pathname) return;

    // Require authentication for protected routes (including role-specific dashboards)
    const requiresAuth = [
      '/profile', 
      '/settings', 
      '/my-orders', 
      '/my-points',
      '/chef/dashboard',
      '/admin/dashboard',
      '/kitchen-partner/dashboard',
      '/restaurant/dashboard'
    ].some(path => location.pathname.startsWith(path));

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

  // Redirect to the correct dashboard or pending page based on approval status
  React.useEffect(() => {
    if (loading) return;

    // Define pending pages that don't require approval
    const pendingPages = [
      '/chef/application-pending',
      '/kitchen-partner/application-pending',
      '/restaurant/application-pending'
    ];
    
    // Don't redirect if already on a pending page
    if (pendingPages.some(page => location.pathname === page)) {
      return;
    }

    if (!role) {
      const protectedBases = ['/chef', '/admin', '/kitchen-partner', '/restaurant'];
      if (protectedBases.some((b) => location.pathname.startsWith(b))) {
        navigate('/');
      }
      return;
    }

    // Check approval for role-specific dashboards
    const dashboardPaths: Record<string, { dashboard: string; pending: string }> = {
      chef: { dashboard: '/chef/dashboard', pending: '/chef/application-pending' },
      kitchen_partner: { dashboard: '/kitchen-partner/dashboard', pending: '/kitchen-partner/application-pending' },
      restaurant: { dashboard: '/restaurant/dashboard', pending: '/restaurant/application-pending' }
    };

    const roleConfig = dashboardPaths[role];
    
    // If user is trying to access a dashboard but is not approved, redirect to pending
    if (roleConfig && location.pathname.startsWith(roleConfig.dashboard) && !isApproved) {
      navigate(roleConfig.pending);
      return;
    }

    // Redirect to appropriate area based on role
    const targets: Record<string, { base: string; target: string }> = {
      admin: { base: '/admin', target: '/admin/dashboard' },
      chef: { base: '/chef', target: isApproved ? '/chef/dashboard' : '/chef/application-pending' },
      kitchen_partner: { base: '/kitchen-partner', target: isApproved ? '/kitchen-partner/dashboard' : '/kitchen-partner/application-pending' },
      restaurant: { base: '/restaurant', target: isApproved ? '/restaurant/dashboard' : '/restaurant/application-pending' },
      customer: { base: '/', target: '/' },
    };

    const config = targets[role];
    if (config && !location.pathname.startsWith(config.base)) {
      navigate(config.target);
    }
  }, [role, loading, location.pathname, navigate, isApproved]);

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