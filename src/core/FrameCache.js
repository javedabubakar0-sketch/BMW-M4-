import { perfTier } from './PerformanceTier.js';

class FrameCache {
  constructor() {
    this.totalFrames = 300;
    this.decodedBitmaps = new Map(); // frameIndex -> ImageBitmap | HTMLImageElement
    this.accessTimes = new Map();     // frameIndex -> timestamp
    this.loadingSet = new Set();      // in-flight frame indices
    this.lastRenderedBitmap = null;
    this.currentScrollFrame = 0;
    this.scrollDirection = 'down';
    this.isSupportedBitmap = typeof window.createImageBitmap === 'function';
    this.idleHandle = null;
  }

  getFrameUrl(index) {
    const padded = String(index + 1).padStart(3, '0');
    const base = import.meta.env.BASE_URL || './';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    return `${normalizedBase}frames/ezgif-frame-${padded}.jpg`;
  }

  async decodeFrame(index) {
    if (this.decodedBitmaps.has(index)) {
      return this.decodedBitmaps.get(index);
    }
    if (this.loadingSet.has(index)) {
      return null;
    }

    this.loadingSet.add(index);
    const url = this.getFrameUrl(index);

    try {
      if (this.isSupportedBitmap) {
        // Off-thread decoding via fetch + createImageBitmap
        const res = await fetch(url, { cache: 'force-cache' });
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob, {
          imageOrientation: 'none',
          premultiplyAlpha: 'none'
        });
        this.decodedBitmaps.set(index, bitmap);
        this.accessTimes.set(index, performance.now());
        this.loadingSet.delete(index);
        this.evictLRU();
        return bitmap;
      } else {
        // Fallback: HTMLImageElement.decode()
        const img = new Image();
        img.src = url;
        await img.decode();
        this.decodedBitmaps.set(index, img);
        this.accessTimes.set(index, performance.now());
        this.loadingSet.delete(index);
        this.evictLRU();
        return img;
      }
    } catch (err) {
      this.loadingSet.delete(index);
      return null;
    }
  }

  evictLRU() {
    const limit = perfTier.cacheLimit;
    if (this.decodedBitmaps.size <= limit) return;

    // Find candidates furthest from currentScrollFrame
    const current = this.currentScrollFrame;
    const entries = Array.from(this.decodedBitmaps.keys())
      .filter(idx => idx !== 0 && Math.abs(idx - current) > 8); // Never evict Hero frame 0 or nearby ±8

    if (entries.length === 0) return;

    // Sort by distance from current frame descending (furthest first)
    entries.sort((a, b) => Math.abs(b - current) - Math.abs(a - current));

    const toRemove = entries.slice(0, this.decodedBitmaps.size - limit);
    for (const idx of toRemove) {
      const bitmap = this.decodedBitmaps.get(idx);
      if (bitmap && typeof bitmap.close === 'function') {
        bitmap.close(); // Release GPU memory
      }
      this.decodedBitmaps.delete(idx);
      this.accessTimes.delete(idx);
    }
  }

  getFrame(index) {
    // 1. Direct hit
    if (this.decodedBitmaps.has(index)) {
      this.accessTimes.set(index, performance.now());
      const bmp = this.decodedBitmaps.get(index);
      this.lastRenderedBitmap = bmp;
      return bmp;
    }

    // 2. Outward search for nearest decoded neighbor (flicker-free fallback)
    for (let offset = 1; offset <= 45; offset++) {
      const prev = index - offset;
      if (prev >= 0 && this.decodedBitmaps.has(prev)) {
        const bmp = this.decodedBitmaps.get(prev);
        this.lastRenderedBitmap = bmp;
        return bmp;
      }
      const next = index + offset;
      if (next < this.totalFrames && this.decodedBitmaps.has(next)) {
        const bmp = this.decodedBitmaps.get(next);
        this.lastRenderedBitmap = bmp;
        return bmp;
      }
    }

    // 3. Keep last rendered frame or hero frame
    if (this.lastRenderedBitmap) return this.lastRenderedBitmap;
    return this.decodedBitmaps.get(0) || null;
  }

  updateScrollContext(currentFrame, direction) {
    this.currentScrollFrame = currentFrame;
    this.scrollDirection = direction;

    // Direction-aware priority window
    const priorityRange = [];
    const windowSize = 25;

    if (direction === 'down') {
      for (let i = 0; i <= windowSize; i++) {
        const idx = currentFrame + i;
        if (idx < this.totalFrames && !this.decodedBitmaps.has(idx)) priorityRange.push(idx);
      }
      for (let i = 1; i <= 8; i++) {
        const idx = currentFrame - i;
        if (idx >= 0 && !this.decodedBitmaps.has(idx)) priorityRange.push(idx);
      }
    } else {
      for (let i = 0; i <= windowSize; i++) {
        const idx = currentFrame - i;
        if (idx >= 0 && !this.decodedBitmaps.has(idx)) priorityRange.push(idx);
      }
      for (let i = 1; i <= 8; i++) {
        const idx = currentFrame + i;
        if (idx < this.totalFrames && !this.decodedBitmaps.has(idx)) priorityRange.push(idx);
      }
    }

    // Trigger decoding for immediate window
    for (const idx of priorityRange.slice(0, 16)) {
      this.decodeFrame(idx);
    }
  }

  async preloadAll(onProgress, concurrency = 16) {
    let loaded = this.decodedBitmaps.size;
    const total = this.totalFrames;

    // Queue missing frame indices
    const queue = [];
    for (let i = 0; i < total; i++) {
      if (!this.decodedBitmaps.has(i)) {
        queue.push(i);
      }
    }

    if (queue.length === 0) {
      if (onProgress) onProgress(100);
      return;
    }

    const worker = async () => {
      while (queue.length > 0) {
        const idx = queue.shift();
        if (idx !== undefined) {
          await this.decodeFrame(idx);
          loaded++;
          if (onProgress) {
            onProgress(Math.min(100, Math.round((loaded / total) * 100)));
          }
        }
      }
    };

    const workers = [];
    const activeConcurrency = Math.min(concurrency, queue.length);
    for (let w = 0; w < activeConcurrency; w++) {
      workers.push(worker());
    }

    await Promise.all(workers);
  }

  startBackgroundIdleLoading() {
    this.preloadAll(null, 8);
  }

  getStats() {
    return {
      decodedCount: this.decodedBitmaps.size,
      loadingCount: this.loadingSet.size,
      cacheLimit: perfTier.cacheLimit
    };
  }
}

export const frameCache = new FrameCache();
