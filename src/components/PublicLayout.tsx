import { ReactNode } from 'react';
import LiveChat from './LiveChat';
import Header from './Header';

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden rounded-lg border border-border/30">
      <Header />
      <main className="p-2 md:p-4">
        {children}
      </main>
      
      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  );
};
