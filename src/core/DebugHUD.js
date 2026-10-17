import { scroller } from './Scroller.js';
import { frameCanvas } from './FrameCanvas.js';
import { frameCache } from './FrameCache.js';
import { perfTier } from './PerformanceTier.js';

class DebugHUD {
  constructor() {
    this.container = null;
    this.isVisible = false;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();
    this.currentFps = 60;
    this.lastFrameDuration = 0;
    this.updateInterval = null;

    // Check query param ?debug=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === '1') {
      this.isVisible = true;
    }
  }

  init() {
    this.container = document.createElement('div');
    this.container.id = 'perf-debug-hud';
    this.container.style.cssText = `
      position: fixed;
      top: 80px;
      left: 20px;
      background: rgba(5, 7, 10, 0.88);
      border: 1px solid rgba(229, 184, 11, 0.4);
      border-radius: 6px;
      padding: 12px 16px;
      color: #00ff88;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      line-height: 1.6;
      z-index: 99999;
      pointer-events: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.8);
      display: ${this.isVisible ? 'block' : 'none'};
      min-width: 220px;
    `;
    document.body.appendChild(this.container);

    // Keyboard toggle Shift + D
    window.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        this.toggle();
      }
    });

    // Track RAF frame times
    let lastTime = performance.now();
    scroller.subscribe(() => {
      const now = performance.now();
      this.lastFrameDuration = now - lastTime;
      lastTime = now;
      this.frameCount++;

      if (now - this.lastFpsTime >= 1000) {
        this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
        this.frameCount = 0;
        this.lastFpsTime = now;
      }
    });

    // Throttled HUD DOM updates (8 times per second / every 125ms)
    setInterval(() => {
      if (this.isVisible) this.updateDOM();
    }, 125);
  }

  toggle() {
    this.isVisible = !this.isVisible;
    this.container.style.display = this.isVisible ? 'block' : 'none';
  }

  updateDOM() {
    const stats = frameCache.getStats();
    let memText = 'N/A';
    if (performance.memory) {
      memText = `${Math.round(performance.memory.usedJSHeapSize / (1024 * 1024))} MB`;
    }

    const fpsColor = this.currentFps >= 55 ? '#00ff88' : (this.currentFps >= 40 ? '#ffb703' : '#ff3333');

    this.container.innerHTML = `
      <div style="color:#ffffff; font-weight:700; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:4px; margin-bottom:6px;">
        ENGINE PERF HUD [Shift+D]
      </div>
      <div>FPS: <strong style="color:${fpsColor}; font-size:13px;">${this.currentFps}</strong> (${this.lastFrameDuration.toFixed(1)}ms)</div>
      <div>TIER: <span style="color:#ffffff;">${perfTier.tier}</span> (DPR ${perfTier.dpr})</div>
      <div>PROGRESS: ${(scroller.currentProgress * 100).toFixed(1)}%</div>
      <div>FRAME: <strong>${frameCanvas.lastRenderedFrame}</strong> / 299</div>
      <div>DECODED: <strong>${stats.decodedCount}</strong> / ${stats.cacheLimit} limit</div>
      <div>VELOCITY: ${Math.round(scroller.scrollVelocity)} px/frame</div>
      <div>MEM HEAP: ${memText}</div>
    `;
  }
}

export const debugHUD = new DebugHUD();
