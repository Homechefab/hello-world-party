import { createContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuthContextType {
  user: {
    email: string;
    id?: string;
  } | null;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ? { email: session.user.email ?? '', id: session.user.id } : null;
      setUser(u);
      
      // Log sign in events
      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(() => {
          supabase.from('login_logs').insert({
            user_id: session.user.id,
            email: session.user.email ?? '',
            user_agent: navigator.userAgent
          }).then(({ error }) => {
            if (error) console.error('Failed to log login:', error);
          });
        }, 0);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ? { email: session.user.email ?? '', id: session.user.id } : null;
      setUser(u);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
