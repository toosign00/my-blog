import { expect } from '@playwright/test';
import { test as base } from 'next/experimental/testmode/playwright.js';

export const test = base.extend({
  next: async ({ next, page }, use) => {
    // Next's proxy handles server fetch and browser fetch/XHR, not script/image tags.
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      return url.origin === 'http://127.0.0.1:3100' ? route.fallback() : route.abort();
    });
    next.onFetch((request) => {
      const url = new URL(request.url);
      if (url.hostname === 'api.cloudflare.com') {
        if (url.pathname.includes('/d1/')) {
          return Response.json({
            success: true,
            result: [{ success: true, results: [{ today: 0, total: 0 }] }],
          });
        }
        return new Response(null, { status: 404 });
      }
      if (url.hostname === 'github-contributions-api.jogruber.de') {
        return Response.json({ contributions: [] });
      }
      // No unhandled external service request may escape the test.
      return 'abort';
    });
    await use(next);
  },
});

export { expect };
