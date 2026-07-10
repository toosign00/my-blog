import type { MetadataRoute } from 'next';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA, POST } from '@/constants/metadata.constants';
import { getAllPosts } from '@/utils/post-util';
import { getAllProjects } from '@/utils/project-util';
import { slugify } from '@/utils/text-util';
import { escapeXml } from '@/utils/xml-util';

export const dynamic = 'force-static';
export const revalidate = false;

const getLatestContentDate = (
  posts: Awaited<ReturnType<typeof getAllPosts>>,
  projects: Awaited<ReturnType<typeof getAllProjects>>
): string | undefined => {
  const dates = [
    ...posts.map(({ modifiedAt, createdAt }) => modifiedAt ?? createdAt),
    ...projects.map(({ projectDue, createdAt }) => projectDue ?? createdAt),
  ];

  return dates.sort((a, b) => new Date(b).valueOf() - new Date(a).valueOf())[0];
};

const generateSitemapUrls = async (): Promise<MetadataRoute.Sitemap> => {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const postsPageCount = Math.ceil(posts.length / POST.PER_PAGE);
  const latestContentDate = getLatestContentDate(posts, projects);

  const categoryCountMap = posts.reduce<Record<string, number>>((map, { category }) => {
    map[category] = (map[category] || 0) + 1;
    return map;
  }, {});

  const categoryUrls = Object.entries(categoryCountMap).flatMap(([category, count]) => {
    const categorySlug = slugify(category);
    const categoryPages = Math.ceil(count / POST.PER_PAGE);
    return [
      {
        url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}/${categorySlug}`,
        lastModified: latestContentDate,
      },
      ...Array.from({ length: Math.max(0, categoryPages - 1) }, (_, pageIndex) => ({
        url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}/${categorySlug}/p/${pageIndex + 2}`,
        lastModified: latestContentDate,
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
      {
        url: `${METADATA.SITE.URL}${ROUTES.TAGS}/${tagSlug}`,
        lastModified: latestContentDate,
      },
      ...Array.from({ length: Math.max(0, tagPages - 1) }, (_, pageIndex) => ({
        url: `${METADATA.SITE.URL}${ROUTES.TAGS}/${tagSlug}/p/${pageIndex + 2}`,
        lastModified: latestContentDate,
      })),
    ];
  });

  return [
    {
      url: METADATA.SITE.URL,
      lastModified: latestContentDate,
    },
    { url: `${METADATA.SITE.URL}${ROUTES.ABOUT}`, lastModified: latestContentDate },
    { url: `${METADATA.SITE.URL}${ROUTES.CATEGORIES}`, lastModified: latestContentDate },
    { url: `${METADATA.SITE.URL}${ROUTES.TAGS}`, lastModified: latestContentDate },
    { url: `${METADATA.SITE.URL}${ROUTES.POSTS}`, lastModified: latestContentDate },
    { url: `${METADATA.SITE.URL}${ROUTES.PROJECTS}`, lastModified: latestContentDate },
    { url: `${METADATA.SITE.URL}${ROUTES.SECURITY_POLICY}`, lastModified: latestContentDate },
    { url: `${METADATA.SITE.URL}${ROUTES.ACKNOWLEDGMENTS}`, lastModified: latestContentDate },
    ...categoryUrls,
    ...tagUrls,
    ...Array.from({ length: Math.max(0, postsPageCount - 1) }, (_, pageIndex) => ({
      url: `${METADATA.SITE.URL}${ROUTES.POSTS}/p/${pageIndex + 2}`,
      lastModified: latestContentDate,
    })),
    ...posts.map(({ slug, modifiedAt, createdAt }) => ({
      url: `${METADATA.SITE.URL}${ROUTES.POSTS}/${slug}`,
      lastModified: modifiedAt ?? createdAt,
    })),
    ...projects.map(({ slug, projectDue, createdAt }) => ({
      url: `${METADATA.SITE.URL}${ROUTES.PROJECTS}/${slug}`,
      lastModified: projectDue ?? createdAt,
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
