import { useEffect } from 'react';

export const useImagePreload = (urls: string[]) => {
  useEffect(() => {
    // Preload images in the background
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }, [urls]);
};

export default useImagePreload;
