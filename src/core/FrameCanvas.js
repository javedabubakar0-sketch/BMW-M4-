import { store } from './StateStore.js';
import { perfTier } from './PerformanceTier.js';
import { frameCache } from './FrameCache.js';

class FrameCanvas {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.totalFrames = 300;
    this.isReady = false;

    // Source frame natural dimensions
    this.srcWidth = 1280;
    this.srcHeight = 720;

    // Cached layout metrics (recalculated only on resize)
    this.viewportWidth = 0;
    this.viewportHeight = 0;
    this.drawX = 0;
    this.drawY = 0;
    this.drawW = 0;
    this.drawH = 0;
    this.dpr = 1.5;

    // Offscreen cached background to eliminate per-frame gradient calculation
    this.bgCanvas = document.createElement('canvas');
    this.bgCtx = this.bgCanvas.getContext('2d');

    // Rendering dirty state
    this.lastRenderedFrame = -1;
    this.lastRenderedFilter = '';
    this.isDirty = true;

    // Laser reveal & headlight states
    this.revealProgress = 1.0;
    this.laserX = 1.5;
    this.headlightIntensity = 0.0;
  }

  init(canvasElement, onProgress, onComplete) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });
    this.applySmoothingSettings();

    this.dpr = perfTier.dpr;
    this.updateLayoutMetrics();

    const onResize = () => {
      this.dpr = perfTier.dpr;
      this.updateLayoutMetrics();
      this.isDirty = true;
      this.render(this.lastRenderedFrame);
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('fullscreenchange', onResize, { passive: true });

    store.subscribe((state, prevState) => {
      if (
        state.paint !== prevState?.paint ||
        state.lightingMode !== prevState?.lightingMode ||
        state.theme !== prevState?.theme
      ) {
        this.cacheBackground();
        this.isDirty = true;
        this.render(this.lastRenderedFrame);
      }
    });

    // Start preloading frames concurrently
    this.preloadInitialSequence(onProgress, onComplete);
  }

  applySmoothingSettings() {
    if (!this.ctx) return;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  async preloadInitialSequence(onProgress, onComplete) {
    // 1. Priority 1: Hero Frame 0 so the first screen is instant and crisp
    await frameCache.decodeFrame(0);
    this.isReady = true;
    this.cacheBackground();
    this.render(0);
    if (onProgress) onProgress(8);

    // 2. High-speed parallel preloader for all 300 frames (16 concurrent workers)
    let readyTriggered = false;

    frameCache.preloadAll((pct) => {
      if (onProgress) onProgress(pct);

      // Once 35% of frames are cached, reveal site smoothly while remainder completes in background
      if (!readyTriggered && pct >= 35) {
        readyTriggered = true;
        if (onComplete) onComplete();
      }
    }, 16).then(() => {
      if (!readyTriggered) {
        readyTriggered = true;
        if (onProgress) onProgress(100);
        if (onComplete) onComplete();
      }
    });
  }

  updateLayoutMetrics() {
    if (!this.canvas) return;
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    const w = Math.round(this.viewportWidth * this.dpr);
    const h = Math.round(this.viewportHeight * this.dpr);

    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.canvas.style.width = `${this.viewportWidth}px`;
      this.canvas.style.height = `${this.viewportHeight}px`;

      this.bgCanvas.width = w;
      this.bgCanvas.height = h;

      this.applySmoothingSettings();
    }

    // Edge-to-edge cover scaling: fills the entire viewport at any aspect ratio
    const scale = Math.max(w / this.srcWidth, h / this.srcHeight);
    this.drawW = Math.round(this.srcWidth * scale);
    this.drawH = Math.round(this.srcHeight * scale);

    // Center vehicle frame within the viewport
    this.drawX = Math.round((w - this.drawW) * 0.5);
    this.drawY = Math.round((h - this.drawH) * 0.5);

    this.cacheBackground();
  }

  cacheBackground() {
    if (!this.bgCtx) return;
    const w = this.bgCanvas.width;
    const h = this.bgCanvas.height;

    // Solid base
    this.bgCtx.fillStyle = '#050505';
    this.bgCtx.fillRect(0, 0, w, h);

    // Studio radial spotlight behind vehicle
    const centerX = this.drawX + this.drawW * 0.5;
    const centerY = this.drawY + this.drawH * 0.45;
    const bgGlow = this.bgCtx.createRadialGradient(
      centerX, centerY, this.drawW * 0.1,
      centerX, centerY, this.drawW * 0.75
    );
    bgGlow.addColorStop(0, 'rgba(35, 40, 48, 0.4)');
    bgGlow.addColorStop(0.6, 'rgba(15, 18, 22, 0.15)');
    bgGlow.addColorStop(1, 'rgba(5, 5, 5, 0.0)');
    this.bgCtx.fillStyle = bgGlow;
    this.bgCtx.fillRect(0, 0, w, h);

    // Floor reflection gradient
    const floorY = this.drawY + this.drawH * 0.78;
    const floorHeight = Math.max(0, h - floorY);
    if (floorHeight > 0) {
      const floorGrad = this.bgCtx.createLinearGradient(0, floorY, 0, h);
      floorGrad.addColorStop(0, 'rgba(5, 5, 5, 0.0)');
      floorGrad.addColorStop(0.4, 'rgba(5, 5, 5, 0.45)');
      floorGrad.addColorStop(1, 'rgba(5, 5, 5, 0.95)');
      this.bgCtx.fillStyle = floorGrad;
      this.bgCtx.fillRect(0, floorY, w, floorHeight);
    }
  }

  setRevealState(laserProgress) {
    this.laserX = laserProgress;
    this.revealProgress = Math.min(1.0, laserProgress * 1.3);
    this.isDirty = true;
    this.render(this.lastRenderedFrame);
  }

  setHeadlightIntensity(intensity) {
    this.headlightIntensity = intensity;
    this.isDirty = true;
    this.render(this.lastRenderedFrame);
  }

  render(frameIndex) {
    if (!this.ctx || !this.isReady) return;

    const targetIdx = Math.max(0, Math.min(this.totalFrames - 1, Math.round(frameIndex)));
    const currentPaint = store.getPaint();
    const filterStr = currentPaint?.filter || 'none';

    // Dirty check: if frame & filter & reveal didn't change, skip costly canvas redraw!
    if (
      targetIdx === this.lastRenderedFrame &&
      filterStr === this.lastRenderedFilter &&
      !this.isDirty
    ) {
      return;
    }

    const frameBmp = frameCache.getFrame(targetIdx);
    if (!frameBmp) return;

    this.lastRenderedFrame = targetIdx;
    this.lastRenderedFilter = filterStr;
    this.isDirty = false;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Blit pre-rendered background in single GPU call (~0.04ms)
    this.ctx.drawImage(this.bgCanvas, 0, 0);

    // 2. Draw car frame with paint filter
    this.ctx.save();
    if (filterStr !== 'none') {
      this.ctx.filter = filterStr;
    }
    this.ctx.drawImage(frameBmp, this.drawX, this.drawY, this.drawW, this.drawH);
    this.ctx.restore();

    // 3. Headlights / Night overlay if active
    const state = store.getState();
    if (state.lightingMode === 'night' || state.lightingMode === 'welcome' || this.headlightIntensity > 0) {
      const alpha = state.lightingMode === 'night' ? 0.85 : this.headlightIntensity;
      if (alpha > 0.01) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        const headlightX = this.drawX + this.drawW * 0.38;
        const headlightY = this.drawY + this.drawH * 0.56;

        this.ctx.fillStyle = `rgba(220, 245, 255, ${alpha * 0.5})`;
        this.ctx.beginPath();
        this.ctx.arc(headlightX, headlightY, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // 4. Hero laser reveal sweep if in initial animation
    if (this.revealProgress < 1.0) {
      const sweepX = this.laserX * w;
      this.ctx.save();
      if (sweepX < w) {
        this.ctx.fillStyle = 'rgba(5, 5, 5, 0.94)';
        this.ctx.fillRect(sweepX + 2, 0, w - sweepX, h);
      }
      this.ctx.restore();
    }
  }
}

export const frameCanvas = new FrameCanvas();
