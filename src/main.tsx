import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { RoleProvider } from '@/contexts/RoleContext'
import { BrowserRouter } from 'react-router-dom'



const rootElement = document.getElementById("root");


if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  
} else {
  console.error('main.tsx: Root element not found!');
}
