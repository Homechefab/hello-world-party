import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { isAdTrackingAllowed, subscribeAdTracking } from "@/lib/tracking";

const TIKTOK_PIXEL_ID = "7667539385084051476";
const TIKTOK_SCRIPT_ID = "homechef-tiktok-pixel";

type TikTokCall = [command: string, ...parameters: unknown[]];

type QueuedTikTokQueue = TikTokCall[] & {
  methods?: string[];
  setAndDefer?: (target: Record<string, unknown>, method: string) => void;
  load?: (id: string, options?: Record<string, unknown>) => void;
  page?: () => void;
  track?: (event: string, params?: Record<string, unknown>) => void;
  instance?: (id: string) => unknown;
  _i?: Record<string, unknown>;
  _t?: Record<string, number>;
  _o?: Record<string, unknown>;
};

declare global {
  interface Window {
    TiktokAnalyticsObject?: string;
    ttq?: QueuedTikTokQueue;
    __homechefTikTokInitialized?: boolean;
    __homechefTikTokLastPath?: string;
  }
}

const TTQ_METHODS = [
  "page", "track", "identify", "instances", "debug", "on", "off", "once", "ready",
  "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent",
];

const ensureTikTokPixel = (): void => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (!window.ttq) {
    const ttq = [] as QueuedTikTokQueue;
    window.TiktokAnalyticsObject = "ttq";
    window.ttq = ttq;

    ttq.methods = TTQ_METHODS;
    ttq.setAndDefer = (target: Record<string, unknown>, method: string) => {
      target[method] = (...args: unknown[]) => {
        ttq.push([method, ...args] as TikTokCall);
      };
    };
    TTQ_METHODS.forEach((method) =>
      ttq.setAndDefer?.(ttq as unknown as Record<string, unknown>, method),
    );

    ttq.load = (id: string, options?: Record<string, unknown>) => {
      const url = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[id] = [];
      (ttq._i[id] as { _u?: string })._u = url;
      ttq._t = ttq._t || {};
      ttq._t[id] = Date.now();
      ttq._o = ttq._o || {};
      ttq._o[id] = options || {};
    };
  }

  if (!document.getElementById(TIKTOK_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = TIKTOK_SCRIPT_ID;
    script.async = true;
    script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${TIKTOK_PIXEL_ID}&lib=ttq`;

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  }

  if (!window.__homechefTikTokInitialized) {
    window.ttq?.load?.(TIKTOK_PIXEL_ID);
    window.__homechefTikTokInitialized = true;
  }
};

const TikTokPixel = () => {
  const location = useLocation();
  const [allowed, setAllowed] = useState(isAdTrackingAllowed());

  useEffect(() => subscribeAdTracking(() => setAllowed(true)), []);

  useEffect(() => {
    if (!allowed) return;

    ensureTikTokPixel();

    const currentPath = `${location.pathname}${location.search}`;
    if (window.__homechefTikTokLastPath === currentPath) return;

    window.ttq?.page?.();
    window.__homechefTikTokLastPath = currentPath;
  }, [allowed, location.pathname, location.search]);

  return null;
};

export default TikTokPixel;
