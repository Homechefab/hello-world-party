import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { RoleProvider } from '@/contexts/RoleContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RoleProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </RoleProvider>
  </AuthProvider>
);
