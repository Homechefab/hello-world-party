type Listener = () => void;

let allowed = false;
const listeners = new Set<Listener>();

/** True when the visitor may be measured by advertising pixels. */
export function isAdTrackingAllowed(): boolean {
  return allowed;
}

/** Enables advertising pixels (consent given, or region without consent requirement). */
export function enableAdTracking(): void {
  if (allowed) return;
  allowed = true;
  listeners.forEach((listener) => listener());
}

export function subscribeAdTracking(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
