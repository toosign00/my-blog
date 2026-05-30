import type { MetadataRoute } from 'next';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA, POST } from '@/constants/metadata.constants';
import { getAllPosts } from '@/utils/post-util';
import { getAllProjects } from '@/utils/project-util';
import { slugify } from '@/utils/text-util';
import { escapeXml } from '@/utils/xml-util';

export const dynamic = 'force-static';
export const revalidate = false;

const generateSitemapUrls = async (): Promise<MetadataRoute.Sitemap> => {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const postsPageCount = Math.ceil(posts.length / POST.PER_PAGE);

  const categoryCountMap = posts.reduce<Record<string, number>>((map, { category }) => {
    map[category] = (map[category] || 0) + 1;
    return map;
  }, {});

  const categoryUrls = Object.entries(categoryCountMap).flatMap(([category, count]) => {
    const categorySlug = slugify(category);
    const categoryPages = Math.ceil(count / POST.PER_PAGE);
    return [
      { url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}/${categorySlug}` },
      ...Array.from({ length: Math.max(0, categoryPages - 1) }, (_, pageIndex) => ({
        url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}/${categorySlug}/p/${pageIndex + 2}`,
      })),
    ];
  });

  const tagCountMap = posts.reduce<Record<string, number>>((map, { tags }) => {
    for (const tag of tags ?? []) {
      map[tag] = (map[tag] || 0) + 1;
    }
    return map;
  }, {});

  const tagUrls = Object.entries(tagCountMap).flatMap(([tag, count]) => {
    const tagSlug = slugify(tag);
    const tagPages = Math.ceil(count / POST.PER_PAGE);
    return [
      { url: `${METADATA.SITE.URL}${ROUTES.TAGS}/${tagSlug}` },
      ...Array.from({ length: Math.max(0, tagPages - 1) }, (_, pageIndex) => ({
        url: `${METADATA.SITE.URL}${ROUTES.TAGS}/${tagSlug}/p/${pageIndex + 2}`,
      })),
    ];
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
    { url: `${METADATA.SITE.URL}${ROUTES.PROJECTS}` },
    ...categoryUrls,
    ...tagUrls,
    ...Array.from({ length: Math.max(0, postsPageCount - 1) }, (_, pageIndex) => ({
      url: `${METADATA.SITE.URL}${ROUTES.POSTS}/p/${pageIndex + 2}`,
    })),
    ...posts.map(({ slug, modifiedAt, createdAt }) => ({
      url: `${METADATA.SITE.URL}${ROUTES.POSTS}/${slug}`,
      lastModified: modifiedAt ?? createdAt,
      changeFrequency: 'monthly',
      priority: 0.9,
    })),
    ...projects.map(({ slug, projectDue, createdAt }) => ({
      url: `${METADATA.SITE.URL}${ROUTES.PROJECTS}/${slug}`,
      lastModified: projectDue ?? createdAt,
      changeFrequency: 'monthly',
      priority: 0.8,
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
    <loc>${escapeXml(item.url)}</loc>
    ${
      item.lastModified
        ? `<lastmod>${
            item.lastModified instanceof Date
              ? item.lastModified.toISOString()
              : new Date(item.lastModified).toISOString()
          }</lastmod>`
        : ''
    }
    ${item.changeFrequency ? `<changefreq>${escapeXml(item.changeFrequency)}</changefreq>` : ''}
    ${item.priority ? `<priority>${escapeXml(item.priority.toString())}</priority>` : ''}
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
