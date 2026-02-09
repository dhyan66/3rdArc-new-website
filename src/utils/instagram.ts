/**
 * Open Instagram profile with app fallback for better mobile compatibility
 */
export const openInstagram = (username: string) => {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isAndroid || isIOS) {
    // Try to open Instagram app first
    const appUrl = `instagram://user?username=${username}`;
    const webUrl = `https://www.instagram.com/${username}`;
    
    // Create a temporary link to test if app is installed
    const now = Date.now();
    window.location.href = appUrl;
    
    // Fallback to web if app doesn't open within 1 second
    setTimeout(() => {
      if (Date.now() - now < 1200) {
        window.location.href = webUrl;
      }
    }, 1000);
  } else {
    // Desktop: just open the web URL
    window.open(`https://www.instagram.com/${username}`, '_blank');
  }
};
