import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { store } from './StateStore.js';
import { frameCanvas } from './FrameCanvas.js';
import { frameCache } from './FrameCache.js';
import { audio } from './AudioManager.js';
import { SCROLL_PHASES } from '../data/systemsData.js';

class Scroller {
  constructor() {
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.scrollVelocity = 0;
    this.lastScrollY = 0;
    this.scrollDirection = 'down';

    this.rafId = null;
    this.scrollContainer = null;
    this.maxScroll = 1;
    this.lenis = null;

    this.lastPhaseIndex = 1;
    this.lastRenderedFrame = -1;
    this.listeners = new Set();
    this.isPaused = false;

    // Accessibility check
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init(scrollContainer) {
    this.scrollContainer = scrollContainer;
    this.updateMaxScroll();

    // High-performance smooth scrolling engine
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: false // Synced directly in our high-precision RAF loop
    });

    this.lenis.on('scroll', (e) => {
      const scrollY = e.scroll;
      // Map scroll strictly to car story track: 0.0 to 1.0 finishes BEFORE footer enters
      this.targetProgress = Math.max(0, Math.min(1, scrollY / this.storyMaxScroll));
      this.scrollVelocity = Math.abs(e.velocity);
      this.scrollDirection = e.direction >= 0 ? 'down' : 'up';

      // Footer entrance ratio [0.0 to 1.0] when scrolling past the story track into footer
      const footerOverscroll = Math.max(0, scrollY - this.storyMaxScroll);
      this.footerRatio = Math.min(1, footerOverscroll / (window.innerHeight * 0.45));
    });

    window.addEventListener('resize', () => {
      this.updateMaxScroll();
      if (this.lenis) this.lenis.resize();
    }, { passive: true });

    // Page Visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPaused = true;
        if (this.rafId) cancelAnimationFrame(this.rafId);
      } else {
        this.isPaused = false;
        this.loop(performance.now());
      }
    });

    // Start high-precision RAF loop
    this.loop(performance.now());
  }

  updateMaxScroll() {
    if (!this.scrollContainer) return;
    const track = document.querySelector('.scroll-track');
    const trackHeight = track ? track.offsetHeight : window.innerHeight * 7;

    // Dedicated distance for 3D car scrollytelling: completes 100% of frames BEFORE footer enters
    this.storyMaxScroll = Math.max(1, trackHeight - window.innerHeight);

    // Total page scroll travel including the VIP footer
    this.totalMaxScroll = Math.max(1, this.scrollContainer.scrollHeight - window.innerHeight);
    this.maxScroll = this.storyMaxScroll;
  }

  scrollToProgress(target, smooth = true) {
    const targetY = target * this.storyMaxScroll;
    if (this.lenis) {
      this.lenis.scrollTo(targetY, {
        immediate: !smooth,
        duration: smooth ? 1.3 : 0
      });
    } else {
      window.scrollTo({ top: targetY, behavior: smooth ? 'smooth' : 'auto' });
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  loop(time) {
    if (this.isPaused) return;

    // 1. Advance Lenis physics engine
    if (this.lenis) {
      this.lenis.raf(time);
    }

    // 2. High-precision sub-frame lerp to eliminate stepped notches
    const delta = this.targetProgress - this.currentProgress;
    const absDelta = Math.abs(delta);

    if (this.prefersReducedMotion || absDelta < 0.00008) {
      this.currentProgress = this.targetProgress;
    } else {
      // Fluid adaptive lerping
      const factor = absDelta > 0.08 ? 0.22 : (absDelta > 0.015 ? 0.16 : 0.12);
      this.currentProgress += delta * factor;
    }

    // 3. Frame index derivation across all 300 frames (0 to 299)
    const frameIndex = Math.min(299, Math.max(0, Math.round(this.currentProgress * 299)));

    // 4. Render frame only when index changes
    if (frameIndex !== this.lastRenderedFrame) {
      frameCanvas.render(frameIndex);
      frameCache.updateScrollContext(frameIndex, this.scrollDirection);
      this.lastRenderedFrame = frameIndex;
    }

    // 5. Determine current phase
    const phaseIndex = Math.min(
      SCROLL_PHASES.length,
      Math.max(1, Math.floor(this.currentProgress * (SCROLL_PHASES.length - 1)) + 1)
    );

    // Discrete Phase Update: ONLY dispatches when phase actually changes
    if (phaseIndex !== this.lastPhaseIndex) {
      if (phaseIndex === 4) {
        audio.playBrakeCue();
      } else if (phaseIndex >= 2 && phaseIndex <= 9) {
        audio.playMechanicalLock();
      }
      this.lastPhaseIndex = phaseIndex;
      store.setState({ currentPhase: phaseIndex });
    }

    // 6. Notify listeners (Trackbar, narrative, HUD, lighting)
    this.listeners.forEach(fn => fn(this.currentProgress, frameIndex, phaseIndex, this.scrollVelocity, this.footerRatio || 0));

    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }
}

export const scroller = new Scroller();
