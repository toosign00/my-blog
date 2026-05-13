import { expect, test } from '@playwright/test';
import { ROUTES, TAG_SLUGS } from '../helpers/routes';

test.describe('Tags List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.TAGS);
  });

  test('"Tags" 헤딩이 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();
  });

  test('태그 목록 nav가 렌더링된다', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /tag list/i });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('listitem').first()).toBeVisible();
  });

  test('태그 항목 클릭 시 해당 태그 페이지로 이동한다', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /tag list/i });
    const firstLink = nav.getByRole('link').first();
    const href = await firstLink.getAttribute('href');

    await firstLink.click();
    await expect(page).toHaveURL(href ?? '');
    await expect(page.url()).toContain('/tags/');
  });
});

test.describe('Tag Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.TAG(TAG_SLUGS.PHOTO));
  });

  test('태그 이름이 포함된 헤딩이 렌더링된다', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('photo');
  });

  test('해당 태그의 포스트 목록이 렌더링된다', async ({ page }) => {
    const list = page.getByRole('list');
    await expect(list.getByRole('listitem').first()).toBeVisible();
  });
});
