import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
};

// Parse user agent for device and browser info
const parseUserAgent = (ua: string) => {
  let deviceType = 'desktop';
  let browser = 'unknown';

  // Device detection
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    deviceType = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile';
  }

  // Browser detection
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browser = 'Chrome';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
  } else if (ua.includes('Opera') || ua.includes('OPR')) {
    browser = 'Opera';
  }

  return { deviceType, browser };
};

export function useVisitorTracking() {
  const location = useLocation();
  const { user } = useAuth();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const trackVisit = async () => {
      // Don't track the same page twice in quick succession
      if (lastTrackedPath.current === location.pathname) {
        return;
      }
      lastTrackedPath.current = location.pathname;

      const userAgent = navigator.userAgent;
      const { deviceType, browser } = parseUserAgent(userAgent);
      const sessionId = getSessionId();

      try {
        await supabase.from('visitors').insert({
          page_path: location.pathname,
          user_agent: userAgent,
          referrer: document.referrer || null,
          user_id: user?.id || null,
          session_id: sessionId,
          device_type: deviceType,
          browser: browser,
        });
      } catch (error) {
        // Silent fail - don't interrupt user experience
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, [location.pathname, user?.id]);
}
