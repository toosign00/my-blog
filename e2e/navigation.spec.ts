import { POST } from '../src/constants/metadata.constants';
import { expect, test } from './fixtures';

for (const [listPath, listName, kind] of [
  ['/tags', 'Tag list', 'tag'],
  ['/categories', 'Category list', 'category'],
] as const) {
  test(`opens a post through the ${kind} list with the advertised post count`, async ({
    page,
    next,
  }) => {
    void next;
    await page.goto(listPath);
    const link = page.getByRole('navigation', { name: listName }).getByRole('link').first();
    const label = (await link.getAttribute('aria-label')) ?? '';
    const count = Number(label.match(/\((\d+) posts\)$/)?.[1]);
    const href = await link.getAttribute('href');

    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    const posts = page.getByRole('link', { name: /^Read post:/ });
    await expect(posts).toHaveCount(Math.min(count, POST.PER_PAGE));

    await posts.first().click();
    await expect(page).toHaveURL(/\/posts\/[^/]+$/);
    await expect(page.locator('article h1')).toBeVisible();
  });
}

test('returns 404 for unknown taxonomies and out-of-range pages', async ({ page, next }) => {
  void next;
  for (const path of ['/tags/no-such-tag', '/categories/no-such-category', '/posts/p/2']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
});

test('shows a single current page without previous or next links', async ({ page, next }) => {
  void next;
  await page.goto('/posts');
  const pagination = page.getByRole('navigation', { name: 'Pagination navigation' });
  await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');
  await expect(pagination.getByRole('link', { name: 'Go to previous page' })).toHaveCount(0);
  await expect(pagination.getByRole('link', { name: 'Go to next page' })).toHaveCount(0);
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens, navigates with the current page marked and closes after navigation', async ({
    page,
    next,
  }) => {
    void next;
    await page.goto('/');
    const toggle = page.locator('button[aria-controls="menu-accordion-content"]');
    const menu = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(menu.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');

    await menu.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    await toggle.click();
    await expect(menu.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes the open menu when the viewport grows to the sidebar layout', async ({
    page,
    next,
  }) => {
    void next;
    await page.goto('/');
    const toggle = page.locator('button[aria-controls="menu-accordion-content"]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.setViewportSize({ width: 1024, height: 844 });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('mobile reading', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('reads and shares a post before returning to the list on mobile', async ({
    context,
    page,
    next,
  }) => {
    void next;
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { value: undefined });
    });
    await page.goto('/posts');
    const post = page.getByRole('link', { name: /^Read post:/ }).first();
    const href = await post.getAttribute('href');
    await post.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    const article = page.getByRole('article');
    await expect(article.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Table of contents' })).toBeHidden();
    const heading = article.getByRole('heading', { level: 2 }).first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeInViewport();
    await article.getByRole('button', { name: 'Share this post' }).click();
    await expect(page.getByText('링크가 클립보드에 복사되었어요')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      `https://toosign.me${href}`
    );
    await article.getByRole('button', { name: 'Go back' }).click();
    await expect(page).toHaveURL(/\/posts$/);
    await expect(page.getByRole('link', { name: /^Read post:/ }).first()).toBeVisible();
  });
});
