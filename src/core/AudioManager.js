import { store } from './StateStore.js';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isInitialized = false;
    this.engineNodes = null;
    this.ambienceNodes = null;
    this.masterGain = null;
    this.engineGain = null;
    this.ambienceGain = null;
    this.uiGain = null;
    this.rpm = 850;

    // Listen for state changes
    store.subscribe((state) => {
      this.syncState(state);
    });
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(store.getState().soundMuted ? 0 : 0.6, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Channels
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.engineGain.connect(this.masterGain);

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      this.uiGain = this.ctx.createGain();
      this.uiGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.uiGain.connect(this.masterGain);

      this.isInitialized = true;
      this.startStudioAmbience();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  syncState(state) {
    if (!this.masterGain) return;
    const now = this.ctx.currentTime;
    const targetGain = state.soundMuted ? 0 : 0.6;
    this.masterGain.gain.setTargetAtTime(targetGain, now, 0.05);

    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(state.soundChannels.engine ? 0.5 : 0, now, 0.05);
    }
    if (this.ambienceGain) {
      this.ambienceGain.gain.setTargetAtTime(state.soundChannels.ambience ? 0.2 : 0, now, 0.05);
    }
    if (this.uiGain) {
      this.uiGain.gain.setTargetAtTime(state.soundChannels.ui ? 0.3 : 0, now, 0.05);
    }
  }

  startStudioAmbience() {
    if (!this.ctx || this.ambienceNodes) return;
    try {
      // Procedural soft architectural room tone (filtered brown/pink noise)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 0.15;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.ambienceGain);
      whiteNoise.start();
      this.ambienceNodes = { whiteNoise, filter };
    } catch (e) {
      console.warn('Ambience sound error:', e);
    }
  }

  startIgnitionSequence(onPhaseUpdate) {
    this.ensureContext();
    const now = this.ctx.currentTime;

    // Step 1: Starter motor high-pitched pulse (180Hz -> 280Hz)
    const starter = this.ctx.createOscillator();
    starter.type = 'triangle';
    starter.frequency.setValueAtTime(180, now);
    starter.frequency.exponentialRampToValueAtTime(320, now + 0.6);

    const starterGain = this.ctx.createGain();
    starterGain.gain.setValueAtTime(0.2, now);
    starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    starter.connect(starterGain);
    starterGain.connect(this.engineGain);
    starter.start(now);
    starter.stop(now + 0.65);

    if (onPhaseUpdate) onPhaseUpdate('starter');

    // Step 2: Ignition thump & combustion burst (~0.6s)
    setTimeout(() => {
      if (!this.ctx) return;
      const ignTime = this.ctx.currentTime;
      const burstOsc = this.ctx.createOscillator();
      burstOsc.type = 'sawtooth';
      burstOsc.frequency.setValueAtTime(65, ignTime);
      burstOsc.frequency.exponentialRampToValueAtTime(120, ignTime + 0.4);

      const burstFilter = this.ctx.createBiquadFilter();
      burstFilter.type = 'lowpass';
      burstFilter.frequency.setValueAtTime(450, ignTime);

      const burstGain = this.ctx.createGain();
      burstGain.gain.setValueAtTime(0.4, ignTime);
      burstGain.gain.exponentialRampToValueAtTime(0.01, ignTime + 0.5);

      burstOsc.connect(burstFilter);
      burstFilter.connect(burstGain);
      burstGain.connect(this.engineGain);
      burstOsc.start(ignTime);
      burstOsc.stop(ignTime + 0.5);

      if (onPhaseUpdate) onPhaseUpdate('ignition');
    }, 600);

    // Step 3: Controlled initial rev (~1.0s) up to 3,800 RPM then settle to idle (~850 RPM)
    setTimeout(() => {
      this.initContinuousEngine();
      this.revEngine(3400, 0.7, () => {
        if (onPhaseUpdate) onPhaseUpdate('idle');
      });
    }, 1100);
  }

  initContinuousEngine() {
    if (this.engineNodes) return;
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(38, this.ctx.currentTime); // ~850 RPM base frequency

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(76, this.ctx.currentTime); // 2nd order inline-6 harmonic

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.engineGain);

    osc1.start();
    osc2.start();

    this.engineNodes = { osc1, osc2, filter, subGain };
    store.setState({ isEngineRunning: true });
  }

  revEngine(targetRpm = 4500, duration = 0.8, onDone) {
    if (!this.engineNodes || !this.ctx) return;
    const now = this.ctx.currentTime;
    const baseFreq = 38 * (targetRpm / 850);

    this.engineNodes.osc1.frequency.setTargetAtTime(baseFreq, now, 0.15);
    this.engineNodes.osc2.frequency.setTargetAtTime(baseFreq * 2, now, 0.15);
    this.engineNodes.filter.frequency.setTargetAtTime(Math.min(900, 260 + targetRpm * 0.1), now, 0.15);

    // Drop back to idle
    setTimeout(() => {
      if (!this.ctx || !this.engineNodes) return;
      const returnTime = this.ctx.currentTime;
      this.engineNodes.osc1.frequency.setTargetAtTime(38, returnTime, 0.3);
      this.engineNodes.osc2.frequency.setTargetAtTime(76, returnTime, 0.3);
      this.engineNodes.filter.frequency.setTargetAtTime(260, returnTime, 0.3);
      if (onDone) setTimeout(onDone, 600);
    }, duration * 1000);
  }

  playUiClick() {
    if (store.getState().soundMuted || !store.getState().soundChannels.ui) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playMechanicalLock() {
    if (store.getState().soundMuted || !store.getState().soundChannels.ui) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playMetallicShimmer() {
    if (store.getState().soundMuted || !store.getState().soundChannels.ui) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playBrakeCue() {
    if (store.getState().soundMuted || !store.getState().soundChannels.ui) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    // Carbon-ceramic brake cue: metallic scrape-clamp transient
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(200, now);
    osc1.frequency.exponentialRampToValueAtTime(55, now + 0.14);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(160, now + 0.14);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc1.connect(filter);
    filter.connect(gain);
    gain.connect(this.uiGain);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Secondary metallic tick
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1800, now);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.05);
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0.06, now);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc2.connect(g2);
    g2.connect(this.uiGain);
    osc2.start(now);
    osc2.stop(now + 0.05);
  }

  setDriveModeSound(mode) {
    if (!this.engineNodes || !this.ctx) return;
    const now = this.ctx.currentTime;
    let basePitch = 38;
    let cutoff = 260;

    if (mode === 'sport') {
      basePitch = 48;
      cutoff = 380;
    } else if (mode === 'track') {
      basePitch = 56;
      cutoff = 520;
    }

    this.engineNodes.osc1.frequency.setTargetAtTime(basePitch, now, 0.2);
    this.engineNodes.osc2.frequency.setTargetAtTime(basePitch * 2, now, 0.2);
    this.engineNodes.filter.frequency.setTargetAtTime(cutoff, now, 0.2);
  }
}

export const audio = new AudioManager();
