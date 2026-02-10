// Web Audio API-based game sound effects
const audioCtx = () => {
  if (!(window as any).__gameAudioCtx) {
    (window as any).__gameAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__gameAudioCtx as AudioContext;
};

const play = (fn: (ctx: AudioContext) => void) => {
  try { fn(audioCtx()); } catch { /* ignore */ }
};

export const GameSounds = {
  pestClick: () => play(ctx => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(600, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.15);
  }),

  ecoKill: () => play(ctx => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(400, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.2);
  }),

  chemicalUse: () => play(ctx => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(150, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.3);
  }),

  combo: (level: number) => play(ctx => {
    const notes = [523, 659, 784, 1047, 1319]; // C5-E6
    const count = Math.min(level, 5);
    for (let i = 0; i < count; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = notes[i];
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.06);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.06 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.06);
      o.stop(ctx.currentTime + i * 0.06 + 0.15);
    }
  }),

  powerUp: () => play(ctx => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.35);
  }),

  gameWin: () => play(ctx => {
    const melody = [523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.15 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.15);
      o.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  }),

  gameLose: () => play(ctx => {
    const melody = [400, 350, 300, 200];
    melody.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.2 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.35);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.2);
      o.stop(ctx.currentTime + i * 0.2 + 0.35);
    });
  }),

  heal: () => play(ctx => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(500, ctx.currentTime);
    o.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.25);
  }),

  shieldActivate: () => play(ctx => {
    const o = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 440;
    o2.type = 'sine'; o2.frequency.value = 554;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o.connect(g); o2.connect(g); g.connect(ctx.destination);
    o.start(); o2.start();
    o.stop(ctx.currentTime + 0.4); o2.stop(ctx.currentTime + 0.4);
  }),
};
