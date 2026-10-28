import { ABOUT } from '../src/constants/about.constants';
import { expect, test } from './fixtures';

test('shows D1 view counts in the post list and records a visit on the post page', async ({
  page,
  next,
}) => {
  next.onFetch(async (request) => {
    if (!request.url.includes('/d1/')) return undefined;
    const body = (await request.json()) as { sql?: string; batch?: { sql: string }[] };
    const rowsFor = (sql: string) => {
      if (sql.includes(' IN ')) return [{ pathname: '/posts/filmlog-01', total: 1234 }];
      if (sql.startsWith('SELECT')) return [{ today: 5, total: 4321 }];
      return [];
    };
    const statements = body.batch ?? [{ sql: body.sql ?? '' }];
    return Response.json({
      success: true,
      result: statements.map(({ sql }) => ({ success: true, results: rowsFor(sql.trim()) })),
    });
  });

  await page.goto('/posts');
  const item = (slug: string) =>
    page.getByRole('listitem').filter({ has: page.locator(`a[href="/posts/${slug}"]`) });
  await expect(item('filmlog-01')).toContainText('1,234 views');
  await expect(item('filmlog-02')).toContainText('0 views');

  const recorded = page.waitForRequest(
    (request) => request.method() === 'POST' && new URL(request.url()).pathname === '/api/views'
  );
  await page.goto('/posts/filmlog-01');
  expect((await recorded).postDataJSON()).toEqual({ pathname: '/posts/filmlog-01' });
  await expect(page.getByRole('article')).toContainText('4,321 views');
});

test.describe('clipboard', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    // Force the copy fallback; the native share sheet is not testable headlessly.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { value: undefined });
    });
  });

  test('copies the post URL when sharing is unavailable', async ({ page, next }) => {
    void next;
    await page.goto('/posts/filmlog-01');
    await page.getByRole('button', { name: 'Share this post' }).click();
    await expect(page.getByText('링크가 클립보드에 복사되었어요')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'https://toosign.me/posts/filmlog-01'
    );
  });

  test('copies the contact email address on the About page', async ({ page, next }) => {
    void next;
    const email = ABOUT.contacts.find(
      (contact) => contact.type === 'copy' && contact.copyType === 'email'
    );
    await page.goto('/about');
    await page.getByRole('button', { name: 'Copy email address' }).click();
    await expect(page.getByText('메일 주소를 클립보드에 복사했어요')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      email && 'value' in email ? email.value : ''
    );
  });
});

test('scrolls to a heading from the table of contents and highlights it', async ({
  page,
  next,
}) => {
  void next;
  await page.goto('/posts/cloudflare-d1-blog-views');
  const toc = page.getByRole('navigation', { name: 'Table of contents' });
  const link = toc.getByRole('link').last();
  const id = ((await link.getAttribute('href')) ?? '').slice(1);

  const active = /(^|\s)font-medium(\s|$)/;
  await expect(link).not.toHaveClass(active);

  await link.click();
  await expect
    .poll(() =>
      page.evaluate((target) => document.getElementById(target)?.getBoundingClientRect().top, id)
    )
    .toBeLessThan(100);
  // The active entry is only exposed through its styling.
  await expect(link).toHaveClass(active);
});

test('keeps post content and navigation usable when view recording and reading fail', async ({
  page,
  next,
}) => {
  next.onFetch((request) =>
    request.url.includes('/d1/') ? new Response(null, { status: 503 }) : undefined
  );
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/posts');
  const failedRecord = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/api/views' &&
      response.request().method() === 'POST' &&
      response.status() === 500
  );
  const failedRead = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/api/views' &&
      new URL(response.url()).searchParams.has('pathname') &&
      response.status() === 500
  );
  const post = page.getByRole('link', { name: /^Read post:/ }).first();
  const href = await post.getAttribute('href');
  await post.click();
  await failedRecord;
  await failedRead;
  const article = page.getByRole('article');
  await expect(article.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(article).toContainText('- views');
  await article.getByRole('button', { name: 'Go back' }).click();
  await expect(page).toHaveURL(/\/posts$/);
  await page
    .getByRole('link', { name: /^Read post:/ })
    .first()
    .click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.getByRole('article').getByRole('heading', { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});

test('shows a copy error without a success notification when clipboard permission is denied', async ({
  context,
  page,
  next,
}) => {
  void next;
  await context.grantPermissions([]);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined });
  });
  await page.goto('/posts/filmlog-01');
  await page.getByRole('button', { name: 'Share this post' }).click();
  await expect(page.getByText('링크를 복사하지 못했어요')).toBeVisible();
  await expect(page.getByText('링크가 클립보드에 복사되었어요')).toHaveCount(0);
  await expect(page.getByRole('article').getByRole('heading', { level: 1 })).toBeVisible();
});
