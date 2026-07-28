import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

export type SocialProvider = 'google' | 'facebook' | 'apple';

export const NATIVE_AUTH_CALLBACK_URL = 'se.homechef.nu://auth/callback';

export const isNativeAuthFlow = () => Capacitor.isNativePlatform();

export async function signInWithSocial(provider: SocialProvider) {
  const isGoogle = provider === 'google';

  // Behåll ev. sparad returväg (t.ex. OAuth-consent) genom social inloggning.
  const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('post_auth_return') : null;
  const returnPath = stored && stored.startsWith('/') && !stored.startsWith('//') ? stored : '/';

  const options: {
    redirectTo: string;
    skipBrowserRedirect?: boolean;
    queryParams?: Record<string, string>;
  } = {
    redirectTo: isNativeAuthFlow() ? NATIVE_AUTH_CALLBACK_URL : `${window.location.origin}${returnPath}`,
  };

  if (isNativeAuthFlow()) {
    options.skipBrowserRedirect = true;
  }

  if (isGoogle) {
    options.queryParams = {
      access_type: 'offline',
      prompt: 'consent',
    };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options,
  });

  if (error) {
    throw error;
  }

  if (!data?.url) {
    throw new Error('Inget svar från autentiseringstjänsten');
  }

  if (isNativeAuthFlow()) {
    await Browser.open({ url: data.url });
    return;
  }

  window.location.href = data.url;
}
