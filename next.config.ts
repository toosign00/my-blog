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
              source: '/(.*)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, s-maxage=3600, stale-while-revalidate=86400',
                },
              ],
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
