import { useEffect } from 'react';
import { App as CapacitorApp, type URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { NATIVE_AUTH_CALLBACK_URL } from '@/lib/socialAuth';

const CALLBACK_PREFIX = `${NATIVE_AUTH_CALLBACK_URL.split('://')[0]}://auth`;

const parseCallbackUrl = (url: string) => {
  const parsedUrl = new URL(url);
  const hash = parsedUrl.hash.startsWith('#') ? parsedUrl.hash.slice(1) : parsedUrl.hash;

  return {
    parsedUrl,
    hashParams: new URLSearchParams(hash),
  };
};

export default function AuthRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let listener: { remove: () => Promise<void> } | undefined;
    let isHandling = false;

    const handleAuthCallback = async ({ url }: URLOpenListenerEvent | { url: string }) => {
      if (!url.startsWith(CALLBACK_PREFIX) || isHandling) {
        return;
      }

      isHandling = true;

      try {
        const { parsedUrl, hashParams } = parseCallbackUrl(url);
        const errorMessage = parsedUrl.searchParams.get('error_description') || hashParams.get('error_description');
        const authCode = parsedUrl.searchParams.get('code');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (errorMessage) {
          throw new Error(errorMessage);
        }

        if (authCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(authCode);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else {
          throw new Error('Ingen giltig inloggningssession returnerades');
        }

        await Browser.close().catch(() => undefined);
        navigate('/');
      } catch (error) {
        console.error('Native auth callback failed:', error);
        await Browser.close().catch(() => undefined);
        navigate('/auth');
      } finally {
        isHandling = false;
      }
    };

    const setupListener = async () => {
      listener = await CapacitorApp.addListener('appUrlOpen', handleAuthCallback);

      const launchUrl = await CapacitorApp.getLaunchUrl();
      if (launchUrl?.url) {
        await handleAuthCallback({ url: launchUrl.url });
      }
    };

    void setupListener();

    return () => {
      void listener?.remove();
    };
  }, [navigate]);

  return null;
}
