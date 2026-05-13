import { expect, test } from '@playwright/test';
import { openMobileMenu } from '../helpers/mobile';
import { ROUTES } from '../helpers/routes';

test.describe('Navigation', () => {
  test('사이드바/헤더에 메뉴 항목이 렌더링된다', async ({ page, isMobile }) => {
    await page.goto(ROUTES.HOME);
    await openMobileMenu(page, isMobile);

    const nav = page.getByRole('navigation', { name: /navigation/i });
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Posts' })).toBeVisible();
  });

  test('About 링크를 클릭하면 /about으로 이동한다', async ({ page, isMobile }) => {
    await page.goto(ROUTES.HOME);
    await openMobileMenu(page, isMobile);

    const nav = page.getByRole('navigation', { name: /navigation/i });
    await nav.getByRole('link', { name: 'About' }).click();

    await expect(page).toHaveURL(ROUTES.ABOUT);
  });

  test('Posts 링크를 클릭하면 /posts로 이동한다', async ({ page, isMobile }) => {
    await page.goto(ROUTES.HOME);
    await openMobileMenu(page, isMobile);

    const nav = page.getByRole('navigation', { name: /navigation/i });
    await nav.getByRole('link', { name: 'Posts' }).click();

    await expect(page).toHaveURL(ROUTES.POSTS);
  });

  test('현재 페이지의 메뉴 항목에 aria-current="page"가 설정된다', async ({ page, isMobile }) => {
    await page.goto(ROUTES.POSTS);
    await openMobileMenu(page, isMobile);

    const nav = page.getByRole('navigation', { name: /navigation/i });
    const postsLink = nav.getByRole('link', { name: 'Posts' });
    await expect(postsLink).toHaveAttribute('aria-current', 'page');
  });

  test('로고를 클릭하면 홈으로 이동한다', async ({ page }) => {
    await page.goto(ROUTES.ABOUT);

    await page.getByRole('link', { name: 'Hyunsoo Ro' }).first().click();
    await expect(page).toHaveURL(ROUTES.HOME);
  });
});
