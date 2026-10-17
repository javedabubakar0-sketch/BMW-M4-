import { scroller } from '../core/Scroller.js';
import { SCROLL_PHASES } from '../data/systemsData.js';

// Key metric highlights per scroll phase (phase index 1-11)
const PHASE_METRICS = [
  null, // phase 1 - complete machine (no extra metric)
  { label: 'PANEL WEIGHT SAVING', value: '−38.4 kg' },   // phase 2 exterior
  { label: 'DOWNFORCE @ 250 km/h', value: '340 kg' },    // phase 3 aero
  { label: 'STOPPING DISTANCE', value: '30.2 m' },       // phase 4 wheels/brakes
  { label: 'TORSIONAL RIGIDITY', value: '42,000 Nm/°' }, // phase 5 structure
  { label: 'MAX POWER', value: '550 HP @ 6,250 RPM' },   // phase 6 powertrain
  { label: 'EXHAUST WEIGHT', value: '11.8 kg Titanium' },// phase 7 aux systems
  { label: 'SEAT MATERIAL', value: 'Carbon Alcantara' }, // phase 8 interior
  { label: 'COMPONENTS', value: '300 Parts Expanded' },  // phase 9 exploded
  { label: 'REASSEMBLY TOLERANCE', value: '±0.04 mm' },  // phase 10
  null, // phase 11 finale
];

export class Scrollytelling {
  constructor(container) {
    this.container = container;
    this.cards = [];
    this.lastPhase = -1;
    this.lastVisible = false;
    this.lastFrameIndex = 0;
    this.frameEl = null;
    this.phaseNumEl = null;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="story-overlay">
        ${SCROLL_PHASES.map((p, idx) => `
          <div class="story-card" id="story-card-${idx + 1}" style="will-change: opacity, transform;" data-accent="${p.accent}">
            <div class="story-eyebrow" style="--phase-accent: ${p.accent};">${p.eyebrow}</div>
            <h2 class="story-headline">${p.headline}</h2>
            <p class="story-desc">${p.desc}</p>
            ${PHASE_METRICS[idx] ? `
              <div class="story-metric-chip" style="border-color: ${p.accent}33; background: ${p.accent}0d;">
                <span class="story-metric-label">${PHASE_METRICS[idx].label}</span>
                <span class="story-metric-value" style="color: ${p.accent};">${PHASE_METRICS[idx].value}</span>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Phase progress indicator (top-right overlay) -->
      <div class="phase-progress-hud" id="phase-hud">
        <div class="phase-hud-inner">
          <span class="phase-hud-label" id="phase-hud-label">PHASE 01</span>
          <span class="phase-hud-frame" id="phase-hud-frame">FRAME 000</span>
        </div>
        <div class="phase-hud-dots" id="phase-hud-dots">
          ${SCROLL_PHASES.map((p, i) => `<span class="phase-dot" id="phdot-${i}" style="--dot-accent: ${p.accent};"></span>`).join('')}
        </div>
      </div>
    `;

    this.cards = this.container.querySelectorAll('.story-card');
    this.phaseNumEl = this.container.querySelector('#phase-hud-label');
    this.frameEl = this.container.querySelector('#phase-hud-frame');
    this.dots = this.container.querySelectorAll('.phase-dot');
    this.hud = this.container.querySelector('#phase-hud');

    // Subscribe to single-RAF master progress
    scroller.subscribe((progress, frameIndex, phaseIndex, vel, footerRatio) => {
      const isVisible = progress > 0.03 && (!footerRatio || footerRatio < 0.15);

      // Show/hide the HUD
      if (this.hud) {
        this.hud.classList.toggle('visible', isVisible);
      }

      if (frameIndex !== this.lastFrameIndex) {
        this.lastFrameIndex = frameIndex;
        if (this.frameEl) {
          this.frameEl.textContent = `FRAME ${String(frameIndex + 1).padStart(3, '0')}`;
        }
      }

      if (phaseIndex !== this.lastPhase || isVisible !== this.lastVisible) {
        this.lastPhase = phaseIndex;
        this.lastVisible = isVisible;
        this.update(isVisible, phaseIndex);
      }
    });
  }

  update(isVisible, phaseIndex) {
    this.cards.forEach((card, idx) => {
      const cardPhase = idx + 1;
      const isActive = isVisible && cardPhase === phaseIndex;
      card.classList.toggle('active', isActive);

      if (isActive) {
        const accent = card.getAttribute('data-accent');
        if (this.phaseNumEl) {
          this.phaseNumEl.textContent = `PHASE ${String(phaseIndex).padStart(2, '0')}`;
          this.phaseNumEl.style.color = accent;
        }
      }
    });

    // Update phase indicator dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 === phaseIndex && isVisible);
    });
  }
}
