import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/contexts/CartContext'
import { RoleProvider } from '@/hooks/useRole'
import { ErrorBoundary } from '@/components/ErrorBoundary'


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
