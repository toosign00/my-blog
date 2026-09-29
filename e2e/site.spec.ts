import { expect, test } from './fixtures';

test('navigates from the post list to real MDX content and back', async ({ page, next }) => {
  void next;
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/posts');
  const link = page.getByRole('link', { name: /^Read post:/ }).first();
  const href = await link.getAttribute('href');
  await link.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `https://toosign.me${href}`
  );
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.map((value) => JSON.parse(value)['@type'])).toContain('BlogPosting');
  await page.getByRole('article').getByRole('button', { name: 'Go back' }).click();
  await expect(page).toHaveURL(/\/posts$/);
  expect(errors).toEqual([]);
});

test('changes theme and preserves it across a reload', async ({ page, next }) => {
  void next;
  await page.goto('/about');
  const button = page.getByRole('button', { name: 'Toggle dark or light mode' });
  const label = (await button.textContent()) ?? '';
  await button.click();
  await expect(button).not.toHaveText(label);
  const selected = (await button.textContent()) ?? '';
  await page.reload();
  await expect(button).toHaveText(selected);
});

test('renders a project detail and handles an unknown page', async ({ page, next }) => {
  void next;
  await page.goto('/projects/community-runway');
  await expect(page.locator('h1')).toBeVisible();
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: /Home/i }).first()).toBeVisible();
});

test('serves parseable RSS and sitemap documents', async ({ page, next }) => {
  void next;
  for (const [path, root] of [
    ['/rss.xml', 'rss'],
    ['/sitemap.xml', 'urlset'],
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('xml');
    const parsed = await page.evaluate(
      (xml) => {
        const document = new DOMParser().parseFromString(xml, 'application/xml');
        return {
          root: document.documentElement.localName,
          errors: document.getElementsByTagName('parsererror').length,
          text: document.documentElement.textContent,
        };
      },
      (await response?.text()) ?? ''
    );
    expect(parsed.root).toBe(root);
    expect(parsed.errors).toBe(0);
    expect(parsed.text).toContain('https://toosign.me/posts/');
  }
});

test('optimizes a real local cover image', async ({ request }) => {
  const response = await request.get('/_next/image', {
    params: {
      url: '/covers/posts/filmlog-01/cover.webp',
      w: '640',
      q: '75',
    },
  });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\//);
  expect((await response.body()).length).toBeGreaterThan(100);
});

test('loads Giscus with the selected theme and cleans up after navigation', async ({
  page,
  next,
}) => {
  void next;
  await page.route('https://giscus.app/client.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `
      (() => {
      const container = document.currentScript?.parentElement;
      if (!container) return;
      const frame = document.createElement('iframe');
      frame.className = 'giscus-frame'; frame.title = 'Comments';
      container.appendChild(frame);
      frame.contentWindow.postMessage = (message, origin) => {
        frame.dataset.theme = message.giscus.setConfig.theme;
        frame.dataset.targetOrigin = origin;
      };
      })();
    `,
    })
  );
  await page.goto('/posts/filmlog-01');
  await expect(page.getByTitle('Comments')).toHaveCount(1);
  const script = page.locator('script[data-giscus-script="true"]');
  const theme = await script.getAttribute('data-theme');
  await expect(page.getByTitle('Comments')).toHaveAttribute('data-theme', theme ?? '');
  await expect(page.getByTitle('Comments')).toHaveAttribute(
    'data-target-origin',
    'https://giscus.app'
  );
  await page.getByRole('button', { name: 'Toggle dark or light mode' }).click();
  await expect(script).not.toHaveAttribute('data-theme', theme ?? '');
  await expect(page.getByTitle('Comments')).toHaveCount(1);
  await expect(page.getByTitle('Comments')).toHaveAttribute(
    'data-theme',
    (await script.getAttribute('data-theme')) ?? ''
  );
  await page.getByRole('article').getByRole('button', { name: 'Go back' }).click();
  await expect(page).toHaveURL(/\/posts$/);
  await expect(page.getByTitle('Comments')).toHaveCount(0);
});
