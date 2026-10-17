import { store } from '../core/StateStore.js';
import { audio } from '../core/AudioManager.js';
import { scroller } from '../core/Scroller.js';
import { EXPERIENCE_THEMES } from '../data/configurationData.js';

export class VIPFooter {
  constructor(container) {
    this.container = container;
    this.isIgnited = false;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <footer class="vip-footer">
        <div class="footer-horizon"></div>

        <!-- Section 1: Massive Hero CTA & Live Engine Ignition -->
        <div class="footer-hero-block">
          <div class="footer-badge-wrap">
            <span class="footer-badge-pulse"></span>
            <span class="footer-eyebrow">FINAL SPECIFICATION • CHASSIS 001/050</span>
          </div>
          
          <h2 class="footer-headline">THE MACHINE<br>DOESN'T END HERE.</h2>
          <p class="footer-subheadline">
            Commission your bespoke build or experience the engineering masterpiece from within the pilot cell.
          </p>

          <!-- Interactive Engine Ignition Pill -->
          <div class="footer-engine-console">
            <button class="footer-engine-btn" id="footer-engine-btn" title="Ignite S58 Twin-Turbo Engine">
              <span class="engine-btn-ring"></span>
              <span class="engine-btn-core">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0"/>
                </svg>
              </span>
              <span class="engine-btn-label" id="footer-engine-label">START S58 TWIN-TURBO</span>
            </button>
            <div class="footer-engine-telemetry">
              <div class="footer-telem-item">
                <span class="telem-label">RPM</span>
                <span class="telem-val" id="footer-rpm-val">0</span>
              </div>
              <div class="footer-telem-item">
                <span class="telem-label">STATE</span>
                <span class="telem-val" id="footer-state-val">STANDBY</span>
              </div>
              <div class="footer-telem-item">
                <span class="telem-label">OIL TEMP</span>
                <span class="telem-val">94°C</span>
              </div>
            </div>
          </div>

          <!-- Primary Navigation Actions -->
          <div class="footer-actions">
            <button class="btn-primary footer-btn" id="footer-config-btn">
              <span>CONFIGURE BESPOKE ATELIER</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </button>

            <button class="btn-secondary footer-btn" id="footer-cockpit-btn">
              <span>ENTER COCKPIT CELL</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </button>

            <button class="btn-ghost footer-btn" id="footer-gallery-btn">
              <span>EDITORIAL ARCHIVE</span>
            </button>
          </div>
        </div>

        <!-- Section 2: Technical Performance Specs Matrix -->
        <div class="footer-specs-section">
          <div class="specs-header">
            <span class="specs-eyebrow">VERIFIED BENCHMARKS</span>
            <span class="specs-title">HOMOLOGATED TELEMETRY</span>
          </div>
          <div class="footer-specs-grid">
            <div class="footer-spec-card">
              <span class="spec-num">2.68<span class="spec-unit">s</span></span>
              <span class="spec-name">0–100 KM/H</span>
              <span class="spec-desc">Launch control pre-stage</span>
            </div>
            <div class="footer-spec-card">
              <span class="spec-num">352<span class="spec-unit">km/h</span></span>
              <span class="spec-name">MAX VELOCITY</span>
              <span class="spec-desc">Active DRS low-drag trim</span>
            </div>
            <div class="footer-spec-card">
              <span class="spec-num">750<span class="spec-unit">HP</span></span>
              <span class="spec-name">SYSTEM OUTPUT</span>
              <span class="spec-desc">880 Nm peak torque curve</span>
            </div>
            <div class="footer-spec-card">
              <span class="spec-num">720<span class="spec-unit">kg</span></span>
              <span class="spec-name">DOWNFORCE</span>
              <span class="spec-desc">@ 260 km/h ground effect</span>
            </div>
            <div class="footer-spec-card">
              <span class="spec-num">1,280<span class="spec-unit">kg</span></span>
              <span class="spec-name">KERB WEIGHT</span>
              <span class="spec-desc">Carbon monocoque T1000G</span>
            </div>
            <div class="footer-spec-card">
              <span class="spec-num">28.4<span class="spec-unit">m</span></span>
              <span class="spec-name">100–0 KM/H</span>
              <span class="spec-desc">410mm Carbon Ceramic brakes</span>
            </div>
          </div>
        </div>

        <!-- Section 3: VIP Client Allocation Request -->
        <div class="footer-allocation-section">
          <div class="allocation-card">
            <div class="allocation-info">
              <span class="alloc-tag">STRICTLY LIMITED PRODUCTION</span>
              <h3 class="alloc-heading">COMMISSIONING INQUIRY</h3>
              <p class="alloc-desc">
                Series limited to 50 bespoke builds worldwide. Submit your VIP credentials to receive the encrypted technical prospectus and factory allocation slot.
              </p>
            </div>
            <form class="allocation-form" id="allocation-form">
              <div class="form-row">
                <input type="text" id="alloc-name" placeholder="Client Full Name" required class="alloc-input">
                <input type="email" id="alloc-email" placeholder="Private Concierge Email" required class="alloc-input">
              </div>
              <div class="form-row">
                <select id="alloc-region" class="alloc-select" required>
                  <option value="" disabled selected>Select Commission Delivery Hub</option>
                  <option value="Monaco">Monaco • Port Hercule</option>
                  <option value="London">London • Mayfair Atelier</option>
                  <option value="Dubai">Dubai • DIFC Private Lounge</option>
                  <option value="Tokyo">Tokyo • Ginza Studio</option>
                  <option value="Los Angeles">Los Angeles • Beverly Hills</option>
                  <option value="Zurich">Zurich • Bahnhofstrasse</option>
                </select>
                <button type="submit" class="alloc-submit-btn" id="alloc-submit-btn">
                  <span>REQUEST ALLOCATION</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <div class="alloc-feedback" id="alloc-feedback"></div>
            </form>
          </div>
        </div>

        <!-- Section 4: Deep Systems Navigation & Swatches -->
        <div class="footer-nav-grid">
          <div class="footer-col">
            <span class="footer-col-title">ENGINEERING CHAPTERS</span>
            <ul class="footer-col-links">
              <li><button data-target-progress="0.0">01 / Dynamic Stance & Exterior</button></li>
              <li><button data-target-progress="0.20">02 / Active Venturi Aerodynamics</button></li>
              <li><button data-target-progress="0.38">03 / Carbon Ceramic Brake Matrix</button></li>
              <li><button data-target-progress="0.55">04 / Pushrod Chassis Architecture</button></li>
              <li><button data-target-progress="0.75">05 / S58 Twin-Turbo Powertrain</button></li>
              <li><button data-target-progress="0.95">06 / Full Exploded Master Assembly</button></li>
            </ul>
          </div>

          <div class="footer-col">
            <span class="footer-col-title">BESPOKE ATELIER</span>
            <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">
              Select real-time ambient environment:
            </p>
            <div class="footer-theme-swatches" id="footer-theme-swatches">
              ${EXPERIENCE_THEMES.map(t => `
                <button class="footer-theme-btn" data-theme-id="${t.id}" title="${t.name}">
                  <span class="footer-theme-dot" style="background:${t.accent};"></span>
                  <span class="footer-theme-name">${t.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="footer-col">
            <span class="footer-col-title">SYSTEM PROTOCOLS</span>
            <ul class="footer-col-links">
              <li><span>CHASSIS NO: PV-GT-050</span></li>
              <li><span>MONOCOQUE: T1000G TORAY</span></li>
              <li><span>ECU FIRMWARE: v4.88.2-PRO</span></li>
              <li><span>HOMOLOGATION: FIA-GT3 / ISO-9001</span></li>
              <li><span>AUDIO SYNTHESIS: 24-BIT PROCEDURAL</span></li>
            </ul>
          </div>

          <div class="footer-col">
            <span class="footer-col-title">PLATFORM CONTROL</span>
            <div class="footer-status-box">
              <div class="status-row">
                <span>SYSTEM CORE</span>
                <span class="status-green">OPTIMAL (60 FPS)</span>
              </div>
              <div class="status-row">
                <span>ACOUSTIC EMITTER</span>
                <span id="footer-sound-status" style="color:var(--accent-color);">ACTIVE</span>
              </div>
              <div class="status-row">
                <span>GLOBAL COORDINATES</span>
                <span style="font-family:var(--font-mono); font-size:0.65rem;">44.5323° N, 10.8640° E</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: Bottom Utility & Back to Top Glider -->
        <div class="footer-bottom-bar">
          <div class="footer-copyright">
            <span class="brand-badge" style="margin-right:8px;">PROJECT V</span>
            <span>© 2026 PROJECT V AUTOMOTIVE TECHNOLOGIES. ALL RIGHTS RESERVED.</span>
          </div>

          <button class="footer-top-btn" id="footer-top-btn" title="Glide to top">
            <span>RETURN TO APEX</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
        </div>
      </footer>
    `;

    this.bindEvents();
    store.subscribe((state) => this.sync(state));
  }

  bindEvents() {
    const configBtn = this.container.querySelector('#footer-config-btn');
    const cockpitBtn = this.container.querySelector('#footer-cockpit-btn');
    const galleryBtn = this.container.querySelector('#footer-gallery-btn');
    const engineBtn = this.container.querySelector('#footer-engine-btn');
    const topBtn = this.container.querySelector('#footer-top-btn');
    const allocForm = this.container.querySelector('#allocation-form');

    if (configBtn) {
      configBtn.addEventListener('click', () => {
        audio.playUiClick();
        store.setState({ activeView: 'configurator' });
      });
    }

    if (cockpitBtn) {
      cockpitBtn.addEventListener('click', () => {
        audio.playUiClick();
        store.setState({ activeView: 'cockpit' });
      });
    }

    if (galleryBtn) {
      galleryBtn.addEventListener('click', () => {
        audio.playUiClick();
        store.setState({ activeView: 'gallery' });
      });
    }

    // Engine Ignition Toggle from Footer
    if (engineBtn) {
      engineBtn.addEventListener('click', () => {
        const rpmVal = this.container.querySelector('#footer-rpm-val');
        const stateVal = this.container.querySelector('#footer-state-val');
        const label = this.container.querySelector('#footer-engine-label');

        if (!this.isIgnited) {
          this.isIgnited = true;
          engineBtn.classList.add('running');
          if (label) label.textContent = 'REV S58 ENGINE';
          if (stateVal) stateVal.textContent = 'CRANKING...';

          audio.startIgnitionSequence((phase) => {
            if (phase === 'starter') {
              if (rpmVal) rpmVal.textContent = '450';
              if (stateVal) stateVal.textContent = 'STARTER';
            } else if (phase === 'ignition') {
              if (rpmVal) rpmVal.textContent = '3,800';
              if (stateVal) stateVal.textContent = 'COMBUSTION';
            } else if (phase === 'idle') {
              if (rpmVal) rpmVal.textContent = '850';
              if (stateVal) stateVal.textContent = 'IDLE ACTIVE';
            }
          });
        } else {
          // Rev Engine
          if (stateVal) stateVal.textContent = 'THROTTLE 85%';
          if (rpmVal) rpmVal.textContent = '6,400';
          audio.revEngine(6400, 0.9, () => {
            if (stateVal) stateVal.textContent = 'IDLE ACTIVE';
            if (rpmVal) rpmVal.textContent = '850';
          });
        }
      });
    }

    // Allocation Form Submission
    if (allocForm) {
      allocForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = this.container.querySelector('#alloc-name');
        const emailInput = this.container.querySelector('#alloc-email');
        const regionInput = this.container.querySelector('#alloc-region');
        const feedback = this.container.querySelector('#alloc-feedback');
        const submitBtn = this.container.querySelector('#alloc-submit-btn');

        audio.playMechanicalLock();

        const certId = `PV-ALLOC-${Math.floor(1000 + Math.random() * 9000)}-${regionInput.value ? regionInput.value.toUpperCase().slice(0, 3) : 'VIP'}`;
        
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';

        feedback.innerHTML = `
          <div class="alloc-success-modal">
            <div class="success-icon">✓</div>
            <div class="success-details">
              <span class="success-title">ALLOCATION DOSSIER RESERVED</span>
              <span class="success-cert">ID: <strong>${certId}</strong> • ${regionInput.value} HUB</span>
              <span class="success-note">Private technical documentation dispatched to ${emailInput.value}</span>
            </div>
          </div>
        `;

        setTimeout(() => {
          nameInput.value = '';
          emailInput.value = '';
          regionInput.selectedIndex = 0;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }, 4000);
      });
    }

    // Navigation jumps
    const progBtns = this.container.querySelectorAll('[data-target-progress]');
    progBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseFloat(btn.getAttribute('data-target-progress'));
        audio.playUiClick();
        store.setState({ activeView: 'story' });
        scroller.scrollToProgress(p, true);
      });
    });

    // Theme switches
    const themeBtns = this.container.querySelectorAll('[data-theme-id]');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const themeId = btn.getAttribute('data-theme-id');
        audio.playMetallicShimmer();
        store.setState({ theme: themeId });
      });
    });

    // Return to apex
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        audio.playUiClick();
        store.setState({ activeView: 'story' });
        scroller.scrollToProgress(0, true);
      });
    }
  }

  sync(state) {
    const currentTheme = store.getTheme();
    const soundStatus = this.container.querySelector('#footer-sound-status');
    const themeBtns = this.container.querySelectorAll('[data-theme-id]');

    if (soundStatus) {
      soundStatus.textContent = state.soundMuted ? 'MUTED' : 'ACTIVE';
      soundStatus.style.color = state.soundMuted ? 'var(--text-muted)' : 'var(--accent-color)';
    }

    themeBtns.forEach(btn => {
      const tid = btn.getAttribute('data-theme-id');
      btn.classList.toggle('active', tid === currentTheme.id);
    });
  }
}
