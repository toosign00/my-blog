import type { MetadataRoute } from 'next';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${METADATA.SITE.URL}${ROUTES.SITEMAP}`,
  };
}
