import { PAINT_PRESETS, EXPERIENCE_THEMES, DRIVE_MODES } from '../data/configurationData.js';

class StateStore {
  constructor() {
    this.storageKey = 'project_v_session_state';
    this.state = this.loadInitialState();
    this.listeners = new Set();
  }

  loadInitialState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, using default state');
    }

    return {
      theme: 'carbon_night',
      paint: 'graphite',
      wheels: 'forged',
      wheelFinish: 'black',
      brakes: 'yellow',
      interiorTrim: 'carbon',
      ambientLight: 'amber',
      driveMode: 'road',
      lightingMode: 'daylight',
      isEngineRunning: false,
      soundMuted: true, // Default SOUND OFF per luxury OEM requirement
      soundChannels: {
        engine: true,
        ambience: true,
        ui: true
      },
      currentProgress: 0,
      currentPhase: 1,
      activeInspectionSystem: null,
      activeView: 'story', // 'story', 'exterior', 'cockpit', 'configurator', 'gallery'
      nightMode: false,
      zenMode: false
    };
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      // Ignore
    }
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    this.save();
    this.notify(this.state, prevState);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(state, prevState) {
    this.listeners.forEach(fn => {
      try {
        fn(state, prevState);
      } catch (err) {
        console.error('State listener error:', err);
      }
    });
  }

  getPaint() {
    return PAINT_PRESETS.find(p => p.id === this.state.paint) || PAINT_PRESETS[0];
  }

  getTheme() {
    return EXPERIENCE_THEMES.find(t => t.id === this.state.theme) || EXPERIENCE_THEMES[0];
  }

  getDriveMode() {
    return DRIVE_MODES.find(m => m.id === this.state.driveMode) || DRIVE_MODES[0];
  }
}

export const store = new StateStore();
