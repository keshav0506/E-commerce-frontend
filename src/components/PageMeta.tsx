import { useEffect } from 'react';

interface PageMetaProps {
  title?: string;
  description?: string;
}

export function PageMeta({
  title = 'Shoply - Premium E-Commerce Store',
  description = 'Shoply - Discover premium lifestyle, electronics, fashion, and home essentials with verified reviews and wholesale B2B quotes.',
}: PageMetaProps) {
  useEffect(() => {
    document.title = title.includes('Shoply') ? title : `${title} | Shoply`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [title, description]);

  return null;
}
