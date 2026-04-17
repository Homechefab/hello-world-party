import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuthContextType {
  user: {
    email: string;
    id?: string;
    emailConfirmed: boolean;
  } | null;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<{ error: Error | null }>;
  isReady: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const mapSessionUser = (
  session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']
) => {
  if (!session?.user) return null;
  return {
    email: session.user.email ?? '',
    id: session.user.id,
    emailConfirmed: Boolean(session.user.email_confirmed_at ?? session.user.confirmed_at),
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isReady, setIsReady] = useState(false);
  const readyRef = useRef(false);
  const wasUnverifiedRef = useRef(false);

  const markReady = (session: Parameters<typeof mapSessionUser>[0]) => {
    if (readyRef.current) return;
    readyRef.current = true;
    const mapped = mapSessionUser(session);
    setUser(mapped);
    wasUnverifiedRef.current = mapped ? !mapped.emailConfirmed : false;
    setIsReady(true);
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      const mapped = mapSessionUser(session);
      setUser(mapped);

      if (!readyRef.current) {
        readyRef.current = true;
        setIsReady(true);
      }

      // Detect verification: was unverified, now verified
      if (mapped?.emailConfirmed && wasUnverifiedRef.current) {
        wasUnverifiedRef.current = false;
        toast.success('E-post verifierad!', {
          description: 'Tack! Du har nu full åtkomst till alla funktioner.',
        });
      } else if (mapped) {
        wasUnverifiedRef.current = !mapped.emailConfirmed;
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

  const resendVerificationEmail = async () => {
    if (!user?.email) {
      return { error: new Error('Ingen e-postadress hittades') };
    }
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  return (
    <AuthContext.Provider value={{ user, signOut, resendVerificationEmail, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}
