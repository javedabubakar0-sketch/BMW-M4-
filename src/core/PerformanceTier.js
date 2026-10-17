class PerformanceTier {
  constructor() {
    this.tier = 'HIGH'; // 'HIGH', 'BALANCED', 'LITE'
    this.dpr = 1.5;
    this.cacheLimit = 140;
    this.detect();
  }

  detect() {
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // GB if supported

    const nativeDpr = window.devicePixelRatio || 1;

    if (isMobile || cores <= 2 || memory <= 2) {
      this.tier = 'LITE';
      this.dpr = Math.min(nativeDpr, 1.5);
      this.cacheLimit = 150;
    } else if (cores <= 4 || memory <= 4 || window.innerWidth <= 1200) {
      this.tier = 'BALANCED';
      this.dpr = Math.min(nativeDpr, 2.0);
      this.cacheLimit = 300;
    } else {
      this.tier = 'HIGH';
      this.dpr = Math.min(nativeDpr, 2.0);
      this.cacheLimit = 300;
    }

    console.info(`[Engine] Performance Tier: ${this.tier} (DPR: ${this.dpr}, Cache: ${this.cacheLimit} frames)`);
  }
}

export const perfTier = new PerformanceTier();
