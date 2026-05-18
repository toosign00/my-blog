import type { MetadataRoute } from 'next';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { getAllPosts } from '@/utils/post-util';
import { slugify } from '@/utils/text-util';

export const dynamic = 'force-static';
export const revalidate = false;

const generateSitemapUrls = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = await getAllPosts();

  const categoryCountMap = posts.reduce<Record<string, number>>((map, { category }) => {
    map[category] = (map[category] || 0) + 1;
    return map;
  }, {});

  const categoryUrls = Object.keys(categoryCountMap).map((category) => {
    const categorySlug = slugify(category);
    return { url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}/${categorySlug}` };
  });

  const tagCountMap = posts.reduce<Record<string, number>>((map, { tags }) => {
    for (const tag of tags ?? []) {
      map[tag] = (map[tag] || 0) + 1;
    }
    return map;
  }, {});

  const tagUrls = Object.keys(tagCountMap).map((tag) => {
    const tagSlug = slugify(tag);
    return { url: `${METADATA.SITE.URL}${ROUTES.TAGS}/${tagSlug}` };
  });

  return [
    {
      url: METADATA.SITE.URL,
      changeFrequency: 'daily',
      priority: 1,
    },
    { url: `${METADATA.SITE.URL}${ROUTES.ABOUT}` },
    { url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}` },
    { url: `${METADATA.SITE.URL}${ROUTES.TAGS}` },
    { url: `${METADATA.SITE.URL}${ROUTES.POSTS}` },
    ...categoryUrls,
    ...tagUrls,
    ...posts.map(({ slug, modifiedAt, createdAt }) => ({
      url: `${METADATA.SITE.URL}${ROUTES.POSTS}/${slug}`,
      lastModified: modifiedAt ?? createdAt,
      changeFrequency: 'monthly',
      priority: 0.9,
    })),
  ];
};

const sitemapToXml = (
  urls: MetadataRoute.Sitemap
): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `
  <url>
    <loc>${item.url}</loc>
    ${
      item.lastModified
        ? `<lastmod>${
            item.lastModified instanceof Date
              ? item.lastModified.toISOString()
              : new Date(item.lastModified).toISOString()
          }</lastmod>`
        : ''
    }
    ${item.changeFrequency ? `<changefreq>${item.changeFrequency}</changefreq>` : ''}
    ${item.priority ? `<priority>${item.priority}</priority>` : ''}
  </url>`
  )
  .join('')}
</urlset>`;

export const GET = async (): Promise<Response> => {
  const urls = await generateSitemapUrls();
  const xml = sitemapToXml(urls);
  return new Response(xml, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
};
