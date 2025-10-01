import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/contexts/CartContext'
import { RoleProvider } from '@/hooks/useRole'
import { ErrorBoundary } from '@/components/ErrorBoundary'
const LazyApp = lazy(() => import('./App.tsx'))



createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AuthProvider>
      <RoleProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </RoleProvider>
    </AuthProvider>
  </ErrorBoundary>
);
