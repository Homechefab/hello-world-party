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
      const play = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.35, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      // Attention-grabbing pattern
      play(880, 0, 0.12);
      play(660, 0.14, 0.12);
      play(880, 0.28, 0.12);
      play(1100, 0.42, 0.2);
    } catch {
      // AudioContext not available
    }
  }, []);

  return { playOrderSound };
}
