import { store } from '../core/StateStore.js';
import { audio } from '../core/AudioManager.js';
import { frameCanvas } from '../core/FrameCanvas.js';
import { scroller } from '../core/Scroller.js';
import { LIGHTING_MODES } from '../data/configurationData.js';

export class LightingSystem {
  constructor(container) {
    this.container = container;
    this.hazardTimer = null;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="lighting-dock" title="Lighting System Presets">
        ${LIGHTING_MODES.map(l => `
          <button class="lighting-btn ${l.id === 'daylight' ? 'active' : ''}" data-light="${l.id}">
            <span class="lighting-dot"></span>
            <span>${l.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    this.bindEvents();
    store.subscribe((state) => this.sync(state));
  }

  bindEvents() {
    const btns = this.container.querySelectorAll('[data-light]');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-light');
        audio.playUiClick();
        store.setState({ lightingMode: mode });

        if (mode === 'welcome') {
          this.triggerWelcomeSequence();
        } else if (mode === 'hazard') {
          this.triggerHazardFlashing();
        } else {
          this.clearTimers();
        }
      });
    });

    const dock = this.container.querySelector('.lighting-dock');
    scroller.subscribe((prog, frame, phase, vel, footerRatio) => {
      if (dock) {
        const opacity = Math.max(0, 1 - (footerRatio || 0) * 2.5);
        dock.style.opacity = opacity;
        dock.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
      }
    });
  }

  clearTimers() {
    if (this.hazardTimer) {
      clearInterval(this.hazardTimer);
      this.hazardTimer = null;
    }
  }

  triggerWelcomeSequence() {
    this.clearTimers();
    // OEM sequential welcome animation: 3 progressive light sweeps
    let intensity = 0;
    let up = true;
    let count = 0;
    const interval = setInterval(() => {
      if (up) {
        intensity += 0.1;
        if (intensity >= 1.0) up = false;
      } else {
        intensity -= 0.1;
        if (intensity <= 0.1) {
          up = true;
          count++;
        }
      }
      frameCanvas.setHeadlightIntensity(intensity);

      if (count >= 2) {
        clearInterval(interval);
        frameCanvas.setHeadlightIntensity(0.8);
      }
    }, 40);
  }

  triggerHazardFlashing() {
    this.clearTimers();
    let on = false;
    this.hazardTimer = setInterval(() => {
      on = !on;
      frameCanvas.setHeadlightIntensity(on ? 0.9 : 0.0);
      audio.playUiClick();
    }, 600);
  }

  sync(state) {
    const btns = this.container.querySelectorAll('[data-light]');
    btns.forEach(b => {
      const mode = b.getAttribute('data-light');
      b.classList.toggle('active', mode === state.lightingMode);
    });
  }
}
