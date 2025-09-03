import React, { ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import LiveChat from '@/components/LiveChat';
import Header from '@/components/Header';

interface RoleBasedLayoutProps {
  children: ReactNode;
}

export const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
  const { user, loading } = useRole();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('RoleBasedLayout: Current user:', user, 'Loading:', loading);

  // Protect chef dashboard route
  React.useEffect(() => {
    if (!loading && location.pathname === '/chef/dashboard') {
      if (!authUser) {
        // Not authenticated, redirect to login
        navigate('/auth');
        return;
      }
      
      if (!user || user.role !== 'chef' || !user.municipality_approved) {
        // Not an approved chef, redirect to application
        navigate('/chef/application');
        return;
      }
    }
  }, [authUser, user, loading, location.pathname, navigate]);

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