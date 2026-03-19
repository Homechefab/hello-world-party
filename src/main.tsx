import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { RoleProvider } from '@/contexts/RoleContext'
import { BrowserRouter } from 'react-router-dom'



// iOS sticky-zoom / viewport reset on input blur
if (typeof window !== 'undefined') {
  const resetViewport = () => {
    // Reset visual viewport after input interaction
    window.scrollTo({ top: window.scrollY, left: 0, behavior: 'instant' as ScrollBehavior });
    // Force viewport scale reset on iOS
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      const content = viewportMeta.getAttribute('content') || '';
      viewportMeta.setAttribute('content', content + ', ');
      requestAnimationFrame(() => viewportMeta.setAttribute('content', content));
    }
  };

  document.addEventListener('focusout', (e) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
      setTimeout(resetViewport, 100);
    }
  });
}

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
