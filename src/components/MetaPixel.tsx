import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const META_PIXEL_ID = "1249461430276628";
const META_PIXEL_SCRIPT_ID = "homechef-meta-pixel";

type MetaPixelCall = [command: string, ...parameters: unknown[]];

type QueuedMetaPixelFunction = ((...args: MetaPixelCall) => void) & {
  callMethod?: (...args: MetaPixelCall) => void;
  queue: MetaPixelCall[];
  push?: QueuedMetaPixelFunction;
  loaded: boolean;
  version: string;
};

const createQueuedFbq = (): QueuedMetaPixelFunction => {
  const queuedFbq = Object.assign(
    function queuedFbq(...args: MetaPixelCall): void {
      if (queuedFbq.callMethod) {
        queuedFbq.callMethod(...args);
        return;
      }

      queuedFbq.queue.push(args);
    },
    {
      queue: [] as MetaPixelCall[],
      loaded: true,
      version: "2.0",
    },
  );

  queuedFbq.push = queuedFbq;
  return queuedFbq;
};

const ensureMetaPixel = (): void => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (!window.fbq) {
    window.fbq = createQueuedFbq();
  }

  if (!window._fbq) {
    window._fbq = window.fbq;
  }

  if (!document.getElementById(META_PIXEL_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = META_PIXEL_SCRIPT_ID;
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  }

  if (!window.__homechefMetaPixelInitialized) {
    window.fbq("init", META_PIXEL_ID);
    window.__homechefMetaPixelInitialized = true;
  }
};

const MetaPixel = () => {
  const location = useLocation();

  useEffect(() => {
    ensureMetaPixel();

    const currentPath = `${location.pathname}${location.search}`;
    if (window.__homechefMetaPixelLastPath === currentPath || !window.fbq) {
      return;
    }

    window.fbq("track", "PageView");
    window.__homechefMetaPixelLastPath = currentPath;
  }, [location.pathname, location.search]);

  return null;
};

export default MetaPixel;