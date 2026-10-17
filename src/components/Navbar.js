import { store } from '../core/StateStore.js';
import { audio } from '../core/AudioManager.js';
import { EXPERIENCE_THEMES } from '../data/configurationData.js';

export class Navbar {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <nav class="site-nav">
        <div class="brand-block">
          <div class="brand-mark">
            <span>PROJECT</span>
            <span style="color: var(--accent-color);">V</span>
          </div>
          <span class="brand-badge">STUDY 01</span>
        </div>

        <ul class="nav-links">
          <li class="nav-link active" data-view="story">OVERVIEW</li>
          <li class="nav-link" data-view="cockpit">COCKPIT</li>
          <li class="nav-link" data-view="configurator">CONFIGURATOR</li>
          <li class="nav-link" data-view="gallery">GALLERY</li>
        </ul>

        <div class="nav-actions">
          <!-- Theme Menu Dropdown -->
          <div class="theme-dropdown-wrap" style="position: relative;">
            <button class="theme-menu-btn" id="theme-btn">
              <span style="width:8px; height:8px; border-radius:50%; background:var(--accent-color);"></span>
              <span id="theme-name-label">THEME</span>
            </button>
            <div class="theme-dropdown-menu" id="theme-menu" style="display:none; position:absolute; top:42px; right:0; background:var(--glass-bg); border:1px solid var(--glass-border); backdrop-filter:var(--glass-blur); border-radius:4px; padding:6px; min-width:170px; z-index:110;">
              ${EXPERIENCE_THEMES.map(t => `
                <button class="theme-opt-btn" data-theme="${t.id}" style="display:flex; align-items:center; gap:8px; width:100%; padding:8px 12px; font-family:var(--font-mono); font-size:0.68rem; letter-spacing:0.1em; color:var(--text-secondary); text-align:left; border-radius:2px; transition:all 150ms;">
                  <span style="width:6px; height:6px; border-radius:50%; background:${t.accent};"></span>
                  ${t.name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Fullscreen Toggle Button -->
          <button class="fullscreen-btn" id="fullscreen-btn" title="Toggle Fullscreen (F)">
            <svg class="fs-enter-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            <svg class="fs-exit-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
            <span class="fs-label">FULLSCREEN</span>
          </button>

          <!-- Clean View (Zen Mode) Toggle Button -->
          <button class="zen-btn" id="zen-btn" title="Toggle Clean View - Unobstructed 3D Model (H)">
            <svg class="zen-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span id="zen-label">CLEAN VIEW</span>
          </button>

          <!-- Sound Controller Widget -->
          <div class="sound-widget">
            <button class="sound-toggle-btn" id="sound-toggle-btn">
              <div class="sound-bars">
                <span class="sound-bar"></span>
                <span class="sound-bar"></span>
                <span class="sound-bar"></span>
              </div>
              <span id="sound-label">SOUND OFF</span>
            </button>
          </div>
        </div>
      </nav>
    `;

    this.bindEvents();
    this.syncState(store.getState());
    store.subscribe((state) => this.syncState(state));
  }

  bindEvents() {
    // Navigation Links
    const links = this.container.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        const view = link.getAttribute('data-view');
        audio.playUiClick();
        store.setState({ activeView: view });
      });
    });

    // Sound Toggle Button
    const soundBtn = this.container.querySelector('#sound-toggle-btn');
    soundBtn.addEventListener('click', () => {
      audio.ensureContext();
      const current = store.getState().soundMuted;
      store.setState({ soundMuted: !current });
      audio.playUiClick();
    });

    // Theme Selector
    const themeBtn = this.container.querySelector('#theme-btn');
    const themeMenu = this.container.querySelector('#theme-menu');

    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playUiClick();
      themeMenu.style.display = themeMenu.style.display === 'none' ? 'flex' : 'none';
      themeMenu.style.flexDirection = 'column';
    });

    document.addEventListener('click', () => {
      if (themeMenu) themeMenu.style.display = 'none';
    });

    const themeOpts = this.container.querySelectorAll('.theme-opt-btn');
    themeOpts.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = btn.getAttribute('data-theme');
        audio.playUiClick();
        store.setState({ theme: themeId });
        themeMenu.style.display = 'none';
      });
    });

    // Fullscreen Toggle
    const fsBtn = this.container.querySelector('#fullscreen-btn');
    if (fsBtn) {
      const enterIcon = fsBtn.querySelector('.fs-enter-icon');
      const exitIcon = fsBtn.querySelector('.fs-exit-icon');
      const fsLabel = fsBtn.querySelector('.fs-label');

      const updateFsState = () => {
        const isFs = !!document.fullscreenElement;
        if (enterIcon) enterIcon.style.display = isFs ? 'none' : 'block';
        if (exitIcon) exitIcon.style.display = isFs ? 'block' : 'none';
        if (fsLabel) fsLabel.textContent = isFs ? 'EXIT FULL' : 'FULLSCREEN';
      };

      fsBtn.addEventListener('click', () => {
        audio.playUiClick();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      document.addEventListener('fullscreenchange', updateFsState);
    }

    // Clean View (Zen Mode) Toggle
    const zenBtn = this.container.querySelector('#zen-btn');
    if (zenBtn) {
      zenBtn.addEventListener('click', () => {
        audio.playUiClick();
        store.setState({ zenMode: !store.getState().zenMode });
      });
    }
  }

  syncState(state) {
    // Sync Active Navigation link
    const links = this.container.querySelectorAll('.nav-link');
    links.forEach(link => {
      const view = link.getAttribute('data-view');
      link.classList.toggle('active', view === state.activeView);
    });

    // Sync Clean View (Zen Mode)
    const zenBtn = this.container.querySelector('#zen-btn');
    const zenLabel = this.container.querySelector('#zen-label');
    if (zenBtn && zenLabel) {
      zenBtn.classList.toggle('active', !!state.zenMode);
      zenLabel.textContent = state.zenMode ? 'SHOW HUD' : 'CLEAN VIEW';
    }
    document.body.classList.toggle('zen-mode', !!state.zenMode);

    // Sync Sound Button
    const soundBtn = this.container.querySelector('#sound-toggle-btn');
    const soundLabel = this.container.querySelector('#sound-label');
    if (soundBtn && soundLabel) {
      if (state.soundMuted) {
        soundBtn.classList.remove('active', 'playing');
        soundLabel.textContent = 'SOUND OFF';
      } else {
        soundBtn.classList.add('active', 'playing');
        soundLabel.textContent = 'SOUND ON';
      }
    }

    // Sync Theme
    const currentTheme = store.getTheme();
    const themeNameLabel = this.container.querySelector('#theme-name-label');
    if (themeNameLabel) {
      themeNameLabel.textContent = currentTheme.name.toUpperCase();
    }

    // Apply Theme to body class
    document.body.className = `theme-${state.theme}${state.zenMode ? ' zen-mode' : ''}`;
  }
}
