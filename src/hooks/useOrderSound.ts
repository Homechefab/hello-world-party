import { useCallback, useEffect } from 'react';

export const ORDER_SOUND_VOLUME_KEY = 'chef-order-sound-volume';
export const DEFAULT_ORDER_SOUND_VOLUME = 0.6;

export function getStoredOrderSoundVolume(): number {
  try {
    const raw = localStorage.getItem(ORDER_SOUND_VOLUME_KEY);
    if (raw === null) return DEFAULT_ORDER_SOUND_VOLUME;
    const v = parseFloat(raw);
    if (Number.isFinite(v)) return Math.min(1, Math.max(0, v));
  } catch {
    // ignore
  }
  return DEFAULT_ORDER_SOUND_VOLUME;
}

// Module-level singleton AudioContext, unlocked on first user gesture.
type AudioCtxCtor = typeof AudioContext;
let sharedCtx: AudioContext | null = null;
let listenersAttached = false;

function getAudioCtxCtor(): AudioCtxCtor | null {
  if (typeof window === 'undefined') return null;
  return (window.AudioContext ||
    (window as unknown as { webkitAudioContext?: AudioCtxCtor }).webkitAudioContext) || null;
}

function ensureCtx(): AudioContext | null {
  if (sharedCtx) return sharedCtx;
  const Ctor = getAudioCtxCtor();
  if (!Ctor) return null;
  try {
    sharedCtx = new Ctor();
    return sharedCtx;
  } catch {
    return null;
  }
}

function unlockOnGesture() {
  const ctx = ensureCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  // Play a near-silent buffer to fully unlock on iOS/Safari
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // ignore
  }
}

function attachUnlockListeners() {
  if (listenersAttached || typeof window === 'undefined') return;
  listenersAttached = true;
  const handler = () => {
    unlockOnGesture();
  };
  const opts = { once: false, passive: true } as AddEventListenerOptions;
  window.addEventListener('click', handler, opts);
  window.addEventListener('touchstart', handler, opts);
  window.addEventListener('keydown', handler, opts);
}

/**
 * Returns a function that plays the "new order" notification sound.
 * Uses a shared AudioContext that is unlocked on the first user gesture
 * so playback survives browser autoplay restrictions.
 */
export function useOrderSound() {
  useEffect(() => {
    attachUnlockListeners();
  }, []);

  const playOrderSound = useCallback((volumeOverride?: number) => {
    try {
      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const volume = typeof volumeOverride === 'number'
        ? Math.min(1, Math.max(0, volumeOverride))
        : getStoredOrderSoundVolume();

      if (volume <= 0) return;

      const play = (freq: number, start: number, dur: number, peak = 0.18) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t0 = ctx.currentTime + start;
        const scaledPeak = Math.max(0.0002, peak * volume);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(scaledPeak, t0 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.start(t0);
        osc.stop(t0 + dur + 0.02);
      };
      play(1046.5, 0, 0.55);
      play(1318.5, 0.18, 0.7);
    } catch {
      // AudioContext not available
    }
  }, []);

  return { playOrderSound };
}
