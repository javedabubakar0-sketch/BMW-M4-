import { store } from '../core/StateStore.js';
import { audio } from '../core/AudioManager.js';
import {
  PAINT_PRESETS,
  WHEEL_OPTIONS,
  WHEEL_FINISHES,
  BRAKE_CALIPERS,
  INTERIOR_TRIMS,
  AMBIENT_LIGHTING
} from '../data/configurationData.js';

export class Configurator {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    const state = store.getState();
    const currentPaint = store.getPaint();

    this.container.innerHTML = `
      <div class="configurator-view" id="config-view">
        <aside class="configurator-panel">
          <div class="config-header">
            <div class="config-tag">ATELIER STUDIO / SPECIFICATION</div>
            <h2 class="config-title">CONFIGURE MACHINE</h2>
          </div>

          <!-- 1. EXTERIOR PAINT -->
          <div class="config-section">
            <div class="section-label-row">
              <span class="section-label">EXTERIOR FINISH</span>
              <span class="section-current-val" id="current-paint-name">${currentPaint.name}</span>
            </div>
            <div class="swatches-grid">
              ${PAINT_PRESETS.map(p => `
                <button class="color-swatch-btn ${p.id === state.paint ? 'active' : ''}" data-paint="${p.id}" title="${p.name} (${p.finish})">
                  <div class="swatch-inner" style="background: ${p.hex};"></div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 2. WHEEL STYLE -->
          <div class="config-section">
            <div class="section-label-row">
              <span class="section-label">WHEEL ARCHITECTURE</span>
            </div>
            <div class="selector-cards">
              ${WHEEL_OPTIONS.map(w => `
                <button class="selector-card ${w.id === state.wheels ? 'active' : ''}" data-wheel="${w.id}">
                  <span class="selector-card-title">${w.name}</span>
                  <span class="selector-card-subtitle">${w.weight}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 3. WHEEL FINISH -->
          <div class="config-section">
            <div class="section-label-row">
              <span class="section-label">WHEEL FINISH</span>
            </div>
            <div class="swatches-grid">
              ${WHEEL_FINISHES.map(f => `
                <button class="color-swatch-btn ${f.id === state.wheelFinish ? 'active' : ''}" data-wheel-finish="${f.id}" title="${f.name}">
                  <div class="swatch-inner" style="background: ${f.hex};"></div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 4. BRAKE CALIPERS -->
          <div class="config-section">
            <div class="section-label-row">
              <span class="section-label">CALIPER FINISH</span>
            </div>
            <div class="swatches-grid">
              ${BRAKE_CALIPERS.map(c => `
                <button class="color-swatch-btn ${c.id === state.brakes ? 'active' : ''}" data-brake="${c.id}" title="${c.name}">
                  <div class="swatch-inner" style="background: ${c.hex};"></div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 5. INTERIOR TRIM -->
          <div class="config-section">
            <div class="section-label-row">
              <span class="section-label">INTERIOR TRIM</span>
            </div>
            <div class="selector-cards">
              ${INTERIOR_TRIMS.map(t => `
                <button class="selector-card ${t.id === state.interiorTrim ? 'active' : ''}" data-trim="${t.id}">
                  <span class="selector-card-title">${t.name}</span>
                  <span class="selector-card-subtitle">${t.finish}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 6. COCKPIT AMBIENT LIGHTING -->
          <div class="config-section">
            <div class="section-label-row">
              <span class="section-label">AMBIENT LIGHT SPECTRUM</span>
            </div>
            <div class="swatches-grid">
              ${AMBIENT_LIGHTING.map(l => `
                <button class="color-swatch-btn ${l.id === state.ambientLight ? 'active' : ''}" data-ambient="${l.id}" title="${l.name}">
                  <div class="swatch-inner" style="background: ${l.hex};"></div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- SUMMARY & CLOSE -->
          <div class="config-summary-box">
            <div class="summary-meta">
              <span>CHASSIS NO. #001/050</span>
              <span>SPECIFICATION LOCKED</span>
            </div>
            <button class="config-done-btn" id="config-done-btn">CONFIRM SPECIFICATION</button>
          </div>
        </aside>
      </div>
    `;

    this.bindEvents();
    store.subscribe((state) => this.sync(state));
  }

  bindEvents() {
    const view = this.container.querySelector('#config-view');
    const doneBtn = this.container.querySelector('#config-done-btn');

    doneBtn.addEventListener('click', () => {
      audio.playUiClick();
      store.setState({ activeView: 'story' });
    });

    // Paint swatches
    const paintBtns = this.container.querySelectorAll('[data-paint]');
    paintBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-paint');
        audio.playMetallicShimmer();
        store.setState({ paint: pId });
      });
    });

    // Wheels
    const wheelBtns = this.container.querySelectorAll('[data-wheel]');
    wheelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const wId = btn.getAttribute('data-wheel');
        audio.playUiClick();
        store.setState({ wheels: wId });
      });
    });

    // Wheel finish
    const wfBtns = this.container.querySelectorAll('[data-wheel-finish]');
    wfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const fId = btn.getAttribute('data-wheel-finish');
        audio.playUiClick();
        store.setState({ wheelFinish: fId });
      });
    });

    // Calipers
    const brakeBtns = this.container.querySelectorAll('[data-brake]');
    brakeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const bId = btn.getAttribute('data-brake');
        audio.playUiClick();
        store.setState({ brakes: bId });
      });
    });

    // Interior trims
    const trimBtns = this.container.querySelectorAll('[data-trim]');
    trimBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tId = btn.getAttribute('data-trim');
        audio.playUiClick();
        store.setState({ interiorTrim: tId });
      });
    });

    // Ambient light
    const ambBtns = this.container.querySelectorAll('[data-ambient]');
    ambBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const aId = btn.getAttribute('data-ambient');
        audio.playUiClick();
        store.setState({ ambientLight: aId });
      });
    });
  }

  sync(state) {
    const view = this.container.querySelector('#config-view');
    view.classList.toggle('active', state.activeView === 'configurator');

    const paintName = this.container.querySelector('#current-paint-name');
    const currentPaint = store.getPaint();
    if (paintName) paintName.textContent = currentPaint.name;

    // Toggle active classes on swatches
    this.updateActive('[data-paint]', state.paint);
    this.updateActive('[data-wheel]', state.wheels);
    this.updateActive('[data-wheel-finish]', state.wheelFinish);
    this.updateActive('[data-brake]', state.brakes);
    this.updateActive('[data-trim]', state.interiorTrim);
    this.updateActive('[data-ambient]', state.ambientLight);
  }

  updateActive(selector, activeId) {
    const btns = this.container.querySelectorAll(selector);
    btns.forEach(b => {
      const id = b.getAttribute(selector.replace(/[\[\]]/g, ''));
      b.classList.toggle('active', id === activeId);
    });
  }
}
