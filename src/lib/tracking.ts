const META_PIXEL_ID = "1249461430276628";
const TIKTOK_PIXEL_ID = "7667539385084051476";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
    ttq?: {
      load: (id: string) => void;
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
    };
    TiktokAnalyticsObject?: string;
  }
}

let loaded = false;

function loadMetaPixel() {
  if (window.fbq) return;
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");
}

function loadTikTokPixel() {
  if (window.ttq) return;
  /* eslint-disable */
  (function (w: any, d: Document, t: string) {
    w.TiktokAnalyticsObject = t;
    const ttq: any = (w[t] = w[t] || []);
    ttq.methods = [
      "page","track","identify","instances","debug","on","off","once","ready",
      "alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent",
    ];
    ttq.setAndDefer = function (obj: any, method: string) {
      obj[method] = function () {
        obj.push([method].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (id: string) {
      const inst = ttq._i[id] || [];
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(inst, ttq.methods[i]);
      return inst;
    };
    ttq.load = function (id: string, options?: unknown) {
      const url = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[id] = [];
      ttq._i[id]._u = url;
      ttq._t = ttq._t || {};
      ttq._t[id] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[id] = options || {};
      const script = d.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = url + "?sdkid=" + id + "&lib=" + t;
      const first = d.getElementsByTagName("script")[0];
      first.parentNode?.insertBefore(script, first);
    };
  })(window, document, "ttq");
  /* eslint-enable */
  window.ttq?.load(TIKTOK_PIXEL_ID);
  window.ttq?.page();
}

/** Loads the advertising pixels. Only call when tracking is allowed. */
export function loadAdPixels() {
  if (loaded) return;
  loaded = true;
  loadMetaPixel();
  loadTikTokPixel();
}

/** Reports a page view to already-loaded pixels (SPA navigation). */
export function trackPageView() {
  if (!loaded) return;
  window.fbq?.("track", "PageView");
  window.ttq?.page();
}
