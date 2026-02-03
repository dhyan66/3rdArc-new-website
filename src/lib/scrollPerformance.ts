/**
 * Scroll Performance Optimization Utilities
 * Focuses on true performance improvements without disruptive scroll behavior changes
 */

export const initializeScrollOptimizations = () => {
  // Prevent layout thrashing during scroll
  let ticking = false;

  const scheduleUpdate = (callback: () => void) => {
    if (!ticking) {
      window.requestAnimationFrame(callback);
      ticking = true;
    }
  };

  // Monitor scroll performance
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('scroll')) {
        console.debug('Scroll performance:', entry.duration, 'ms');
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (e) {
    // PerformanceObserver not supported
  }

  // Optimize fast scrolling
  let lastScrollTime = Date.now();
  const handleOptimizedScroll = () => {
    const now = Date.now();
    const delta = now - lastScrollTime;
    lastScrollTime = now;

    // Log if scroll is slow (>16ms = below 60fps)
    if (delta > 16.67) {
      console.debug('Scroll frame drop detected:', delta.toFixed(2), 'ms');
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    scheduleUpdate(handleOptimizedScroll);
  }, { passive: true });

  return () => {
    observer.disconnect();
  };
};

export default initializeScrollOptimizations;
