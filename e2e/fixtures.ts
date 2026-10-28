import { readFileSync } from 'node:fs';
import { expect } from '@playwright/test';
import { test as base } from 'next/experimental/testmode/playwright.js';

const IMAGE_ORIGIN = 'https://files.toosign.me';
const imagePlaceholders = new Map<string, string>();
const fixedImage = new Uint8Array(readFileSync('public/assets/images/profile.webp'));

export const test = base.extend({
  next: async ({ next, page }, use) => {
    // Next's proxy handles server fetch and browser fetch/XHR, not script/image tags.
    await page.route('**/*', (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const imageSource =
        url.origin === 'http://127.0.0.1:3100' && url.pathname === '/_next/image'
          ? url.searchParams.get('url')
          : null;
      if (
        request.method() === 'GET' &&
        imageSource &&
        URL.canParse(imageSource) &&
        new URL(imageSource).origin === IMAGE_ORIGIN
      ) {
        return route.fulfill({ contentType: 'image/webp', body: Buffer.from(fixedImage) });
      }
      if (url.origin === 'http://127.0.0.1:3100') return route.fallback();
      if (url.origin === IMAGE_ORIGIN && request.method() === 'GET') {
        return route.fulfill({ contentType: 'image/webp', body: Buffer.from(fixedImage) });
      }
      return route.abort();
    });
    next.onFetch(async (request) => {
      const url = new URL(request.url);
      if (url.origin === IMAGE_ORIGIN && request.method === 'GET') {
        return new Response(fixedImage, { headers: { 'Content-Type': 'image/webp' } });
      }
      if (url.hostname === 'api.cloudflare.com') {
        if (url.pathname.includes('/d1/')) {
          return Response.json({
            success: true,
            result: [{ success: true, results: [{ today: 0, total: 0 }] }],
          });
        }
        if (url.pathname.includes('/storage/kv/')) {
          if (request.method === 'PUT') {
            const value = (await request.formData()).get('value');
            if (typeof value === 'string') imagePlaceholders.set(url.pathname, value);
            return Response.json({ success: true });
          }
          const value = imagePlaceholders.get(url.pathname);
          if (request.method === 'GET' && value !== undefined) {
            return new Response(value, { headers: { 'Content-Type': 'application/json' } });
          }
        }
        return new Response(null, { status: 404 });
      }
      if (url.hostname === 'github-contributions-api.jogruber.de') {
        return Response.json({ contributions: [] });
      }
      // Unregistered service requests remain blocked.
      return 'abort';
    });
    await use(next);
  },
});

export { expect };
