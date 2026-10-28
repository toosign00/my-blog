import { expect, test } from './fixtures';

test('keeps reading and navigation available while a view response is pending', async ({
  page,
  next,
}) => {
  void next;
  const { promise: pending, resolve: release } = Promise.withResolvers<void>();
  await page.route('**/api/views', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    await pending;
    await route.fulfill({
      json: {
        ok: true,
        counted: false,
        site: { today: 0, total: 12 },
        page: { today: 0, total: 12 },
      },
    });
  });
  try {
    const recording = page.waitForRequest(
      (request) => request.method() === 'POST' && new URL(request.url()).pathname === '/api/views'
    );
    await page.goto('/posts/filmlog-01');
    await recording;
    const article = page.getByRole('article');
    await expect(article.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(article).toContainText('- views');
    await article.getByRole('button', { name: 'Go back' }).click();
    await expect(page).toHaveURL(/\/posts$/);
    await expect(page.getByRole('link', { name: /^Read post:/ }).first()).toBeVisible();
  } finally {
    release();
  }
});

test('shows recovered view counts after leaving and revisiting a failed post', async ({
  page,
  next,
}) => {
  let failing = true;
  next.onFetch(async (request) => {
    if (!request.url.includes('/d1/')) return undefined;
    if (failing) return new Response(null, { status: 503 });
    const { batch } = (await request.json()) as { batch: { sql: string }[] };
    return Response.json({
      success: true,
      result: (batch ?? [{}]).map(() => ({ success: true, results: [{ today: 2, total: 42 }] })),
    });
  });
  const failed = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/api/views' &&
      response.request().method() === 'POST' &&
      response.status() === 500
  );
  await page.goto('/posts/filmlog-01');
  await failed;
  await expect(page.getByRole('article')).toContainText('- views');
  await page.getByRole('article').getByRole('button', { name: 'Go back' }).click();
  await expect(page).toHaveURL(/\/posts$/);
  failing = false;
  await page
    .getByRole('link', { name: /^Read post:/ })
    .and(page.locator('[href="/posts/filmlog-01"]'))
    .click();
  await expect(page).toHaveURL(/\/posts\/filmlog-01$/);
  await expect(page.getByRole('article')).toContainText('42 views');
});

test('recovers through Retry and Home after a browser API render failure', async ({
  page,
  next,
}) => {
  next.onFetch((request) =>
    new URL(request.url).hostname === 'github-contributions-api.jogruber.de'
      ? Response.json({ contributions: [{ date: '2026-09-01', count: 3, level: 2 }] })
      : undefined
  );
  await page.addInitScript(() => {
    const matchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      if (
        query === '(prefers-reduced-motion: reduce)' &&
        sessionStorage.getItem('e2e-media-failure') !== 'off'
      ) {
        throw new Error('e2e media query failure');
      }
      return matchMedia(query);
    };
  });
  await page.goto('/?recovery=retry');
  await expect(page.getByRole('heading', { name: '문제가 발생했어요' })).toBeVisible();
  await page.evaluate(() => sessionStorage.setItem('e2e-media-failure', 'off'));
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.getByRole('region', { name: 'GitHub Contributions' })).toBeVisible();

  await page.evaluate(() => sessionStorage.removeItem('e2e-media-failure'));
  await page.reload();
  await expect(page.getByRole('heading', { name: '문제가 발생했어요' })).toBeVisible();
  await page.evaluate(() => sessionStorage.setItem('e2e-media-failure', 'off'));
  await page.getByRole('link', { name: 'Home', exact: true }).last().click();
  await expect(page).toHaveURL('http://127.0.0.1:3100/');
  await expect(page.getByRole('region', { name: 'GitHub Contributions' })).toBeVisible();
});

test('keeps reading and sharing available when the comments script fails to load', async ({
  context,
  page,
  next,
}) => {
  void next;
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined });
  });
  await page.route('https://giscus.app/client.js', (route) => route.abort('failed'));
  const scriptFailed = page.waitForEvent('requestfailed', {
    predicate: (request) => request.url() === 'https://giscus.app/client.js',
  });
  await page.goto('/posts/filmlog-01');
  await scriptFailed;
  const article = page.getByRole('article');
  await expect(article.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByTitle('Comments')).toHaveCount(0);
  await article.getByRole('button', { name: 'Share this post' }).click();
  await expect(page.getByText('링크가 클립보드에 복사되었어요')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'https://toosign.me/posts/filmlog-01'
  );
});
