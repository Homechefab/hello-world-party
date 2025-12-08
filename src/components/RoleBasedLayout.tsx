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

  // Protect dashboard routes - require authentication and correct role with approval
  React.useEffect(() => {
    if (loading || !location.pathname) return;

    // Routes that require authentication
    const requiresAuth = [
      '/profile', 
      '/settings', 
      '/my-orders', 
      '/my-points',
      '/dashboard',
      '/chef/dashboard',
      '/admin/dashboard',
      '/kitchen-partner/dashboard',
      '/restaurant/dashboard'
    ].some(path => location.pathname.startsWith(path));

    if (requiresAuth && !authUser) {
      navigate('/auth');
      return;
    }

    // Dashboard-specific protection: require correct role AND approval
    const dashboardConfig: Record<string, { path: string; requiredRole: string; pendingPage: string }> = {
      chef: { path: '/chef/dashboard', requiredRole: 'chef', pendingPage: '/chef/application-pending' },
      admin: { path: '/admin/dashboard', requiredRole: 'admin', pendingPage: '/' },
      kitchen_partner: { path: '/kitchen-partner/dashboard', requiredRole: 'kitchen_partner', pendingPage: '/kitchen-partner/application-pending' },
      restaurant: { path: '/restaurant/dashboard', requiredRole: 'restaurant', pendingPage: '/restaurant/application-pending' }
    };

    // Check each dashboard
    for (const [, config] of Object.entries(dashboardConfig)) {
      if (location.pathname.startsWith(config.path)) {
        // Must have correct role
        if (role !== config.requiredRole) {
          navigate('/auth');
          return;
        }
        
        // Must be approved (except admin which is always approved)
        if (config.requiredRole !== 'admin' && !isApproved) {
          navigate(config.pendingPage);
          return;
        }
      }
    }
  }, [authUser, role, loading, location.pathname, navigate, isApproved]);

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