import { useEffect } from 'react';

export const useScrollOptimization = () => {
  useEffect(() => {
    // Set scroll behavior to auto for best performance
    // Smooth scroll causes janky performance on large pages
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Just add a passive scroll listener to prevent layout thrashing
    let scrolling = false;
    
    const handleScroll = () => {
      scrolling = true;
      requestAnimationFrame(() => {
        scrolling = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

export default useScrollOptimization;

