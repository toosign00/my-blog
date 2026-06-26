import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remarkGfm'],
  },
});

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const pageCacheHeader = {
  key: 'Cache-Control',
  value: 'public, s-maxage=3600, stale-while-revalidate=86400',
};

const staticAssetCacheHeader = {
  key: 'Cache-Control',
  value: 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
};

const nextConfig: NextConfig = {
  trailingSlash: false,
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      ...(isProd
        ? [
            {
              source: '/favicon.svg',
              headers: [staticAssetCacheHeader],
            },
            {
              source: '/assets/:path*',
              headers: [staticAssetCacheHeader],
            },
            {
              source: '/covers/:path*',
              headers: [staticAssetCacheHeader],
            },
            {
              source: '/((?!api(?:/|$)|_next(?:/|$)|.*\\..*).*)',
              headers: [pageCacheHeader],
            },
          ]
        : []),
    ];
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: {
      mdxType: 'gfm',
    },
  },
  images: {
    minimumCacheTTL: 2592000,
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'files.toosign.me',
      },
    ],
  },
};

export default withMDX(nextConfig);
