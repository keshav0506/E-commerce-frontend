/**
 * Optimizes Cloudinary image URLs with automatic format (WebP/AVIF), quality compression, and responsive widths.
 */
export function getOptimizedImageUrl(url?: string | null, width = 600): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Avoid double transformation
    if (url.includes('/upload/f_auto') || url.includes('/upload/w_') || url.includes('/upload/q_')) {
      return url;
    }
    return url.replace('/upload/', `/upload/f_auto,q_auto:good,w_${width}/`);
  }
  return url;
}
