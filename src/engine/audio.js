// audio.js — SFX 100% procedurales con Web Audio (diferenciador: 0/15 del campo).
// Sin assets binarios. ADSR para no clippear (R4). Se desbloquea en primer gesto.

export class AudioEngine {
  constructor() {
    this.ctx = null; this.master = null; this.muted = false; this.noise = null; this.amb = null;
  }

  ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    // buffer de ruido reusable
    const len = (this.ctx.sampleRate * 0.5) | 0;
    const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noise = b;
  }

  resume() { this.ensure(); if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); if (!this.amb) this.startAmbient(); }
  toggleMute() { this.muted = !this.muted; if (this.master) this.master.gain.value = this.muted ? 0 : 0.5; return this.muted; }

  _noiseSrc() { const s = this.ctx.createBufferSource(); s.buffer = this.noise; s.loop = true; return s; }
  _gain(v = 0) { const g = this.ctx.createGain(); g.gain.value = v; g.connect(this.master); return g; }
  _env(g, t, a, d, peak) {
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  // --- armas ---
  shoot(kind = 'pistol') {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const C = { pistol: [1400, 0.09, 0.6], shotgun: [700, 0.22, 0.95], chaingun: [1100, 0.06, 0.5] }[kind] || [1200, 0.1, 0.6];
    const n = this._noiseSrc();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(C[0], t); f.frequency.exponentialRampToValueAtTime(180, t + C[1]);
    const g = this._gain(); this._env(g, t, 0.002, C[1], C[2]);
    n.connect(f); f.connect(g); n.start(t); n.stop(t + C[1] + 0.05);
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.1);
    const og = this._gain(); this._env(og, t, 0.002, 0.13, C[2] * 0.8);
    o.connect(og); o.start(t); o.stop(t + 0.18);
  }

  plasma() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(220, t + 0.16);
    const g = this._gain(); this._env(g, t, 0.002, 0.16, 0.4);
    o.connect(g); o.start(t); o.stop(t + 0.2);
  }

  fireball() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const n = this._noiseSrc();
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = 0.7;
    const g = this._gain(); this._env(g, t, 0.01, 0.3, 0.4);
    n.connect(f); f.connect(g); n.start(t); n.stop(t + 0.35);
  }

  explosion() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const n = this._noiseSrc();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(80, t + 0.4);
    const g = this._gain(); this._env(g, t, 0.005, 0.4, 0.8);
    n.connect(f); f.connect(g); n.start(t); n.stop(t + 0.45);
  }

  // --- enemigos ---
  growl(type = 'imp') {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const base = { imp: 150, zombie: 110, pinky: 80 }[type] || 120;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(base, t); o.frequency.linearRampToValueAtTime(base * 0.7, t + 0.3);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 18; const lg = ctx.createGain(); lg.gain.value = 12;
    lfo.connect(lg); lg.connect(o.frequency);
    const g = this._gain(); this._env(g, t, 0.03, 0.35, 0.3);
    o.connect(g); o.start(t); lfo.start(t); o.stop(t + 0.4); lfo.stop(t + 0.4);
  }

  die(type = 'imp') {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const base = { imp: 200, zombie: 160, pinky: 120 }[type] || 180;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(base, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    const g = this._gain(); this._env(g, t, 0.02, 0.55, 0.4);
    o.connect(g); o.start(t); o.stop(t + 0.6);
    const n = this._noiseSrc(); const ng = this._gain(); this._env(ng, t, 0.02, 0.3, 0.2);
    n.connect(ng); n.start(t); n.stop(t + 0.35);
  }

  // --- mundo / ui ---
  door() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(60, t); o.frequency.linearRampToValueAtTime(110, t + 0.5);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
    const g = this._gain(); this._env(g, t, 0.05, 0.6, 0.25);
    o.connect(f); f.connect(g); o.start(t); o.stop(t + 0.65);
  }

  pickup(kind = 'item') {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const seq = kind === 'weapon' ? [440, 660, 880] : [660, 990];
    seq.forEach((fr, i) => {
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = fr;
      const g = this._gain(); this._env(g, t + i * 0.05, 0.005, 0.08, 0.25);
      o.connect(g); o.start(t + i * 0.05); o.stop(t + i * 0.05 + 0.1);
    });
  }

  pain() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.15);
    const g = this._gain(); this._env(g, t, 0.005, 0.16, 0.35);
    o.connect(g); o.start(t); o.stop(t + 0.2);
  }

  playerDie() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(50, t + 1.0);
    const g = this._gain(); this._env(g, t, 0.02, 1.1, 0.5);
    o.connect(g); o.start(t); o.stop(t + 1.2);
  }

  noAmmo() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const n = this._noiseSrc(); const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000;
    const g = this._gain(); this._env(g, t, 0.001, 0.03, 0.2);
    n.connect(f); f.connect(g); n.start(t); n.stop(t + 0.05);
  }

  uiSelect() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 520;
    const g = this._gain(); this._env(g, t, 0.002, 0.05, 0.2);
    o.connect(g); o.start(t); o.stop(t + 0.07);
  }

  startAmbient() {
    if (!this.ctx || this.amb) return;
    const ctx = this.ctx;
    const g = ctx.createGain(); g.gain.value = 0.06; g.connect(this.master);
    const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 55;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 41.2;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 180;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.1; const lg = ctx.createGain(); lg.gain.value = 0.03;
    lfo.connect(lg); lg.connect(g.gain);
    o1.connect(f); o2.connect(f); f.connect(g);
    o1.start(); o2.start(); lfo.start();
    this.amb = { g, o1, o2, lfo };
  }
}

export const audio = new AudioEngine();
