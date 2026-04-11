import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuthContextType {
  user: {
    email: string;
    id?: string;
  } | null;
  signOut: () => Promise<void>;
  isReady: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const mapSessionUser = (session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']) => {
  return session?.user ? { email: session.user.email ?? '', id: session.user.id } : null;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isReady, setIsReady] = useState(false);
  const readyRef = useRef(false);

  const markReady = (session: Parameters<typeof mapSessionUser>[0]) => {
    if (readyRef.current) return;
    readyRef.current = true;
    setUser(mapSessionUser(session));
    setIsReady(true);
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      // Always update user on auth changes (login/logout)
      setUser(mapSessionUser(session));
      if (!readyRef.current) {
        readyRef.current = true;
        setIsReady(true);
      }

      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(() => {
          void supabase.rpc('log_user_login', {
            p_user_agent: navigator.userAgent,
          }).then(({ error }) => {
            if (error) console.error('Failed to log login:', error);
          });
        }, 0);
      }
    });

    // Fallback if onAuthStateChange doesn't fire quickly
    const timeout = setTimeout(() => {
      if (isMounted && !readyRef.current) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (isMounted && !readyRef.current) {
            markReady(session);
          }
        });
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsReady(true);
  };

  return (
    <AuthContext.Provider value={{ user, signOut, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}
