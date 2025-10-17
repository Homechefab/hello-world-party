import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import { CartProvider } from '@/contexts/CartContext.tsx'
import { RoleProvider } from '@/contexts/RoleContext.tsx'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RoleProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </RoleProvider>
  </AuthProvider>
);
