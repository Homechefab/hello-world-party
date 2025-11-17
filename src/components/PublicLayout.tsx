import { ReactNode } from 'react';
import LiveChat from './LiveChat';
import Header from './Header';

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      {children}
      
      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  );
};
