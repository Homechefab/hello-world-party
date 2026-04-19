import { useCallback } from 'react';

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

/**
 * Returns a function that plays the "new order" notification sound.
 * Uses the WebAudio API – no asset needed.
 * Volume is read from localStorage at play time so updates take effect immediately.
 */
export function useOrderSound() {
  const playOrderSound = useCallback((volumeOverride?: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
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
        // Soft attack + gentle release for a mellow bell-like tone
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(scaledPeak, t0 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.start(t0);
        osc.stop(t0 + dur + 0.02);
      };
      // Soft two-note chime (C6 → E6), pleasant and calm
      play(1046.5, 0, 0.55);
      play(1318.5, 0.18, 0.7);
    } catch {
      // AudioContext not available
    }
  }, []);

  return { playOrderSound };
}
