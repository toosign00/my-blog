import '@/styles/globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';
import type { Person, WebSite, WithContext } from 'schema-dts';
import { twMerge } from 'tailwind-merge';
import JsonLd from '@/components/JsonLd';
import { Layout } from '@/components/layout/Root';
import { AppProviders } from '@/components/providers/AppProviders';
import { METADATA } from '@/constants/metadata.constants';
import { GeistMono } from '@/styles/font';

const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: METADATA.SITE.NAME,
  url: METADATA.SITE.URL,
  description: METADATA.SITE.DESCRIPTION,
  inLanguage: METADATA.SITE.LANGUAGE,
  author: {
    '@type': 'Person',
    name: METADATA.AUTHOR.NAME,
  },
};

const personSchema: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: METADATA.AUTHOR.NAME,
  email: METADATA.AUTHOR.EMAIL,
  url: METADATA.SITE.URL,
  image: `${METADATA.SITE.URL}${METADATA.AUTHOR.PROFILE_IMAGE}`,
  jobTitle: 'QA Engineer',
  sameAs: [METADATA.SITE.URL],
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang={METADATA.SITE.LANGUAGE} suppressHydrationWarning>
      <head>
        <link
          as='style'
          crossOrigin='anonymous'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
          rel='stylesheet'
        />
      </head>
      <body className={twMerge(GeistMono.variable)}>
        <JsonLd data={websiteSchema} />
        <JsonLd data={personSchema} />
        <AppProviders>
          <Layout>{children}</Layout>
        </AppProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;

export const metadata: Metadata = {
  title: METADATA.SITE.NAME,
  description: METADATA.SITE.DESCRIPTION,
  metadataBase: new URL(METADATA.SITE.URL),
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png' }],
  },
  openGraph: {
    title: METADATA.SITE.NAME,
    description: METADATA.SITE.DESCRIPTION,
    url: METADATA.SITE.URL,
    siteName: METADATA.SITE.NAME,
    images: [
      {
        url: METADATA.SITE.PREVIEW_IMAGE,
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
    locale: METADATA.SITE.LANGUAGE,
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
  alternates: {
    canonical: METADATA.SITE.URL,
  },
  generator: 'Next.js',
  applicationName: METADATA.SITE.NAME,
  creator: METADATA.AUTHOR.NAME,
  publisher: METADATA.AUTHOR.NAME,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
