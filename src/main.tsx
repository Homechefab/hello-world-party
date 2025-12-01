import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { RoleProvider } from '@/contexts/RoleContext'
import { BrowserRouter } from 'react-router-dom'

console.log('main.tsx: Starting to render app');

const rootElement = document.getElementById("root");
console.log('main.tsx: Root element found:', rootElement);

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
  console.log('main.tsx: App rendered successfully');
} else {
  console.error('main.tsx: Root element not found!');
}
