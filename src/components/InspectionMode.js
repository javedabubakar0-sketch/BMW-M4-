import { scroller } from '../core/Scroller.js';
import { audio } from '../core/AudioManager.js';
import { ENGINEERING_SYSTEMS } from '../data/systemsData.js';

export class InspectionMode {
  constructor(container) {
    this.container = container;
    this.currentSystem = null;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="inspection-hotspots-layer" id="hotspots-layer">
        ${ENGINEERING_SYSTEMS.map(sys => `
          <div class="hotspot-item" data-id="${sys.id}" style="left: ${sys.hotspot.x}%; top: ${sys.hotspot.y}%;">
            <div class="hotspot-marker">
              <span class="hotspot-pulse"></span>
              <span class="hotspot-dot"></span>
            </div>
            <span class="hotspot-label">${sys.title}</span>
          </div>
        `).join('')}
      </div>

      <!-- Right Side Technical Inspection Drawer -->
      <aside class="inspection-drawer" id="inspection-drawer">
        <div>
          <div class="drawer-header">
            <span class="drawer-code" id="drawer-code">04 / BRAKING</span>
            <button class="drawer-close-btn" id="drawer-close-btn">ESC / CLOSE</button>
          </div>

          <h3 class="drawer-headline" id="drawer-headline">CONTROL, ON DEMAND.</h3>
          <div class="drawer-title" id="drawer-title">CARBON-CERAMIC BRAKING</div>
          <p class="drawer-desc" id="drawer-desc">Description of mechanical system.</p>

          <div class="drawer-specs-table" id="drawer-specs">
            <!-- Injected dynamically -->
          </div>
        </div>

        <button class="drawer-action-btn" id="drawer-action-btn">
          <span>SYSTEM VERIFIED</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </button>
      </aside>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const layer = this.container.querySelector('#hotspots-layer');
    const drawer = this.container.querySelector('#inspection-drawer');
    const closeBtn = this.container.querySelector('#drawer-close-btn');
    const actionBtn = this.container.querySelector('#drawer-action-btn');
    const hotspotItems = this.container.querySelectorAll('.hotspot-item');

    // Show hotspots strictly during Phase 09 (Exploded View), hiding in Phase 10 (Reassembly)
    scroller.subscribe((progress) => {
      const isExplodedPhase = progress >= 0.81 && progress <= 0.89;
      layer.classList.toggle('active', isExplodedPhase);
      if (!isExplodedPhase && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
      }
    });

    hotspotItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const sys = ENGINEERING_SYSTEMS.find(s => s.id === id);
        if (sys) {
          audio.playMechanicalLock();
          this.openSystem(sys);
        }
      });
    });

    closeBtn.addEventListener('click', () => {
      audio.playUiClick();
      drawer.classList.remove('open');
    });

    actionBtn.addEventListener('click', () => {
      audio.playUiClick();
      drawer.classList.remove('open');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
      }
    });
  }

  openSystem(sys) {
    const drawer = this.container.querySelector('#inspection-drawer');
    const code = this.container.querySelector('#drawer-code');
    const headline = this.container.querySelector('#drawer-headline');
    const title = this.container.querySelector('#drawer-title');
    const desc = this.container.querySelector('#drawer-desc');
    const specsBox = this.container.querySelector('#drawer-specs');

    code.textContent = sys.code;
    headline.textContent = sys.headline;
    title.textContent = sys.title;
    desc.textContent = sys.desc;

    specsBox.innerHTML = sys.specs.map(sp => `
      <div class="spec-row">
        <span class="spec-label">${sp.label}</span>
        <span class="spec-value">${sp.value}</span>
      </div>
    `).join('');

    drawer.classList.add('open');
  }
}
