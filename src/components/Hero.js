import { store } from '../core/StateStore.js';
import { audio } from '../core/AudioManager.js';
import { scroller } from '../core/Scroller.js';
import { frameCanvas } from '../core/FrameCanvas.js';

export class Hero {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <section class="hero-section" id="hero-section">
        <div class="hero-content">
          <div class="hero-eyebrow">
            <span class="eyebrow-tag">PROJECT V</span>
            <span class="eyebrow-divider"></span>
            <span class="eyebrow-study">ENGINEERING STUDY 01</span>
          </div>

          <h1 class="hero-headline">
            BUILT TO BE<br>UNDERSTOOD.
          </h1>

          <p class="hero-subhead">
            Explore every surface, system and decision behind the machine.
          </p>

          <div class="hero-actions">
            <button class="btn-primary" id="btn-enter">
              <span>ENTER THE MACHINE</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </button>

            <button class="btn-secondary" id="btn-start-engine">
              <span class="engine-led"></span>
              <span id="engine-btn-label">START ENGINE</span>
            </button>
          </div>
        </div>

        <div class="hero-footer-hint">
          <div class="scroll-indicator">
            <span class="scroll-text">SCROLL TO OPEN</span>
            <div class="scroll-track-line">
              <div class="scroll-track-pulse"></div>
            </div>
          </div>

          <div class="hero-spec-tag">
            <span>TWIN-TURBO 3.0L INLINE-6 / 550 HP</span>
          </div>
        </div>
      </section>
    `;

    this.bindEvents();
    this.startLaserReveal();
  }

  startLaserReveal() {
    // Laser sweep across screen: -0.2 to 1.3 over 1.6s
    let start = null;
    const duration = 1600;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1.3, -0.2 + (elapsed / duration) * 1.5);
      frameCanvas.setRevealState(progress);

      if (progress < 1.3) {
        requestAnimationFrame(step);
      } else {
        frameCanvas.setRevealState(1.3);
      }
    };

    setTimeout(() => {
      requestAnimationFrame(step);
    }, 200);
  }

  bindEvents() {
    // ENTER THE MACHINE CTA
    const enterBtn = this.container.querySelector('#btn-enter');
    enterBtn.addEventListener('click', () => {
      audio.playUiClick();
      scroller.scrollToProgress(0.12, true);
    });

    // START ENGINE CTA
    const engineBtn = this.container.querySelector('#btn-start-engine');
    const engineLabel = this.container.querySelector('#engine-btn-label');

    engineBtn.addEventListener('click', () => {
      audio.ensureContext();
      if (store.getState().soundMuted) {
        store.setState({ soundMuted: false }); // Unmute when user explicitly requests engine start
      }

      engineBtn.classList.add('engine-running');
      engineLabel.textContent = 'IGNITION...';

      // Subtle camera micro-pulse
      const stage = document.querySelector('.stage-container');
      if (stage) {
        stage.style.transition = 'transform 300ms ease';
        stage.style.transform = 'scale(1.008)';
      }

      audio.startIgnitionSequence((phase) => {
        if (phase === 'starter') {
          engineLabel.textContent = 'CRANKING...';
        } else if (phase === 'ignition') {
          engineLabel.textContent = 'COMBUSTION';
          // Gentle light pulse on canvas
          frameCanvas.setHeadlightIntensity(0.7);
          setTimeout(() => frameCanvas.setHeadlightIntensity(0), 400);
        } else if (phase === 'idle') {
          engineLabel.textContent = 'ENGINE RUNNING';
          if (stage) stage.style.transform = 'scale(1.0)';
        }
      });
    });

    // Fade hero as user scrolls past Phase 01
    scroller.subscribe((progress) => {
      const heroContent = this.container.querySelector('.hero-content');
      const footerHint = this.container.querySelector('.hero-footer-hint');
      if (heroContent && footerHint) {
        const opacity = Math.max(0, 1 - progress * 8);
        const translateY = progress * 60;
        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translateY(-${translateY}px)`;
        footerHint.style.opacity = opacity;
        heroContent.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
      }
    });
  }
}
