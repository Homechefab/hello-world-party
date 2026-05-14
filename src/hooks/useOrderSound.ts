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

      // "Ka-ching" cash register style: two bell strikes with metallic harmonics.
      const now = ctx.currentTime;

      const bellStrike = (start: number, baseFreq: number, peak = 0.22, dur = 1.2) => {
        // Bell = fundamental + inharmonic partials, fast attack, exp decay
        const partials = [
          { mult: 1.0, gain: 1.0 },
          { mult: 2.01, gain: 0.6 },
          { mult: 3.02, gain: 0.4 },
          { mult: 4.21, gain: 0.25 },
          { mult: 5.43, gain: 0.15 },
        ];
        const t0 = now + start;
        const scaledPeak = Math.max(0.0002, peak * volume);
        partials.forEach((p) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = baseFreq * p.mult;
          osc.connect(gain);
          gain.connect(ctx.destination);
          const partPeak = Math.max(0.0002, scaledPeak * p.gain);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(partPeak, t0 + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          osc.start(t0);
          osc.stop(t0 + dur + 0.02);
        });

        // Short noise burst for the metallic "ting" attack
        try {
          const noiseDur = 0.05;
          const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * noiseDur), ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 4000;
          const ng = ctx.createGain();
          const noisePeak = Math.max(0.0002, scaledPeak * 0.4);
          ng.gain.setValueAtTime(noisePeak, t0);
          ng.gain.exponentialRampToValueAtTime(0.0001, t0 + noiseDur);
          src.connect(hp);
          hp.connect(ng);
          ng.connect(ctx.destination);
          src.start(t0);
          src.stop(t0 + noiseDur + 0.02);
        } catch {
          // ignore
        }
      };

      // "Ka" – higher bright strike, then "ching" – slightly lower, longer ring
      bellStrike(0, 1760, 0.22, 0.6);
      bellStrike(0.12, 1318.5, 0.26, 1.4);
    } catch {
      // AudioContext not available
    }
  }, []);

  return { playOrderSound };
}
