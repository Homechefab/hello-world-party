const STORAGE_KEY = "hc_ad_consent";

export type ConsentChoice = "granted" | "denied";

// Countries where prior consent is required (EU/EEA + UK + CH)
const CONSENT_REQUIRED_COUNTRIES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO",
  "GB","CH",
]);

type Listener = (choice: ConsentChoice | null) => void;
const listeners = new Set<Listener>();

export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* ignore storage failures */
  }
  listeners.forEach((listener) => listener(choice));
}

export function subscribeConsent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Resolves whether prior consent is required for this visitor.
 * Falls back to "required" whenever the region cannot be determined.
 */
export async function isConsentRequiredRegion(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const response = await fetch("/cdn-cgi/trace", { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) return true;
    const text = await response.text();
    const match = text.match(/^loc=(.*)$/m);
    const country = match?.[1]?.trim().toUpperCase();
    if (!country || country === "XX" || country === "T1") return true;
    return CONSENT_REQUIRED_COUNTRIES.has(country);
  } catch {
    return true;
  }
}
