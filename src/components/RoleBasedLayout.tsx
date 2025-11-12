import React, { ReactNode } from 'react';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import LiveChat from './LiveChat';
import Header from './Header';

interface RoleBasedLayoutProps {
  children: ReactNode;
}

export const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
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
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      
      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  );
};