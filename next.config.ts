import { cpSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const articlesDir = join(process.cwd(), 'src', 'app', 'posts', '_articles');
const coversDir = join(process.cwd(), 'public', 'covers');

for (const slug of readdirSync(articlesDir)) {
  const articleDir = join(articlesDir, slug);
  if (!statSync(articleDir).isDirectory()) continue;
  for (const file of readdirSync(articleDir)) {
    if (file.startsWith('cover.')) {
      mkdirSync(join(coversDir, slug), { recursive: true });
      cpSync(join(articleDir, file), join(coversDir, slug, file));
    }
  }
}

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
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
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
