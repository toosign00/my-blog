import { METADATA } from '@/constants/metadata.constants';
import { generatePageMetadata } from './metadata-util';

describe('generatePageMetadata', () => {
  it('falls back to the site title, description and preview image', () => {
    const metadata = generatePageMetadata({});

    expect(metadata.title).toBe(METADATA.SITE.NAME);
    expect(metadata.description).toBe(METADATA.SITE.DESCRIPTION);
    expect(metadata.openGraph?.images).toEqual([
      { url: METADATA.SITE.PREVIEW_IMAGE, width: 1200, height: 630 },
    ]);
  });

  it('builds the open graph URL and the canonical URL from the path', () => {
    const metadata = generatePageMetadata({ path: '/posts/hello' });

    expect(metadata.openGraph).toMatchObject({ url: 'https://toosign.me/posts/hello' });
    expect(metadata.alternates?.canonical).toBe('https://toosign.me/posts/hello');
  });

  it('points the canonical URL at the canonical path when the page is paginated', () => {
    const metadata = generatePageMetadata({ path: '/posts/p/2', canonicalPath: '/posts' });

    expect(metadata.openGraph).toMatchObject({ url: 'https://toosign.me/posts/p/2' });
    expect(metadata.alternates?.canonical).toBe('https://toosign.me/posts');
  });

  it('mirrors the title, description and image into the twitter card', () => {
    const metadata = generatePageMetadata({
      title: 'Hello',
      description: 'A post',
      image: 'https://toosign.me/cover.png',
    });

    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Hello',
      description: 'A post',
      images: ['https://toosign.me/cover.png'],
    });
  });

  it('adds the article fields when the page is an article', () => {
    const metadata = generatePageMetadata({
      type: 'article',
      openGraph: {
        publishedTime: '2026-01-01',
        modifiedTime: '2026-02-01',
        authors: ['노현수'],
        tags: ['QA'],
      },
    });

    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-01-01',
      modifiedTime: '2026-02-01',
      authors: ['노현수'],
      tags: ['QA'],
    });
  });

  it('omits the article fields when the page is a website', () => {
    const metadata = generatePageMetadata({
      openGraph: { publishedTime: '2026-01-01' },
    });

    expect(metadata.openGraph).toMatchObject({ type: 'website' });
    expect(metadata.openGraph).not.toHaveProperty('publishedTime');
  });

  it('omits the article fields when an article provides no open graph details', () => {
    const metadata = generatePageMetadata({ type: 'article' });

    expect(metadata.openGraph).toMatchObject({ type: 'article' });
    expect(metadata.openGraph).not.toHaveProperty('publishedTime');
  });

  it('allows indexing and following', () => {
    expect(generatePageMetadata({}).robots).toMatchObject({ index: true, follow: true });
  });
});
