/**
 * Scroll Performance Optimization Utilities
 * Focuses on true performance improvements without disruptive scroll behavior changes
 */

export const initializeScrollOptimizations = () => {
  // Prevent layout thrashing during scroll
  let ticking = false;
  let lastScrollY = window.scrollY;

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

  // Optimize fast scrolling with frame rate monitoring
  let lastScrollTime = Date.now();
  let frameCount = 0;
  const handleOptimizedScroll = () => {
    const now = Date.now();
    const delta = now - lastScrollTime;
    const currentScrollY = window.scrollY;
    
    // Track scroll velocity for smooth animations
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    lastScrollTime = now;
    frameCount++;

    // Log if scroll is slow (>16ms = below 60fps)
    if (delta > 16.67 && frameCount % 30 === 0) {
      console.debug('Scroll frame drop detected:', delta.toFixed(2), 'ms');
    }

    ticking = false;
  };

  // Use passive event listener for better scroll performance
  window.addEventListener('scroll', () => {
    scheduleUpdate(handleOptimizedScroll);
  }, { passive: true });

  // Optimize images and content during scroll
  let hideTimer: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    // Debounce heavy operations during scroll
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      // Resume lazy loading and heavy ops after scroll
    }, 150);
  }, { passive: true });

  return () => {
    observer.disconnect();
    clearTimeout(hideTimer);
  };
};

export default initializeScrollOptimizations;
