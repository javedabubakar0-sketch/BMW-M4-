import { scroller } from '../core/Scroller.js';
import { audio } from '../core/AudioManager.js';
import { TRACK_CHAPTERS } from '../data/systemsData.js';

export class TrackBar {
  constructor(container) {
    this.container = container;
    this.lastActiveChapter = null;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="trackbar-container">
        <div class="trackbar-line-wrapper">
          <div class="trackbar-progress-fill" id="track-fill" style="transform-origin: left; will-change: transform;"></div>

          <!-- Minimalist Automotive Silhouette SVG -->
          <div class="trackbar-car-silhouette" id="track-car" style="will-change: transform;">
            <svg viewBox="0 0 40 18" fill="currentColor">
              <path d="M1 13 L4 13 C5 11.5 6.5 10.5 8.5 10.5 C10.5 10.5 12 11.5 13 13 L27 13 C28 11.5 29.5 10.5 31.5 10.5 C33.5 10.5 35 11.5 36 13 L39 13 C39.5 13 40 12.5 40 12 C39.5 9 37 8 34 7.5 L26 4 C24 3 20 3 17 4 L10 7.5 C6 8 2 9 1 12 C0.8 12.6 1 13 1 13 Z M8.5 15 C7.1 15 6 13.9 6 12.5 C6 11.1 7.1 10 8.5 10 C9.9 10 11 11.1 11 12.5 C11 13.9 9.9 15 8.5 15 Z M31.5 15 C30.1 15 29 13.9 29 12.5 C29 11.1 30.1 10 31.5 10 C32.9 10 34 11.1 34 12.5 C34 13.9 32.9 15 31.5 15 Z"/>
            </svg>
          </div>
        </div>

        <div class="trackbar-chapters">
          ${TRACK_CHAPTERS.map((ch) => `
            <button class="track-chapter-node" data-progress="${ch.progress}" id="chapter-${ch.id}">
              <span class="chapter-pip"></span>
              <span class="chapter-label">${ch.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const car = this.container.querySelector('#track-car');
    const fill = this.container.querySelector('#track-fill');
    const lineWrapper = this.container.querySelector('.trackbar-line-wrapper');
    const chapterNodes = this.container.querySelectorAll('.track-chapter-node');

    let trackWidth = lineWrapper ? lineWrapper.clientWidth : 800;
    window.addEventListener('resize', () => {
      if (lineWrapper) trackWidth = lineWrapper.clientWidth;
    }, { passive: true });

    chapterNodes.forEach(node => {
      node.addEventListener('click', () => {
        const prog = parseFloat(node.getAttribute('data-progress'));
        audio.playUiClick();
        scroller.scrollToProgress(prog, true);
      });
    });

    // GPU-accelerated transforms (translate3d & scaleX)
    const trackContainer = this.container.querySelector('.trackbar-container');
    scroller.subscribe((progress, frameIndex, phaseIndex, vel, footerRatio) => {
      // Fade out trackbar cleanly when entering the footer
      if (trackContainer) {
        const opacity = Math.max(0, 1 - (footerRatio || 0) * 2.5);
        trackContainer.style.opacity = opacity;
        trackContainer.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
      }

      const clampedProg = Math.max(0, Math.min(1, progress));
      if (car) {
        car.style.transform = `translate3d(${clampedProg * trackWidth}px, 0, 0) translateX(-50%)`;
      }
      if (fill) {
        fill.style.transform = `scaleX(${clampedProg})`;
      }

      // Update active chapter only when changed
      chapterNodes.forEach(node => {
        const nodeProg = parseFloat(node.getAttribute('data-progress'));
        const isNear = Math.abs(progress - nodeProg) < 0.08;
        if (node.classList.contains('active') !== isNear) {
          node.classList.toggle('active', isNear);
        }
      });
    });
  }
}
