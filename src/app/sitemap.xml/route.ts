import type { MetadataRoute } from 'next';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA, POST } from '@/constants/metadata.constants';
import { SITEMAP_PAGE_LAST_MODIFIED } from '@/constants/sitemap.constants';
import { getAllPosts } from '@/utils/post-util';
import { getAllProjects } from '@/utils/project-util';
import {
  getLatestDate,
  getLatestPostDate,
  getLatestProjectDate,
  toIsoDate,
} from '@/utils/sitemap-util';
import { slugify } from '@/utils/text-util';
import { escapeXml } from '@/utils/xml-util';

export const dynamic = 'force-static';
export const revalidate = false;

const generateSitemapUrls = async (): Promise<MetadataRoute.Sitemap> => {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const postsPageCount = Math.ceil(posts.length / POST.PER_PAGE);
  const postsLastModified = getLatestPostDate(posts);
  const projectsLastModified = getLatestProjectDate(projects);
  const homeLastModified = getLatestDate(
    [
      { date: SITEMAP_PAGE_LAST_MODIFIED[ROUTES.HOME] },
      ...posts.slice(0, 2).map(({ modifiedAt, createdAt }) => ({
        date: modifiedAt ?? createdAt,
      })),
    ],
    ({ date }) => date
  );

  const categoryCountMap = posts.reduce<Record<string, number>>((map, { category }) => {
    map[category] = (map[category] || 0) + 1;
    return map;
  }, {});

  const categoryUrls = Object.entries(categoryCountMap).flatMap(([category, count]) => {
    const categorySlug = slugify(category);
    const categoryPages = Math.ceil(count / POST.PER_PAGE);
    const categoryLastModified = getLatestPostDate(posts, (post) => post.category === category);
    return [
      {
        url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}/${categorySlug}`,
        lastModified: categoryLastModified,
      },
      ...Array.from({ length: Math.max(0, categoryPages - 1) }, (_, pageIndex) => ({
        url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}/${categorySlug}/p/${pageIndex + 2}`,
        lastModified: categoryLastModified,
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
    const tagLastModified = getLatestPostDate(posts, (post) => post.tags?.includes(tag) ?? false);
    return [
      {
        url: `${METADATA.SITE.URL}${ROUTES.TAGS}/${tagSlug}`,
        lastModified: tagLastModified,
      },
      ...Array.from({ length: Math.max(0, tagPages - 1) }, (_, pageIndex) => ({
        url: `${METADATA.SITE.URL}${ROUTES.TAGS}/${tagSlug}/p/${pageIndex + 2}`,
        lastModified: tagLastModified,
      })),
    ];
  });

  return [
    {
      url: METADATA.SITE.URL,
      lastModified: homeLastModified,
    },
    {
      url: `${METADATA.SITE.URL}${ROUTES.ABOUT}`,
      lastModified: SITEMAP_PAGE_LAST_MODIFIED[ROUTES.ABOUT],
    },
    { url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}`, lastModified: postsLastModified },
    { url: `${METADATA.SITE.URL}${ROUTES.TAGS}`, lastModified: postsLastModified },
    { url: `${METADATA.SITE.URL}${ROUTES.POSTS}`, lastModified: postsLastModified },
    { url: `${METADATA.SITE.URL}${ROUTES.PROJECTS}`, lastModified: projectsLastModified },
    {
      url: `${METADATA.SITE.URL}${ROUTES.SECURITY_POLICY}`,
      lastModified: SITEMAP_PAGE_LAST_MODIFIED[ROUTES.SECURITY_POLICY],
    },
    {
      url: `${METADATA.SITE.URL}${ROUTES.ACKNOWLEDGMENTS}`,
      lastModified: SITEMAP_PAGE_LAST_MODIFIED[ROUTES.ACKNOWLEDGMENTS],
    },
    ...categoryUrls,
    ...tagUrls,
    ...Array.from({ length: Math.max(0, postsPageCount - 1) }, (_, pageIndex) => ({
      url: `${METADATA.SITE.URL}${ROUTES.POSTS}/p/${pageIndex + 2}`,
      lastModified: postsLastModified,
    })),
    ...posts.map(({ slug, modifiedAt, createdAt }) => ({
      url: `${METADATA.SITE.URL}${ROUTES.POSTS}/${slug}`,
      lastModified: modifiedAt ?? createdAt,
    })),
    ...projects.map(({ slug, modifiedAt }) => ({
      url: `${METADATA.SITE.URL}${ROUTES.PROJECTS}/${slug}`,
      lastModified: modifiedAt,
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
    ${item.lastModified ? `<lastmod>${toIsoDate(item.lastModified)}</lastmod>` : ''}
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
