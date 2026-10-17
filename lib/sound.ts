"use client";

/**
 * Procedural sound design with the Web Audio API (no audio files): a soft
 * ambient pad plus tiny UI ticks for hover and click. Off by default.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: { stop: () => void } | null = null;
  private lastHover = 0;
  enabled = false;

  private ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    }
    return { ctx: this.ctx, master: this.master! };
  }

  async enable() {
    const { ctx, master } = this.ensure();
    await ctx.resume();
    this.enabled = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.6);
    if (!this.ambient) this.ambient = this.startAmbient();
  }

  disable() {
    if (!this.ctx || !this.master) return;
    this.enabled = false;
    const { ctx, master } = { ctx: this.ctx, master: this.master };
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    window.setTimeout(() => {
      if (!this.enabled) {
        this.ambient?.stop();
        this.ambient = null;
        void ctx.suspend();
      }
    }, 700);
  }

  private startAmbient() {
    const { ctx, master } = this.ensure();
    const out = ctx.createGain();
    out.gain.value = 0.045;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.6;
    filter.connect(out).connect(master);

    // Warm open fifth (A2 / E3 / A3) with slow detune drift.
    const voices = [110, 164.81, 220].map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 2 ? "triangle" : "sine";
      osc.frequency.value = freq;
      osc.detune.value = (i - 1) * 6;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.35 : 0.6;
      osc.connect(g).connect(filter);
      osc.start();
      return osc;
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    return {
      stop: () => {
        voices.forEach((v) => v.stop());
        lfo.stop();
        out.disconnect();
      },
    };
  }

  private blip(from: number, to: number, duration: number, volume: number) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(from, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + duration);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(g).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  }

  hover() {
    const now = performance.now();
    if (now - this.lastHover < 70) return;
    this.lastHover = now;
    this.blip(1320, 1760, 0.06, 0.018);
  }

  click() {
    this.blip(660, 330, 0.16, 0.05);
  }
}

export const sound = new SoundEngine();
