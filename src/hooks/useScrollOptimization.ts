import { useEffect } from 'react';

export const useScrollOptimization = () => {
  useEffect(() => {
    // Enable VSYNC-aligned scroll behavior
    const html = document.documentElement;
    
    // Ensure smooth scrolling is always enabled
    html.style.scrollBehavior = 'smooth';
    html.style.scrollbarGutter = 'stable';
    
    // Optimize scrollable elements for performance
    const scrollableElements = document.querySelectorAll('[class*="scroll"], [style*="overflow"]');
    scrollableElements.forEach(el => {
      (el as HTMLElement).style.overscrollBehavior = 'contain';
      (el as HTMLElement).style.webkitOverflowScrolling = 'touch';
      // Enable hardware acceleration for smooth scrolling
      (el as HTMLElement).style.transform = 'translateZ(0)';
      (el as HTMLElement).style.backfaceVisibility = 'hidden';
      (el as HTMLElement).style.perspective = '1000px';
    });

    // Optimize images and heavy content
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.style.willChange = 'auto';
      img.loading = 'lazy';
    });

    // Disable text selection during scroll for better performance
    const handleScrollStart = () => {
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
    };

    const handleScrollEnd = () => {
      document.body.style.userSelect = 'auto';
      document.body.style.pointerEvents = 'auto';
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      handleScrollStart();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      html.style.scrollBehavior = '';
      html.style.scrollbarGutter = '';
    };
  }, []);
};

export default useScrollOptimization;

