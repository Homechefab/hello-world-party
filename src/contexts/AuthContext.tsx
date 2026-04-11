import { createContext, ReactNode, useEffect, useState } from 'react';
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

  useEffect(() => {
    let isMounted = true;
    let sessionResolved = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!sessionResolved && event === 'INITIAL_SESSION') {
        return;
      }

      if (!isMounted) {
        return;
      }

      setUser(mapSessionUser(session));
      setIsReady(true);

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

    void supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) {
          return;
        }

        sessionResolved = true;
        setUser(mapSessionUser(session));
        setIsReady(true);
      })
      .catch((error) => {
        console.error('Failed to restore auth session:', error);
        if (isMounted) {
          sessionResolved = true;
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
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
