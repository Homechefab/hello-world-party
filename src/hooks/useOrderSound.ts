import { useCallback } from 'react';

/**
 * Returns a function that plays the "new order" notification sound.
 * Uses the WebAudio API – no asset needed.
 */
export function useOrderSound() {
  const playOrderSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const play = (freq: number, start: number, dur: number, peak = 0.18) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t0 = ctx.currentTime + start;
        // Soft attack + gentle release for a mellow bell-like tone
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.04);
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
