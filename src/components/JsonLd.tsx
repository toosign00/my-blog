import { METADATA } from '@/constants/metadata.constants';
import type { Post } from '@/types/content.types';

export const WebsiteJsonLd = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${METADATA.SITE.URL}/#website`,
        url: METADATA.SITE.URL,
        name: METADATA.SITE.NAME,
        description: METADATA.SITE.DESCRIPTION,
        inLanguage: METADATA.SITE.LANGUAGE,
      },
      {
        '@type': 'Person',
        '@id': `${METADATA.SITE.URL}/#person`,
        name: METADATA.AUTHOR.NAME,
        alternateName: METADATA.SITE.NAME,
        url: METADATA.SITE.URL,
        sameAs: ['https://www.linkedin.com/in/hyunsooro', 'https://github.com/toosign00'],
        jobTitle: 'QA Engineer',
        email: METADATA.AUTHOR.EMAIL,
      },
    ],
  };

  return (
    <script
      // JSON-LD schema data is constructed from trusted internal constants only — no user input
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type='application/ld+json'
    />
  );
};

interface BlogPostingJsonLdProps {
  post: Pick<Post, 'title' | 'subtitle' | 'createdAt' | 'modifiedAt' | 'coverImage' | 'slug'>;
}

export const BlogPostingJsonLd = ({ post }: BlogPostingJsonLdProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.subtitle,
    datePublished: post.createdAt,
    dateModified: post.modifiedAt ?? post.createdAt,
    author: {
      '@type': 'Person',
      name: METADATA.AUTHOR.NAME,
      url: `${METADATA.SITE.URL}/about`,
    },
    publisher: {
      '@type': 'Person',
      name: METADATA.AUTHOR.NAME,
      url: METADATA.SITE.URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${METADATA.SITE.URL}/posts/${post.slug}`,
    },
    image: post.coverImage,
    inLanguage: METADATA.SITE.LANGUAGE,
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type='application/ld+json'
    />
  );
};

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export const BreadcrumbJsonLd = ({ items }: BreadcrumbJsonLdProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type='application/ld+json'
    />
  );
};
