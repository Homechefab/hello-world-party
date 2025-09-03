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
  const { user, loading, usingMockData } = useRole();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('RoleBasedLayout: Current user:', user, 'Loading:', loading);

  // Only protect chef dashboard if using real auth
  React.useEffect(() => {
    if (!loading && !usingMockData && location.pathname === '/chef/dashboard') {
      if (!authUser) {
        navigate('/auth');
        return;
      }
      
      if (!user || user.role !== 'chef' || !user.municipality_approved) {
        navigate('/chef/application');
        return;
      }
    }
  }, [authUser, user, loading, location.pathname, navigate, usingMockData]);

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