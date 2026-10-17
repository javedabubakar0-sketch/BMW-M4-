import { store } from '../core/StateStore.js';
import { audio } from '../core/AudioManager.js';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../data/galleryData.js';

export class GalleryView {
  constructor(container) {
    this.container = container;
    this.activeCategory = 'ALL';
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="gallery-view" id="gallery-view">
        <div class="gallery-header">
          <div>
            <span style="font-family:var(--font-mono); font-size:0.75rem; letter-spacing:0.25em; color:var(--accent-color);">EDITORIAL ARCHIVE</span>
            <h2 class="gallery-title">DESIGN & ENGINEERING</h2>
          </div>

          <div style="display:flex; align-items:center; gap:24px;">
            <ul class="gallery-categories">
              ${GALLERY_CATEGORIES.map(cat => `
                <li>
                  <button class="gallery-cat-btn ${cat === 'ALL' ? 'active' : ''}" data-cat="${cat}">${cat}</button>
                </li>
              `).join('')}
            </ul>

            <button class="drawer-close-btn" id="gallery-close-btn">RETURN</button>
          </div>
        </div>

        <div class="gallery-grid" id="gallery-grid">
          ${this.renderCards()}
        </div>

        <!-- Fullscreen Lightbox -->
        <div class="lightbox-modal" id="lightbox-modal">
          <div class="lightbox-content">
            <button class="lightbox-close" id="lightbox-close">CLOSE [ESC]</button>
            <img id="lightbox-img" src="" alt="Project V Editorial">
            <div id="lightbox-meta" style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-secondary); text-align:center;"></div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    store.subscribe((state) => this.sync(state));
  }

  resolveAsset(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    const base = import.meta.env.BASE_URL || './';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    return `${normalizedBase}${url.replace(/^\//, '')}`;
  }

  renderCards() {
    const filtered = this.activeCategory === 'ALL'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter(i => i.category === this.activeCategory);

    return filtered.map(item => {
      const resolvedImg = this.resolveAsset(item.img);
      return `
      <div class="gallery-card" data-img="${resolvedImg}" data-title="${item.title}" data-specs="${item.specs}">
        <div class="gallery-img-wrap">
          <img src="${resolvedImg}" alt="${item.title}" loading="lazy">
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">${item.tag}</span>
          <h3 class="gallery-card-title">${item.title}</h3>
          <p class="gallery-card-desc">${item.specs}</p>
        </div>
      </div>
    `;
    }).join('');
  }

  bindEvents() {
    const view = this.container.querySelector('#gallery-view');
    const closeBtn = this.container.querySelector('#gallery-close-btn');
    const grid = this.container.querySelector('#gallery-grid');
    const catBtns = this.container.querySelectorAll('.gallery-cat-btn');

    const lightbox = this.container.querySelector('#lightbox-modal');
    const lightboxImg = this.container.querySelector('#lightbox-img');
    const lightboxMeta = this.container.querySelector('#lightbox-meta');
    const lightboxClose = this.container.querySelector('#lightbox-close');

    closeBtn.addEventListener('click', () => {
      audio.playUiClick();
      store.setState({ activeView: 'story' });
    });

    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        audio.playUiClick();
        this.activeCategory = cat;
        catBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-cat') === cat));
        grid.innerHTML = this.renderCards();
        this.bindCardClicks();
      });
    });

    this.bindCardClicks();

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });
  }

  bindCardClicks() {
    const cards = this.container.querySelectorAll('.gallery-card');
    const lightbox = this.container.querySelector('#lightbox-modal');
    const lightboxImg = this.container.querySelector('#lightbox-img');
    const lightboxMeta = this.container.querySelector('#lightbox-meta');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-img');
        const title = card.getAttribute('data-title');
        const specs = card.getAttribute('data-specs');
        audio.playUiClick();
        lightboxImg.src = src;
        lightboxMeta.innerHTML = `<strong style="color:var(--text-primary); font-size:1.1rem;">${title}</strong><br><span style="color:var(--accent-color);">${specs}</span>`;
        lightbox.classList.add('active');
      });
    });
  }

  sync(state) {
    const view = this.container.querySelector('#gallery-view');
    view.classList.toggle('active', state.activeView === 'gallery');
  }
}
