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
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://giscus.app",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://files.toosign.me https://toosign.me",
      "font-src 'self'",
      'frame-src https://giscus.app',
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    ].join('; '),
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
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
