import { METADATA } from '@/constants/metadata.constants';
import { generatePageMetadata } from './metadata-util';

it('generates default site metadata and crawler settings', () => {
  const metadata = generatePageMetadata({});
  expect(metadata).toMatchObject({
    title: METADATA.SITE.NAME,
    description: METADATA.SITE.DESCRIPTION,
    metadataBase: new URL(METADATA.SITE.URL),
    alternates: { canonical: METADATA.SITE.URL },
    openGraph: {
      type: 'website',
      url: METADATA.SITE.URL,
      title: METADATA.SITE.NAME,
      description: METADATA.SITE.DESCRIPTION,
      locale: METADATA.SITE.LANGUAGE,
      images: [{ url: METADATA.SITE.PREVIEW_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: METADATA.SITE.NAME,
      description: METADATA.SITE.DESCRIPTION,
      images: [METADATA.SITE.PREVIEW_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    creator: METADATA.AUTHOR.NAME,
    publisher: METADATA.AUTHOR.NAME,
  });
});

it('uses custom page content and a separate canonical path', () => {
  const metadata = generatePageMetadata({
    title: 'Page',
    description: 'Summary',
    path: '/posts?page=2',
    canonicalPath: '/posts',
    image: '/custom.png',
  });
  expect(metadata).toMatchObject({
    title: 'Page',
    description: 'Summary',
    alternates: { canonical: `${METADATA.SITE.URL}/posts` },
    openGraph: {
      title: 'Page',
      description: 'Summary',
      url: `${METADATA.SITE.URL}/posts?page=2`,
      images: [{ url: '/custom.png', width: 1200, height: 630 }],
    },
    twitter: { title: 'Page', description: 'Summary', images: ['/custom.png'] },
  });
});

it('includes publication details for articles', () => {
  const details = {
    publishedTime: '2026-01-01',
    modifiedTime: '2026-09-25',
    authors: ['Author'],
    tags: ['React'],
  };
  const metadata = generatePageMetadata({
    path: '/posts/example',
    type: 'article',
    openGraph: details,
  });
  expect(metadata.openGraph).toMatchObject({ type: 'article', ...details });
  expect(metadata.alternates).toEqual({ canonical: `${METADATA.SITE.URL}/posts/example` });
});

it('supports articles without optional publication details', () => {
  const metadata = generatePageMetadata({ type: 'article' });
  expect(metadata.openGraph).toMatchObject({ type: 'article' });
  expect(metadata.openGraph).not.toHaveProperty('publishedTime');
});

it('omits article details for website metadata', () => {
  const metadata = generatePageMetadata({
    type: 'website',
    openGraph: { publishedTime: '2026-01-01' },
  });
  expect(metadata.openGraph).not.toHaveProperty('publishedTime');
});

it('allows an explicit root canonical for a nested page', () => {
  expect(generatePageMetadata({ path: '/posts', canonicalPath: '' }).alternates).toEqual({
    canonical: METADATA.SITE.URL,
  });
});
