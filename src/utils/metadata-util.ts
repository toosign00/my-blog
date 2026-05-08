import type { Metadata } from 'next';
import { METADATA } from '@/constants/metadata.constants';

interface GeneratePageMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article';
  openGraph?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
}

export const generatePageMetadata = ({
  title = METADATA.SITE.NAME,
  description = METADATA.SITE.DESCRIPTION,
  path = '',
  canonicalPath,
  image = METADATA.SITE.PREVIEW_IMAGE,
  type = 'website',
  openGraph,
}: GeneratePageMetadataParams): Metadata => {
  const url = `${METADATA.SITE.URL}${path}`;
  const canonical = `${METADATA.SITE.URL}${canonicalPath ?? path}`;

  return {
    title,
    description,
    metadataBase: new URL(METADATA.SITE.URL),
    openGraph: {
      title,
      description,
      url,
      siteName: METADATA.SITE.NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      type,
      ...(type === 'article' &&
        openGraph && {
          publishedTime: openGraph.publishedTime,
          modifiedTime: openGraph.modifiedTime,
          authors: openGraph.authors,
          tags: openGraph.tags,
        }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
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
    alternates: {
      canonical,
    },
    generator: 'Next.js',
    applicationName: METADATA.SITE.NAME,
    creator: METADATA.AUTHOR.NAME,
    publisher: METADATA.AUTHOR.NAME,
  };
};
