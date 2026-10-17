import { store } from '../core/StateStore.js';
import { audio } from '../core/AudioManager.js';
import { DRIVE_MODES, AMBIENT_LIGHTING } from '../data/configurationData.js';

export class Cockpit {
  constructor(container) {
    this.container = container;
    this.isPlayingMedia = false;
    this.currentRpm = 850;
    this.currentSpeed = 0;
    this.currentGear = 'N';
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="cockpit-view" id="cockpit-view">
        <div class="cockpit-ambient-glow" id="cockpit-glow"></div>

        <!-- Cockpit Header -->
        <div class="cockpit-header">
          <div class="cockpit-title-block">
            <span style="font-family:var(--font-mono); font-size:0.75rem; letter-spacing:0.2em; color:var(--accent-color);">COCKPIT MODE</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">/ DRIVER CELL</span>
          </div>
          <button class="cockpit-exit-btn" id="cockpit-exit-btn">RETURN TO EXTERIOR</button>
        </div>

        <!-- Central Cockpit Layout -->
        <div class="cockpit-main-grid">
          <!-- 1. Digital Instrument Cluster -->
          <div class="instrument-cluster-panel">
            <div class="cluster-top-row">
              <span class="cluster-mode-badge" id="cluster-mode-badge">MODE / ROAD</span>
              <span style="font-family:var(--font-mono); font-size:0.68rem; color:var(--text-muted);">OIL TEMP: 94°C</span>
            </div>

            <div class="cluster-dials-row">
              <div class="speed-dial">
                <span class="speed-number" id="cluster-speed">0</span>
                <span class="speed-unit">KM / H</span>
              </div>

              <div class="gear-indicator">
                <span class="gear-letter" id="cluster-gear">N</span>
                <span class="gear-label">GEAR</span>
              </div>

              <div class="rpm-dial">
                <span class="rpm-number" id="cluster-rpm">850</span>
                <span class="rpm-unit">RPM</span>
              </div>
            </div>

            <!-- Throttle Rev Trigger -->
            <button class="rev-trigger-btn" id="rev-trigger-btn">
              <span>ACCELERATE THROTTLE</span>
            </button>

            <!-- Drive Modes Selection -->
            <div class="drive-modes-row">
              ${DRIVE_MODES.map(m => `
                <button class="drive-mode-btn ${m.id === 'road' ? 'active' : ''}" data-mode="${m.id}">
                  ${m.name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 2. Automotive Android OS Infotainment Display -->
          <div class="infotainment-panel">
            <div class="infotainment-tabs">
              <button class="info-tab-btn active" data-tab="media">MEDIA</button>
              <button class="info-tab-btn" data-tab="nav">NAVIGATION</button>
              <button class="info-tab-btn" data-tab="climate">CLIMATE</button>
            </div>

            <!-- Media Player View -->
            <div class="media-player-card" id="media-card">
              <div class="media-track-info">
                <div class="album-art-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <div class="track-details">
                  <span class="track-title">CIRCUIT VELOCITY 01</span>
                  <span class="track-artist">PROJECT V AUDIO LABS • ACOUSTIC MASTER</span>
                </div>
              </div>

              <!-- Animated Waveform Visualizer -->
              <div class="waveform-bars">
                ${Array.from({ length: 28 }).map(() => `<span class="wave-bar"></span>`).join('')}
              </div>

              <!-- Controls -->
              <div class="media-controls">
                <button class="media-ctrl-btn" id="media-prev">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button class="play-pause-btn" id="media-play-btn">
                  <svg id="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <button class="media-ctrl-btn" id="media-next">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
              </div>
            </div>

            <!-- Navigation Tab -->
            <div class="nav-tab-content" id="nav-card" style="display:none; flex-direction:column; gap:8px;">
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-color);">NÜRBURGRING NORDSCHLEIFE • GP CIRCUIT</span>
              <span style="font-family:var(--font-mono); font-size:0.68rem; color:var(--text-muted);">LAT 50.3356° N, LON 6.9478° E • TELEMETRY ACTIVE</span>
              <div style="height:50px; background:rgba(255,255,255,0.04); border-radius:4px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-subtle);">
                <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-secondary);">GPS LOCK ACQUIRED • TRACK TEMPERATURE 26°C</span>
              </div>
            </div>

            <!-- Climate Tab -->
            <div class="climate-tab-content" id="climate-card" style="display:none; flex-direction:column; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-secondary);">CABIN TEMPERATURE</span>
                <span style="font-family:var(--font-headline); font-size:1.8rem; font-weight:800; color:var(--text-primary);">21.5°C</span>
              </div>
              <div style="display:flex; gap:10px;">
                <button style="flex:1; padding:8px; border:1px solid var(--border-subtle); border-radius:4px; font-family:var(--font-mono); font-size:0.7rem; color:var(--text-primary); background:rgba(255,255,255,0.05);">AUTO SYNC</button>
                <button style="flex:1; padding:8px; border:1px solid var(--border-subtle); border-radius:4px; font-family:var(--font-mono); font-size:0.7rem; color:var(--accent-color); background:rgba(229,184,11,0.1);">DUAL ZONE</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const cockpitEl = this.container.querySelector('#cockpit-view');
    if (cockpitEl) {
      const base = import.meta.env.BASE_URL || './';
      const normalizedBase = base.endsWith('/') ? base : `${base}/`;
      cockpitEl.style.backgroundImage = `url("${normalizedBase}assets/cockpit.jpg")`;
    }

    this.bindEvents();
    store.subscribe((state) => this.sync(state));
  }

  bindEvents() {
    const exitBtn = this.container.querySelector('#cockpit-exit-btn');
    exitBtn.addEventListener('click', () => {
      audio.playUiClick();
      store.setState({ activeView: 'story' });
    });

    // Throttle Rev Trigger
    const revBtn = this.container.querySelector('#rev-trigger-btn');
    const rpmEl = this.container.querySelector('#cluster-rpm');
    const speedEl = this.container.querySelector('#cluster-speed');
    const gearEl = this.container.querySelector('#cluster-gear');

    revBtn.addEventListener('click', () => {
      audio.ensureContext();
      audio.revEngine(5800, 1.2);

      // Animate speed, rpm, gear
      gearEl.textContent = '2';
      let targetRpm = 5800;
      let targetSpeed = 94;

      let frame = 0;
      const step = () => {
        frame++;
        if (frame < 25) {
          rpmEl.textContent = Math.round(850 + (targetRpm - 850) * (frame / 25));
          speedEl.textContent = Math.round(targetSpeed * (frame / 25));
          requestAnimationFrame(step);
        } else if (frame < 50) {
          const down = (frame - 25) / 25;
          rpmEl.textContent = Math.round(targetRpm - (targetRpm - 850) * down);
          speedEl.textContent = Math.round(targetSpeed - targetSpeed * down);
          requestAnimationFrame(step);
        } else {
          rpmEl.textContent = '850';
          speedEl.textContent = '0';
          gearEl.textContent = 'N';
        }
      };
      requestAnimationFrame(step);
    });

    // Drive Mode Buttons
    const modeBtns = this.container.querySelectorAll('[data-mode]');
    const modeBadge = this.container.querySelector('#cluster-mode-badge');

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        audio.playUiClick();
        audio.setDriveModeSound(mode);
        store.setState({ driveMode: mode });
        modeBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-mode') === mode));
        if (modeBadge) modeBadge.textContent = `MODE / ${mode.toUpperCase()}`;
      });
    });

    // Infotainment Tabs
    const tabs = this.container.querySelectorAll('.info-tab-btn');
    const mediaCard = this.container.querySelector('#media-card');
    const navCard = this.container.querySelector('#nav-card');
    const climateCard = this.container.querySelector('#climate-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        audio.playUiClick();
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        mediaCard.style.display = target === 'media' ? 'flex' : 'none';
        navCard.style.display = target === 'nav' ? 'flex' : 'none';
        climateCard.style.display = target === 'climate' ? 'flex' : 'none';
      });
    });

    // Media Player Play/Pause
    const playBtn = this.container.querySelector('#media-play-btn');
    const playIcon = this.container.querySelector('#play-icon');

    playBtn.addEventListener('click', () => {
      audio.ensureContext();
      this.isPlayingMedia = !this.isPlayingMedia;
      mediaCard.classList.toggle('playing', this.isPlayingMedia);

      if (this.isPlayingMedia) {
        audio.playMetallicShimmer();
        playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`;
      } else {
        playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
      }
    });
  }

  sync(state) {
    const view = this.container.querySelector('#cockpit-view');
    view.classList.toggle('active', state.activeView === 'cockpit');

    // Sync ambient light glow
    const currentAmbient = AMBIENT_LIGHTING.find(a => a.id === state.ambientLight) || AMBIENT_LIGHTING[0];
    const glow = this.container.querySelector('#cockpit-glow');
    if (glow) {
      glow.style.setProperty('--ambient-glow-color', `${currentAmbient.hex}33`);
    }
  }
}
