import { useEffect } from 'react';

export const useScrollOptimization = () => {
  useEffect(() => {
    // Enable VSYNC-aligned scroll behavior
    const html = document.documentElement;
    
    // Ensure smooth scrolling is always enabled
    html.style.scrollBehavior = 'smooth';
    
    // Optimize scrollable elements for performance
    const scrollableElements = document.querySelectorAll('[class*="scroll"]');
    scrollableElements.forEach(el => {
      (el as HTMLElement).style.overscrollBehavior = 'contain';
      (el as HTMLElement).style.webkitOverflowScrolling = 'touch';
    });

    return () => {
      html.style.scrollBehavior = '';
    };
  }, []);
};

export default useScrollOptimization;

