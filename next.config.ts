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
  value: 'public, max-age=0, s-maxage=31536000',
};

const staticAssetCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=604800, must-revalidate',
  },
  {
    key: 'Vercel-CDN-Cache-Control',
    value: 'public, max-age=2592000',
  },
];

const imageCdnCacheHeader = {
  key: 'Vercel-CDN-Cache-Control',
  value: 'public, max-age=2592000',
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
              headers: staticAssetCacheHeaders,
            },
            {
              source: '/assets/:path*',
              headers: staticAssetCacheHeaders,
            },
            {
              source: '/covers/:path*',
              headers: staticAssetCacheHeaders,
            },
            {
              source: '/_next/image',
              headers: [imageCdnCacheHeader],
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
    minimumCacheTTL: 604800,
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
