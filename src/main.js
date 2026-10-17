import './styles/reset.css';
import './styles/variables.css';
import './styles/main.css';
import './styles/hero.css';
import './styles/scrollytelling.css';
import './styles/trackbar.css';
import './styles/inspection.css';
import './styles/configurator.css';
import './styles/cockpit.css';
import './styles/lighting.css';
import './styles/gallery.css';
import './styles/footer.css';

import { store } from './core/StateStore.js';
import { audio } from './core/AudioManager.js';
import { frameCanvas } from './core/FrameCanvas.js';
import { scroller } from './core/Scroller.js';
import { debugHUD } from './core/DebugHUD.js';

import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { Scrollytelling } from './components/Scrollytelling.js';
import { TrackBar } from './components/TrackBar.js';
import { InspectionMode } from './components/InspectionMode.js';
import { Configurator } from './components/Configurator.js';
import { Cockpit } from './components/Cockpit.js';
import { LightingSystem } from './components/LightingSystem.js';
import { GalleryView } from './components/GalleryView.js';
import { VIPFooter } from './components/VIPFooter.js';

class App {
  constructor() {
    this.canvas = document.getElementById('car-canvas');
    this.preloader = document.getElementById('preloader');
    this.preloaderBar = document.getElementById('preloader-bar');
    this.preloaderText = document.getElementById('preloader-text');
  }

  init() {
    // 1. Initialize Frame Canvas with Preloader
    frameCanvas.init(
      this.canvas,
      (pct) => {
        if (this.preloaderBar) this.preloaderBar.style.width = `${pct}%`;
        if (this.preloaderText) this.preloaderText.textContent = `DECODING ENGINEERING DATA ${pct}%`;
      },
      () => {
        // Hide preloader smoothly once initial frame batch is ready
        if (this.preloader) {
          this.preloader.style.opacity = '0';
          setTimeout(() => {
            this.preloader.style.display = 'none';
          }, 600);
        }
      }
    );

    // 2. Initialize Components
    new Navbar(document.getElementById('nav-root'));
    new Hero(document.getElementById('hero-root'));
    new Scrollytelling(document.getElementById('scrolly-root'));
    new TrackBar(document.getElementById('trackbar-root'));
    new InspectionMode(document.getElementById('inspection-root'));
    new Configurator(document.getElementById('configurator-root'));
    new Cockpit(document.getElementById('cockpit-root'));
    new LightingSystem(document.getElementById('lighting-root'));
    new GalleryView(document.getElementById('gallery-root'));
    new VIPFooter(document.getElementById('footer-root'));

    // 3. Initialize Master Scroller
    scroller.init(document.body);

    // 4. Initialize Performance Debug HUD [Shift + D]
    debugHUD.init();

    // 5. Lightweight RAF-based Custom Cursor
    this.initCursor();

    // 6. Global Keyboard Shortcuts & Audio Unlock
    this.initInteractions();
  }

  initCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) {
      if (cursor) cursor.style.display = 'none';
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let isCursorDirty = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isCursorDirty = true;
    }, { passive: true });

    // Single cursor render loop aligned with display refresh
    const cursorLoop = () => {
      if (isCursorDirty) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        isCursorDirty = false;
      }
      requestAnimationFrame(cursorLoop);
    };
    requestAnimationFrame(cursorLoop);

    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      const isInteractive = target.closest('button, a, .hotspot-item, .color-swatch-btn, .selector-card');
      cursor.classList.toggle('hovering', !!isInteractive);

      const isHotspot = target.closest('.hotspot-item');
      cursor.classList.toggle('explore', !!isHotspot);
    }, { passive: true });
  }

  initInteractions() {
    // Unlock Web Audio Context upon first interaction
    const unlockAudio = () => {
      audio.ensureContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // Keyboard Hotkeys
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'c' || e.key === 'C') {
        const cur = store.getState().activeView;
        store.setState({ activeView: cur === 'configurator' ? 'story' : 'configurator' });
      } else if (e.key === 'k' || e.key === 'K') {
        const cur = store.getState().activeView;
        store.setState({ activeView: cur === 'cockpit' ? 'story' : 'cockpit' });
      } else if (e.key === 'g' || e.key === 'G') {
        const cur = store.getState().activeView;
        store.setState({ activeView: cur === 'gallery' ? 'story' : 'gallery' });
      } else if (e.key === 'm' || e.key === 'M') {
        const cur = store.getState().soundMuted;
        store.setState({ soundMuted: !cur });
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      } else if (e.key === 'h' || e.key === 'H' || e.key === 'z' || e.key === 'Z') {
        const cur = store.getState().zenMode;
        store.setState({ zenMode: !cur });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
