import { ReactNode } from 'react';
import LiveChat from './LiveChat';
import Header from './Header';
import useAutoSafeArea from '@/hooks/useAutoSafeArea';

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  useAutoSafeArea();
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden rounded-lg border border-border/30">
      <Header />
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </main>
      
      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  );
};
