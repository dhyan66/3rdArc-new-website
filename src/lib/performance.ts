// Performance monitoring and optimization utilities
export const setupPerformanceMonitoring = () => {
  // Observe Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.debug('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            console.debug('CLS:', clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay (FID) / Interaction to Next Paint (INP)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          console.debug('INP:', (entry as any).processingDuration);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input', 'event'] });
    } catch (e) {
      // Silently fail if observers not supported
    }
  }

  // Monitor navigation timing
  if ('PerformanceNavigationTiming' in window) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.debug('Page Load Time:', pageLoadTime, 'ms');
    });
  }
};

export default setupPerformanceMonitoring;
