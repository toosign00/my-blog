import { expect, test } from '@playwright/test';
import { ROUTES } from '../helpers/routes';

test.describe('Posts List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.POSTS);
  });

  test('"Posts (N)" 헤딩이 렌더링된다', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Posts');
  });

  test('포스트 목록에 항목이 1개 이상 있다', async ({ page }) => {
    const list = page.getByRole('list');
    const items = list.getByRole('listitem');
    await expect(items.first()).toBeVisible();
  });

  test('포스트 항목 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
    const list = page.getByRole('list');
    const firstItem = list.getByRole('listitem').first();
    const link = firstItem.getByRole('link').first();
    const href = await link.getAttribute('href');

    await link.click();
    await expect(page).toHaveURL(href ?? '');
  });

  test('포스트가 10개를 초과하면 페이지네이션이 표시된다', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    const headingText = await heading.textContent();
    const match = headingText?.match(/\d+/);
    const totalPosts = match ? parseInt(match[0], 10) : 0;

    if (totalPosts > 10) {
      const pagination = page.getByRole('navigation', { name: /pagination/i });
      await expect(pagination).toBeVisible();
      await expect(pagination.getByRole('link', { name: /next page/i })).toBeVisible();
    } else {
      test.info().annotations.push({
        type: 'info',
        description: `포스트 수 ${totalPosts}개 — 페이지네이션 없음, 스킵`,
      });
    }
  });
});

test.describe('Posts Pagination', () => {
  test('페이지 2 URL(/posts/p/2)이 유효하게 렌더링된다 (포스트 11개 이상인 경우)', async ({
    page,
  }) => {
    await page.goto(ROUTES.POSTS);
    const heading = page.getByRole('heading', { level: 1 });
    const headingText = await heading.textContent();
    const match = headingText?.match(/\d+/);
    const totalPosts = match ? parseInt(match[0], 10) : 0;

    if (totalPosts <= 10) {
      test.skip(true, `포스트 수 ${totalPosts}개 — 페이지네이션 테스트 불필요`);
    }

    await page.goto(ROUTES.POSTS_PAGE(2));
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Posts');
    const pagination = page.getByRole('navigation', { name: /pagination/i });
    const currentPageSpan = pagination.locator('[aria-current="page"]');
    await expect(currentPageSpan).toHaveText('2');
  });
});
