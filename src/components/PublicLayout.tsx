import { ReactNode } from 'react';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import LiveChat from './LiveChat';
import Header from './Header';
import useAutoSafeArea from '@/hooks/useAutoSafeArea';
import { FloatingCartBanner } from './FloatingCartBanner';
import { EmailVerificationBanner } from './EmailVerificationBanner';

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  useAutoSafeArea();
  useVisitorTracking();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <EmailVerificationBanner />
      <Header />
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto pb-20">
        {children}
      </main>

      {/* Floating cart banner for mobile */}
      <FloatingCartBanner />

      {/* Live Chat Widget with Voice Assistant */}
      <LiveChat />
    </div>
  );
};
